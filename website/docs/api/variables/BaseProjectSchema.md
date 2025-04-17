# BaseProjectSchema

```ts
const BaseProjectSchema: ZodObject<{
  canAssignTasks: ZodBoolean;
  childOrder: ZodNumber;
  color: ZodString;
  createdAt: ZodNullable<ZodString>;
  defaultOrder: ZodNumber;
  description: ZodString;
  id: ZodString;
  isArchived: ZodBoolean;
  isCollapsed: ZodBoolean;
  isDeleted: ZodBoolean;
  isFavorite: ZodBoolean;
  isFrozen: ZodBoolean;
  isShared: ZodBoolean;
  name: ZodString;
  updatedAt: ZodNullable<ZodString>;
  viewStyle: ZodString;
 }, "strip", {
  canAssignTasks: boolean;
  childOrder: number;
  color: string;
  createdAt: null | string;
  defaultOrder: number;
  description: string;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isShared: boolean;
  name: string;
  updatedAt: null | string;
  viewStyle: string;
 }, {
  canAssignTasks: boolean;
  childOrder: number;
  color: string;
  createdAt: null | string;
  defaultOrder: number;
  description: string;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isShared: boolean;
  name: string;
  updatedAt: null | string;
  viewStyle: string;
}>;
```

Base schema for all project types in Todoist.
Contains common fields shared between personal and workspace projects.
