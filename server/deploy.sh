#!/usr/bin/env bash
# Deploy the MECA waitlist API to the Docker host.
#
# Steps:
#   1. Copy the app files to the remote stack
#   2. Ensure LOOPS_API_KEY / LOOPS_TRANSACTIONAL_ID exist in the remote .env
#      (appends them from the local server/.env if missing — never overwrites)
#   3. Rebuild the image and recreate the container.
#      NOTE: a plain `docker compose restart` would NOT pick up index.js,
#      because the Dockerfile bakes it into the image at build time.
#   4. Verify the container is up and the public /health endpoint responds.
#
# Usage: ./deploy.sh

set -euo pipefail

REMOTE="nuno@192.168.1.232"
REMOTE_DIR="/home/nuno/stacks/meca-api"
LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" # this server/ folder
API_HEALTH_URL="https://api.meca-app.com/health"

# package.json / package-lock.json: unchanged for this deploy (no new deps —
# the Loops call uses Node 22's built-in fetch), but copied anyway so the
# script stays correct when dependencies do change.
FILES=(index.js package.json package-lock.json Dockerfile docker-compose.yml)

echo "==> 1/4 Copying ${FILES[*]} to ${REMOTE}:${REMOTE_DIR}"
scp "${FILES[@]/#/$LOCAL_DIR/}" "${REMOTE}:${REMOTE_DIR}/"

echo "==> 2/4 Checking remote .env for Loops variables"
if ! ssh "$REMOTE" "test -f ${REMOTE_DIR}/.env"; then
  echo "ERROR: ${REMOTE}:${REMOTE_DIR}/.env not found — add it manually and re-run." >&2
  exit 1
fi

missing=()
for var in LOOPS_API_KEY LOOPS_TRANSACTIONAL_ID; do
  if ! ssh "$REMOTE" "grep -q \"^${var}=\" ${REMOTE_DIR}/.env"; then
    missing+=("$var")
  fi
done

if [ "${#missing[@]}" -gt 0 ]; then
  echo "    missing on remote: ${missing[*]} — appending from local .env"
  for var in "${missing[@]}"; do
    line="$(grep "^${var}=" "${LOCAL_DIR}/.env" | head -n1 || true)"
    if [ -z "$line" ]; then
      echo "ERROR: ${var} not in local ${LOCAL_DIR}/.env either." >&2
      exit 1
    fi
    printf '%s\n' "$line" | ssh "$REMOTE" "cat >> ${REMOTE_DIR}/.env"
    echo "    + ${var}"
  done
else
  echo "    all Loops variables present — nothing to do"
fi

echo "==> 3/4 Rebuilding image and recreating container"
DC="docker compose"
if ! ssh "$REMOTE" "docker compose version" >/dev/null 2>&1; then
  DC="docker-compose"
fi
ssh "$REMOTE" "cd ${REMOTE_DIR} && ${DC} up -d --build"

echo "==> 4/4 Verifying"
sleep 3
ssh "$REMOTE" "cd ${REMOTE_DIR} && ${DC} ps"
if curl -fsS -m 10 "${API_HEALTH_URL}" >/dev/null; then
  echo "    public health check OK: ${API_HEALTH_URL}"
else
  echo "    WARNING: public health check failed — check Traefik / domain." >&2
fi

echo "Done. Test with the landing page form (submissions now trigger the Loops email)."
