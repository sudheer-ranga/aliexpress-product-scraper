# Release Checklist

Use this checklist before publishing a new npm version.

## 1) Versioning
- Update `version` in `package.json`.
- Keep semver rules:
  - patch: bug fixes only
  - minor: additive features
  - major: breaking changes

## 2) Quality gates
- `pnpm run lint`
- `pnpm run test`
- Optional live check: `ALIX_SMOKE=1 pnpm run smoke`

## 3) Packaging sanity check
- `HUSKY=0 npm_config_cache=/tmp/npm-cache npm pack --dry-run`
- Confirm tarball includes `index.js`, `src/**`, `README.md`, `LICENSE`.

## 4) Release notes
- Update changelog/release notes with:
  - new features
  - bug fixes
  - migration notes (if any)

## 5) Publish flow
- Merge to default branch.
- Create GitHub release with tag matching package version (`vX.Y.Z` or `X.Y.Z`).
- Workflow `.github/workflows/npm-publish.yml` validates tag/version match and publishes.

## 6) Post-release validation
- `npm view aliexpress-product-scraper version`
- Quick import test:
  - `node -e "import('aliexpress-product-scraper').then(() => console.log('OK'))"`
