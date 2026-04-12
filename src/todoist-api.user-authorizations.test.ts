import {
    getSyncBaseUri,
    ENDPOINT_REST_USER_AUTHORIZATIONS,
    ENDPOINT_REST_USER_AUTHORIZATIONS_DELETE,
} from './consts/endpoints'
import { server, http, HttpResponse } from './test-utils/msw-setup'
import {
    DEFAULT_AUTH_TOKEN,
    DEFAULT_USER_AUTHORIZATION,
    DEFAULT_ACCESS_TOKEN_ID,
} from './test-utils/test-defaults'
import { TodoistApi } from './todoist-api'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi user authorization endpoints', () => {
    describe('getUserAuthorizations', () => {
        test('lists authorizations', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_USER_AUTHORIZATIONS}`, () => {
                    return HttpResponse.json(
                        [
                            {
                                access_token_id: DEFAULT_USER_AUTHORIZATION.accessTokenId,
                                scope: DEFAULT_USER_AUTHORIZATION.scope,
                                scope_descriptions: DEFAULT_USER_AUTHORIZATION.scopeDescriptions,
                                created_at: DEFAULT_USER_AUTHORIZATION.createdAt,
                                app: {
                                    id: DEFAULT_USER_AUTHORIZATION.app?.id,
                                    display_name: DEFAULT_USER_AUTHORIZATION.app?.displayName,
                                    description: DEFAULT_USER_AUTHORIZATION.app?.description,
                                    service_url: DEFAULT_USER_AUTHORIZATION.app?.serviceUrl,
                                    icon_md: DEFAULT_USER_AUTHORIZATION.app?.iconMd,
                                },
                            },
                        ],
                        { status: 200 },
                    )
                }),
            )
            const authorizations = await getTarget().getUserAuthorizations()
            expect(authorizations).toEqual([DEFAULT_USER_AUTHORIZATION])
        })
    })

    describe('revokeUserAuthorization', () => {
        test('revokes an authorization', async () => {
            let receivedBody: unknown
            server.use(
                http.post(
                    `${getSyncBaseUri()}${ENDPOINT_REST_USER_AUTHORIZATIONS_DELETE}`,
                    async ({ request }) => {
                        receivedBody = await request.json()
                        return HttpResponse.json({ status: 'ok' }, { status: 200 })
                    },
                ),
            )
            const result = await getTarget().revokeUserAuthorization({
                accessTokenId: DEFAULT_ACCESS_TOKEN_ID,
            })
            expect(result).toBe(true)
            expect(receivedBody).toEqual({ access_token_id: DEFAULT_ACCESS_TOKEN_ID })
        })
    })
})
