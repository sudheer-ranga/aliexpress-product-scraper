#!/usr/bin/env bash
set -euo pipefail

export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  nvm use 24
else
  echo "nvm not found; ensure Node 24 is active." >&2
fi

pnpm install
npx puppeteer browsers install chrome
