import {
    SectionSchema,
    LabelSchema,
    CommentSchema,
    UserSchema,
    CurrentUserSchema,
    TaskSchema,
    type Task,
    type Section,
    type Label,
    type Comment,
    type User,
    type CurrentUser,
    type ProductivityStats,
    PersonalProjectSchema,
    WorkspaceProjectSchema,
    type WorkspaceProject,
    type PersonalProject,
    ProductivityStatsSchema,
} from '../types/entities'

export function validateTask(input: unknown): Task {
    return TaskSchema.parse(input)
}

export function validateTaskArray(input: unknown[]): Task[] {
    return input.map(validateTask)
}

/**
 * Type guard to check if a project is a workspace project.
 * @param project The project to check
 * @returns True if the project is a workspace project
 */
export function isWorkspaceProject(
    project: PersonalProject | WorkspaceProject,
): project is WorkspaceProject {
    return 'workspaceId' in project
}

/**
 * Type guard to check if a project is a personal project.
 * @param project The project to check
 * @returns True if the project is a personal project
 */
export function isPersonalProject(
    project: PersonalProject | WorkspaceProject,
): project is PersonalProject {
    return !isWorkspaceProject(project)
}

/**
 * Validates and parses a project input.
 * @param input The input to validate
 * @returns A validated project (either PersonalProject or WorkspaceProject)
 */
export function validateProject(input: unknown): PersonalProject | WorkspaceProject {
    if ('workspaceId' in (input as WorkspaceProject)) {
        return WorkspaceProjectSchema.parse(input)
    }
    return PersonalProjectSchema.parse(input)
}

export function validateProjectArray(input: unknown[]): (PersonalProject | WorkspaceProject)[] {
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

export function validateProductivityStats(input: unknown): ProductivityStats {
    return ProductivityStatsSchema.parse(input)
}

export function validateCurrentUser(input: unknown): CurrentUser {
    return CurrentUserSchema.parse(input)
}
