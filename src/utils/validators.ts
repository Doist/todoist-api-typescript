import { Label, Project, Section, Task, User, Comment } from '../types'

export function validateTask(input: unknown): Task {
    return Task.check(input)
}
export function validateTaskArray(input: unknown[]): Task[] {
    return input.map(validateTask)
}

export function validateProject(input: unknown): Project {
    return Project.check(input)
}
export function validateProjectArray(input: unknown[]): Project[] {
    return input.map(validateProject)
}

export function validateSection(input: unknown): Section {
    return Section.check(input)
}
export function validateSectionArray(input: unknown[]): Section[] {
    return input.map(validateSection)
}

export function validateLabel(input: unknown): Label {
    return Label.check(input)
}
export function validateLabelArray(input: unknown[]): Label[] {
    return input.map(validateLabel)
}

export function validateComment(input: unknown): Comment {
    return Comment.check(input)
}
export function validateCommentArray(input: unknown[]): Comment[] {
    return input.map(validateComment)
}

export function validateUser(input: unknown): User {
    return User.check(input)
}
export function validateUserArray(input: unknown[]): User[] {
    return input.map(validateUser)
}
