# getAuthorizationUrl()

```ts
function getAuthorizationUrl(
   clientId: string, 
   permissions: Permission[], 
   state: string, 
   baseUrl?: string): string
```

Generates the authorization URL for the OAuth2 flow.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `clientId` | `string` |
| `permissions` | [`Permission`](../type-aliases/Permission.md)[] |
| `state` | `string` |
| `baseUrl`? | `string` |

## Returns

`string`

The full authorization URL to redirect users to

## Example

```typescript
const url = getAuthorizationUrl(
  'your-client-id',
  ['data:read', 'task:add'],
  state
)
// Redirect user to url
```

## See

https://developer.todoist.com/guides/#step-1-authorization-request
