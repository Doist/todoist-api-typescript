import { TodoistApi } from '.'
import {
    DEFAULT_AUTH_TOKEN,
    DEFAULT_PROJECT,
    RAW_DEFAULT_PROJECT,
    DEFAULT_REQUEST_ID,
    DEFAULT_USER,
} from './testUtils/testDefaults'
import {
    getSyncBaseUri,
    ENDPOINT_REST_PROJECTS,
    ENDPOINT_REST_PROJECT_COLLABORATORS,
} from './consts/endpoints'
import { setupRestClientMock } from './testUtils/mocks'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi project endpoints', () => {
    describe('getProject', () => {
        test('calls get request with expected url', async () => {
            const projectId = '12'
            const requestMock = setupRestClientMock(RAW_DEFAULT_PROJECT)
            const api = getTarget()

            await api.getProject(projectId)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                getSyncBaseUri(),
                `${ENDPOINT_REST_PROJECTS}/${projectId}`,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(RAW_DEFAULT_PROJECT)
            const api = getTarget()

            const project = await api.getProject('123')

            expect(project).toEqual(DEFAULT_PROJECT)
        })
    })

    describe('getProjects', () => {
        test('calls get on projects endpoint', async () => {
            const requestMock = setupRestClientMock({
                results: [RAW_DEFAULT_PROJECT],
                nextCursor: '123',
            })
            const api = getTarget()

            const args = { limit: 10, cursor: '0' }
            await api.getProjects(args)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                getSyncBaseUri(),
                ENDPOINT_REST_PROJECTS,
                DEFAULT_AUTH_TOKEN,
                args,
            )
        })

        test('returns result from rest client', async () => {
            const projects = [RAW_DEFAULT_PROJECT]
            setupRestClientMock({ results: projects, nextCursor: '123' })
            const api = getTarget()

            const { results, nextCursor } = await api.getProjects()

            expect(results).toEqual([DEFAULT_PROJECT])
            expect(nextCursor).toBe('123')
        })
    })

    describe('addProject', () => {
        const DEFAULT_ADD_PROJECT_ARGS = {
            name: 'This is a project',
        }

        test('calls post on restClient with expected parameters', async () => {
            const requestMock = setupRestClientMock(RAW_DEFAULT_PROJECT)
            const api = getTarget()

            await api.addProject(DEFAULT_ADD_PROJECT_ARGS, DEFAULT_REQUEST_ID)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                getSyncBaseUri(),
                ENDPOINT_REST_PROJECTS,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_ADD_PROJECT_ARGS,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(RAW_DEFAULT_PROJECT)
            const api = getTarget()

            const project = await api.addProject(DEFAULT_ADD_PROJECT_ARGS)

            expect(project).toEqual(DEFAULT_PROJECT)
        })
    })

    describe('updateProject', () => {
        const DEFAULT_UPDATE_PROJECT_ARGS = { name: 'a name' }
        test('calls post on restClient with expected parameters', async () => {
            const projectId = '123'
            const updateArgs = { name: 'a new name' }
            const requestMock = setupRestClientMock(RAW_DEFAULT_PROJECT, 204)
            const api = getTarget()

            await api.updateProject(projectId, updateArgs, DEFAULT_REQUEST_ID)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                getSyncBaseUri(),
                `${ENDPOINT_REST_PROJECTS}/${projectId}`,
                DEFAULT_AUTH_TOKEN,
                updateArgs,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns success result from rest client', async () => {
            const RAW_DEFAULT_PROJECT_WITH_UPDATES = {
                ...RAW_DEFAULT_PROJECT,
                name: DEFAULT_UPDATE_PROJECT_ARGS.name,
            }
            setupRestClientMock(RAW_DEFAULT_PROJECT_WITH_UPDATES, 204)
            const api = getTarget()

            const result = await api.updateProject('123', DEFAULT_UPDATE_PROJECT_ARGS)

            const DEFAULT_PROJECT_WITH_UPDATES = {
                ...DEFAULT_PROJECT,
                name: DEFAULT_UPDATE_PROJECT_ARGS.name,
            }
            expect(result).toEqual(DEFAULT_PROJECT_WITH_UPDATES)
        })
    })

    describe('deleteProject', () => {
        test('calls delete on expected project', async () => {
            const projectId = '123'
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.deleteProject(projectId, DEFAULT_REQUEST_ID)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'DELETE',
                getSyncBaseUri(),
                `${ENDPOINT_REST_PROJECTS}/${projectId}`,
                DEFAULT_AUTH_TOKEN,
                undefined,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const result = await api.deleteProject('123')

            expect(result).toEqual(true)
        })
    })

    describe('getProjectCollaborators', () => {
        const projectId = '123'
        const users = [DEFAULT_USER]

        test('calls get on expected endpoint', async () => {
            const requestMock = setupRestClientMock({ results: users, nextCursor: '123' })
            const api = getTarget()

            const args = { limit: 10, cursor: '0' }
            await api.getProjectCollaborators(projectId, args)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                getSyncBaseUri(),
                `${ENDPOINT_REST_PROJECTS}/${projectId}/${ENDPOINT_REST_PROJECT_COLLABORATORS}`,
                DEFAULT_AUTH_TOKEN,
                args,
            )
        })

        test('returns result from rest client', async () => {
            setupRestClientMock({ results: users, nextCursor: '123' })
            const api = getTarget()

            const { results, nextCursor } = await api.getProjectCollaborators(projectId)

            expect(results).toEqual(users)
            expect(nextCursor).toBe('123')
        })
    })
})
