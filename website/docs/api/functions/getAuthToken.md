# getAuthToken()

```ts
function getAuthToken(args: AuthTokenRequestArgs, baseUrl?: string): Promise<AuthTokenResponse>
```

Exchanges an authorization code for an access token.

## Parameters

| Parameter  | Type                                                              |
| ---------- | ----------------------------------------------------------------- |
| `args`     | [`AuthTokenRequestArgs`](../type-aliases/AuthTokenRequestArgs.md) |
| `baseUrl`? | `string`                                                          |

## Returns

`Promise`\<[`AuthTokenResponse`](../type-aliases/AuthTokenResponse.md)\>

The access token response

## Example

```typescript
const { accessToken } = await getAuthToken({
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    code: authCode,
})
```

## Throws

[TodoistRequestError](../classes/TodoistRequestError.md) If the token exchange fails
