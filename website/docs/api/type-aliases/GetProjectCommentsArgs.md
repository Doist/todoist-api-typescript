# GetProjectCommentsArgs

```ts
type GetProjectCommentsArgs = {
  cursor: string | null;
  limit: number;
  projectId: string;
  taskId: never;
};
```

Arguments for retrieving project comments.

## Type declaration

| Name | Type |
| ------ | ------ |
| <a id="cursor"></a> `cursor`? | `string` \| `null` |
| <a id="limit"></a> `limit`? | `number` |
| <a id="projectid"></a> `projectId` | `string` |
| <a id="taskid"></a> `taskId`? | `never` |

## See

https://todoist.com/api/v1/docs#tag/Comments/operation/get_comments_api_v1_comments_get
