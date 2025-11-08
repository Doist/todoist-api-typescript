import { TodoistApi } from '.'
import { DEFAULT_AUTH_TOKEN, DEFAULT_LABEL } from './test-utils/test-defaults'
import {
    getSyncBaseUri,
    ENDPOINT_REST_LABELS,
    ENDPOINT_REST_LABELS_SHARED,
    ENDPOINT_REST_LABELS_SHARED_RENAME,
    ENDPOINT_REST_LABELS_SHARED_REMOVE,
} from './consts/endpoints'
import { server, http, HttpResponse } from './test-utils/msw-setup'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi label endpoints', () => {
    describe('getLabel', () => {
        test('returns result from rest client', async () => {
            const labelId = '123'
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_LABELS}/${labelId}`, () => {
                    return HttpResponse.json(DEFAULT_LABEL, { status: 200 })
                }),
            )
            const api = getTarget()

            const label = await api.getLabel(labelId)

            expect(label).toEqual(DEFAULT_LABEL)
        })
    })

    describe('getLabels', () => {
        test('returns result from rest client', async () => {
            const labels = [DEFAULT_LABEL]
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_LABELS}`, () => {
                    return HttpResponse.json(
                        {
                            results: [DEFAULT_LABEL],
                            nextCursor: '123',
                        },
                        { status: 200 },
                    )
                }),
            )
            const api = getTarget()

            const { results, nextCursor } = await api.getLabels()

            expect(results).toEqual(labels)
            expect(nextCursor).toBe('123')
        })
    })

    describe('addLabel', () => {
        const DEFAULT_ADD_LABEL_ARGS = {
            name: 'This is a label',
        }

        test('returns result from rest client', async () => {
            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_REST_LABELS}`, () => {
                    return HttpResponse.json(DEFAULT_LABEL, { status: 200 })
                }),
            )
            const api = getTarget()

            const label = await api.addLabel(DEFAULT_ADD_LABEL_ARGS)

            expect(label).toEqual(DEFAULT_LABEL)
        })
    })

    describe('updateLabel', () => {
        const DEFAULT_UPDATE_LABEL_ARGS = {
            name: 'A new name',
        }

        test('returns success result from rest client', async () => {
            const returnedTask = { ...DEFAULT_LABEL, ...DEFAULT_UPDATE_LABEL_ARGS }
            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_REST_LABELS}/123`, () => {
                    return HttpResponse.json(returnedTask, { status: 200 })
                }),
            )
            const api = getTarget()

            const result = await api.updateLabel('123', DEFAULT_UPDATE_LABEL_ARGS)

            expect(result).toEqual(returnedTask)
        })
    })

    describe('deleteLabel', () => {
        test('returns success result from rest client', async () => {
            server.use(
                http.delete(`${getSyncBaseUri()}${ENDPOINT_REST_LABELS}/123`, () => {
                    return HttpResponse.json(undefined, { status: 204 })
                }),
            )
            const api = getTarget()

            const result = await api.deleteLabel('123')

            expect(result).toEqual(true)
        })
    })

    describe('getSharedLabels', () => {
        test('returns result from rest client', async () => {
            const mockResponse = { results: ['shared1', 'shared2'], nextCursor: 'abc' }
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_LABELS_SHARED}`, () => {
                    return HttpResponse.json(mockResponse, { status: 200 })
                }),
            )
            const api = getTarget()

            const result = await api.getSharedLabels()

            expect(result).toEqual(mockResponse)
        })
    })

    describe('renameSharedLabel', () => {
        test('returns success result from rest client', async () => {
            const args = { name: 'old', newName: 'new' }
            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_REST_LABELS_SHARED_RENAME}`, () => {
                    return HttpResponse.json(null, { status: 200 })
                }),
            )
            const api = getTarget()

            const result = await api.renameSharedLabel(args)

            expect(result).toBe(true)
        })
    })

    describe('removeSharedLabel', () => {
        test('returns success result from rest client', async () => {
            const args = { name: 'toremove' }
            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_REST_LABELS_SHARED_REMOVE}`, () => {
                    return HttpResponse.json(null, { status: 200 })
                }),
            )
            const api = getTarget()

            const result = await api.removeSharedLabel(args)

            expect(result).toBe(true)
        })
    })
})
