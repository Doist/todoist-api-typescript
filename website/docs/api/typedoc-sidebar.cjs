// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const typedocSidebar = {
    items: [
        {
            type: 'category',
            label: 'Classes',
            items: [
                { type: 'doc', id: 'api/classes/TodoistApi', label: 'TodoistApi' },
                {
                    type: 'doc',
                    id: 'api/classes/TodoistRequestError',
                    label: 'TodoistRequestError',
                },
            ],
        },
        {
            type: 'category',
            label: 'Interfaces',
            items: [
                { type: 'doc', id: 'api/interfaces/Attachment', label: 'Attachment' },
                { type: 'doc', id: 'api/interfaces/Color', label: 'Color' },
                { type: 'doc', id: 'api/interfaces/Comment', label: 'Comment' },
                { type: 'doc', id: 'api/interfaces/Deadline', label: 'Deadline' },
                { type: 'doc', id: 'api/interfaces/DueDate', label: 'DueDate' },
                { type: 'doc', id: 'api/interfaces/Duration', label: 'Duration' },
                { type: 'doc', id: 'api/interfaces/Label', label: 'Label' },
                { type: 'doc', id: 'api/interfaces/Project', label: 'Project' },
                { type: 'doc', id: 'api/interfaces/Section', label: 'Section' },
                { type: 'doc', id: 'api/interfaces/Task', label: 'Task' },
                { type: 'doc', id: 'api/interfaces/User', label: 'User' },
            ],
        },
        {
            type: 'category',
            label: 'Type Aliases',
            items: [
                { type: 'doc', id: 'api/type-aliases/AddCommentArgs', label: 'AddCommentArgs' },
                { type: 'doc', id: 'api/type-aliases/AddLabelArgs', label: 'AddLabelArgs' },
                { type: 'doc', id: 'api/type-aliases/AddProjectArgs', label: 'AddProjectArgs' },
                { type: 'doc', id: 'api/type-aliases/AddSectionArgs', label: 'AddSectionArgs' },
                { type: 'doc', id: 'api/type-aliases/AddTaskArgs', label: 'AddTaskArgs' },
                {
                    type: 'doc',
                    id: 'api/type-aliases/AuthTokenRequestArgs',
                    label: 'AuthTokenRequestArgs',
                },
                {
                    type: 'doc',
                    id: 'api/type-aliases/AuthTokenResponse',
                    label: 'AuthTokenResponse',
                },
                {
                    type: 'doc',
                    id: 'api/type-aliases/GetCommentsResponse',
                    label: 'GetCommentsResponse',
                },
                { type: 'doc', id: 'api/type-aliases/GetLabelsArgs', label: 'GetLabelsArgs' },
                {
                    type: 'doc',
                    id: 'api/type-aliases/GetLabelsResponse',
                    label: 'GetLabelsResponse',
                },
                {
                    type: 'doc',
                    id: 'api/type-aliases/GetProjectCollaboratorsArgs',
                    label: 'GetProjectCollaboratorsArgs',
                },
                {
                    type: 'doc',
                    id: 'api/type-aliases/GetProjectCollaboratorsResponse',
                    label: 'GetProjectCollaboratorsResponse',
                },
                {
                    type: 'doc',
                    id: 'api/type-aliases/GetProjectCommentsArgs',
                    label: 'GetProjectCommentsArgs',
                },
                { type: 'doc', id: 'api/type-aliases/GetProjectsArgs', label: 'GetProjectsArgs' },
                {
                    type: 'doc',
                    id: 'api/type-aliases/GetProjectsResponse',
                    label: 'GetProjectsResponse',
                },
                { type: 'doc', id: 'api/type-aliases/GetSectionsArgs', label: 'GetSectionsArgs' },
                {
                    type: 'doc',
                    id: 'api/type-aliases/GetSectionsResponse',
                    label: 'GetSectionsResponse',
                },
                {
                    type: 'doc',
                    id: 'api/type-aliases/GetSharedLabelsArgs',
                    label: 'GetSharedLabelsArgs',
                },
                {
                    type: 'doc',
                    id: 'api/type-aliases/GetSharedLabelsResponse',
                    label: 'GetSharedLabelsResponse',
                },
                {
                    type: 'doc',
                    id: 'api/type-aliases/GetTaskCommentsArgs',
                    label: 'GetTaskCommentsArgs',
                },
                { type: 'doc', id: 'api/type-aliases/GetTasksArgs', label: 'GetTasksArgs' },
                { type: 'doc', id: 'api/type-aliases/GetTasksResponse', label: 'GetTasksResponse' },
                { type: 'doc', id: 'api/type-aliases/Permission', label: 'Permission' },
                { type: 'doc', id: 'api/type-aliases/ProjectViewStyle', label: 'ProjectViewStyle' },
                { type: 'doc', id: 'api/type-aliases/QuickAddTaskArgs', label: 'QuickAddTaskArgs' },
                {
                    type: 'doc',
                    id: 'api/type-aliases/QuickAddTaskResponse',
                    label: 'QuickAddTaskResponse',
                },
                {
                    type: 'doc',
                    id: 'api/type-aliases/RemoveSharedLabelArgs',
                    label: 'RemoveSharedLabelArgs',
                },
                {
                    type: 'doc',
                    id: 'api/type-aliases/RenameSharedLabelArgs',
                    label: 'RenameSharedLabelArgs',
                },
                {
                    type: 'doc',
                    id: 'api/type-aliases/RevokeAuthTokenRequestArgs',
                    label: 'RevokeAuthTokenRequestArgs',
                },
                {
                    type: 'doc',
                    id: 'api/type-aliases/TaskWithSanitizedContent',
                    label: 'TaskWithSanitizedContent',
                },
                {
                    type: 'doc',
                    id: 'api/type-aliases/UpdateCommentArgs',
                    label: 'UpdateCommentArgs',
                },
                { type: 'doc', id: 'api/type-aliases/UpdateLabelArgs', label: 'UpdateLabelArgs' },
                {
                    type: 'doc',
                    id: 'api/type-aliases/UpdateProjectArgs',
                    label: 'UpdateProjectArgs',
                },
                {
                    type: 'doc',
                    id: 'api/type-aliases/UpdateSectionArgs',
                    label: 'UpdateSectionArgs',
                },
                { type: 'doc', id: 'api/type-aliases/UpdateTaskArgs', label: 'UpdateTaskArgs' },
            ],
        },
        {
            type: 'category',
            label: 'Functions',
            items: [
                {
                    type: 'doc',
                    id: 'api/functions/getAuthorizationUrl',
                    label: 'getAuthorizationUrl',
                },
                {
                    type: 'doc',
                    id: 'api/functions/getAuthStateParameter',
                    label: 'getAuthStateParameter',
                },
                { type: 'doc', id: 'api/functions/getAuthToken', label: 'getAuthToken' },
                { type: 'doc', id: 'api/functions/getColorByKey', label: 'getColorByKey' },
                {
                    type: 'doc',
                    id: 'api/functions/getSanitizedContent',
                    label: 'getSanitizedContent',
                },
                { type: 'doc', id: 'api/functions/getSanitizedTasks', label: 'getSanitizedTasks' },
                { type: 'doc', id: 'api/functions/revokeAuthToken', label: 'revokeAuthToken' },
            ],
        },
    ],
}
module.exports = typedocSidebar.items
