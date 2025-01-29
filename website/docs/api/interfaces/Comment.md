# Comment

Represents a comment on a task or project in Todoist.

## See

https://developer.todoist.com/sync/v9/#notes

## Extends

- `TypeOf`\<*typeof* `CommentSchema`\>

## Properties

| Property | Type |
| ------ | ------ |
| <a id="attachment"></a> `attachment` | \| `null` \| \{ `fileDuration`: `null` \| `number`; `fileName`: `null` \| `string`; `fileSize`: `null` \| `number`; `fileType`: `null` \| `string`; `fileUrl`: `null` \| `string`; `image`: `null` \| `string`; `imageHeight`: `null` \| `number`; `imageWidth`: `null` \| `number`; `resourceType`: `string`; `title`: `null` \| `string`; `uploadState`: `null` \| `"pending"` \| `"completed"`; `url`: `null` \| `string`; \} |
| <a id="content"></a> `content` | `string` |
| <a id="id"></a> `id` | `string` |
| <a id="postedat"></a> `postedAt` | `string` |
| <a id="projectid"></a> `projectId` | `null` \| `string` |
| <a id="taskid"></a> `taskId` | `null` \| `string` |
