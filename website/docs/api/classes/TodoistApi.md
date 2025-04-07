# TodoistApi

A client for interacting with the Todoist Sync API.
This class provides methods to manage tasks, projects, sections, labels, and comments in Todoist.

## Example

```typescript
const api = new TodoistApi('your-api-token');

// Get all tasks
const tasks = await api.getTasks();

// Create a new task
const newTask = await api.addTask({
  content: 'My new task',
  projectId: '12345'
});
```

## Constructors

### new TodoistApi()

```ts
new TodoistApi(authToken: string, baseUrl?: string): TodoistApi
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `authToken` | `string` | Your Todoist API token. |
| `baseUrl`? | `string` | Optional custom API base URL. If not provided, defaults to Todoist's standard API endpoint |

#### Returns

[`TodoistApi`](TodoistApi.md)

## Methods

### addComment()

```ts
addComment(args: AddCommentArgs, requestId?: string): Promise<Comment>
```

Adds a comment to a task or project.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`AddCommentArgs`](../type-aliases/AddCommentArgs.md) | Parameters for creating the comment, such as content and the target task or project ID. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<[`Comment`](../interfaces/Comment.md)\>

A promise that resolves to the created comment.

***

### addLabel()

```ts
addLabel(args: AddLabelArgs, requestId?: string): Promise<Label>
```

Adds a new label.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`AddLabelArgs`](../type-aliases/AddLabelArgs.md) | Label creation parameters such as name. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<[`Label`](../interfaces/Label.md)\>

A promise that resolves to the created label.

***

### addProject()

```ts
addProject(args: AddProjectArgs, requestId?: string): Promise<Project>
```

Creates a new project with the provided parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`AddProjectArgs`](../type-aliases/AddProjectArgs.md) | Project creation parameters such as name or color. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<[`Project`](../interfaces/Project.md)\>

A promise that resolves to the created project.

***

### addSection()

```ts
addSection(args: AddSectionArgs, requestId?: string): Promise<Section>
```

Creates a new section within a project.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`AddSectionArgs`](../type-aliases/AddSectionArgs.md) | Section creation parameters such as name or project ID. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<[`Section`](../interfaces/Section.md)\>

A promise that resolves to the created section.

***

### addTask()

```ts
addTask(args: AddTaskArgs, requestId?: string): Promise<Task>
```

Creates a new task with the provided parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`AddTaskArgs`](../type-aliases/AddTaskArgs.md) | Task creation parameters such as content, due date, or priority. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md)\>

A promise that resolves to the created task.

***

### closeTask()

```ts
closeTask(id: string, requestId?: string): Promise<boolean>
```

Closes (completes) a task by its ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the task to close. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if successful.

***

### deleteComment()

```ts
deleteComment(id: string, requestId?: string): Promise<boolean>
```

Deletes a comment by its ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the comment to delete. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if successful.

***

### deleteLabel()

```ts
deleteLabel(id: string, requestId?: string): Promise<boolean>
```

Deletes a label by its ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the label to delete. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if successful.

***

### deleteProject()

```ts
deleteProject(id: string, requestId?: string): Promise<boolean>
```

Deletes a project by its ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the project to delete. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if successful.

***

### deleteSection()

```ts
deleteSection(id: string, requestId?: string): Promise<boolean>
```

Deletes a section by its ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the section to delete. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if successful.

***

### deleteTask()

```ts
deleteTask(id: string, requestId?: string): Promise<boolean>
```

Deletes a task by its ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the task to delete. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if successful.

***

### getComment()

```ts
getComment(id: string): Promise<Comment>
```

Retrieves a specific comment by its ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the comment to retrieve. |

#### Returns

`Promise`\<[`Comment`](../interfaces/Comment.md)\>

A promise that resolves to the requested comment.

***

### getComments()

```ts
getComments(args: 
  | GetTaskCommentsArgs
| GetProjectCommentsArgs): Promise<GetCommentsResponse>
```

Retrieves all comments associated with a task or project.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | \| [`GetTaskCommentsArgs`](../type-aliases/GetTaskCommentsArgs.md) \| [`GetProjectCommentsArgs`](../type-aliases/GetProjectCommentsArgs.md) | Parameters for retrieving comments, such as task ID or project ID. |

#### Returns

`Promise`\<[`GetCommentsResponse`](../type-aliases/GetCommentsResponse.md)\>

A promise that resolves to an array of comments.

***

### getLabel()

```ts
getLabel(id: string): Promise<Label>
```

Retrieves a label by its ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the label. |

#### Returns

`Promise`\<[`Label`](../interfaces/Label.md)\>

A promise that resolves to the requested label.

***

### getLabels()

```ts
getLabels(args: GetLabelsArgs): Promise<GetLabelsResponse>
```

Retrieves all labels.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`GetLabelsArgs`](../type-aliases/GetLabelsArgs.md) | Optional filter parameters. |

#### Returns

`Promise`\<[`GetLabelsResponse`](../type-aliases/GetLabelsResponse.md)\>

A promise that resolves to an array of labels.

***

### getProject()

```ts
getProject(id: string): Promise<Project>
```

Retrieves a project by its ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the project. |

#### Returns

`Promise`\<[`Project`](../interfaces/Project.md)\>

A promise that resolves to the requested project.

***

### getProjectCollaborators()

```ts
getProjectCollaborators(projectId: string, args: GetProjectCollaboratorsArgs): Promise<GetProjectCollaboratorsResponse>
```

Retrieves a list of collaborators for a specific project.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `projectId` | `string` | The unique identifier of the project. |
| `args` | [`GetProjectCollaboratorsArgs`](../type-aliases/GetProjectCollaboratorsArgs.md) | Optional parameters to filter collaborators. |

#### Returns

`Promise`\<[`GetProjectCollaboratorsResponse`](../type-aliases/GetProjectCollaboratorsResponse.md)\>

A promise that resolves to an array of collaborators for the project.

***

### getProjects()

```ts
getProjects(args: GetProjectsArgs): Promise<GetProjectsResponse>
```

Retrieves all projects with optional filters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`GetProjectsArgs`](../type-aliases/GetProjectsArgs.md) | Optional filters for retrieving projects. |

#### Returns

`Promise`\<[`GetProjectsResponse`](../type-aliases/GetProjectsResponse.md)\>

A promise that resolves to an array of projects.

***

### getSection()

```ts
getSection(id: string): Promise<Section>
```

Retrieves a single section by its ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the section. |

#### Returns

`Promise`\<[`Section`](../interfaces/Section.md)\>

A promise that resolves to the requested section.

***

### getSections()

```ts
getSections(args: GetSectionsArgs): Promise<GetSectionsResponse>
```

Retrieves all sections within a specific project or matching criteria.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`GetSectionsArgs`](../type-aliases/GetSectionsArgs.md) | Filter parameters such as project ID. |

#### Returns

`Promise`\<[`GetSectionsResponse`](../type-aliases/GetSectionsResponse.md)\>

A promise that resolves to an array of sections.

***

### getSharedLabels()

```ts
getSharedLabels(args?: GetSharedLabelsArgs): Promise<GetSharedLabelsResponse>
```

Retrieves a list of shared labels.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args`? | [`GetSharedLabelsArgs`](../type-aliases/GetSharedLabelsArgs.md) | Optional parameters to filter shared labels. |

#### Returns

`Promise`\<[`GetSharedLabelsResponse`](../type-aliases/GetSharedLabelsResponse.md)\>

A promise that resolves to an array of shared labels.

***

### getTask()

```ts
getTask(id: string): Promise<Task>
```

Retrieves a single active (non-completed) task by its ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the task. |

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md)\>

A promise that resolves to the requested task.

***

### getTasks()

```ts
getTasks(args: GetTasksArgs): Promise<GetTasksResponse>
```

Retrieves a list of active tasks filtered by specific parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`GetTasksArgs`](../type-aliases/GetTasksArgs.md) | Filter parameters such as project ID, label ID, or due date. |

#### Returns

`Promise`\<[`GetTasksResponse`](../type-aliases/GetTasksResponse.md)\>

A promise that resolves to an array of tasks.

***

### getTasksByFilter()

```ts
getTasksByFilter(args: GetTasksByFilterArgs): Promise<GetTasksResponse>
```

Retrieves tasks filtered by a filter string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`GetTasksByFilterArgs`](../type-aliases/GetTasksByFilterArgs.md) | Parameters for filtering tasks, including the query string and optional language. |

#### Returns

`Promise`\<[`GetTasksResponse`](../type-aliases/GetTasksResponse.md)\>

A promise that resolves to a paginated response of tasks.

***

### moveTasks()

```ts
moveTasks(
   ids: string[], 
   args: MoveTaskArgs, 
requestId?: string): Promise<Task[]>
```

Moves existing tasks by their ID to either a different parent/section/project.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ids` | `string`[] | The unique identifier of the tasks to be moved. |
| `args` | [`MoveTaskArgs`](../type-aliases/MoveTaskArgs.md) | The paramets that should contain only one of projectId, sectionId, or parentId |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md)[]\>

- A promise that resolves to an array of the updated tasks.

***

### quickAddTask()

```ts
quickAddTask(args: QuickAddTaskArgs): Promise<Task>
```

Quickly adds a task using natural language processing for due dates.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`QuickAddTaskArgs`](../type-aliases/QuickAddTaskArgs.md) | Quick add task parameters, including content and due date. |

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md)\>

A promise that resolves to the created task.

***

### removeSharedLabel()

```ts
removeSharedLabel(args: RemoveSharedLabelArgs): Promise<boolean>
```

Removes a shared label.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`RemoveSharedLabelArgs`](../type-aliases/RemoveSharedLabelArgs.md) | Parameters for removing the shared label. |

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if successful.

***

### renameSharedLabel()

```ts
renameSharedLabel(args: RenameSharedLabelArgs): Promise<boolean>
```

Renames an existing shared label.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`RenameSharedLabelArgs`](../type-aliases/RenameSharedLabelArgs.md) | Parameters for renaming the shared label, including the current and new name. |

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if successful.

***

### reopenTask()

```ts
reopenTask(id: string, requestId?: string): Promise<boolean>
```

Reopens a previously closed (completed) task by its ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the task to reopen. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if successful.

***

### updateComment()

```ts
updateComment(
   id: string, 
   args: UpdateCommentArgs, 
requestId?: string): Promise<Comment>
```

Updates an existing comment by its ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the comment to update. |
| `args` | [`UpdateCommentArgs`](../type-aliases/UpdateCommentArgs.md) | Update parameters such as new content. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<[`Comment`](../interfaces/Comment.md)\>

A promise that resolves to the updated comment.

***

### updateLabel()

```ts
updateLabel(
   id: string, 
   args: UpdateLabelArgs, 
requestId?: string): Promise<Label>
```

Updates an existing label by its ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the label to update. |
| `args` | [`UpdateLabelArgs`](../type-aliases/UpdateLabelArgs.md) | Update parameters such as name or color. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<[`Label`](../interfaces/Label.md)\>

A promise that resolves to the updated label.

***

### updateProject()

```ts
updateProject(
   id: string, 
   args: UpdateProjectArgs, 
requestId?: string): Promise<Project>
```

Updates an existing project by its ID with the provided parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the project to update. |
| `args` | [`UpdateProjectArgs`](../type-aliases/UpdateProjectArgs.md) | Update parameters such as name or color. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<[`Project`](../interfaces/Project.md)\>

A promise that resolves to the updated project.

***

### updateSection()

```ts
updateSection(
   id: string, 
   args: UpdateSectionArgs, 
requestId?: string): Promise<Section>
```

Updates a section by its ID with the provided parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the section to update. |
| `args` | [`UpdateSectionArgs`](../type-aliases/UpdateSectionArgs.md) | Update parameters such as name or project ID. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<[`Section`](../interfaces/Section.md)\>

A promise that resolves to the updated section.

***

### updateTask()

```ts
updateTask(
   id: string, 
   args: UpdateTaskArgs, 
requestId?: string): Promise<Task>
```

Updates an existing task by its ID with the provided parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The unique identifier of the task to update. |
| `args` | [`UpdateTaskArgs`](../type-aliases/UpdateTaskArgs.md) | Update parameters such as content, priority, or due date. |
| `requestId`? | `string` | Optional unique identifier for idempotency. |

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md)\>

A promise that resolves to the updated task.
