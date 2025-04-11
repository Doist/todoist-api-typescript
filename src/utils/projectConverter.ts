import { Project, RawProject } from '../types'

const showProjectEndpoint = 'https://todoist.com/showProject'

function getProjectUrlFromProjectId(projectId: string) {
    return `${showProjectEndpoint}?id=${projectId}`
}
export function getProjectFromRawProjectResponse(responseData: RawProject): Project {
    const project = {
        id: responseData.id,
        parentId: responseData.parentId,
        order: responseData.childOrder,
        color: responseData.color,
        name: responseData.name,
        isShared: responseData.isShared,
        isFavorite: responseData.isFavorite,
        isInboxProject: responseData.inboxProject,
        isTeamInbox: responseData.inboxProject && responseData.isShared, // just guessing
        url: getProjectUrlFromProjectId(responseData.id),
        viewStyle: responseData.viewStyle,
    }
    return project
}
