#!/usr/bin/env bash
set -euo pipefail

corepack pnpm run lint
corepack pnpm run test
