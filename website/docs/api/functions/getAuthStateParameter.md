# getAuthStateParameter()

```ts
function getAuthStateParameter(): string
```

Generates a random state parameter for OAuth2 authorization.
The state parameter helps prevent CSRF attacks.

## Returns

`string`

A random UUID v4 string

## Example

```typescript
const state = getAuthStateParameter()
// Store state in session
const authUrl = getAuthorizationUrl(clientId, ['data:read'], state)
```
