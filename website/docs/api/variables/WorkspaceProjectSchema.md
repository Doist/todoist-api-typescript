# WorkspaceProjectSchema

```ts
const WorkspaceProjectSchema: ZodEffects<ZodObject<extendShape<{
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
  collaboratorRoleDefault: ZodString;
  folderId: ZodNullable<ZodBoolean>;
  isInviteOnly: ZodNullable<ZodBoolean>;
  isLinkSharingEnabled: ZodBoolean;
  role: ZodNullable<ZodString>;
  status: ZodString;
  workspaceId: ZodString;
 }>, "strip", {
  canAssignTasks: boolean;
  childOrder: number;
  collaboratorRoleDefault: string;
  color: string;
  createdAt: null | string;
  defaultOrder: number;
  description: string;
  folderId: null | boolean;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isInviteOnly: null | boolean;
  isLinkSharingEnabled: boolean;
  isShared: boolean;
  name: string;
  role: null | string;
  status: string;
  updatedAt: null | string;
  viewStyle: string;
  workspaceId: string;
 }, {
  canAssignTasks: boolean;
  childOrder: number;
  collaboratorRoleDefault: string;
  color: string;
  createdAt: null | string;
  defaultOrder: number;
  description: string;
  folderId: null | boolean;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isInviteOnly: null | boolean;
  isLinkSharingEnabled: boolean;
  isShared: boolean;
  name: string;
  role: null | string;
  status: string;
  updatedAt: null | string;
  viewStyle: string;
  workspaceId: string;
 }>, {
  canAssignTasks: boolean;
  childOrder: number;
  collaboratorRoleDefault: string;
  color: string;
  createdAt: null | string;
  defaultOrder: number;
  description: string;
  folderId: null | boolean;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isInviteOnly: null | boolean;
  isLinkSharingEnabled: boolean;
  isShared: boolean;
  name: string;
  role: null | string;
  status: string;
  updatedAt: null | string;
  url: string;
  viewStyle: string;
  workspaceId: string;
 }, {
  canAssignTasks: boolean;
  childOrder: number;
  collaboratorRoleDefault: string;
  color: string;
  createdAt: null | string;
  defaultOrder: number;
  description: string;
  folderId: null | boolean;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isInviteOnly: null | boolean;
  isLinkSharingEnabled: boolean;
  isShared: boolean;
  name: string;
  role: null | string;
  status: string;
  updatedAt: null | string;
  viewStyle: string;
  workspaceId: string;
}>;
```

Schema for workspace projects in Todoist.
