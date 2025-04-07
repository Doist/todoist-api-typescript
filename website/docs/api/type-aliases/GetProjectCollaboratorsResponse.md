# GetProjectCollaboratorsResponse

```ts
type GetProjectCollaboratorsResponse = {
  nextCursor: string | null;
  results: User[];
};
```

Response from retrieving project collaborators.

## Type declaration

| Name | Type |
| ------ | ------ |
| <a id="nextcursor"></a> `nextCursor` | `string` \| `null` |
| <a id="results"></a> `results` | [`User`](../interfaces/User.md)[] |

## See

https://todoist.com/api/v1/docs#tag/Projects/operation/get_project_collaborators_api_v1_projects__project_id__collaborators_get
