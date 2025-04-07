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

https://developer.todoist.com/rest/v2/#tasks
