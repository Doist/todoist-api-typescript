import { TODOIST_WEB_URI } from '../consts/endpoints'

/**
 * Generate the URL for a given task.
 *
 * @param taskId The ID of the task.
 * @param content The content of the task.
 * @returns The URL string for the task view.
 */
export function getTaskUrl(taskId: string, content?: string): string {
    const slug = content ? slugify(content) : undefined
    const path = slug ? `${slug}-${taskId}` : taskId
    return `${TODOIST_WEB_URI}/task/${path}`
}

/**
 * Generate the URL for a given project.
 *
 * @param projectId The ID of the project.
 * @param name The name of the project.
 * @returns The URL string for the project view.
 */
export function getProjectUrl(projectId: string, name?: string): string {
    const slug = name ? slugify(name) : undefined
    const path = slug ? `${slug}-${projectId}` : projectId
    return `${TODOIST_WEB_URI}/project/${path}`
}

/**
 * Generate the URL for a given section.
 *
 * @param sectionId The ID of the section.
 * @param name The name of the section.
 * @returns The URL string for the section view.
 */
export function getSectionUrl(sectionId: string, name?: string): string {
    const slug = name ? slugify(name) : undefined
    const path = slug ? `${slug}-${sectionId}` : sectionId
    return `${TODOIST_WEB_URI}/section/${path}`
}

/**
 * Slugify function borrowed from Django.
 *
 * @param value The string to slugify.
 * @returns The slugified string.
 */
function slugify(value: string): string {
    // Convert to ASCII
    let result = value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')

    // Remove non-ASCII characters
    result = result.replace(/[^\x20-\x7E]/g, '')

    // Convert to lowercase and replace non-alphanumeric characters with dashes
    result = result.toLowerCase().replace(/[^\w\s-]/g, '')

    // Replace spaces and repeated dashes with single dashes
    result = result.replace(/[-\s]+/g, '-')

    // Strip dashes from the beginning and end
    return result.replace(/^-+|-+$/g, '')
}
