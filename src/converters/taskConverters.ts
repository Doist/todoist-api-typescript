import { QuickAddTaskResponse, Task } from '../types'

const showTaskEndpoint = 'https://todoist.com/showTask'

const getTaskUrlFromQuickAddResponse = (responseData: QuickAddTaskResponse) =>
    responseData.syncId
        ? `${showTaskEndpoint}?id=${responseData.id}&sync_id=${responseData.syncId}`
        : `${showTaskEndpoint}?id=${responseData.id}`

export const getTaskFromQuickAddResponse = (responseData: QuickAddTaskResponse): Task => ({
    id: responseData.id,
    order: responseData.childOrder,
    parentId: responseData.parentId ?? undefined,
    content: responseData.content,
    projectId: responseData.projectId,
    sectionId: responseData.sectionId ?? 0,
    completed: !!responseData.checked,
    labelIds: responseData.labels,
    priority: responseData.priority,
    commentCount: 0, // Will always be 0 for a quick add
    created: responseData.dateAdded,
    url: getTaskUrlFromQuickAddResponse(responseData),
    due: responseData.due ?? undefined,
    assignee: responseData.responsibleUid ?? undefined,
})
