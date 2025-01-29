# AddTaskArgs

```ts
type AddTaskArgs = {
    assigneeId: string
    content: string
    deadlineDate: string
    deadlineLang: string
    description: string
    dueLang: string
    dueString: string
    labels: string[]
    order: number
    parentId: string
    priority: number
    projectId: string
    sectionId: string
} & RequireOneOrNone<{
    dueDate: string
    dueDatetime: string
}> &
    RequireAllOrNone<{
        duration: Duration['amount']
        durationUnit: Duration['unit']
    }>
```

## Type declaration

| Name            | Type       |
| --------------- | ---------- |
| `assigneeId`?   | `string`   |
| `content`       | `string`   |
| `deadlineDate`? | `string`   |
| `deadlineLang`? | `string`   |
| `description`?  | `string`   |
| `dueLang`?      | `string`   |
| `dueString`?    | `string`   |
| `labels`?       | `string`[] |
| `order`?        | `number`   |
| `parentId`?     | `string`   |
| `priority`?     | `number`   |
| `projectId`?    | `string`   |
| `sectionId`?    | `string`   |

## See

https://developer.todoist.com/rest/v2/#create-a-new-task
