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

For more detailed reference documentation, have a look at the [API documentation with TypeScript examples](https://developer.todoist.com/rest/v1/?javascript).

## Development and Testing

Instead of having an example app in the repository to assist development and testing, we have included [ts-node](https://github.com/TypeStrong/ts-node) as a dev dependency. This allows us to have a scratch file locally that can import and utilize the API while developing or reviewing pull requests without having to manage a separate app project.

-   `npm install`
-   Add a file named `scratch.ts` in the `src` folder.
-   Configure your IDE to run the scratch file with `ts-node` (instructions for [VSCode](https://medium.com/@dupski/debug-typescript-in-vs-code-without-compiling-using-ts-node-9d1f4f9a94a), [WebStorm](https://www.jetbrains.com/help/webstorm/running-and-debugging-typescript.html#ws_ts_run_debug_server_side_ts_node)), or you can optionally run ts-node in a terminal using instructions [here](https://github.com/TypeStrong/ts-node) (`npx ts-node ./src/scratch.ts` should be enough).
-   Import and call the relevant modules and run the scratch file.

Example scratch.ts file:

```
/* eslint-disable no-console */
import { TodoistApi } from './TodoistApi'

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
