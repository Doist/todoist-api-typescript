import { Label, Project, QuickAddTaskResponse, Task } from '../types'

const DEFAULT_TASK_ID = 1234
const DEFAULT_TASK_CONTENT = 'This is a task'
const DEFAULT_TASK_PRIORITY = 1
const DEFAULT_ORDER = 3
const DEFAULT_PROJECT_ID = 123
const DEFAULT_PROJECT_NAME = 'This is a project'
const DEFAULT_LABEL_ID = 456
const DEFAULT_LABEL_NAME = 'This is a label'
const DEFAULT_SECTION_ID = 456
const DEFAULT_PARENT_ID = 5678
const DEFAULT_ASSIGNEE = 1234
const DEFAULT_DATE = '2020-09-08T12:00:00Z'
const DEFAULT_ENTITY_COLOR = 30
const DEFAULT_TASK_DUE = {
    recurring: false,
    string: 'a date string',
    date: DEFAULT_DATE,
}
const DEFAULT_LABELS = [1, 2, 3]

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
    due: DEFAULT_TASK_DUE,
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
    due: DEFAULT_TASK_DUE,
    assignee: DEFAULT_ASSIGNEE,
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

export const DEFAULT_LABEL: Label = {
    id: DEFAULT_LABEL_ID,
    name: DEFAULT_LABEL_NAME,
    color: DEFAULT_ENTITY_COLOR,
    order: DEFAULT_ORDER,
    favorite: false,
}
