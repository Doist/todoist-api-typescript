# TodoistRequestError

## Extends

-   `CustomError`

## Constructors

### new TodoistRequestError()

```ts
new TodoistRequestError(
   message: string,
   httpStatusCode?: number,
   responseData?: unknown): TodoistRequestError
```

#### Parameters

| Parameter         | Type      |
| ----------------- | --------- |
| `message`         | `string`  |
| `httpStatusCode`? | `number`  |
| `responseData`?   | `unknown` |

#### Returns

[`TodoistRequestError`](TodoistRequestError.md)

#### Overrides

```ts
CustomError.constructor
```

## Properties

| Property                                            | Modifier | Type                                                   | Description                                                                                                                      |
| --------------------------------------------------- | -------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| <a id="cause"></a> `cause?`                         | `public` | `unknown`                                              | -                                                                                                                                |
| <a id="httpstatuscode-1"></a> `httpStatusCode?`     | `public` | `number`                                               | -                                                                                                                                |
| <a id="message-1"></a> `message`                    | `public` | `string`                                               | -                                                                                                                                |
| <a id="name"></a> `name`                            | `public` | `string`                                               | -                                                                                                                                |
| <a id="responsedata-1"></a> `responseData?`         | `public` | `unknown`                                              | -                                                                                                                                |
| <a id="stack"></a> `stack?`                         | `public` | `string`                                               | -                                                                                                                                |
| <a id="preparestacktrace"></a> `prepareStackTrace?` | `static` | (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any` | Optional override for formatting stack traces **See** https://github.com/v8/v8/wiki/Stack%20Trace%20API#customizing-stack-traces |
| <a id="stacktracelimit"></a> `stackTraceLimit`      | `static` | `number`                                               | -                                                                                                                                |

## Methods

### isAuthenticationError()

```ts
isAuthenticationError(): boolean
```

#### Returns

`boolean`

---

### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void
```

Create .stack property on a target object

#### Parameters

| Parameter         | Type       |
| ----------------- | ---------- |
| `targetObject`    | `object`   |
| `constructorOpt`? | `Function` |

#### Returns

`void`

#### Inherited from

```ts
CustomError.captureStackTrace
```
