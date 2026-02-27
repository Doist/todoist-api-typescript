# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.10.0](https://github.com/Doist/todoist-api-typescript/compare/v6.9.0...v6.10.0) (2026-02-27)


### Features

* add objectEventTypes param to getActivityLogs, deprecate objectType/eventType ([#474](https://github.com/Doist/todoist-api-typescript/issues/474)) ([49fed49](https://github.com/Doist/todoist-api-typescript/commit/49fed490b7ba714854a51ce767367dc941a6eea7))

## [6.9.0](https://github.com/Doist/todoist-api-typescript/compare/v6.8.1...v6.9.0) (2026-02-27)


### Features

* add ColorKey type and restrict color params to valid keys ([#471](https://github.com/Doist/todoist-api-typescript/issues/471)) ([608ff72](https://github.com/Doist/todoist-api-typescript/commit/608ff722068cb5fb31e00c7a01f7c0e500911814))

## [6.8.1](https://github.com/Doist/todoist-api-typescript/compare/v6.8.0...v6.8.1) (2026-02-27)


### Bug Fixes

* use date_from/date_to params in getActivityLogs, deprecate since/until ([#469](https://github.com/Doist/todoist-api-typescript/issues/469)) ([ede6af1](https://github.com/Doist/todoist-api-typescript/commit/ede6af1bae556bd872060939648d3763f58d1d25))

## [6.8.0](https://github.com/Doist/todoist-api-typescript/compare/v6.7.0...v6.8.0) (2026-02-26)


### Features

* Typed Sync API user preferences + missing resource fields ([#466](https://github.com/Doist/todoist-api-typescript/issues/466)) ([be78d1d](https://github.com/Doist/todoist-api-typescript/commit/be78d1dda715dffae0b900cd39a1d8fd964c5e02))

## [6.7.0](https://github.com/Doist/todoist-api-typescript/compare/v6.6.0...v6.7.0) (2026-02-25)


### Features

* Add missing Sync API commands: reminder_update, user_settings_update, update_goals ([#464](https://github.com/Doist/todoist-api-typescript/issues/464)) ([ca0659f](https://github.com/Doist/todoist-api-typescript/commit/ca0659ff9b7d1d5ddc8321087b7d30f00c5d7290))

## [6.6.0](https://github.com/Doist/todoist-api-typescript/compare/v6.5.1...v6.6.0) (2026-02-25)


### Features

* Add strongly-typed Sync API command support ([#460](https://github.com/Doist/todoist-api-typescript/issues/460)) ([b8acec3](https://github.com/Doist/todoist-api-typescript/commit/b8acec3fad0f34a3981af65c380855f4bea30926))
* Add Zod schemas for Sync API response resource types ([#462](https://github.com/Doist/todoist-api-typescript/issues/462)) ([e3f1f29](https://github.com/Doist/todoist-api-typescript/commit/e3f1f2924109a61934be30151a7103253b7b92e0))


### Code Refactoring

* replace boilerplate validators with generic factory functions ([#463](https://github.com/Doist/todoist-api-typescript/issues/463)) ([b42d16a](https://github.com/Doist/todoist-api-typescript/commit/b42d16ac627d9c905fe75105192511d7c4b0fa15))

## [6.5.1](https://github.com/Doist/todoist-api-typescript/compare/v6.5.0...v6.5.1) (2026-02-20)


### Bug Fixes

* **deps:** update dependency form-data to v4.0.5 ([#448](https://github.com/Doist/todoist-api-typescript/issues/448)) ([9ba47ca](https://github.com/Doist/todoist-api-typescript/commit/9ba47ca81d4e7672d0200dd1925e198c5cd8aa1f))
* **deps:** update dependency zod to v4.3.6 ([#455](https://github.com/Doist/todoist-api-typescript/issues/455)) ([d9ae6bb](https://github.com/Doist/todoist-api-typescript/commit/d9ae6bb536f381366603822c0ea7d728ad279523))
* make multipart upload browser-compatible for Vite builds ([#458](https://github.com/Doist/todoist-api-typescript/issues/458)) ([b18f36d](https://github.com/Doist/todoist-api-typescript/commit/b18f36d500924b4debe300690ed041c29adbe7c6))


### Miscellaneous

* **deps:** update dependency lint-staged to v16.2.7 ([#449](https://github.com/Doist/todoist-api-typescript/issues/449)) ([6dd5b43](https://github.com/Doist/todoist-api-typescript/commit/6dd5b43f1e864abc65ca02253cc7a437689afefb))
* **deps:** update dependency msw to v2.12.10 ([#450](https://github.com/Doist/todoist-api-typescript/issues/450)) ([bcbbf6d](https://github.com/Doist/todoist-api-typescript/commit/bcbbf6dff68a503535631b0c36ccfcc6a52644d5))
* **deps:** update dependency obsidian to v1.12.0 ([#451](https://github.com/Doist/todoist-api-typescript/issues/451)) ([2495997](https://github.com/Doist/todoist-api-typescript/commit/249599791ffb8098921823cc0392ac59f61fa2ae))
* **deps:** update dependency rimraf to v6.1.2 ([#452](https://github.com/Doist/todoist-api-typescript/issues/452)) ([91676c7](https://github.com/Doist/todoist-api-typescript/commit/91676c7702fb3a5ed27e26a029100d31256ef4aa))
* **deps:** update dependency ts-jest to v29.4.6 ([#445](https://github.com/Doist/todoist-api-typescript/issues/445)) ([2891d25](https://github.com/Doist/todoist-api-typescript/commit/2891d25721d5896bfb9095a6dda1c2dc64047449))
* **deps:** update dependency type-fest to v5 ([#456](https://github.com/Doist/todoist-api-typescript/issues/456)) ([856c4b8](https://github.com/Doist/todoist-api-typescript/commit/856c4b816439f10e7aaa86ba23db0d62c13ba8e7))
* **deps:** update dependency undici to v7.22.0 ([#454](https://github.com/Doist/todoist-api-typescript/issues/454)) ([abb1431](https://github.com/Doist/todoist-api-typescript/commit/abb1431a024e18b9f5e5e08ca0a26d0bf407106a))

## [6.5.0](https://github.com/Doist/todoist-api-typescript/compare/v6.4.1...v6.5.0) (2026-02-14)


### Features

* Add moveProjectToWorkspace and moveProjectToPersonal endpoints ([#440](https://github.com/Doist/todoist-api-typescript/issues/440)) ([e7962d8](https://github.com/Doist/todoist-api-typescript/commit/e7962d8b53fcec853e94052c83889b047ccf1719))

## [6.4.1](https://github.com/Doist/todoist-api-typescript/compare/v6.4.0...v6.4.1) (2026-02-12)


### Bug Fixes

* Deprecate noteCount field on Task ([#439](https://github.com/Doist/todoist-api-typescript/issues/439)) ([ffeac23](https://github.com/Doist/todoist-api-typescript/commit/ffeac23bd4ebf7cf05dd2b23a5c984c28d16c652))


### Miscellaneous

* **deps-dev:** bump webpack from 5.101.3 to 5.105.0 ([#436](https://github.com/Doist/todoist-api-typescript/issues/436)) ([7cee4c9](https://github.com/Doist/todoist-api-typescript/commit/7cee4c9c25f5142590e920be9082421c6a6b7a60))

## [6.4.0](https://github.com/Doist/todoist-api-typescript/compare/v6.3.0...v6.4.0) (2026-02-03)


### Features

* Add getWorkspaces() method and refactor Sync API request handling ([#434](https://github.com/Doist/todoist-api-typescript/issues/434)) ([0eeac78](https://github.com/Doist/todoist-api-typescript/commit/0eeac782b5ecbd50da69321834050a7a78ccd754))


### Miscellaneous

* **deps-dev:** bump lodash from 4.17.21 to 4.17.23 ([#432](https://github.com/Doist/todoist-api-typescript/issues/432)) ([4d4bf50](https://github.com/Doist/todoist-api-typescript/commit/4d4bf500e8817c776f54a09d80b0bf610b290274))

## [6.3.0](https://github.com/Doist/todoist-api-typescript/compare/v6.2.1...v6.3.0) (2026-01-16)


### Features

* Add search for projects, sections, and labels ([#426](https://github.com/Doist/todoist-api-typescript/issues/426)) ([663880f](https://github.com/Doist/todoist-api-typescript/commit/663880ff83d3d6aa0720137f12dc5fe82b4d9057))


### Miscellaneous

* **deps:** bump undici from 7.16.0 to 7.18.2 ([#427](https://github.com/Doist/todoist-api-typescript/issues/427)) ([a04cbb1](https://github.com/Doist/todoist-api-typescript/commit/a04cbb13a8f82a2e7691110b054d2abe26e64a2f))

## [6.2.1](https://github.com/Doist/todoist-api-typescript/compare/v6.2.0...v6.2.1) (2025-12-03)


### Bug Fixes

* Fix undici browser compatibility with dynamic imports ([#424](https://github.com/Doist/todoist-api-typescript/issues/424)) ([7cd8707](https://github.com/Doist/todoist-api-typescript/commit/7cd8707e1574122bd8494d4d9c8766faa19b0023))


### Code Refactoring

* reduce uncompletable test redundancy by 48% ([#420](https://github.com/Doist/todoist-api-typescript/issues/420)) ([e056fd5](https://github.com/Doist/todoist-api-typescript/commit/e056fd5c42c3754fa2e8b34edcaa68884385f69e))

## [6.2.0](https://github.com/Doist/todoist-api-typescript/compare/v6.1.12...v6.2.0) (2025-11-27)


### Features

* Add uncompletable task support with isUncompletable field ([#418](https://github.com/Doist/todoist-api-typescript/issues/418)) ([93e007a](https://github.com/Doist/todoist-api-typescript/commit/93e007a09adb22b20b7b70bf069bc18bda573fe3))


### Bug Fixes

* Exclude website folder from triggering releases ([#417](https://github.com/Doist/todoist-api-typescript/issues/417)) ([26a7da8](https://github.com/Doist/todoist-api-typescript/commit/26a7da8d53d1edf3c2497c1f0cb7f83cc6cde383))
* Replace 'any' with 'Record&lt;string, unknown&gt;' in test mocks ([#419](https://github.com/Doist/todoist-api-typescript/issues/419)) ([d95300f](https://github.com/Doist/todoist-api-typescript/commit/d95300fd3da480dd4936148cdaf8f729171ea1a1))

## [6.1.12](https://github.com/Doist/todoist-api-typescript/compare/v6.1.11...v6.1.12) (2025-11-26)


### Bug Fixes

* Fix script hanging for 30 seconds ([#414](https://github.com/Doist/todoist-api-typescript/issues/414)) ([afd7094](https://github.com/Doist/todoist-api-typescript/commit/afd70949d8bcc32b09f3ae3217663ab7035cde66))


### Miscellaneous

* Update tests to not use deprecator ctor ([#411](https://github.com/Doist/todoist-api-typescript/issues/411)) ([bb71041](https://github.com/Doist/todoist-api-typescript/commit/bb710419ecd6f904367fb93353ec08f6839153a6))

## [6.1.11](https://github.com/Doist/todoist-api-typescript/compare/v6.1.10...v6.1.11) (2025-11-24)


### Bug Fixes

* add .js extensions to declaration file imports to resolve type re-export issue ([#410](https://github.com/Doist/todoist-api-typescript/issues/410)) ([f059ad9](https://github.com/Doist/todoist-api-typescript/commit/f059ad9ac63b22b7b73037f1461049a5e7678ae0))
* resolve 30-second connection hang in v6.0.0+ ([#408](https://github.com/Doist/todoist-api-typescript/issues/408)) ([27d6133](https://github.com/Doist/todoist-api-typescript/commit/27d61334273974be771f76f650a64c5e3f890bf1))

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
