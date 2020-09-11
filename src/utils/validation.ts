import { DueDate, Label, Project, ResponseValidationError, Task } from '../types'

const isString = (value: unknown, isOptional = false): boolean =>
    (isOptional && typeof value === 'undefined') || typeof value === 'string'

const isNumber = (value: unknown, isOptional = false): boolean =>
    (isOptional && typeof value === 'undefined') || typeof value === 'number'

const isBoolean = (value: unknown, isOptional = false): boolean =>
    (isOptional && typeof value === 'undefined') || typeof value === 'boolean'

const isArray = (items: unknown, itemValidationFunc: (item: unknown) => boolean) =>
    Array.isArray(items) && items.every(itemValidationFunc)

const isDueDate = (value: unknown, isOptional = false): value is DueDate => {
    const dueDate = value as DueDate

    return (
        (isOptional && typeof value === 'undefined') ||
        (dueDate &&
            isBoolean(dueDate.recurring) &&
            isString(dueDate.string) &&
            isString(dueDate.date) &&
            isString(dueDate.datetime, true) &&
            isString(dueDate.timezone, true))
    )
}

export const isTask = (item: unknown): item is Task => {
    const task = item as Task

    return (
        task &&
        isNumber(task.id) &&
        isNumber(task.order) &&
        isNumber(task.parentId, true) &&
        isString(task.content) &&
        isNumber(task.projectId) &&
        isNumber(task.sectionId) &&
        isBoolean(task.completed) &&
        isArray(task.labelIds, isNumber) &&
        isNumber(task.priority) &&
        isNumber(task.commentCount) &&
        isString(task.created) &&
        isString(task.url) &&
        isDueDate(task.due, true) &&
        isNumber(task.assignee, true)
    )
}

export const isTaskArray = (items: unknown): items is Task[] => isArray(items, isTask)

export const isProject = (item: unknown): item is Project => {
    const project = item as Project

    return (
        project &&
        isNumber(project.id) &&
        isNumber(project.order, true) &&
        isNumber(project.parentId, true) &&
        isString(project.name) &&
        isNumber(project.color) &&
        isNumber(project.commentCount) &&
        isBoolean(project.shared) &&
        isBoolean(project.favorite) &&
        isBoolean(project.inboxProject, true) &&
        isBoolean(project.teamInbox, true) &&
        isNumber(project.syncId)
    )
}

export const isProjectArray = (items: unknown): items is Project[] => isArray(items, isProject)

export const isLabel = (item: unknown): item is Label => {
    const label = item as Label

    return (
        label &&
        isNumber(label.id) &&
        isNumber(label.order) &&
        isString(label.name) &&
        isNumber(label.color) &&
        isBoolean(label.favorite)
    )
}

export const isLabelArray = (items: unknown): items is Label[] => isArray(items, isLabel)

export const validate = (data: unknown, validationFunc: (data: unknown) => boolean): boolean => {
    const isValid = validationFunc(data)

    if (!isValid) {
        throw new ResponseValidationError(data)
    }

    return isValid
}
