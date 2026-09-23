import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

// ── Logging ────────────────────────────────────────────────────────────────
// Minimal structured logger: ISO-8601 UTC timestamp, level, message, and
// optional JSON metadata. Dependency-free and greppable, e.g.:
//   2026-09-23T14:13:02.411Z INFO  POST /waitlist -> 201 {"reqId":"ab12cd34",...}
const log = (level, message, meta) => {
  const ts = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  const line = `${ts} ${level.toUpperCase().padEnd(5)} ${message}${metaStr}`;
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
};

// Mask an email for logs, e.g. "john.doe@example.com" -> "j***@example.com".
// Keeps submissions correlatable without storing raw PII in logs (GDPR).
const maskEmail = (email) => {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  return `${local.slice(0, 1)}***@${domain}`;
};

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  ALLOWED_ORIGIN,
  PORT,
  LOOPS_API_KEY,
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
}

const allowedOrigins = (ALLOWED_ORIGIN || 'https://www.meca-app.com')
  .split(',')
  .map((origin) => origin.trim());

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Split a full name into first/last at the first space.
// "Nuno Pereira" -> { firstName: "Nuno", lastName: "Pereira" }
// "Nuno"         -> { firstName: "Nuno", lastName: "" }
function splitName(fullName) {
  const idx = fullName.indexOf(' ');
  if (idx === -1) {
    return { firstName: fullName, lastName: '' };
  }
  return { firstName: fullName.slice(0, idx), lastName: fullName.slice(idx + 1) };
}

// Register the submitter as a Loops contact via POST /v1/contacts/create.
// Creating the contact fires the "contact added" (signup) workflow in Loops,
// which can then branch on `role` and send the right email. Never blocks or
// fails the request: DB insert already succeeded, so we only log problems.
async function addContactToLoops({ name, email, role }) {
  if (!LOOPS_API_KEY) {
    log('warn', 'Loops not configured (LOOPS_API_KEY missing), skipping contact creation');
    return;
  }
  const { firstName, lastName } = splitName(name);
  const startedAt = Date.now();
  try {
    const res = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        role,
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.success) {
      log('error', 'Loops contact creation failed', {
        email: maskEmail(email),
        status: res.status,
        response: body,
        ms: Date.now() - startedAt,
      });
    } else {
      log('info', 'Loops contact created', {
        email: maskEmail(email),
        ms: Date.now() - startedAt,
      });
    }
  } catch (err) {
    log('error', 'Loops contact creation network error', {
      email: maskEmail(email),
      errName: err?.name,
      message: err?.message,
    });
  }
}

const ALLOWED_ROLES = new Set([
  'roleArtist',
  'roleStudio',
  'roleVenue',
  'rolePromoter',
  'roleFan'
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const app = express();

// Behind Cloudflare (orange-cloud) + Traefik: trust the first proxy hop so
// express-rate-limit keys on the real client IP instead of the proxy's.
app.set('trust proxy', 1);

app.use(express.json({ limit: '10kb' }));
app.use(
  cors({
    origin: allowedOrigins
  })
);

// Attach a short request id to every request and log method, path, status,
// and duration once the response finishes. Skips /health to avoid noise
// from uptime probes.
app.use((req, res, next) => {
  req.id = randomUUID().slice(0, 8);
  const startedAt = Date.now();
  res.on('finish', () => {
    if (req.path === '/health') return;
    log('info', `${req.method} ${req.originalUrl} -> ${res.statusCode}`, {
      reqId: req.id,
      ip: req.ip,
      ms: Date.now() - startedAt,
    });
  });
  next();
});

const waitlistLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  // Cloudflare sets CF-Connecting-IP to the real client IP; fall back to
  // Express's resolved req.ip (via trust proxy) if it's absent.
  keyGenerator: (req) => req.headers['cf-connecting-ip']?.toString() || req.ip,
  // Log rate-limit hits (abuse or a stuck client retry loop) and return
  // JSON instead of the default HTML error page.
  handler: (req, res) => {
    log('warn', 'Rate limit exceeded on POST /waitlist', {
      reqId: req.id,
      ip: req.ip,
      limit: '5 per 60s',
    });
    res.status(429).json({ error: 'Too many requests, please try again in a minute' });
  }
});

app.post('/waitlist', waitlistLimiter, async (req, res) => {
  const { name, email, role } = req.body ?? {};

  // Validate all fields, then log exactly which ones were rejected so bad
  // payloads (client bug or probing) are distinguishable at a glance.
  const invalidFields = [];
  if (typeof name !== 'string' || name.trim().length === 0 || name.length > 200) {
    invalidFields.push('name');
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 320) {
    invalidFields.push('email');
  }
  if (typeof role !== 'string' || !ALLOWED_ROLES.has(role)) {
    invalidFields.push('role');
  }
  if (invalidFields.length > 0) {
    log('warn', 'Waitlist submission rejected: invalid input', {
      reqId: req.id,
      ip: req.ip,
      fields: invalidFields.join(','),
      role: typeof role === 'string' ? role : typeof role,
    });
    return res.status(400).json({ error: `Invalid ${invalidFields.join(', ')}` });
  }

  try {
    const { error } = await supabase
      .from('waitlist')
      .insert({ name: name.trim(), email: email.trim().toLowerCase(), role });

    if (error) {
      // 23505 = unique_violation (duplicate email)
      if (error.code === '23505') {
        log('info', 'Waitlist duplicate email rejected', {
          reqId: req.id,
          ip: req.ip,
          email: maskEmail(email.trim().toLowerCase()),
        });
        return res.status(409).json({ error: 'email_already_registered' });
      }
      log('error', 'Supabase insert failed', {
        reqId: req.id,
        ip: req.ip,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return res.status(502).json({ error: 'Failed to store submission' });
    }

    log('info', 'Waitlist signup stored', {
      reqId: req.id,
      ip: req.ip,
      email: maskEmail(email),
      role,
    });

    await addContactToLoops({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
    });

    return res.status(201).json({ ok: true });
  } catch (err) {
    log('error', 'Unexpected error handling POST /waitlist', {
      reqId: req.id,
      errName: err?.name,
      message: err?.message,
      stack: err?.stack,
    });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

const port = Number(PORT) || 3001;
app.listen(port, () => {
  log('info', 'meca-waitlist-api started', {
    port,
    allowedOrigins: allowedOrigins.join(','),
    supabaseUrl: SUPABASE_URL,
    loops: LOOPS_API_KEY ? 'configured' : 'missing',
    rateLimit: '5 req/60s per IP',
  });
});

// Top-level safety nets so nothing fails silently in the container logs.
// uncaughtException leaves the process in an undefined state: log it, then
// exit so Docker/Traefik can restart us cleanly. unhandledRejections are
// logged (and kept non-fatal) — every known async path already handles its
// own errors.
process.on('uncaughtException', (err) => {
  log('error', 'Uncaught exception', {
    errName: err?.name,
    message: err?.message,
    stack: err?.stack,
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  log('error', 'Unhandled promise rejection', {
    reason: reason instanceof Error ? `${reason.name}: ${reason.message}` : String(reason),
  });
});
