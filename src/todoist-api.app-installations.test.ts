import {
    getSyncBaseUri,
    ENDPOINT_REST_APPS_INSTALLATIONS,
    getAppInstallationEndpoint,
} from './consts/endpoints'
import { server, http, HttpResponse } from './test-utils/msw-setup'
import {
    DEFAULT_AUTH_TOKEN,
    DEFAULT_APP_INSTALLATION,
    DEFAULT_INSTALLATION_ID,
    DEFAULT_APP,
    DEFAULT_DISTRIBUTION_TOKEN,
} from './test-utils/test-defaults'
import { TodoistApi } from './todoist-api'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

const installationWire = {
    id: DEFAULT_APP_INSTALLATION.id,
    creator: DEFAULT_APP_INSTALLATION.creator,
    created_ts: DEFAULT_APP_INSTALLATION.createdTs,
    installation_type: DEFAULT_APP_INSTALLATION.installationType,
    app_token_scopes_validated: DEFAULT_APP_INSTALLATION.appTokenScopesValidated,
    integration: {
        ...DEFAULT_APP,
        app_token_scopes: DEFAULT_APP.appTokenScopes.join(','),
    },
}

describe('TodoistApi app installation endpoints', () => {
    describe('getAppInstallations', () => {
        test('lists installations', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_APPS_INSTALLATIONS}`, () => {
                    return HttpResponse.json([installationWire], { status: 200 })
                }),
            )
            const installations = await getTarget().getAppInstallations()
            expect(installations).toEqual([DEFAULT_APP_INSTALLATION])
        })
    })

    describe('installApp', () => {
        test('installs an app via distribution token', async () => {
            let receivedBody: unknown
            server.use(
                http.post(
                    `${getSyncBaseUri()}${ENDPOINT_REST_APPS_INSTALLATIONS}`,
                    async ({ request }) => {
                        receivedBody = await request.json()
                        return HttpResponse.json(installationWire, { status: 200 })
                    },
                ),
            )
            const installation = await getTarget().installApp({
                distributionToken: DEFAULT_DISTRIBUTION_TOKEN,
                installationType: 'user',
                appTokenScopesValidated: true,
            })
            expect(installation).toEqual(DEFAULT_APP_INSTALLATION)
            expect(receivedBody).toEqual({
                distribution_token: DEFAULT_DISTRIBUTION_TOKEN,
                installation_type: 'user',
                app_token_scopes_validated: true,
            })
        })
    })

    describe('getAppInstallation', () => {
        test('fetches one installation', async () => {
            server.use(
                http.get(
                    `${getSyncBaseUri()}${getAppInstallationEndpoint(DEFAULT_INSTALLATION_ID)}`,
                    () => HttpResponse.json(installationWire, { status: 200 }),
                ),
            )
            const installation = await getTarget().getAppInstallation(DEFAULT_INSTALLATION_ID)
            expect(installation).toEqual(DEFAULT_APP_INSTALLATION)
        })
    })

    describe('updateAppInstallation', () => {
        test('updates an installation', async () => {
            server.use(
                http.post(
                    `${getSyncBaseUri()}${getAppInstallationEndpoint(DEFAULT_INSTALLATION_ID)}`,
                    () => HttpResponse.json(installationWire, { status: 200 }),
                ),
            )
            const installation = await getTarget().updateAppInstallation(DEFAULT_INSTALLATION_ID, {
                appTokenScopesValidated: true,
            })
            expect(installation).toEqual(DEFAULT_APP_INSTALLATION)
        })
    })

    describe('uninstallApp', () => {
        test('returns true on success', async () => {
            server.use(
                http.delete(
                    `${getSyncBaseUri()}${getAppInstallationEndpoint(DEFAULT_INSTALLATION_ID)}`,
                    () => HttpResponse.json({ status: 'ok' }, { status: 200 }),
                ),
            )
            const result = await getTarget().uninstallApp(DEFAULT_INSTALLATION_ID)
            expect(result).toBe(true)
        })
    })
})
