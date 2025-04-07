# AddTaskArgs

```ts
type AddTaskArgs = {
  assigneeId: string;
  content: string;
  deadlineDate: string;
  deadlineLang: string;
  description: string;
  dueLang: string;
  dueString: string;
  labels: string[];
  order: number;
  parentId: string;
  priority: number;
  projectId: string;
  sectionId: string;
 } & RequireOneOrNone<{
  dueDate: string;
  dueDatetime: string;
 }> & RequireAllOrNone<{
  duration: Duration["amount"];
  durationUnit: Duration["unit"];
}>;
```

Arguments for creating a new task.

## Type declaration

| Name | Type |
| ------ | ------ |
| `assigneeId`? | `string` |
| `content` | `string` |
| `deadlineDate`? | `string` |
| `deadlineLang`? | `string` |
| `description`? | `string` |
| `dueLang`? | `string` |
| `dueString`? | `string` |
| `labels`? | `string`[] |
| `order`? | `number` |
| `parentId`? | `string` |
| `priority`? | `number` |
| `projectId`? | `string` |
| `sectionId`? | `string` |

## See

https://todoist.com/api/v1/docs#tag/Tasks/operation/create_task_api_v1_tasks_post
