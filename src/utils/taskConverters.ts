import { QuickAddTaskResponse, Task } from '../types'

const showTaskEndpoint = 'https://todoist.com/showTask'

function getTaskUrlFromQuickAddResponse(responseData: QuickAddTaskResponse) {
    return `${showTaskEndpoint}?id=${responseData.id}`
}

export function getTaskFromQuickAddResponse(responseData: QuickAddTaskResponse): Task {
    const task = {
        id: responseData.id,
        order: responseData.childOrder,
        content: responseData.content,
        description: responseData.description,
        projectId: responseData.projectId,
        sectionId: responseData.sectionId,
        isCompleted: responseData.checked,
        labels: responseData.labels,
        priority: responseData.priority,
        createdAt: responseData.addedAt,
        url: getTaskUrlFromQuickAddResponse(responseData),
        creatorId: responseData.addedByUid ?? '',
        parentId: responseData.parentId,
        duration: responseData.duration,
        assignerId: responseData.assignedByUid,
        assigneeId: responseData.responsibleUid,
        deadline: responseData.deadline,
        due: responseData.due,
    }

    return task
}
