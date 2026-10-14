import { TodoistApi } from '.'
import { getSyncBaseUri } from './consts/endpoints'
import { captureRequest, getLastRequest, http, HttpResponse, server } from './test-utils/msw-setup'
import { DEFAULT_AUTH_TOKEN } from './test-utils/test-defaults'
import type { SyncCommand } from './types/sync'

async function sendUserUpdate(args: Record<string, unknown>) {
    server.use(
        http.post(`${getSyncBaseUri()}sync`, async ({ request }) => {
            captureRequest({ request, body: await request.clone().json() })
            return HttpResponse.json({ sync_status: { u1: 'ok' } }, { status: 200 })
        }),
    )
    const api = new TodoistApi(DEFAULT_AUTH_TOKEN)
    await api.sync({
        commands: [{ type: 'user_update', uuid: 'u1', args } as SyncCommand],
    })
    const body = getLastRequest()?.body as { commands: { args: Record<string, unknown> }[] }
    return body.commands[0].args
}

describe('user_update status serialization', () => {
    test('sends a Date activeUntil as an ISO string, not an empty object', async () => {
        const args = await sendUserUpdate({
            status: {
                message: 'Deep work',
                emoji: '🎧',
                activeUntil: new Date('2026-10-20T17:00:00.000Z'),
            },
        })

        expect(args).toEqual({
            status: {
                message: 'Deep work',
                emoji: '🎧',
                active_until: '2026-10-20T17:00:00.000Z',
            },
        })
    })

    test('passes a string activeUntil through and snake_cases effects', async () => {
        const args = await sendUserUpdate({
            status: {
                message: 'Heads down',
                activeUntil: '2026-10-20T17:00:00Z',
                effects: {
                    pauseNotifications: { scope: { mode: 'all' } },
                    pauseActivity: { scope: { mode: 'all' } },
                },
            },
        })

        expect(args).toEqual({
            status: {
                message: 'Heads down',
                active_until: '2026-10-20T17:00:00Z',
                effects: {
                    pause_notifications: { scope: { mode: 'all' } },
                    pause_activity: { scope: { mode: 'all' } },
                },
            },
        })
    })

    test('sends status: null to clear', async () => {
        const args = await sendUserUpdate({ status: null })

        expect(args).toEqual({ status: null })
    })

    test('omits status when not provided', async () => {
        const args = await sendUserUpdate({ fullName: 'Ada' })

        expect(args).toEqual({ full_name: 'Ada' })
        expect('status' in args).toBe(false)
    })
})
