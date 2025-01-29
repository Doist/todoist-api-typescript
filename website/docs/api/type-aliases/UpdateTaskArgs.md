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

https://developer.todoist.com/rest/v2/#update-a-task
