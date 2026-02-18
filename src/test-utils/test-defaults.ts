import {
    Label,
    Section,
    Task,
    User,
    Attachment,
    Duration,
    Deadline,
    RawComment,
    PersonalProject,
    Folder,
} from '../types'
import { getProjectUrl, getTaskUrl, getSectionUrl } from '../utils/url-helpers'

export const DEFAULT_TASK_ID = '1234'
export const DEFAULT_TASK_CONTENT = 'This is a task'
export const DEFAULT_TASK_DESCRIPTION = 'A description'
export const DEFAULT_TASK_PRIORITY = 1
export const DEFAULT_ORDER = 3
export const DEFAULT_PROJECT_ID = '123'
export const DEFAULT_PROJECT_NAME = 'This is a project'
export const DEFAULT_PROJECT_VIEW_STYLE = 'list'
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
const DEFAULT_COMMENT_REACTIONS = { '👍': ['1234', '5678'] }
const DEFAULT_NOTE_COUNT = 0
const DEFAULT_CAN_ASSIGN_TASKS = true
const DEFAULT_IS_ARCHIVED = false
const DEFAULT_IS_DELETED = false
const DEFAULT_IS_FROZEN = false
const DEFAULT_IS_COLLAPSED = false

// URL constants using the helper functions
const DEFAULT_TASK_URL = getTaskUrl(DEFAULT_TASK_ID, DEFAULT_TASK_CONTENT)
const DEFAULT_PROJECT_URL = getProjectUrl(DEFAULT_PROJECT_ID, DEFAULT_PROJECT_NAME)
const DEFAULT_SECTION_URL = getSectionUrl(DEFAULT_SECTION_ID, DEFAULT_SECTION_NAME)

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

export const DEFAULT_TASK: Task = {
    id: DEFAULT_TASK_ID,
    userId: DEFAULT_CREATOR,
    projectId: DEFAULT_PROJECT_ID,
    sectionId: DEFAULT_SECTION_ID,
    parentId: DEFAULT_PARENT_ID,
    addedByUid: DEFAULT_CREATOR,
    assignedByUid: DEFAULT_CREATOR,
    responsibleUid: DEFAULT_ASSIGNEE,
    labels: DEFAULT_LABELS,
    deadline: DEFAULT_DEADLINE,
    duration: DEFAULT_DURATION,
    checked: false,
    isDeleted: DEFAULT_IS_DELETED,
    addedAt: DEFAULT_DATE,
    completedAt: null,
    updatedAt: DEFAULT_DATE,
    due: DEFAULT_DUE_DATE,
    priority: DEFAULT_TASK_PRIORITY,
    childOrder: DEFAULT_ORDER,
    content: DEFAULT_TASK_CONTENT,
    description: DEFAULT_TASK_DESCRIPTION,
    noteCount: DEFAULT_NOTE_COUNT,
    dayOrder: DEFAULT_ORDER,
    isCollapsed: DEFAULT_IS_COLLAPSED,
    isUncompletable: false,
    url: DEFAULT_TASK_URL,
}

export const INVALID_TASK = {
    ...DEFAULT_TASK,
    due: '2020-01-31',
}

export const TASK_WITH_OPTIONALS_AS_NULL: Task = {
    userId: DEFAULT_CREATOR,
    id: DEFAULT_TASK_ID,
    projectId: DEFAULT_PROJECT_ID,
    sectionId: null,
    parentId: null,
    addedByUid: DEFAULT_CREATOR,
    assignedByUid: null,
    responsibleUid: null,
    labels: [],
    deadline: null,
    duration: null,
    checked: false,
    isDeleted: DEFAULT_IS_DELETED,
    addedAt: DEFAULT_DATE,
    completedAt: null,
    updatedAt: DEFAULT_DATE,
    due: null,
    priority: DEFAULT_TASK_PRIORITY,
    childOrder: DEFAULT_ORDER,
    content: DEFAULT_TASK_CONTENT,
    description: DEFAULT_TASK_DESCRIPTION,
    dayOrder: DEFAULT_ORDER,
    isCollapsed: DEFAULT_IS_COLLAPSED,
    isUncompletable: false,
    noteCount: DEFAULT_NOTE_COUNT,
    url: DEFAULT_TASK_URL,
}

export const DEFAULT_PROJECT: PersonalProject = {
    id: DEFAULT_PROJECT_ID,
    name: DEFAULT_PROJECT_NAME,
    color: DEFAULT_ENTITY_COLOR,
    childOrder: DEFAULT_ORDER,
    parentId: DEFAULT_PROJECT_ID,
    isFavorite: false,
    isShared: false,
    inboxProject: false,
    viewStyle: DEFAULT_PROJECT_VIEW_STYLE,
    canAssignTasks: DEFAULT_CAN_ASSIGN_TASKS,
    isArchived: DEFAULT_IS_ARCHIVED,
    isDeleted: DEFAULT_IS_DELETED,
    isFrozen: DEFAULT_IS_FROZEN,
    createdAt: DEFAULT_DATE,
    updatedAt: DEFAULT_DATE,
    defaultOrder: DEFAULT_ORDER,
    description: '',
    isCollapsed: DEFAULT_IS_COLLAPSED,
    url: DEFAULT_PROJECT_URL,
}

export const INVALID_PROJECT = {
    ...DEFAULT_PROJECT,
    name: 123,
}

export const PROJECT_WITH_OPTIONALS_AS_NULL: PersonalProject = {
    ...DEFAULT_PROJECT,
    parentId: null,
}

export const DEFAULT_SECTION: Section = {
    id: DEFAULT_SECTION_ID,
    userId: DEFAULT_USER_ID,
    projectId: DEFAULT_PROJECT_ID,
    addedAt: '2025-03-28T14:01:23.334881Z',
    updatedAt: '2025-03-28T14:01:23.334885Z',
    archivedAt: null,
    name: DEFAULT_SECTION_NAME,
    sectionOrder: DEFAULT_ORDER,
    isArchived: false,
    isDeleted: false,
    isCollapsed: false,
    url: DEFAULT_SECTION_URL,
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

export const DEFAULT_RAW_COMMENT: RawComment = {
    id: DEFAULT_COMMENT_ID,
    postedUid: DEFAULT_USER_ID,
    content: DEFAULT_COMMENT_CONTENT,
    fileAttachment: DEFAULT_ATTACHMENT,
    uidsToNotify: null,
    isDeleted: false,
    postedAt: DEFAULT_DATE,
    reactions: DEFAULT_COMMENT_REACTIONS,
    itemId: DEFAULT_TASK_ID,
}

export const DEFAULT_COMMENT = {
    ...DEFAULT_RAW_COMMENT,
    taskId: DEFAULT_RAW_COMMENT.itemId,
    itemId: undefined,
}

export const INVALID_COMMENT = {
    ...DEFAULT_RAW_COMMENT,
    isDeleted: 'true',
}

export const RAW_COMMENT_WITH_OPTIONALS_AS_NULL_TASK: RawComment = {
    ...DEFAULT_RAW_COMMENT,
    fileAttachment: null,
    uidsToNotify: null,
    reactions: null,
}

export const COMMENT_WITH_OPTIONALS_AS_NULL_TASK = {
    ...RAW_COMMENT_WITH_OPTIONALS_AS_NULL_TASK,
    taskId: RAW_COMMENT_WITH_OPTIONALS_AS_NULL_TASK.itemId,
    itemId: undefined,
}

export const RAW_COMMENT_WITH_ATTACHMENT_WITH_OPTIONALS_AS_NULL: RawComment = {
    ...DEFAULT_RAW_COMMENT,
    fileAttachment: {
        resourceType: 'file',
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

export const COMMENT_WITH_ATTACHMENT_WITH_OPTIONALS_AS_NULL = {
    ...RAW_COMMENT_WITH_ATTACHMENT_WITH_OPTIONALS_AS_NULL,
    taskId: RAW_COMMENT_WITH_ATTACHMENT_WITH_OPTIONALS_AS_NULL.itemId,
    itemId: undefined,
}

export const RAW_COMMENT_WITH_OPTIONALS_AS_NULL_PROJECT: RawComment = {
    ...DEFAULT_RAW_COMMENT,
    itemId: undefined,
    projectId: DEFAULT_PROJECT_ID,
}

export const COMMENT_WITH_OPTIONALS_AS_NULL_PROJECT = {
    ...RAW_COMMENT_WITH_OPTIONALS_AS_NULL_PROJECT,
    taskId: undefined,
}

export const DEFAULT_FOLDER: Folder = {
    id: '789',
    name: 'This is a folder',
    workspaceId: '100',
    defaultOrder: 3,
    childOrder: 3,
    isDeleted: false,
}
