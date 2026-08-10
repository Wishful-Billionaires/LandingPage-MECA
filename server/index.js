import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ALLOWED_ORIGIN, PORT } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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
    origin: ALLOWED_ORIGIN || 'https://meca-app.com'
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

  return res.status(201).json({ ok: true });
});

app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

const port = Number(PORT) || 3001;
app.listen(port, () => {
  console.log(`meca-waitlist-api listening on port ${port}`);
});
