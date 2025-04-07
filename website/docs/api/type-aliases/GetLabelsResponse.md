# GetLabelsResponse

```ts
type GetLabelsResponse = {
  nextCursor: string | null;
  results: Label[];
};
```

Response from retrieving labels.

## Type declaration

| Name | Type |
| ------ | ------ |
| <a id="nextcursor"></a> `nextCursor` | `string` \| `null` |
| <a id="results"></a> `results` | [`Label`](../interfaces/Label.md)[] |

## See

https://todoist.com/api/v1/docs#tag/Labels/operation/get_labels_api_v1_labels_get
