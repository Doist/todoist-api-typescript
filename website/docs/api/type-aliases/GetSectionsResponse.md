# GetSectionsResponse

```ts
type GetSectionsResponse = {
  nextCursor: string | null;
  results: Section[];
};
```

Response from retrieving sections.

## Type declaration

| Name | Type |
| ------ | ------ |
| <a id="nextcursor"></a> `nextCursor` | `string` \| `null` |
| <a id="results"></a> `results` | [`Section`](../interfaces/Section.md)[] |

## See

https://todoist.com/api/v1/docs#tag/Sections/operation/get_sections_api_v1_sections_get
