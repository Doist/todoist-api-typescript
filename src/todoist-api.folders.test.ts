import { TodoistApi } from '.'
import { DEFAULT_AUTH_TOKEN, DEFAULT_FOLDER } from './test-utils/test-defaults'
import { getSyncBaseUri, ENDPOINT_REST_FOLDERS } from './consts/endpoints'
import { server, http, HttpResponse } from './test-utils/msw-setup'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi folder endpoints', () => {
    describe('getFolder', () => {
        test('returns result from rest client', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_FOLDERS}/789`, () => {
                    return HttpResponse.json(DEFAULT_FOLDER, { status: 200 })
                }),
            )
            const api = getTarget()

            const folder = await api.getFolder('789')

            expect(folder).toEqual(DEFAULT_FOLDER)
        })
    })

    describe('getFolders', () => {
        test('returns result from rest client with workspace_id param', async () => {
            const folders = [DEFAULT_FOLDER]
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_FOLDERS}`, ({ request }) => {
                    const url = new URL(request.url)
                    expect(url.searchParams.get('workspace_id')).toBe('100')
                    return HttpResponse.json(
                        { results: folders, nextCursor: '123' },
                        { status: 200 },
                    )
                }),
            )
            const api = getTarget()

            const { results, nextCursor } = await api.getFolders({ workspaceId: 100 })

            expect(results).toEqual(folders)
            expect(nextCursor).toBe('123')
        })
    })

    describe('addFolder', () => {
        const DEFAULT_ADD_FOLDER_ARGS = {
            name: 'This is a folder',
            workspaceId: 100,
        }

        test('returns result from rest client', async () => {
            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_REST_FOLDERS}`, () => {
                    return HttpResponse.json(DEFAULT_FOLDER, { status: 200 })
                }),
            )
            const api = getTarget()

            const folder = await api.addFolder(DEFAULT_ADD_FOLDER_ARGS)

            expect(folder).toEqual(DEFAULT_FOLDER)
        })
    })

    describe('updateFolder', () => {
        const DEFAULT_UPDATE_FOLDER_ARGS = { name: 'a new name' }

        test('returns success result from rest client', async () => {
            const returnedFolder = {
                ...DEFAULT_FOLDER,
                ...DEFAULT_UPDATE_FOLDER_ARGS,
                id: '789',
            }
            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_REST_FOLDERS}/789`, () => {
                    return HttpResponse.json(returnedFolder, { status: 200 })
                }),
            )
            const api = getTarget()

            const response = await api.updateFolder('789', DEFAULT_UPDATE_FOLDER_ARGS)

            expect(response).toEqual(returnedFolder)
        })
    })

    describe('deleteFolder', () => {
        test('returns success result from rest client', async () => {
            server.use(
                http.delete(`${getSyncBaseUri()}${ENDPOINT_REST_FOLDERS}/789`, () => {
                    return HttpResponse.json(undefined, { status: 204 })
                }),
            )
            const api = getTarget()

            const response = await api.deleteFolder('789')

            expect(response).toEqual(true)
        })
    })
})
