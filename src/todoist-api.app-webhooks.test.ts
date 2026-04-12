import { getSyncBaseUri, getAppWebhookEndpoint } from './consts/endpoints'
import { server, http, HttpResponse } from './test-utils/msw-setup'
import { DEFAULT_AUTH_TOKEN, DEFAULT_APP_ID, DEFAULT_APP_WEBHOOK } from './test-utils/test-defaults'
import { TodoistApi } from './todoist-api'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi app webhook endpoints', () => {
    describe('getAppWebhook', () => {
        test('translates wire-format event names to pretty names', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${getAppWebhookEndpoint(DEFAULT_APP_ID)}`, () => {
                    return HttpResponse.json(
                        {
                            status: 'active',
                            callback_url: 'https://example.com/webhook',
                            version: '1',
                            events: ['e_item_added', 'e_item_completed'],
                        },
                        { status: 200 },
                    )
                }),
            )
            const webhook = await getTarget().getAppWebhook(DEFAULT_APP_ID)
            expect(webhook).toEqual(DEFAULT_APP_WEBHOOK)
            expect(webhook?.events).toEqual(['item:added', 'item:completed'])
        })

        test('returns null when no webhook configured', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${getAppWebhookEndpoint(DEFAULT_APP_ID)}`, () => {
                    return HttpResponse.json(null, { status: 200 })
                }),
            )
            const webhook = await getTarget().getAppWebhook(DEFAULT_APP_ID)
            expect(webhook).toBeNull()
        })
    })

    describe('updateAppWebhook', () => {
        test('accepts pretty event names and sends wire-format names', async () => {
            let receivedBody: unknown
            server.use(
                http.post(
                    `${getSyncBaseUri()}${getAppWebhookEndpoint(DEFAULT_APP_ID)}`,
                    async ({ request }) => {
                        receivedBody = await request.json()
                        return HttpResponse.json(
                            {
                                status: 'active',
                                callback_url: 'https://example.com/webhook',
                                version: '1',
                                events: ['e_item_added', 'e_item_completed'],
                            },
                            { status: 200 },
                        )
                    },
                ),
            )
            const webhook = await getTarget().updateAppWebhook({
                appId: DEFAULT_APP_ID,
                callbackUrl: 'https://example.com/webhook',
                events: ['item:added', 'item:completed'],
                version: '1',
            })
            expect(webhook).toEqual(DEFAULT_APP_WEBHOOK)
            expect(receivedBody).toEqual({
                callback_url: 'https://example.com/webhook',
                events: ['e_item_added', 'e_item_completed'],
                version: '1',
            })
        })
    })

    describe('deleteAppWebhook', () => {
        test('returns true on 204', async () => {
            server.use(
                http.delete(`${getSyncBaseUri()}${getAppWebhookEndpoint(DEFAULT_APP_ID)}`, () => {
                    return HttpResponse.json(undefined, { status: 204 })
                }),
            )
            const result = await getTarget().deleteAppWebhook(DEFAULT_APP_ID)
            expect(result).toBe(true)
        })
    })
})
