# Loops — MECA waitlist confirmation

## Live state (as of 2026-08-27)
| What | Value |
|---|---|
| Transactional email name | "Waitlist confirmation" |
| **transactionalId** | `cmtbqw3l201ta0j21t0uofesc` |
| Status | Published ✅ |
| Required data variables | `name` (only) |
| Backup | "Test template, change later" (`cmtbpwbvn013x0k0va7x8xrh3`) — full design, MJML |

## Files
| File | Purpose |
|---|---|
| `index.mjml` | MJML version of the simple template (name only) |
| `template.zip` | Import-ready zip (contains `index.mjml`) |
| `simple.lmx` | LMX version (used to create the live email via API) |

## How it works
`server/index.js` → on `POST /waitlist`:
1. validate name/email/role
2. insert into Supabase `waitlist` table
3. **after success**, `POST https://app.loops.so/api/v1/transactional`
   with `{ email, transactionalId, addToAudience: true, dataVariables: { name } }`
4. email send failures are logged only — they never fail the request

Config in `server/.env`: `LOOPS_API_KEY`, `LOOPS_TRANSACTIONAL_ID`.

## Gotchas (learned the hard way)
- **MJML import = zip containing `index.mjml`** at the zip root. A wrong upload
  puts the source code into a `<CodeBlock>` and recipients see raw HTML.
- **MJML emails can't be edited via API** (`409 "MJML format is not supported
  via API"`). The live template was therefore recreated as LMX
  (`POST /v1/transactional-emails` → update draft with `lmx` → publish).
- Re-importing MJML in the editor resets the email to **draft** — republish
  before any API send.
- `GET /v1/email-messages/{id}` returns 409 for legacy-MJML messages.

## Manual test send
```bash
curl -X POST https://app.loops.so/api/v1/transactional \
  -H "Authorization: Bearer $LOOPS_API_KEY" -H "Content-Type: application/json" \
  --data '{"email":"you@your-email.com","transactionalId":"cmtbqw3l201ta0j21t0uofesc","dataVariables":{"name":"Nuno"}}'
```
Dry run (nothing delivered): use `you@example.com`.

## Local end-to-end
```bash
cd server && node index.js        # listens on :3001
curl localhost:3001/health
curl -X POST localhost:3001/waitlist -H "Content-Type: application/json" \
  --data '{"name":"Nuno","email":"you@your-email.com","role":"roleArtist"}'
```
Watch the server log for `Loops confirmation email sent to ...`.
