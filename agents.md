# Agent Guidelines

## String Union Types

When defining a string union type, always derive it from a `const` array with `as const`. This gives you both a runtime array and a type from a single source of truth.

### Pattern

```ts
export const EXAMPLE_VALUES = ['a', 'b', 'c'] as const
export type ExampleValue = (typeof EXAMPLE_VALUES)[number]

// If used in a Zod schema:
z.enum(EXAMPLE_VALUES)
```

### Rules

- **Naming**: `SCREAMING_SNAKE_CASE` for const arrays, `PascalCase` for types
- **Export**: Always export const arrays and types
- **Chaining**: Never put `.nullable()` or `.optional()` on the const array — chain those on the schema after `z.enum()`
- **Placement**: Place the const array and type immediately above the first usage
- **Reuse**: If the same values appear in multiple files, define the const array once and import it elsewhere

## Zod Schemas

- **Export**: All Zod schemas should be exported
