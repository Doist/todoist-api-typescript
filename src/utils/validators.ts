import {
    SectionSchema,
    LabelSchema,
    CommentSchema,
    UserSchema,
    type Task,
    type Project,
    type Section,
    type Label,
    type Comment,
    type User,
    RawTaskSchema,
    RawProjectSchema,
    ProjectSchema,
    TaskSchema,
} from '../types/entities'
import { getProjectFromRawProjectResponse } from './projectConverter'
import { getTaskFromRawTaskResponse } from './taskConverters'

export function validateTask(input: unknown): Task {
    const rawTaskParse = RawTaskSchema.safeParse(input)
    if (rawTaskParse.success) {
        const task = getTaskFromRawTaskResponse(rawTaskParse.data)
        return task
    }
    return TaskSchema.parse(input)
}

export function validateTaskArray(input: unknown[]): Task[] {
    return input.map(validateTask)
}

export function validateProject(input: unknown): Project {
    const rawProjectParse = RawProjectSchema.safeParse(input)
    if (rawProjectParse.success) {
        const project = getProjectFromRawProjectResponse(rawProjectParse.data)
        return project
    }
    return ProjectSchema.parse(input)
}

export function validateProjectArray(input: unknown[]): Project[] {
    return input.map(validateProject)
}

export function validateSection(input: unknown): Section {
    return SectionSchema.parse(input)
}

export function validateSectionArray(input: unknown[]): Section[] {
    return input.map(validateSection)
}

export function validateLabel(input: unknown): Label {
    return LabelSchema.parse(input)
}

export function validateLabelArray(input: unknown[]): Label[] {
    return input.map(validateLabel)
}

export function validateComment(input: unknown): Comment {
    return CommentSchema.parse(input)
}

export function validateCommentArray(input: unknown[]): Comment[] {
    return input.map(validateComment)
}

export function validateUser(input: unknown): User {
    return UserSchema.parse(input)
}

export function validateUserArray(input: unknown[]): User[] {
    return input.map(validateUser)
}
