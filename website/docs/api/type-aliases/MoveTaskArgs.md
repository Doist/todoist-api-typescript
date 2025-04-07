# MoveTaskArgs

```ts
type MoveTaskArgs = RequireExactlyOne<{
  parentId: string;
  projectId: string;
  sectionId: string;
}>;
```

Arguments for moving a task.

## See

https://todoist.com/api/v1/docs#tag/Tasks/operation/move_task_api_v1_tasks__task_id__move_post
