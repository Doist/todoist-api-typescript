import { TodoistApi } from '.'
import {
    DEFAULT_AUTH_TOKEN,
    DEFAULT_PROJECT,
    DEFAULT_USER,
    PROJECT_WITH_OPTIONALS_AS_NULL,
    DEFAULT_PROJECT_ID,
} from './test-utils/test-defaults'
import {
    getSyncBaseUri,
    ENDPOINT_REST_PROJECTS,
    ENDPOINT_REST_PROJECT_COLLABORATORS,
    PROJECT_ARCHIVE,
    PROJECT_UNARCHIVE,
} from './consts/endpoints'
import { server, http, HttpResponse } from './test-utils/msw-setup'
import { getProjectUrl } from './utils/url-helpers'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi project endpoints', () => {
    describe('getProject', () => {
        test('returns result from rest client', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_PROJECTS}/123`, () => {
                    return HttpResponse.json(DEFAULT_PROJECT, { status: 200 })
                }),
            )
            const api = getTarget()

            const project = await api.getProject('123')

            expect(project).toEqual(DEFAULT_PROJECT)
        })
    })

    describe('getProjects', () => {
        test('returns result from rest client', async () => {
            const projects = [DEFAULT_PROJECT, PROJECT_WITH_OPTIONALS_AS_NULL]
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_PROJECTS}`, () => {
                    return HttpResponse.json(
                        { results: projects, nextCursor: '123' },
                        { status: 200 },
                    )
                }),
            )
            const api = getTarget()

            const { results, nextCursor } = await api.getProjects()

            expect(results).toEqual(projects)
            expect(nextCursor).toBe('123')
        })
    })

    describe('addProject', () => {
        const DEFAULT_ADD_PROJECT_ARGS = {
            name: 'This is a project',
        }

        test('returns result from rest client', async () => {
            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_REST_PROJECTS}`, () => {
                    return HttpResponse.json(DEFAULT_PROJECT, { status: 200 })
                }),
            )
            const api = getTarget()

            const project = await api.addProject(DEFAULT_ADD_PROJECT_ARGS)

            expect(project).toEqual(DEFAULT_PROJECT)
        })
    })

    describe('updateProject', () => {
        const DEFAULT_UPDATE_PROJECT_ARGS = { name: 'a name' }
        const DEFAULT_UPDATED_PROJECT_URL = getProjectUrl(
            DEFAULT_PROJECT_ID,
            DEFAULT_UPDATE_PROJECT_ARGS.name,
        )

        test('returns success result from rest client', async () => {
            const returnedProject = {
                ...DEFAULT_PROJECT,
                ...DEFAULT_UPDATE_PROJECT_ARGS,
                url: DEFAULT_UPDATED_PROJECT_URL,
            }
            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_REST_PROJECTS}/123`, () => {
                    return HttpResponse.json(returnedProject, { status: 200 })
                }),
            )
            const api = getTarget()

            const result = await api.updateProject('123', DEFAULT_UPDATE_PROJECT_ARGS)

            expect(result).toEqual(returnedProject)
        })
    })

    describe('deleteProject', () => {
        test('returns success result from rest client', async () => {
            server.use(
                http.delete(`${getSyncBaseUri()}${ENDPOINT_REST_PROJECTS}/123`, () => {
                    return HttpResponse.json(undefined, { status: 204 })
                }),
            )
            const api = getTarget()

            const result = await api.deleteProject('123')

            expect(result).toEqual(true)
        })
    })

    describe('getProjectCollaborators', () => {
        const projectId = '123'
        const users = [DEFAULT_USER]

        test('returns result from rest client', async () => {
            server.use(
                http.get(
                    `${getSyncBaseUri()}${ENDPOINT_REST_PROJECTS}/${projectId}/${ENDPOINT_REST_PROJECT_COLLABORATORS}`,
                    () => {
                        return HttpResponse.json(
                            { results: users, nextCursor: '123' },
                            { status: 200 },
                        )
                    },
                ),
            )
            const api = getTarget()

            const { results, nextCursor } = await api.getProjectCollaborators(projectId)

            expect(results).toEqual(users)
            expect(nextCursor).toBe('123')
        })
    })

    describe('archiveProject', () => {
        test('returns result from rest client', async () => {
            server.use(
                http.post(
                    `${getSyncBaseUri()}${ENDPOINT_REST_PROJECTS}/123/${PROJECT_ARCHIVE}`,
                    () => {
                        return HttpResponse.json(DEFAULT_PROJECT, { status: 200 })
                    },
                ),
            )
            const api = getTarget()

            const project = await api.archiveProject('123')
            expect(project).toEqual(DEFAULT_PROJECT)
        })
    })

    describe('unarchiveProject', () => {
        test('returns result from rest client', async () => {
            server.use(
                http.post(
                    `${getSyncBaseUri()}${ENDPOINT_REST_PROJECTS}/123/${PROJECT_UNARCHIVE}`,
                    () => {
                        return HttpResponse.json(DEFAULT_PROJECT, { status: 200 })
                    },
                ),
            )
            const api = getTarget()

            const project = await api.unarchiveProject('123')
            expect(project).toEqual(DEFAULT_PROJECT)
        })

        describe('getArchivedProjects', () => {
            test('returns result from rest client', async () => {
                const projects = [DEFAULT_PROJECT, PROJECT_WITH_OPTIONALS_AS_NULL]
                server.use(
                    http.get(`${getSyncBaseUri()}projects/archived`, () => {
                        return HttpResponse.json(
                            { results: projects, nextCursor: 'abc' },
                            { status: 200 },
                        )
                    }),
                )
                const api = getTarget()

                const { results, nextCursor } = await api.getArchivedProjects()
                expect(results).toEqual(projects)
                expect(nextCursor).toBe('abc')
            })
        })
    })
})
