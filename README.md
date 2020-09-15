# todoist-api-typescript

A typescript wrapper for the Todoist REST API.

## Installation

```
npm install @doist/todoist-api-typescript
```

## Development + Testing

Instead of having an example app in the repository to assist development and testing, we have included [ts-node](https://github.com/TypeStrong/ts-node) as a dev dependency. This allows us to have a scratch file locally that can import and utilize the API while developing or reviewing pull requests without having to manage a separate app project.

-   Add a file named `scratch.ts` in the `src` folder.
-   Configure your IDE to run the scratch file with `ts-node` (instructions for [VSCode](https://medium.com/@dupski/debug-typescript-in-vs-code-without-compiling-using-ts-node-9d1f4f9a94a), [WebStorm](https://www.jetbrains.com/help/webstorm/running-and-debugging-typescript.html#ws_ts_run_debug_server_side_ts_node)), or you can optionally run ts-node in a terminal using instructions [here](https://github.com/TypeStrong/ts-node).
-   Import and call the relevant modules and run the scratch file.

Example scratch.ts file:

```
import { TodoistApi } from './TodoistApi'

const token = 'YOURTOKEN'
const api = new TodoistApi(token)

api.getProjects().then((projects) => {
    console.log(projects)
})
```

## Publishing

This project uses [semantic versioning](https://semver.org/). A new version will be published to GitHub Package Registry when a new tag is pushed.

```
npm version <major|minor|patch>
git push --follow-tags
```
