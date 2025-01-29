# revokeAuthToken()

```ts
function revokeAuthToken(args: RevokeAuthTokenRequestArgs, baseUrl?: string): Promise<boolean>
```

Revokes an access token, making it invalid for future use.

## Parameters

| Parameter  | Type                                                                          |
| ---------- | ----------------------------------------------------------------------------- |
| `args`     | [`RevokeAuthTokenRequestArgs`](../type-aliases/RevokeAuthTokenRequestArgs.md) |
| `baseUrl`? | `string`                                                                      |

## Returns

`Promise`\<`boolean`\>

True if revocation was successful

## Example

```typescript
await revokeAuthToken({
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    accessToken: token,
})
```
