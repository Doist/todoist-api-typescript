# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.1.10](https://github.com/Doist/todoist-api-typescript/compare/v6.1.9...v6.1.10) (2025-11-19)


### Bug Fixes

* Remove dependency on `projectId` for GetSectionsArgs ([#405](https://github.com/Doist/todoist-api-typescript/issues/405)) ([89bc88a](https://github.com/Doist/todoist-api-typescript/commit/89bc88ae910c88d049ae8490eddb7770bda37c55))


### Miscellaneous

* **deps:** bump js-yaml ([#403](https://github.com/Doist/todoist-api-typescript/issues/403)) ([e37a4b1](https://github.com/Doist/todoist-api-typescript/commit/e37a4b12474c88dcd4bcacc553aa802f4de61cd8))

## [6.1.9](https://github.com/Doist/todoist-api-typescript/compare/v6.1.8...v6.1.9) (2025-11-18)


### Bug Fixes

* Revert accidental node version increase ([#401](https://github.com/Doist/todoist-api-typescript/issues/401)) ([fe41375](https://github.com/Doist/todoist-api-typescript/commit/fe413756df45f8e94ee6f877e05d090c42a187e5))

## [6.1.8](https://github.com/Doist/todoist-api-typescript/compare/v6.1.7...v6.1.8) (2025-11-18)


### Miscellaneous

* **deps:** bump js-yaml from 3.14.1 to 3.14.2 in /website ([#397](https://github.com/Doist/todoist-api-typescript/issues/397)) ([4bc0d65](https://github.com/Doist/todoist-api-typescript/commit/4bc0d65ae3f2d338010b11738d554b9da3155f25))

## [6.1.7](https://github.com/Doist/todoist-api-typescript/compare/v6.1.6...v6.1.7) (2025-11-11)


### Bug Fixes

* Don't force `projectId` for fetching sections ([#395](https://github.com/Doist/todoist-api-typescript/issues/395)) ([8ddd19c](https://github.com/Doist/todoist-api-typescript/commit/8ddd19c68f8940f90978154352d6875cd775ab06))

## [6.1.6](https://github.com/Doist/todoist-api-typescript/compare/v6.1.5...v6.1.6) (2025-11-10)


### Miscellaneous

* Expose `premiumStatus` user field ([#382](https://github.com/Doist/todoist-api-typescript/issues/382)) ([4c66fed](https://github.com/Doist/todoist-api-typescript/commit/4c66fedae165fd8d0aa5ddb84d0f393344cbf14e))

## [6.1.5](https://github.com/Doist/todoist-api-typescript/compare/v6.1.4...v6.1.5) (2025-11-10)


### Bug Fixes

* Correct the deprecations ([#393](https://github.com/Doist/todoist-api-typescript/issues/393)) ([e1b2fdc](https://github.com/Doist/todoist-api-typescript/commit/e1b2fdcd3e1c450eac2b0bdf6d9de897fc386820))


### Miscellaneous

* **deps:** update dependency @doist/eslint-config to v12 ([#371](https://github.com/Doist/todoist-api-typescript/issues/371)) ([e355e4b](https://github.com/Doist/todoist-api-typescript/commit/e355e4b2ade4cc231b9927f5caf7ce2a8dbd1fb6))

## [6.1.4](https://github.com/Doist/todoist-api-typescript/compare/v6.1.3...v6.1.4) (2025-11-08)


### Bug Fixes

* exclude CHANGELOG.md from Prettier formatting ([06a7601](https://github.com/Doist/todoist-api-typescript/commit/06a7601f2d0ce0e54855a4239adb2fad67032f51))

## [6.1.3](https://github.com/Doist/todoist-api-typescript/compare/v6.1.2...v6.1.3) (2025-11-08)


### Bug Fixes

* auto-format Release Please PRs with Prettier ([3068d54](https://github.com/Doist/todoist-api-typescript/commit/3068d54b3415fca1ea8f490b21276439430fc5a7))

## [6.1.2](https://github.com/Doist/todoist-api-typescript/compare/v6.1.1...v6.1.2) (2025-11-08)


### Miscellaneous

* Workflow dispatch on publish ([e2dce29](https://github.com/Doist/todoist-api-typescript/commit/e2dce29e223d11f9a99513c62721e9b97efd4d96))

## [6.1.1](https://github.com/Doist/todoist-api-typescript/compare/v6.1.0...v6.1.1) (2025-11-08)


### Bug Fixes

* resolve docs deployment failure and add PR validation ([#388](https://github.com/Doist/todoist-api-typescript/issues/388)) ([4e7646b](https://github.com/Doist/todoist-api-typescript/commit/4e7646b6338743a3fea79c786e36cd736d838023))
* update Release Please to trigger publish workflow ([80d1079](https://github.com/Doist/todoist-api-typescript/commit/80d10799d64f56010c25af3cc3e39a47610225f0))

## [6.1.0](https://github.com/Doist/todoist-api-typescript/compare/v6.0.1...v6.1.0) (2025-11-08)

### Features

-   add custom HTTP client support for cross-platform compatibility ([#383](https://github.com/Doist/todoist-api-typescript/issues/383)) ([e5f13e5](https://github.com/Doist/todoist-api-typescript/commit/e5f13e5de3686e6ba7469b199ab05886086b68d6))

### Bug Fixes

-   configure Release Please to not include component in tags ([ac0cc9d](https://github.com/Doist/todoist-api-typescript/commit/ac0cc9d4c6d2b84d89c095773f928b9ab7b28fa1))
-   rename release-please config file to correct filename ([73c9e5c](https://github.com/Doist/todoist-api-typescript/commit/73c9e5cb4bbe6cf02a73f5859bb043d1d2cda373))

### Code Refactoring

-   migrate all tests from mockFetch to MSW ([#384](https://github.com/Doist/todoist-api-typescript/issues/384)) ([1d5c150](https://github.com/Doist/todoist-api-typescript/commit/1d5c150b0336ac9eab95916bab2489274178519c))

### Miscellaneous

-   set up Release Please for automated releases ([#385](https://github.com/Doist/todoist-api-typescript/issues/385)) ([4402acc](https://github.com/Doist/todoist-api-typescript/commit/4402acc5325a5c9a59ea47c40853f2b143cb30ff))

## [Unreleased]

## [6.0.1] - 2025-01-08

### Fixed

-   Convert camelCase to snake_case for GET request parameters (#380)

## [6.0.0] - 2025-01-07

### Added

-   Add dual module support (CommonJS + ESM) (#379)

### Changed

-   **BREAKING**: Enforce max-params ESLint rule with limit of 3 (#378)
-   **BREAKING**: Set minimum Node.js to 20+ (#376)
-   Migrate from axios to native fetch API (#377)

## [1.5.0] - 2021-11-23

### Added

-   Public release
