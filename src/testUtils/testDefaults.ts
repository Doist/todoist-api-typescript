import {
    Label,
    Project,
    QuickAddTaskResponse,
    Section,
    Task,
    User,
    Comment,
    Attachment,
    Duration,
    Deadline,
} from '../types'

const DEFAULT_TASK_ID = '1234'
const DEFAULT_TASK_CONTENT = 'This is a task'
const DEFAULT_TASK_DESCRIPTION = 'A description'
const DEFAULT_TASK_PRIORITY = 1
const DEFAULT_ORDER = 3
const DEFAULT_PROJECT_ID = '123'
const DEFAULT_PROJECT_NAME = 'This is a project'
const DEFAULT_PROJECT_VIEW_STYLE = 'list'
const DEFAULT_LABEL_ID = '456'
const DEFAULT_LABEL_NAME = 'This is a label'
const DEFAULT_SECTION_ID = '456'
const DEFAULT_SECTION_NAME = 'This is a section'
const DEFAULT_PARENT_ID = '5678'
const DEFAULT_ASSIGNEE = '1234'
const DEFAULT_CREATOR = '1234'
const DEFAULT_DATE = '2020-09-08T12:00:00Z'
const DEFAULT_ENTITY_COLOR = 'berry_red'
const DEFAULT_LABELS = ['personal', 'work', 'hobby']
const DEFAULT_USER_ID = '5'
const DEFAULT_USER_NAME = 'A User'
const DEFAULT_USER_EMAIL = 'atestuser@doist.com'
const DEFAULT_COMMENT_ID = '4'
const DEFAULT_COMMENT_CONTENT = 'A comment'

export const DEFAULT_AUTH_TOKEN = 'AToken'
export const DEFAULT_REQUEST_ID = 'ARequestID'

export const INVALID_ENTITY_ID = 1234

export const DEFAULT_DUE_DATE = {
    isRecurring: false,
    string: 'a date string',
    date: DEFAULT_DATE,
    lang: 'en',
    timezone: null,
}

export const DEFAULT_DURATION: Duration = {
    amount: 10,
    unit: 'minute',
}

export const DEFAULT_DEADLINE: Deadline = {
    date: '2020-09-08',
    lang: 'en',
}

export const DEFAULT_QUICK_ADD_RESPONSE: QuickAddTaskResponse = {
    id: DEFAULT_TASK_ID,
    projectId: DEFAULT_PROJECT_ID,
    content: DEFAULT_TASK_CONTENT,
    description: DEFAULT_TASK_DESCRIPTION,
    priority: DEFAULT_TASK_PRIORITY,
    sectionId: DEFAULT_SECTION_ID,
    parentId: DEFAULT_PARENT_ID,
    childOrder: DEFAULT_ORDER,
    labels: DEFAULT_LABELS,
    responsibleUid: DEFAULT_ASSIGNEE,
    checked: false,
    addedAt: DEFAULT_DATE,
    addedByUid: DEFAULT_CREATOR,
    duration: DEFAULT_DURATION,
    due: {
        date: DEFAULT_DATE,
        timezone: null,
        string: 'a date string',
        lang: 'en',
        isRecurring: false,
    },
    deadline: DEFAULT_DEADLINE,
    assignedByUid: DEFAULT_CREATOR,
}

export const DEFAULT_TASK: Task = {
    id: DEFAULT_TASK_ID,
    order: DEFAULT_ORDER,
    parentId: DEFAULT_PARENT_ID,
    content: DEFAULT_TASK_CONTENT,
    description: DEFAULT_TASK_DESCRIPTION,
    projectId: DEFAULT_PROJECT_ID,
    sectionId: DEFAULT_SECTION_ID,
    isCompleted: false,
    labels: DEFAULT_LABELS,
    priority: DEFAULT_TASK_PRIORITY,
    commentCount: 0,
    createdAt: DEFAULT_DATE,
    url: 'https://todoist.com/showTask?id=1234',
    due: DEFAULT_DUE_DATE,
    assignerId: DEFAULT_CREATOR,
    assigneeId: DEFAULT_ASSIGNEE,
    creatorId: DEFAULT_CREATOR,
    duration: DEFAULT_DURATION,
    deadline: DEFAULT_DEADLINE,
}

export const INVALID_TASK = {
    ...DEFAULT_TASK,
    due: '2020-01-31',
}

export const TASK_WITH_OPTIONALS_AS_NULL: Task = {
    ...DEFAULT_TASK,
    due: null,
    assigneeId: null,
    assignerId: null,
    parentId: null,
    sectionId: null,
    duration: null,
}

export const DEFAULT_PROJECT: Project = {
    id: DEFAULT_PROJECT_ID,
    name: DEFAULT_PROJECT_NAME,
    color: DEFAULT_ENTITY_COLOR,
    order: DEFAULT_ORDER,
    parentId: DEFAULT_PROJECT_ID,
    commentCount: 0,
    isFavorite: false,
    isShared: false,
    isInboxProject: false,
    isTeamInbox: false,
    viewStyle: DEFAULT_PROJECT_VIEW_STYLE,
    url: 'https://todoist.com/showProject?id=123',
}

export const INVALID_PROJECT = {
    ...DEFAULT_PROJECT,
    name: 123,
}

export const PROJECT_WITH_OPTIONALS_AS_NULL: Project = {
    ...DEFAULT_PROJECT,
    parentId: null,
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
    isFavorite: false,
}

export const INVALID_LABEL = {
    ...DEFAULT_LABEL,
    isFavorite: 'true',
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
    taskId: null,
    projectId: DEFAULT_PROJECT_ID,
    attachment: DEFAULT_ATTACHMENT,
    postedAt: DEFAULT_DATE,
}

export const INVALID_COMMENT = {
    ...DEFAULT_COMMENT,
    attachment: INVALID_ATTACHMENT,
}

export const COMMENT_WITH_OPTIONALS_AS_NULL_TASK: Comment = {
    ...DEFAULT_COMMENT,
    projectId: null,
    attachment: null,
}

export const COMMENT_WITH_ATTACHMENT_WITH_OPTIONALS_AS_NULL: Comment = {
    ...DEFAULT_COMMENT,
    attachment: {
        ...DEFAULT_ATTACHMENT,
        fileName: null,
        fileSize: null,
        fileType: null,
        fileDuration: null,
        uploadState: null,
        image: null,
        imageWidth: null,
        imageHeight: null,
        url: null,
        title: null,
    },
}

export const COMMENT_WITH_OPTIONALS_AS_NULL_PROJECT: Comment = {
    ...DEFAULT_COMMENT,
    taskId: null,
    attachment: null,
}
