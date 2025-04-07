# Task

Represents a task in Todoist.

## See

https://todoist.com/api/v1/docs#tag/Tasks

## Extends

- `TypeOf`\<*typeof* `TaskSchema`\>

## Properties

| Property | Type |
| ------ | ------ |
| <a id="assigneeid"></a> `assigneeId` | `null` \| `string` |
| <a id="assignerid"></a> `assignerId` | `null` \| `string` |
| <a id="content"></a> `content` | `string` |
| <a id="createdat"></a> `createdAt` | `string` |
| <a id="creatorid"></a> `creatorId` | `string` |
| <a id="deadline"></a> `deadline` | \| `null` \| \{ `date`: `string`; `lang`: `string`; \} |
| <a id="description"></a> `description` | `string` |
| <a id="due"></a> `due` | \| `null` \| \{ `date`: `string`; `datetime`: `null` \| `string`; `isRecurring`: `boolean`; `lang`: `null` \| `string`; `string`: `string`; `timezone`: `null` \| `string`; \} |
| <a id="duration"></a> `duration` | \| `null` \| \{ `amount`: `number`; `unit`: `"minute"` \| `"day"`; \} |
| <a id="id"></a> `id` | `string` |
| <a id="iscompleted"></a> `isCompleted` | `boolean` |
| <a id="labels"></a> `labels` | `string`[] |
| <a id="order"></a> `order` | `number` |
| <a id="parentid"></a> `parentId` | `null` \| `string` |
| <a id="priority"></a> `priority` | `number` |
| <a id="projectid"></a> `projectId` | `string` |
| <a id="sectionid"></a> `sectionId` | `null` \| `string` |
| <a id="url"></a> `url` | `string` |
