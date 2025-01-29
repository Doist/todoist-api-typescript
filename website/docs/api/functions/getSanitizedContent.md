# getSanitizedContent()

```ts
function getSanitizedContent(input: string): string
```

Sanitizes a string by removing Todoist's formatting syntax (e.g. bold, italic, code blocks, links).

## Parameters

| Parameter | Type     | Description            |
| --------- | -------- | ---------------------- |
| `input`   | `string` | The string to sanitize |

## Returns

`string`

The sanitized string with all formatting removed

## Example

```ts
// Removes bold/italic formatting
getSanitizedContent('Some **bold** and *italic*') // 'Some bold and italic'

// Removes markdown links
getSanitizedContent('A [markdown](http://url.com) link') // 'A markdown link'

// Removes app-specific links
getSanitizedContent('A [[gmail=id, link from gmail]]') // 'A link from gmail'
```
