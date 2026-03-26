import { TodoistApi } from '.'
import { DEFAULT_AUTH_TOKEN } from './test-utils/test-defaults'
import { getSyncBaseUri } from './consts/endpoints'
import { server, http, HttpResponse } from './test-utils/msw-setup'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi backups endpoints', () => {
    describe('getBackups', () => {
        test('returns backups from rest client', async () => {
            const mockResponse = [
                { version: '2025-02-13 02:03', url: 'https://example.com/backup1.zip' },
                { version: '2025-02-12 02:03', url: 'https://example.com/backup2.zip' },
            ]
            server.use(
                http.get(`${getSyncBaseUri()}backups`, () => {
                    return HttpResponse.json(mockResponse, { status: 200 })
                }),
            )
            const api = getTarget()

            const result = await api.getBackups()

            expect(result).toHaveLength(2)
            expect(result[0]).toMatchObject({
                version: '2025-02-13 02:03',
                url: 'https://example.com/backup1.zip',
            })
        })
    })

    describe('downloadBackup', () => {
        test('returns file response from rest client', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}backups/download`, () => {
                    return new HttpResponse('binary-content', { status: 200 })
                }),
            )
            const api = getTarget()

            const result = await api.downloadBackup({ file: 'backup123.zip' })

            expect(result.ok).toBe(true)
            expect(result.status).toBe(200)
            const text = await result.text()
            expect(text).toBe('binary-content')
        })
    })
})

describe('TodoistApi email forwarding endpoints', () => {
    describe('getOrCreateEmailForwarding', () => {
        test('returns email from rest client', async () => {
            const mockResponse = { email: 'forward+123@todoist.com' }
            server.use(
                http.put(`${getSyncBaseUri()}emails`, () => {
                    return HttpResponse.json(mockResponse, { status: 200 })
                }),
            )
            const api = getTarget()

            const result = await api.getOrCreateEmailForwarding({
                objType: 'project',
                objId: '123',
            })

            expect(result.email).toBe('forward+123@todoist.com')
        })
    })

    describe('disableEmailForwarding', () => {
        test('returns success from rest client', async () => {
            server.use(
                http.delete(`${getSyncBaseUri()}emails`, () => {
                    return HttpResponse.json({ status: 'ok' }, { status: 200 })
                }),
            )
            const api = getTarget()

            const result = await api.disableEmailForwarding({
                objType: 'project',
                objId: '123',
            })

            expect(result).toBe(true)
        })
    })
})

describe('TodoistApi ID mapping endpoints', () => {
    describe('getIdMappings', () => {
        test('returns ID mappings from rest client', async () => {
            const mockResponse = [
                { old_id: '918273645', new_id: '6VfWjjjFg2xqX6Pa' },
                { old_id: null, new_id: '6WMVPf8Hm8JP6mC8' },
            ]
            server.use(
                http.get(`${getSyncBaseUri()}id_mappings/tasks/abc,def`, () => {
                    return HttpResponse.json(mockResponse, { status: 200 })
                }),
            )
            const api = getTarget()

            const result = await api.getIdMappings({
                objName: 'tasks',
                objIds: ['abc', 'def'],
            })

            expect(result).toHaveLength(2)
            expect(result[0]).toMatchObject({
                oldId: '918273645',
                newId: '6VfWjjjFg2xqX6Pa',
            })
            expect(result[1].oldId).toBeNull()
        })
    })

    describe('getMovedIds', () => {
        test('returns moved IDs from rest client', async () => {
            const mockResponse = [{ old_id: '6WMVPf8Hm8JP6mC8', new_id: '6WMVPf8Hm8JP6mFx' }]
            server.use(
                http.get(`${getSyncBaseUri()}moved_ids/sections`, () => {
                    return HttpResponse.json(mockResponse, { status: 200 })
                }),
            )
            const api = getTarget()

            const result = await api.getMovedIds({ objName: 'sections' })

            expect(result).toHaveLength(1)
            expect(result[0]).toMatchObject({
                oldId: '6WMVPf8Hm8JP6mC8',
                newId: '6WMVPf8Hm8JP6mFx',
            })
        })
    })
})
