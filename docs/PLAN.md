# Plan: AliExpress Product Scraper (Non-breaking evolution)

## Principles
- Backward compatibility: default behavior and output shape must not change.
- Additive options only; new behavior is opt-in.
- Node 22+ support.
- Tests protect output contracts and reduce regressions.

## How to use this plan
- Each phase maps to a branch and PR (prefix: codex/).
- Update status checkboxes as work completes.
- Record decisions and follow-ups in the Notes section of each phase.

## Milestones

### Phase 0 (codex/plan) - Plan + runbook
Status: [x]
Deliverables:
- docs/PLAN.md (this file)
- docs/AGENT_RUNBOOK.md
- .gitignore updates for local artifacts
Notes:
- Keep the plan updated after each PR merge.

### Phase 1 (codex/test-harness) - Tests + CI safety net
Status: [ ]
Deliverables:
- Extract pure helpers (parseJsonp, extractDataFromApiResponse, buildSkuPriceList, getSalePrice)
- Unit tests for helpers (node:test)
- Integration tests with fixtures (no network)
- Contract tests to lock output shape for fixtures
- GitHub Actions CI: lint + unit + integration (Node 22 and Node 24)
- Agent scripts: scripts/agent-setup.sh and scripts/agent-check.sh
Notes:
- E2E smoke remains opt-in via ALIX_SMOKE=1.

### Phase 2 (codex/ux-perf) - Non-breaking UX + performance
Status: [ ]
Deliverables:
- Accept product URL or product ID (same output)
- Optional browser injection to reuse a Puppeteer instance
- fastMode option (skip description/reviews, block heavy resources)
- Better error taxonomy (invalid ID vs blocked vs timeout)
- Remove node-fetch (use native fetch in Node 22+)
Notes:
- All new behavior opt-in; defaults stay the same.

### Phase 3 (codex/feature/batch) - Batch scraping
Status: [ ]
Deliverables:
- scrapeMany(idsOrUrls, options)
- Concurrency limit, retries, per-item timeouts
- Progress callback or async iterator
Notes:
- Must not change existing single-item API.

### Phase 4 (codex/feature/localization) - Locale options
Status: [ ]
Deliverables:
- Options: shipTo, currency, language/region
- Shipping output filtered for locale
Notes:
- Default behavior unchanged.

## Testing strategy
- Unit: pure helpers (no I/O)
- Integration: fixtures only (no network)
- E2E: ALIX_SMOKE=1 pnpm run smoke (optional)
- Contract tests: stable output snapshots for fixtures

## Agent workflow (Codex + Ralph loop)
- One branch per PR, one worktree per agent.
- Keep work scoped to the phase.
- Run scripts/agent-check.sh before opening PRs (added in Phase 1).
- Avoid manual steps; codify them in scripts.

