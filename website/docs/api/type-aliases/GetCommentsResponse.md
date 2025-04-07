# GetCommentsResponse

```ts
type GetCommentsResponse = {
  nextCursor: string | null;
  results: Comment[];
};
```

Response from retrieving comments.

## Type declaration

| Name | Type |
| ------ | ------ |
| <a id="nextcursor"></a> `nextCursor` | `string` \| `null` |
| <a id="results"></a> `results` | [`Comment`](../interfaces/Comment.md)[] |

## See

https://todoist.com/api/v1/docs#tag/Comments/operation/get_comments_api_v1_comments_get
