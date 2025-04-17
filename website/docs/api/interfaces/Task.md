# Task

Represents a task in Todoist.

## See

https://todoist.com/api/v1/docs#tag/Tasks

## Extends

- `TypeOf`\<*typeof* `TaskSchema`\>

## Properties

| Property | Type |
| ------ | ------ |
| <a id="addedat"></a> `addedAt` | `null` \| `string` |
| <a id="addedbyuid"></a> `addedByUid` | `null` \| `string` |
| <a id="assignedbyuid"></a> `assignedByUid` | `null` \| `string` |
| <a id="checked"></a> `checked` | `boolean` |
| <a id="childorder"></a> `childOrder` | `number` |
| <a id="completedat"></a> `completedAt` | `null` \| `string` |
| <a id="content"></a> `content` | `string` |
| <a id="dayorder"></a> `dayOrder` | `number` |
| <a id="deadline"></a> `deadline` | \| `null` \| \{ `date`: `string`; `lang`: `string`; \} |
| <a id="description"></a> `description` | `string` |
| <a id="due"></a> `due` | \| `null` \| \{ `date`: `string`; `datetime`: `null` \| `string`; `isRecurring`: `boolean`; `lang`: `null` \| `string`; `string`: `string`; `timezone`: `null` \| `string`; \} |
| <a id="duration"></a> `duration` | \| `null` \| \{ `amount`: `number`; `unit`: `"minute"` \| `"day"`; \} |
| <a id="id"></a> `id` | `string` |
| <a id="iscollapsed"></a> `isCollapsed` | `boolean` |
| <a id="isdeleted"></a> `isDeleted` | `boolean` |
| <a id="labels"></a> `labels` | `string`[] |
| <a id="notecount"></a> `noteCount` | `number` |
| <a id="parentid"></a> `parentId` | `null` \| `string` |
| <a id="priority"></a> `priority` | `number` |
| <a id="projectid"></a> `projectId` | `string` |
| <a id="responsibleuid"></a> `responsibleUid` | `null` \| `string` |
| <a id="sectionid"></a> `sectionId` | `null` \| `string` |
| <a id="updatedat"></a> `updatedAt` | `null` \| `string` |
| <a id="url"></a> `url` | `string` |
| <a id="userid"></a> `userId` | `string` |
