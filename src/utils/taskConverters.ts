import { QuickAddTaskResponse, RawTask, Task } from '../types'

const showTaskEndpoint = 'https://todoist.com/showTask'

function getTaskUrlFromTaskId(taskId: string) {
    return `${showTaskEndpoint}?id=${taskId}`
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
        url: getTaskUrlFromTaskId(responseData.id),
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

export function getTaskFromRawTaskResponse(responseData: RawTask): Task {
    const task = {
        id: responseData.id,
        assignerId: responseData.assignedByUid,
        assigneeId: responseData.responsibleUid,
        projectId: responseData.projectId,
        sectionId: responseData.sectionId,
        parentId: responseData.parentId,
        order: responseData.childOrder,
        content: responseData.content,
        description: responseData.description,
        isCompleted: responseData.checked,
        labels: responseData.labels,
        priority: responseData.priority,
        creatorId: responseData.addedByUid ?? '',
        createdAt: responseData.addedAt,
        due: responseData.due,
        url: getTaskUrlFromTaskId(responseData.id),
        duration: responseData.duration,
        deadline: responseData.deadline,
    }
    return task
}
