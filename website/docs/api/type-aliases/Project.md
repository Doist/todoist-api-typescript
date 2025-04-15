# Project

```ts
type Project = 
  | {
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
 }
  | {
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
};
```

Represents either a personal project or a workspace project in Todoist.
