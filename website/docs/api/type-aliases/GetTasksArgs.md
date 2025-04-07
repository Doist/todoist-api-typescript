# GetTasksArgs

```ts
type GetTasksArgs = {
  cursor: string | null;
  ids: string[];
  label: string;
  limit: number;
  parentId: string;
  projectId: string;
  sectionId: string;
};
```

Arguments for retrieving tasks.

## Type declaration

| Name | Type |
| ------ | ------ |
| <a id="cursor"></a> `cursor`? | `string` \| `null` |
| <a id="ids"></a> `ids`? | `string`[] |
| <a id="label"></a> `label`? | `string` |
| <a id="limit"></a> `limit`? | `number` |
| <a id="parentid"></a> `parentId`? | `string` |
| <a id="projectid"></a> `projectId`? | `string` |
| <a id="sectionid"></a> `sectionId`? | `string` |

## See

https://todoist.com/api/v1/docs#tag/Tasks/operation/get_tasks_api_v1_tasks_get
