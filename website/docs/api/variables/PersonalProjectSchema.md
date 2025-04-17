# PersonalProjectSchema

```ts
const PersonalProjectSchema: ZodEffects<ZodObject<extendShape<{
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
 }, {
  inboxProject: ZodBoolean;
  parentId: ZodNullable<ZodString>;
 }>, "strip", {
  canAssignTasks: boolean;
  childOrder: number;
  color: string;
  createdAt: null | string;
  defaultOrder: number;
  description: string;
  id: string;
  inboxProject: boolean;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isShared: boolean;
  name: string;
  parentId: null | string;
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
  inboxProject: boolean;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isShared: boolean;
  name: string;
  parentId: null | string;
  updatedAt: null | string;
  viewStyle: string;
 }>, {
  canAssignTasks: boolean;
  childOrder: number;
  color: string;
  createdAt: null | string;
  defaultOrder: number;
  description: string;
  id: string;
  inboxProject: boolean;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isShared: boolean;
  name: string;
  parentId: null | string;
  updatedAt: null | string;
  url: string;
  viewStyle: string;
 }, {
  canAssignTasks: boolean;
  childOrder: number;
  color: string;
  createdAt: null | string;
  defaultOrder: number;
  description: string;
  id: string;
  inboxProject: boolean;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isShared: boolean;
  name: string;
  parentId: null | string;
  updatedAt: null | string;
  viewStyle: string;
}>;
```

Schema for personal projects in Todoist.
