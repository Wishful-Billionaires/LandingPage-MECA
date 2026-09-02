import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';

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
    console.warn('Loops not configured, skipping contact creation');
    return;
  }
  const { firstName, lastName } = splitName(name);
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
      console.error('Loops contact creation failed:', res.status, body);
    } else {
      console.log(`Loops contact created for ${email}`);
    }
  } catch (err) {
    console.error('Loops contact creation error:', err);
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

const waitlistLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  // Cloudflare sets CF-Connecting-IP to the real client IP; fall back to
  // Express's resolved req.ip (via trust proxy) if it's absent.
  keyGenerator: (req) => req.headers['cf-connecting-ip']?.toString() || req.ip
});

app.post('/waitlist', waitlistLimiter, async (req, res) => {
  const { name, email, role } = req.body ?? {};

  if (typeof name !== 'string' || name.trim().length === 0 || name.length > 200) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 320) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (typeof role !== 'string' || !ALLOWED_ROLES.has(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const { error } = await supabase
    .from('waitlist')
    .insert({ name: name.trim(), email: email.trim().toLowerCase(), role });

  if (error) {
    console.error('Supabase insert failed:', error);
    return res.status(502).json({ error: 'Failed to store submission' });
  }

  await addContactToLoops({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
  });

  return res.status(201).json({ ok: true });
});

app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

const port = Number(PORT) || 3001;
app.listen(port, () => {
  console.log(`meca-waitlist-api listening on port ${port}`);
});
