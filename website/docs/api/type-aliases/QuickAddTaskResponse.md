# QuickAddTaskResponse

```ts
type QuickAddTaskResponse = {
  addedAt: string;
  addedByUid: string | null;
  assignedByUid: string | null;
  checked: boolean;
  childOrder: number;
  content: string;
  deadline: Deadline | null;
  description: string;
  due: DueDate | null;
  duration: Duration | null;
  id: string;
  labels: string[];
  parentId: string | null;
  priority: number;
  projectId: string;
  responsibleUid: string | null;
  sectionId: string | null;
};
```

## Type declaration

| Name | Type |
| ------ | ------ |
| <a id="addedat"></a> `addedAt` | `string` |
| <a id="addedbyuid"></a> `addedByUid` | `string` \| `null` |
| <a id="assignedbyuid"></a> `assignedByUid` | `string` \| `null` |
| <a id="checked"></a> `checked` | `boolean` |
| <a id="childorder"></a> `childOrder` | `number` |
| <a id="content"></a> `content` | `string` |
| <a id="deadline"></a> `deadline` | [`Deadline`](../interfaces/Deadline.md) \| `null` |
| <a id="description"></a> `description` | `string` |
| <a id="due"></a> `due` | [`DueDate`](../interfaces/DueDate.md) \| `null` |
| <a id="duration"></a> `duration` | [`Duration`](../interfaces/Duration.md) \| `null` |
| <a id="id"></a> `id` | `string` |
| <a id="labels"></a> `labels` | `string`[] |
| <a id="parentid"></a> `parentId` | `string` \| `null` |
| <a id="priority"></a> `priority` | `number` |
| <a id="projectid"></a> `projectId` | `string` |
| <a id="responsibleuid"></a> `responsibleUid` | `string` \| `null` |
| <a id="sectionid"></a> `sectionId` | `string` \| `null` |

## See

https://developer.todoist.com/rest/v2/#quick-add-task
