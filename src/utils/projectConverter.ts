import { Project, RawProject } from '../types'

const showProjectEndpoint = 'https://todoist.com/showProject'

function getProjectUrlFromProjectId(projectId: string) {
    return `${showProjectEndpoint}?id=${projectId}`
}
export function getProjectFromRawProjectResponse(responseData: RawProject): Project {
    const project = {
        id: responseData.id,
        parentId: responseData.parentId ?? null, // workspace projects do not have a parent
        order: responseData.childOrder,
        color: responseData.color,
        name: responseData.name,
        isShared: responseData.isShared,
        isFavorite: responseData.isFavorite,
        isInboxProject: responseData.inboxProject ?? false, // workspace projects do not set this flag
        isTeamInbox: false, // this flag is no longer used
        url: getProjectUrlFromProjectId(responseData.id),
        viewStyle: responseData.viewStyle,
    }
    return project
}
