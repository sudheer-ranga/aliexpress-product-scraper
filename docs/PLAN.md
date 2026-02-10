# Plan: AliExpress Product Scraper (Non-breaking evolution)

## Principles
- Backward compatibility: default behavior and output shape must not change.
- Additive options only; new behavior is opt-in.
- Node 24+ support.
- Tests protect output contracts and reduce regressions.

## Completed
- Phase 0 (codex/plan): planning docs and baseline workflow updates.
- Phase 1 (codex/test-harness): helper extraction, unit/integration/contract tests, and Node 24 CI.

## Remaining milestones

### Phase 2 (codex/ux-perf) - Non-breaking UX + performance
Status: [~]
Deliverables:
- [x] Accept product URL or product ID (same output)
- [ ] Optional browser injection to reuse a Puppeteer instance
- [x] fastMode option (skip description/reviews, block heavy resources)
- [ ] Better error taxonomy (invalid ID vs blocked vs timeout)
- [ ] Remove node-fetch (use native fetch in Node 24+)
Notes:
- All new behavior opt-in; defaults stay the same.

### Phase 3 (codex/feature/batch) - Batch scraping
Status: [x]
Deliverables:
- [x] scrapeMany(idsOrUrls, options)
- [x] Concurrency limit, retries, per-item timeouts
- [x] Progress callback
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
- Prefer project scripts/workflows over ad-hoc local shell scripts.
