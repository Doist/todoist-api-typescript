export type WorkspaceGoalAddArgs = {
    workspaceId: string
    title: string
    description?: string
    deadline?: string | null
    projectIds: string[]
}

export type WorkspaceGoalUpdateArgs = {
    id: string
    title?: string
    description?: string
    deadline?: string | null
}

export type WorkspaceGoalDeleteArgs = {
    id: string
}

export type WorkspaceGoalProjectAddArgs = {
    goalId: string
    projectId: string
}

export type WorkspaceGoalProjectRemoveArgs = {
    goalId: string
    projectId: string
}
