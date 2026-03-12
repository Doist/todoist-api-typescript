import { TodoistApi } from '.'
import { createCommand } from './utils/sync-helpers'
import { DEFAULT_AUTH_TOKEN } from './test-utils/test-defaults'
import { getSyncBaseUri, ENDPOINT_SYNC } from './consts/endpoints'
import { server, http, HttpResponse } from './test-utils/msw-setup'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi sync endpoint', () => {
    describe('sync', () => {
        test('returns a sync response', async () => {
            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_SYNC}`, () => {
                    return HttpResponse.json({ sync_token: 'token123' }, { status: 200 })
                }),
            )
            const api = getTarget()

            const response = await api.sync({
                commands: [createCommand('item_add', { content: 'Buy milk' })],
                resourceTypes: ['items'],
                syncToken: '*',
            })

            expect(response.syncToken).toBe('token123')
        })

        test('sends the command type and args in the request body', async () => {
            let capturedBody:
                | { commands: Array<{ type: string; args: unknown }> }
                | null
                | undefined

            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_SYNC}`, async ({ request }) => {
                    capturedBody = (await request.json()) as typeof capturedBody
                    return HttpResponse.json({ sync_token: 'token123' }, { status: 200 })
                }),
            )
            const api = getTarget()

            await api.sync({
                commands: [createCommand('item_add', { content: 'Buy milk' })],
                syncToken: '*',
            })

            expect(capturedBody).toBeDefined()
            expect(capturedBody?.commands[0].type).toBe('item_add')
            expect(capturedBody?.commands[0].args).toEqual({ content: 'Buy milk' })
        })

        test('rejects invalid command name in sync request at compile time', async () => {
            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_SYNC}`, () => {
                    return HttpResponse.json({}, { status: 200 })
                }),
            )
            const api = getTarget()

            await api.sync({
                commands: [
                    // @ts-expect-error invalid command name
                    createCommand('task_add', { content: 'Buy milk' }),
                ],
                resourceTypes: ['items'],
                syncToken: '*',
            })
        })
    })
})
