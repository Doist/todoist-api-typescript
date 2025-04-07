# UpdateTaskArgs

```ts
type UpdateTaskArgs = {
  assigneeId: string | null;
  content: string;
  deadlineDate: string | null;
  deadlineLang: string | null;
  description: string;
  dueLang: string | null;
  dueString: string;
  labels: string[];
  priority: number;
 } & RequireOneOrNone<{
  dueDate: string;
  dueDatetime: string;
 }> & RequireAllOrNone<{
  duration: Duration["amount"];
  durationUnit: Duration["unit"];
}>;
```

Arguments for updating a task.

## Type declaration

| Name | Type |
| ------ | ------ |
| `assigneeId`? | `string` \| `null` |
| `content`? | `string` |
| `deadlineDate`? | `string` \| `null` |
| `deadlineLang`? | `string` \| `null` |
| `description`? | `string` |
| `dueLang`? | `string` \| `null` |
| `dueString`? | `string` |
| `labels`? | `string`[] |
| `priority`? | `number` |

## See

https://todoist.com/api/v1/docs#tag/Tasks/operation/update_task_api_v1_tasks__task_id__post
