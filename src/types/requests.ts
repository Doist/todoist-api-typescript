export type AddTaskArgs = {
    content: string
    projectId?: number
    sectionId?: number
    parentId?: number
    order?: number
    labelIds?: number[]
    priority?: number
    dueString?: string
    dueLang?: string
    dueDate?: string
    dueDatetime?: string
    assignee?: number
}
