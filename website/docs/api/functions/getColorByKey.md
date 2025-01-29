# getColorByKey()

```ts
function getColorByKey(colorKey: string): Color
```

Retrieves a [Color](../interfaces/Color.md) object by its key identifier.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `colorKey` | `string` | The unique key identifier of the color to find (e.g., 'berry_red', 'sky_blue') |

## Returns

[`Color`](../interfaces/Color.md)

The matching Color object if found, otherwise returns the default color (charcoal)

## Example

```typescript
const color = getColorByKey('berry_red');
console.log(color.hexValue); // '#b8255f'
```
