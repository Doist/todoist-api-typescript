import { QuickAddTaskResponse, Task } from '../types'

const showTaskEndpoint = 'https://todoist.com/showTask'

function getTaskUrlFromQuickAddResponse(responseData: QuickAddTaskResponse) {
    return responseData.syncId
        ? `${showTaskEndpoint}?id=${responseData.id}&sync_id=${responseData.syncId}`
        : `${showTaskEndpoint}?id=${responseData.id}`
}

export function getTaskFromQuickAddResponse(responseData: QuickAddTaskResponse): Task {
    const due = responseData.due
        ? {
              recurring: responseData.due.isRecurring,
              string: responseData.due.string,
              date: responseData.due.date,
              ...(responseData.due.timezone !== null && { datetime: responseData.due.date }),
              ...(responseData.due.timezone !== null && { timezone: responseData.due.timezone }),
          }
        : undefined

    const task = {
        id: responseData.id,
        order: responseData.childOrder,
        content: responseData.content,
        description: responseData.description,
        projectId: responseData.projectId,
        sectionId: responseData.sectionId ?? 0,
        completed: responseData.checked === 1,
        labelIds: responseData.labels,
        priority: responseData.priority,
        commentCount: 0, // Will always be 0 for a quick add
        created: responseData.dateAdded,
        url: getTaskUrlFromQuickAddResponse(responseData),
        ...(due !== undefined && { due }),
        ...(responseData.parentId !== null && { parentId: responseData.parentId }),
        ...(responseData.responsibleUid !== null && { assignee: responseData.responsibleUid }),
    }

    return task
}
