import {
    Label,
    Project,
    QuickAddTaskResponse,
    Section,
    Task,
    User,
    Comment,
    Attachment,
} from '../types'

const DEFAULT_TASK_ID = 1234
const DEFAULT_TASK_CONTENT = 'This is a task'
const DEFAULT_TASK_PRIORITY = 1
const DEFAULT_ORDER = 3
const DEFAULT_PROJECT_ID = 123
const DEFAULT_PROJECT_NAME = 'This is a project'
const DEFAULT_LABEL_ID = 456
const DEFAULT_LABEL_NAME = 'This is a label'
const DEFAULT_SECTION_ID = 456
const DEFAULT_SECTION_NAME = 'This is a section'
const DEFAULT_PARENT_ID = 5678
const DEFAULT_ASSIGNEE = 1234
const DEFAULT_DATE = '2020-09-08T12:00:00Z'
const DEFAULT_ENTITY_COLOR = 30
const DEFAULT_LABELS = [1, 2, 3]
const DEFAULT_USER_ID = 5
const DEFAULT_USER_NAME = 'A User'
const DEFAULT_USER_EMAIL = 'atestuser@doist.com'
const DEFAULT_COMMENT_ID = 4
const DEFAULT_COMMENT_CONTENT = 'A comment'

export const DEFAULT_AUTH_TOKEN = 'AToken'

export const INVALID_ENTITY_ID = ('invalid/entity/id' as unknown) as number

export const DEFAULT_DUE_DATE = {
    recurring: false,
    string: 'a date string',
    date: DEFAULT_DATE,
}

export const INVALID_DUE_DATE = {
    ...DEFAULT_DUE_DATE,
    recurring: 'false',
}

export const DEFAULT_QUICK_ADD_RESPONSE: QuickAddTaskResponse = {
    id: DEFAULT_TASK_ID,
    projectId: DEFAULT_PROJECT_ID,
    content: DEFAULT_TASK_CONTENT,
    priority: DEFAULT_TASK_PRIORITY,
    sectionId: DEFAULT_SECTION_ID,
    parentId: DEFAULT_PARENT_ID,
    childOrder: DEFAULT_ORDER,
    labels: DEFAULT_LABELS,
    responsibleUid: DEFAULT_ASSIGNEE,
    checked: 0,
    dateAdded: DEFAULT_DATE,
    syncId: null,
    due: {
        date: DEFAULT_DATE,
        timezone: null,
        string: 'a date string',
        lang: 'en',
        isRecurring: false,
    },
}

export const DEFAULT_TASK: Task = {
    id: DEFAULT_TASK_ID,
    order: DEFAULT_ORDER,
    parentId: DEFAULT_PARENT_ID,
    content: DEFAULT_TASK_CONTENT,
    projectId: DEFAULT_PROJECT_ID,
    sectionId: DEFAULT_SECTION_ID,
    completed: false,
    labelIds: DEFAULT_LABELS,
    priority: DEFAULT_TASK_PRIORITY,
    commentCount: 0,
    created: DEFAULT_DATE,
    url: 'https://todoist.com/showTask?id=1234',
    due: DEFAULT_DUE_DATE,
    assignee: DEFAULT_ASSIGNEE,
}

export const INVALID_TASK = {
    ...DEFAULT_TASK,
    due: INVALID_DUE_DATE,
}

export const DEFAULT_PROJECT: Project = {
    id: DEFAULT_PROJECT_ID,
    name: DEFAULT_PROJECT_NAME,
    color: DEFAULT_ENTITY_COLOR,
    order: DEFAULT_ORDER,
    parentId: DEFAULT_PROJECT_ID,
    commentCount: 0,
    favorite: false,
    shared: false,
}

export const INVALID_PROJECT = {
    ...DEFAULT_PROJECT,
    name: 123,
}

export const DEFAULT_SECTION: Section = {
    id: DEFAULT_SECTION_ID,
    name: DEFAULT_SECTION_NAME,
    order: DEFAULT_ORDER,
    projectId: DEFAULT_PROJECT_ID,
}

export const INVALID_SECTION = {
    ...DEFAULT_SECTION,
    projectId: undefined,
}

export const DEFAULT_LABEL: Label = {
    id: DEFAULT_LABEL_ID,
    name: DEFAULT_LABEL_NAME,
    color: DEFAULT_ENTITY_COLOR,
    order: DEFAULT_ORDER,
    favorite: false,
}

export const INVALID_LABEL = {
    ...DEFAULT_LABEL,
    favorite: 'true',
}

export const DEFAULT_USER: User = {
    id: DEFAULT_USER_ID,
    name: DEFAULT_USER_NAME,
    email: DEFAULT_USER_EMAIL,
}

export const INVALID_USER = {
    ...DEFAULT_USER,
    email: undefined,
}

export const DEFAULT_ATTACHMENT: Attachment = {
    resourceType: 'file',
    fileType: 'image/png',
    fileUrl: 'https://someurl.com/image.jpg',
    uploadState: 'completed',
}

export const INVALID_ATTACHMENT = {
    ...DEFAULT_ATTACHMENT,
    uploadState: 'something random',
}

export const DEFAULT_COMMENT: Comment = {
    id: DEFAULT_COMMENT_ID,
    content: DEFAULT_COMMENT_CONTENT,
    projectId: DEFAULT_PROJECT_ID,
    attachment: DEFAULT_ATTACHMENT,
    posted: DEFAULT_DATE,
}

export const INVALID_COMMENT = {
    ...DEFAULT_COMMENT,
    attachment: INVALID_ATTACHMENT,
}
