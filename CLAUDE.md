# Agent Coding Guidelines

## Workflow
- Always create a new branch per task; never commit directly to `master`.
- Run `pnpm run lint` and `pnpm run test` before committing.
- Keep PRs focused and scoped to one concern.
- Use `pnpm`, not npm or yarn.

## Code Style
- ESM (`import`/`export`), no CommonJS.
- 2-space indentation.
- 1TBS brace style (`if (...) {`), always use curly braces.
- Follow existing patterns in the codebase.

## Backward Compatibility
- Default behavior and output shape must not change.
- New behavior is always opt-in via explicit flags/options.
- Never change the default export contract without a major version bump.

## Testing
- Use Node 24+ built-in test runner (`node:test`) and `node:assert/strict`.
- Unit tests go in `tests/unit/`, integration tests in `tests/integration/`.
- Use fixtures for integration tests — no live network calls in CI.
- E2E smoke tests are opt-in: `ALIX_SMOKE=1 pnpm run smoke`.
- Write tests for all new functionality.

## Quick Reference
```bash
pnpm install
pnpm run lint
pnpm run test
ALIX_SMOKE=1 pnpm run smoke   # optional, requires network
```
