# Comment

Represents a comment on a task or project in Todoist.

## See

https://developer.todoist.com/sync/v9/#notes

## Extends

- `TypeOf`\<*typeof* `CommentSchema`\>

## Properties

| Property | Type | Default value |
| ------ | ------ | ------ |
| <a id="content"></a> `content` | `string` | `undefined` |
| <a id="fileattachment"></a> `fileAttachment` | \| `null` \| \{ `fileDuration`: `null` \| `number`; `fileName`: `null` \| `string`; `fileSize`: `null` \| `number`; `fileType`: `null` \| `string`; `fileUrl`: `null` \| `string`; `image`: `null` \| `string`; `imageHeight`: `null` \| `number`; `imageWidth`: `null` \| `number`; `resourceType`: `string`; `title`: `null` \| `string`; `uploadState`: `null` \| `"pending"` \| `"completed"`; `url`: `null` \| `string`; \} | `undefined` |
| <a id="id"></a> `id` | `string` | `undefined` |
| <a id="isdeleted"></a> `isDeleted` | `boolean` | `undefined` |
| <a id="postedat"></a> `postedAt` | `string` | `undefined` |
| <a id="posteduid"></a> `postedUid` | `string` | `undefined` |
| <a id="projectid"></a> `projectId?` | `string` | `undefined` |
| <a id="reactions"></a> `reactions` | `null` \| `Record`\<`string`, `string`[]\> | `undefined` |
| <a id="taskid"></a> `taskId` | `undefined` \| `string` | `itemId` |
| <a id="uidstonotify"></a> `uidsToNotify` | `null` \| `string`[] | `undefined` |
