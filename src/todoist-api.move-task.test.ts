import { TodoistApi } from '.'
import { DEFAULT_AUTH_TOKEN, DEFAULT_REQUEST_ID, DEFAULT_TASK } from './test-utils/test-defaults'
import { getSyncBaseUri, ENDPOINT_REST_TASKS, ENDPOINT_REST_TASK_MOVE } from './consts/endpoints'
import { server, http, HttpResponse } from './test-utils/msw-setup'
import { getTaskUrl } from './utils/url-helpers'

function getTarget(baseUrl = 'https://api.todoist.com') {
    return new TodoistApi(DEFAULT_AUTH_TOKEN, { baseUrl })
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
            expectedTaskProps: { projectId: PROJECT_ID },
        },
        {
            description: 'section',
            args: { sectionId: SECTION_ID },
            expectedTaskProps: { sectionId: SECTION_ID },
        },
        {
            description: 'parent',
            args: { parentId: PARENT_ID },
            expectedTaskProps: { parentId: PARENT_ID },
        },
    ])('moving task to $description', ({ args, expectedTaskProps }) => {
        test('returns moved task', async () => {
            const movedTask = {
                ...DEFAULT_TASK,
                id: TASK_ID,
                ...expectedTaskProps,
                url: getTaskUrl(TASK_ID, DEFAULT_TASK.content),
            }

            server.use(
                http.post(
                    `${getSyncBaseUri()}${ENDPOINT_REST_TASKS}/${TASK_ID}/${ENDPOINT_REST_TASK_MOVE}`,
                    () => {
                        return HttpResponse.json(movedTask, { status: 200 })
                    },
                ),
            )

            const api = getTarget()
            const result = await api.moveTask(TASK_ID, args)

            expect(result).toEqual(movedTask)
        })
    })

    test('works with staging base URL', async () => {
        const movedTask = {
            ...DEFAULT_TASK,
            id: TASK_ID,
            projectId: PROJECT_ID,
            url: getTaskUrl(TASK_ID, DEFAULT_TASK.content),
        }

        server.use(
            http.post(
                `${getSyncBaseUri('https://staging.todoist.com')}${ENDPOINT_REST_TASKS}/${TASK_ID}/${ENDPOINT_REST_TASK_MOVE}`,
                () => {
                    return HttpResponse.json(movedTask, { status: 200 })
                },
            ),
        )

        const api = getTarget('https://staging.todoist.com')
        const result = await api.moveTask(TASK_ID, { projectId: PROJECT_ID }, DEFAULT_REQUEST_ID)

        expect(result).toEqual(movedTask)
    })

    test('works without requestId', async () => {
        const movedTask = {
            ...DEFAULT_TASK,
            id: TASK_ID,
            projectId: PROJECT_ID,
            url: getTaskUrl(TASK_ID, DEFAULT_TASK.content),
        }

        server.use(
            http.post(
                `${getSyncBaseUri()}${ENDPOINT_REST_TASKS}/${TASK_ID}/${ENDPOINT_REST_TASK_MOVE}`,
                () => {
                    return HttpResponse.json(movedTask, { status: 200 })
                },
            ),
        )

        const api = getTarget()
        const result = await api.moveTask(TASK_ID, { projectId: PROJECT_ID })

        expect(result).toEqual(movedTask)
    })
})
