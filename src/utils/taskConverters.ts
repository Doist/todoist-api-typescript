import { QuickAddTaskResponse, Task } from '../types'

const showTaskEndpoint = 'https://todoist.com/showTask'

function getTaskUrlFromQuickAddResponse(responseData: QuickAddTaskResponse) {
    return `${showTaskEndpoint}?id=${responseData.id}`
}

export function getTaskFromQuickAddResponse(responseData: QuickAddTaskResponse): Task {
    const due = responseData.due
        ? {
              isRecurring: responseData.due.isRecurring,
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
        sectionId: responseData.sectionId ?? undefined,
        isCompleted: responseData.checked === 1,
        labels: responseData.labels,
        priority: responseData.priority,
        commentCount: 0, // Will always be 0 for a quick add
        createdAt: responseData.dateAdded,
        url: getTaskUrlFromQuickAddResponse(responseData),
        ...(due !== undefined && { due }),
        ...(responseData.parentId !== null && { parentId: responseData.parentId }),
        ...(responseData.responsibleUid !== null && { assigneeId: responseData.responsibleUid }),
    }

    return task
}
