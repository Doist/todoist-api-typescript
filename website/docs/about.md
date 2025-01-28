---
sidebar_label: About
sidebar_position: 1
slug: /
---

# Todoist API TypeScript Client

This is the official TypeScript API client for the Todoist REST API.

:::caution warning

This documentation is only compatible with version `v4.0.0` and newer.

### Important Changes

We are currently transitioning from the [Todoist REST API](https://developer.todoist.com/rest/v2/) to the [Todoist Sync API](https://developer.todoist.com/sync/v9/#overview). Due to this migration:

-   Documentation for versions `v3.0.3` and earlier may be outdated
-   Some features might not be backward compatible
-   Pre-release versions of `v4.0.0` should not be used in production

For older versions, please refer to the [legacy](https://developer.todoist.com/rest/v2/) documentation.
:::

## Installation

```bash
npm install @doist/todoist-api-typescript
```

## Basic Usage

Here's how to initialize the API client and fetch tasks:

```typescript
import { TodoistApi } from '@doist/todoist-api-typescript'

const api = new TodoistApi('YOUR_API_TOKEN')

api.getTask('6X4Vw2Hfmg73Q2XR')
    .then((task) => console.log(task))
    .catch((error) => console.log(error))
```

Explore all available methods in [TodoistApi](/api/classes/TodoistApi).
