---
sidebar_label: About
sidebar_position: 1
slug: /
---

# Todoist API TypeScript Client

This is the official TypeScript SDK for the Todoist API.

:::caution Version 4.0.0 - Major Update
This version introduces breaking changes to align with Todoist's new v1 API.
### Important Changes

We have transitioned from the [Todoist REST API v2](https://developer.todoist.com/rest/v2/) to the [Todoist API v1](https://todoist.com/api/v1). This migration brings several improvements:

- New unified API structure
- Enhanced TypeScript types and documentation
- Better error handling with specific error types
- New endpoint implementations

For detailed migration instructions from v9, please refer to the [official Todoist API v1 migration guide](https://todoist.com/api/v1/docs#tag/Migrating-from-v9).
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
