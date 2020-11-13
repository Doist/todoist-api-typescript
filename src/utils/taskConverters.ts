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
              ...(!!responseData.due.timezone && { datetime: responseData.due.date }),
              ...(!!responseData.due.timezone && { timezone: responseData.due.timezone }),
          }
        : undefined

    const task = {
        id: responseData.id,
        order: responseData.childOrder,
        content: responseData.content,
        projectId: responseData.projectId,
        sectionId: responseData.sectionId ?? 0,
        completed: !!responseData.checked,
        labelIds: responseData.labels,
        priority: responseData.priority,
        commentCount: 0,
        created: responseData.dateAdded,
        url: getTaskUrlFromQuickAddResponse(responseData),
        ...(!!due && { due }),
        ...(!!responseData.parentId && { parentId: responseData.parentId }),
        ...(!!responseData.responsibleUid && { assignee: responseData.responsibleUid }),
    }

    return task
}
