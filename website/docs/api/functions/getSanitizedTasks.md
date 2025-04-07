# getSanitizedTasks()

```ts
function getSanitizedTasks(tasks: Task[]): TaskWithSanitizedContent[]
```

Takes an array of tasks and returns a new array with sanitized content
added as 'sanitizedContent' property to each task.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tasks` | [`Task`](../interfaces/Task.md)[] | Array of Task objects to sanitize |

## Returns

[`TaskWithSanitizedContent`](../type-aliases/TaskWithSanitizedContent.md)[]

Array of tasks with added sanitizedContent property

## See

[getSanitizedContent](getSanitizedContent.md)

## Example

```ts
const tasks = [{ content: '**Bold** task', ... }]
getSanitizedTasks(tasks) // [{ content: '**Bold** task', sanitizedContent: 'Bold task', ... }]
```
