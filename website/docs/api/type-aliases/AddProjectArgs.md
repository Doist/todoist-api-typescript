# AddProjectArgs

```ts
type AddProjectArgs = {
  color: string | number;
  isFavorite: boolean;
  name: string;
  parentId: string;
  viewStyle: ProjectViewStyle;
};
```

Arguments for creating a new project.

## Type declaration

| Name | Type |
| ------ | ------ |
| <a id="color"></a> `color`? | `string` \| `number` |
| <a id="isfavorite"></a> `isFavorite`? | `boolean` |
| <a id="name"></a> `name` | `string` |
| <a id="parentid"></a> `parentId`? | `string` |
| <a id="viewstyle"></a> `viewStyle`? | [`ProjectViewStyle`](ProjectViewStyle.md) |

## See

https://todoist.com/api/v1/docs#tag/Projects/operation/create_project_api_v1_projects_post
