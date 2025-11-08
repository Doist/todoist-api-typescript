# Todoist API TypeScript Client

This is the official TypeScript API client for the Todoist REST API.

## Installation

```
npm install @doist/todoist-api-typescript
```

### Usage

An example of initializing the API client and fetching a user's tasks:

```typescript
import { TodoistApi } from '@doist/todoist-api-typescript'

const api = new TodoistApi('YOURTOKEN')

api.getTasks()
    .then((tasks) => console.log(tasks))
    .catch((error) => console.log(error))
```

### Documentation

For more detailed reference documentation, have a look at the [Todoist API v1 Documentation](https://todoist.com/api/v1/docs).

### Migration Guide

If you're migrating from an older version of the Todoist API (v9), please refer to the [official migration guide](https://todoist.com/api/v1/docs#tag/Migrating-from-v9) for detailed information about the changes and breaking updates.

Key changes in v1 include:

-   Updated endpoint structure
-   New pagination system
-   Unified error response format
-   Object renames (e.g., items → tasks, notes → comments)
-   URL renames and endpoint signature changes

## Custom HTTP Clients

The Todoist API client supports custom HTTP implementations to enable usage in environments with specific networking requirements, such as:

-   **Obsidian plugins** - Desktop app with strict CORS policies
-   **Browser extensions** - Custom HTTP APIs with different security models
-   **Electron apps** - Requests routed through IPC layer
-   **React Native** - Different networking stack
-   **Enterprise environments** - Proxy configuration, custom headers, or certificate handling

### Basic Usage

```typescript
import { TodoistApi } from '@doist/todoist-api-typescript'

// Using the new options-based constructor
const api = new TodoistApi('YOURTOKEN', {
    baseUrl: 'https://custom-api.example.com', // optional
    customFetch: myCustomFetch, // your custom fetch implementation
})

// Legacy constructor (deprecated but supported)
const apiLegacy = new TodoistApi('YOURTOKEN', 'https://custom-api.example.com')
```

### Custom Fetch Interface

Your custom fetch function must implement this interface:

```typescript
type CustomFetch = (
    url: string,
    options?: RequestInit & { timeout?: number },
) => Promise<CustomFetchResponse>

type CustomFetchResponse = {
    ok: boolean
    status: number
    statusText: string
    headers: Record<string, string>
    text(): Promise<string>
    json(): Promise<unknown>
}
```

### OAuth with Custom Fetch

OAuth authentication functions (`getAuthToken`, `revokeAuthToken`, `revokeToken`) support custom fetch through an options object:

```typescript
// New options-based usage
const { accessToken } = await getAuthToken(args, {
    baseUrl: 'https://custom-auth.example.com',
    customFetch: myCustomFetch,
})

await revokeToken(args, {
    customFetch: myCustomFetch,
})

// Legacy usage (deprecated)
const { accessToken } = await getAuthToken(args, baseUrl)
```

### Important Notes

-   All existing transforms (snake_case ↔ camelCase) work automatically with custom fetch
-   Retry logic and error handling are preserved
-   File uploads work with custom fetch implementations
-   The custom fetch function should handle FormData for multipart uploads
-   Timeout parameter is optional and up to your custom implementation

## Development and Testing

Instead of having an example app in the repository to assist development and testing, we have included [ts-node](https://github.com/TypeStrong/ts-node) as a dev dependency. This allows us to have a scratch file locally that can import and utilize the API while developing or reviewing pull requests without having to manage a separate app project.

-   `npm install`
-   Add a file named `scratch.ts` in the `src` folder.
-   Configure your IDE to run the scratch file with `ts-node` (instructions for [VSCode](https://medium.com/@dupski/debug-typescript-in-vs-code-without-compiling-using-ts-node-9d1f4f9a94a), [WebStorm](https://www.jetbrains.com/help/webstorm/running-and-debugging-typescript.html#ws_ts_run_debug_server_side_ts_node)), or you can optionally run ts-node in a terminal using instructions [here](https://github.com/TypeStrong/ts-node) (`npx ts-node ./src/scratch.ts` should be enough).
-   Import and call the relevant modules and run the scratch file.

Example scratch.ts file:

```
/* eslint-disable no-console */
import { TodoistApi } from './todoist-api'

const token = 'YOURTOKEN'
const api = new TodoistApi(token)

api.getProjects()
    .then((projects) => {
        console.log(projects)
    })
    .catch((error) => console.error(error))
```

## Releases

A new version is published to the NPM Registry whenever a new release on GitHub is created.

The version in both package.json and package-lock.json is updated with:

`npm version <major|minor|patch> --no-git-tag-version`

Once these changes have been pushed and merged, a release should be created, and a GitHub Action will automatically perform all the necessary steps and will release the version number that's specified inside the `package.json` file's version field.

Users of the API client can then update to this version in their `package.json`.

### Feedback

Any feedback, such as bugs, questions, comments, etc. can be reported as _Issues_ in this repository, and will be handled by us in Todoist.

### Contributions

We would also love contributions in the form of _Pull requests_ in this repository.
