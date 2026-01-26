# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2025-01-26

### Breaking Changes

- Minimum Node.js version is now 22.0.0

### Added

- Stealth mode with puppeteer-extra-plugin-stealth to avoid bot detection
- ESLint with curly, indent, brace-style rules
- Prettier for code formatting
- Commitlint for conventional commits
- EditorConfig for consistent editor settings
- GitHub Actions CI for linting on PRs
- Dependabot for automated dependency updates

### Changed

- Scraping method: now intercepts CSR API responses (AliExpress switched from SSR to CSR)
- Updated all dependencies to latest versions:
  - puppeteer: 24.34.0
  - cheerio: 1.1.2
  - node-fetch: 3.3.2
  - @faker-js/faker: 10.2.0
- Improved error handling and reliability
- Default timeout increased to 60 seconds

### Fixed

- AliExpress CSR page support (new API structure)
- Field mappings for new API response format
- Sale price extraction from multiple sources (warmUpPrice, salePrice, salePriceString)

## [2.0.2] - Previous Release

### Added

- Basic scraping functionality for AliExpress products
- Support for reviews, variants, shipping, and store info
