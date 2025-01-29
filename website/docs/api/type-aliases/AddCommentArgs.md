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

## Type declaration

| Name | Type |
| ------ | ------ |
| `attachment`? | \| \{ `fileName`: `string`; `fileType`: `string`; `fileUrl`: `string`; `resourceType`: `string`; \} \| `null` |
| `content` | `string` |

## See

https://developer.todoist.com/rest/v2/#create-a-new-comment
