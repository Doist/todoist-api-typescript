import type { PersonalProject, WorkspaceProject } from '../types/projects/types'

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
