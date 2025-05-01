# Permission

```ts
type Permission = 
  | "task:add"
  | "data:read"
  | "data:read_write"
  | "data:delete"
  | "project:delete"
  | "backups:read";
```

Permission scopes that can be requested during OAuth2 authorization.

## See

[https://todoist.com/api/v1/docs#tag/Authorization](https://todoist.com/api/v1/docs#tag/Authorization)
