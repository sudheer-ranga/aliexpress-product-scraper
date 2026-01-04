# Upgrade Plan: Node/NPM/Dependencies + Codebase Compatibility (KISS)

## Context Summary (confirmed from code)
- `puppeteer` is used in `src/aliexpressProductScraper.js` to open the product page and read `runParams`.
- `cheerio` is used to parse the description HTML fetched from `descriptionUrl`.
- Reviews are fetched via `node-fetch` in `src/reviews.js`.
- No automated tests; example script in `examples/example.js`.
- `pnpm-lock.yaml` is present; package manager not explicitly pinned in `package.json`.

## Why Puppeteer and Cheerio?
- Puppeteer: required to render and access `runParams` from the AliExpress product page. This is not available via simple HTTP fetch because the data is embedded in the page runtime.
- Cheerio: used to parse the description HTML after loading the description URL with the same browser session. It extracts the `<body>` HTML without running a full browser DOM in Node.

## Automated Tests?
- Today there are no tests. We should keep it simple:
  - Add a minimal smoke script that runs only when explicitly requested (manual or env-gated).
  - Avoid brittle CI scraping tests unless you want them.

## Goals (KISS)
1. Upgrade to the latest stable Node.js LTS.
2. Upgrade runtime dependencies to their latest compatible majors.
3. Keep the scraper working with minimal, targeted code changes.
4. Verify with a manual smoke run.
5. Avoid working directly on `master`.

## Proposed Branch Strategy (Nested/Stacked)
- Base upgrade branch from `master` (or default branch): `upgrade/node-lts/base`
- Nested branches off the base for focused changes:
  - `upgrade/node-lts/deps` (dependency/version bumps + lockfile)
  - `upgrade/node-lts/compat` (code changes for new APIs/behavior)
  - `upgrade/node-lts/tests` (smoke tests / test harness)
  - `upgrade/node-lts/docs` (README + example updates)
- Merge nested branches into `upgrade/node-lts/base` via stacked PRs, then merge `upgrade/node-lts/base` into `master`.

## Step-by-Step Plan (simple)

### 1) Baseline (quick)
- Note current Node/npm versions.
- Run `examples/example.js` once to confirm current behavior.

### 2) Set Target Runtime
- Choose latest Node LTS (verify at time of upgrade).
- Add `.nvmrc` (or `.tool-versions`) and `package.json` `engines.node`.

### 3) Upgrade Dependencies
- Update `puppeteer`, `cheerio`, `@faker-js/faker`, `node-fetch`.
- Regenerate `pnpm-lock.yaml`.

### 4) Minimal Code Compatibility Fixes
- Adjust any breaking API changes (mostly `faker` and `puppeteer` options).
- Add a safe guard for `runParams` access (avoid reference errors).

### 5) Optional Smoke Test
- Add a simple `npm run smoke` that only runs when you explicitly call it.

### 6) Documentation + Example Fix
- Update README with Node minimum.
- Fix `examples/example.js` option key (`filterReviewsBy`).

### 7) Manual Validation
- Run the example on the new Node LTS and confirm output looks OK.

## Risks & Mitigations (short)
- **AliExpress page changes** can break `runParams` access.
  - Mitigation: add guards and fail with a clear error message.
- **Puppeteer Chromium download** can be heavy or blocked.
  - Mitigation: document `PUPPETEER_SKIP_DOWNLOAD`/`PUPPETEER_EXECUTABLE_PATH` usage.
- **Live network tests** can be flaky.
  - Mitigation: gate with env vars; provide fixture tests for core logic.

## Deliverables
- Runtime pins (`.nvmrc` or `.tool-versions`, `engines`)
- Updated dependencies + lockfile
- Minimal code updates for compatibility
- Optional smoke script
- Updated README + example
