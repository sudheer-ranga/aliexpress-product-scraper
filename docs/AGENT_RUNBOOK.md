# Agent Runbook

## Setup
- Use Node 24+ (standardize on 24)
- Use pnpm

```bash
nvm use 24
pnpm install
npx puppeteer browsers install chrome
```

## Current checks
```bash
pnpm run lint
ALIX_SMOKE=1 pnpm run smoke
```

## Coming in Phase 1 (codex/test-harness)
These will be added with fixtures and helper tests:
```bash
pnpm run test
pnpm run test:integration
```

## Ralph loop / parallel agents
- Use one worktree per branch.
- Keep each agent focused on a single phase.

Example:
```bash
git worktree add ../aliexpress-product-scraper-test-harness codex/test-harness
```

## Notes
- E2E smoke is live network; keep it opt-in.
- Do not change default behavior without an explicit opt-in option.
