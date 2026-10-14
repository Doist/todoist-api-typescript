import { TodoistApi } from '.'
import { ENDPOINT_SYNC, getSyncBaseUri } from './consts/endpoints'
import { captureRequest, getLastRequest, http, HttpResponse, server } from './test-utils/msw-setup'
import { DEFAULT_AUTH_TOKEN } from './test-utils/test-defaults'
import { TodoistArgumentError } from './types'
import type { UserUpdateArgs } from './types/sync'
import { createCommand } from './utils/sync-helpers'

async function sendUserUpdate(args: UserUpdateArgs) {
    server.use(
        http.post(`${getSyncBaseUri()}${ENDPOINT_SYNC}`, async ({ request }) => {
            captureRequest({ request, body: await request.clone().json() })
            return HttpResponse.json({ sync_status: { u1: 'ok' } }, { status: 200 })
        }),
    )
    const api = new TodoistApi(DEFAULT_AUTH_TOKEN)
    await api.sync({
        commands: [createCommand('user_update', args)],
    })
    const body = getLastRequest()?.body as { commands: { args: Record<string, unknown> }[] }
    return body.commands[0].args
}

describe('user_update status serialization', () => {
    test('sends a Date activeUntil as an ISO string', async () => {
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
    })

    test('sends activeUntil: null so a status with no expiry can be written back', async () => {
        const args = await sendUserUpdate({ status: { message: 'Away', activeUntil: null } })

        expect(args).toEqual({ status: { message: 'Away', active_until: null } })
    })

    test('rejects an invalid Date instead of sending it as a null expiry', async () => {
        const api = new TodoistApi(DEFAULT_AUTH_TOKEN)

        await expect(
            api.sync({
                commands: [
                    createCommand('user_update', {
                        status: { message: 'Away', activeUntil: new Date('nope') },
                    }),
                ],
            }),
        ).rejects.toBeInstanceOf(TodoistArgumentError)
    })
})
