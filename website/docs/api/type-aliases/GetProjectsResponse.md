# GetProjectsResponse

```ts
type GetProjectsResponse = {
  nextCursor: string | null;
  results: (
     | PersonalProject
     | WorkspaceProject)[];
};
```

Response from retrieving projects.

## Type declaration

| Name | Type |
| ------ | ------ |
| <a id="nextcursor"></a> `nextCursor` | `string` \| `null` |
| <a id="results"></a> `results` | ( \| [`PersonalProject`](../interfaces/PersonalProject.md) \| [`WorkspaceProject`](../interfaces/WorkspaceProject.md))[] |

## See

https://todoist.com/api/v1/docs#tag/Projects/operation/get_projects_api_v1_projects_get
