# RawComment

Represents the raw comment data as received from the API before transformation.

## See

https://developer.todoist.com/sync/v9/#notes

## Extends

- `TypeOf`\<*typeof* `RawCommentSchema`\>

## Properties

| Property | Type |
| ------ | ------ |
| <a id="content"></a> `content` | `string` |
| <a id="fileattachment"></a> `fileAttachment` | \| `null` \| \{ `fileDuration`: `null` \| `number`; `fileName`: `null` \| `string`; `fileSize`: `null` \| `number`; `fileType`: `null` \| `string`; `fileUrl`: `null` \| `string`; `image`: `null` \| `string`; `imageHeight`: `null` \| `number`; `imageWidth`: `null` \| `number`; `resourceType`: `string`; `title`: `null` \| `string`; `uploadState`: `null` \| `"pending"` \| `"completed"`; `url`: `null` \| `string`; \} |
| <a id="id"></a> `id` | `string` |
| <a id="isdeleted"></a> `isDeleted` | `boolean` |
| <a id="itemid"></a> `itemId?` | `string` |
| <a id="postedat"></a> `postedAt` | `string` |
| <a id="posteduid"></a> `postedUid` | `string` |
| <a id="projectid"></a> `projectId?` | `string` |
| <a id="reactions"></a> `reactions` | `null` \| `Record`\<`string`, `string`[]\> |
| <a id="uidstonotify"></a> `uidsToNotify` | `null` \| `string`[] |
