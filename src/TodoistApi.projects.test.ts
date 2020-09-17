import { TodoistApi } from '.'
import { DEFAULT_AUTH_TOKEN, DEFAULT_PROJECT, DEFAULT_USER } from './testUtils/testDefaults'
import {
    API_REST_BASE_URI,
    ENDPOINT_REST_PROJECTS,
    ENDPOINT_REST_PROJECT_COLLABORATORS,
} from './consts/endpoints'
import { setupRestClientMock } from './testUtils/mocks'

const getTarget = () => new TodoistApi(DEFAULT_AUTH_TOKEN)

describe('TodoistApi project endpoints', () => {
    describe('getProject', () => {
        test('calls get request with expected url', async () => {
            const projectId = 12
            const requestMock = setupRestClientMock(DEFAULT_PROJECT)
            const api = getTarget()

            await api.getProject(projectId)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                API_REST_BASE_URI,
                `${ENDPOINT_REST_PROJECTS}/${projectId}`,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(DEFAULT_PROJECT)
            const api = getTarget()

            const project = await api.getProject(123)

            expect(project).toEqual(DEFAULT_PROJECT)
        })
    })

    describe('getProjects', () => {
        test('calls get on projects endpoint', async () => {
            const requestMock = setupRestClientMock([DEFAULT_PROJECT])
            const api = getTarget()

            await api.getProjects()

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                API_REST_BASE_URI,
                ENDPOINT_REST_PROJECTS,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns result from rest client', async () => {
            const projects = [DEFAULT_PROJECT]
            setupRestClientMock(projects)
            const api = getTarget()

            const response = await api.getProjects()

            expect(response).toEqual(projects)
        })
    })

    describe('addProject', () => {
        const DEFAULT_ADD_PROJECT_ARGS = {
            name: 'This is a project',
        }

        test('calls post on restClient with expected parameters', async () => {
            const requestMock = setupRestClientMock(DEFAULT_PROJECT)
            const api = getTarget()

            await api.addProject(DEFAULT_ADD_PROJECT_ARGS)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                API_REST_BASE_URI,
                ENDPOINT_REST_PROJECTS,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_ADD_PROJECT_ARGS,
            )
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(DEFAULT_PROJECT)
            const api = getTarget()

            const project = await api.addProject(DEFAULT_ADD_PROJECT_ARGS)

            expect(project).toEqual(DEFAULT_PROJECT)
        })
    })

    describe('updateProject', () => {
        test('calls post on restClient with expected parameters', async () => {
            const projectId = 123
            const updateArgs = { name: 'a new name' }
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.updateProject(projectId, updateArgs)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                API_REST_BASE_URI,
                `${ENDPOINT_REST_PROJECTS}/${projectId}`,
                DEFAULT_AUTH_TOKEN,
                updateArgs,
            )
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const result = await api.updateProject(123, { name: 'a name' })

            expect(result).toEqual(true)
        })
    })

    describe('deleteProject', () => {
        test('calls delete on expected project', async () => {
            const projectId = 123
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.deleteProject(projectId)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'DELETE',
                API_REST_BASE_URI,
                `${ENDPOINT_REST_PROJECTS}/${projectId}`,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const result = await api.deleteProject(123)

            expect(result).toEqual(true)
        })
    })

    describe('getProjectCollaborators', () => {
        const projectId = 123
        const users = [DEFAULT_USER]

        test('calls get on expected endpoint', async () => {
            const requestMock = setupRestClientMock(users)
            const api = getTarget()

            await api.getProjectCollaborators(projectId)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                API_REST_BASE_URI,
                `${ENDPOINT_REST_PROJECTS}/${projectId}/${ENDPOINT_REST_PROJECT_COLLABORATORS}`,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(users)
            const api = getTarget()

            const returnedUsers = await api.getProjectCollaborators(projectId)

            expect(returnedUsers).toEqual(users)
        })
    })
})
