# AddCommentArgs

```ts
type AddCommentArgs = {
  attachment:   | {
     fileName: string;
     fileType: string;
     fileUrl: string;
     resourceType: string;
    }
     | null;
  content: string;
 } & RequireExactlyOne<{
  projectId: string;
  taskId: string;
}>;
```

Arguments for creating a new comment.

## Type declaration

| Name | Type |
| ------ | ------ |
| `attachment`? | \| \{ `fileName`: `string`; `fileType`: `string`; `fileUrl`: `string`; `resourceType`: `string`; \} \| `null` |
| `content` | `string` |

## See

https://todoist.com/api/v1/docs#tag/Comments/operation/create_comment_api_v1_comments_post
