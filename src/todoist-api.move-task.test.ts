import { TodoistApi } from '.'
import { DEFAULT_AUTH_TOKEN, DEFAULT_REQUEST_ID, DEFAULT_TASK } from './test-utils/test-defaults'
import { getSyncBaseUri, ENDPOINT_REST_TASKS, ENDPOINT_REST_TASK_MOVE } from './consts/endpoints'
import { setupRestClientMock } from './test-utils/mocks'
import { getTaskUrl } from './utils/url-helpers'

function getTarget(baseUrl = 'https://api.todoist.com') {
    return new TodoistApi(DEFAULT_AUTH_TOKEN, baseUrl)
}

describe('TodoistApi moveTask', () => {
    const TASK_ID = '123'
    const PROJECT_ID = '999'
    const SECTION_ID = '888'
    const PARENT_ID = '777'

    describe.each([
        {
            description: 'project',
            args: { projectId: PROJECT_ID },
            expectedApiArgs: { project_id: PROJECT_ID },
            expectedTaskProps: { projectId: PROJECT_ID },
        },
        {
            description: 'section',
            args: { sectionId: SECTION_ID },
            expectedApiArgs: { section_id: SECTION_ID },
            expectedTaskProps: { sectionId: SECTION_ID },
        },
        {
            description: 'parent',
            args: { parentId: PARENT_ID },
            expectedApiArgs: { parent_id: PARENT_ID },
            expectedTaskProps: { parentId: PARENT_ID },
        },
    ])('moving task to $description', ({ args, expectedApiArgs, expectedTaskProps }) => {
        test('calls post on restClient with expected parameters', async () => {
            const movedTask = {
                ...DEFAULT_TASK,
                id: TASK_ID,
                ...expectedTaskProps,
                url: getTaskUrl(TASK_ID, DEFAULT_TASK.content),
            }
            const requestMock = setupRestClientMock(movedTask)
            const api = getTarget()

            await api.moveTask(TASK_ID, args, DEFAULT_REQUEST_ID)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'POST',
                baseUri: getSyncBaseUri(),
                relativePath: `${ENDPOINT_REST_TASKS}/${TASK_ID}/${ENDPOINT_REST_TASK_MOVE}`,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: expectedApiArgs,
                requestId: DEFAULT_REQUEST_ID,
            })
        })

        test('returns moved task', async () => {
            const movedTask = {
                ...DEFAULT_TASK,
                id: TASK_ID,
                ...expectedTaskProps,
                url: getTaskUrl(TASK_ID, DEFAULT_TASK.content),
            }
            setupRestClientMock(movedTask)
            const api = getTarget()

            const result = await api.moveTask(TASK_ID, args)

            expect(result).toEqual(movedTask)
        })
    })

    test('calls post on restClient with expected parameters against staging', async () => {
        const movedTask = {
            ...DEFAULT_TASK,
            id: TASK_ID,
            projectId: PROJECT_ID,
            url: getTaskUrl(TASK_ID, DEFAULT_TASK.content),
        }
        const requestMock = setupRestClientMock(movedTask)
        const api = getTarget('https://staging.todoist.com')

        await api.moveTask(TASK_ID, { projectId: PROJECT_ID }, DEFAULT_REQUEST_ID)

        expect(requestMock).toHaveBeenCalledTimes(1)
        expect(requestMock).toHaveBeenCalledWith({
            httpMethod: 'POST',
            baseUri: getSyncBaseUri('https://staging.todoist.com'),
            relativePath: `${ENDPOINT_REST_TASKS}/${TASK_ID}/${ENDPOINT_REST_TASK_MOVE}`,
            apiToken: DEFAULT_AUTH_TOKEN,
            payload: { project_id: PROJECT_ID },
            requestId: DEFAULT_REQUEST_ID,
        })
    })

    test('works without requestId', async () => {
        const movedTask = {
            ...DEFAULT_TASK,
            id: TASK_ID,
            projectId: PROJECT_ID,
            url: getTaskUrl(TASK_ID, DEFAULT_TASK.content),
        }
        const requestMock = setupRestClientMock(movedTask)
        const api = getTarget()

        await api.moveTask(TASK_ID, { projectId: PROJECT_ID })

        expect(requestMock).toHaveBeenCalledTimes(1)
        expect(requestMock).toHaveBeenCalledWith({
            httpMethod: 'POST',
            baseUri: getSyncBaseUri(),
            relativePath: `${ENDPOINT_REST_TASKS}/${TASK_ID}/${ENDPOINT_REST_TASK_MOVE}`,
            apiToken: DEFAULT_AUTH_TOKEN,
            payload: { project_id: PROJECT_ID },
            requestId: undefined,
        })
    })
})
