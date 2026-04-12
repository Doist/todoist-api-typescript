import { vi } from 'vitest'
import {
    getSyncBaseUri,
    ENDPOINT_REST_APPS_UI_EXTENSIONS,
    ENDPOINT_REST_APPS_UI_EXTENSIONS_INSTALLED,
    getUiExtensionEndpoint,
    getUiExtensionIconEndpoint,
    getUiExtensionsByIntegrationEndpoint,
} from './consts/endpoints'
import { server, http, HttpResponse } from './test-utils/msw-setup'
import {
    DEFAULT_AUTH_TOKEN,
    DEFAULT_APP_ID,
    DEFAULT_UI_EXTENSION,
    DEFAULT_UI_EXTENSION_ID,
} from './test-utils/test-defaults'
import { TodoistApi } from './todoist-api'
import { uploadMultipartFile } from './utils/multipart-upload'

vi.mock('./utils/multipart-upload')
const mockedUploadMultipartFile = vi.mocked(uploadMultipartFile)

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi UI extension endpoints', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getUiExtension', () => {
        test('returns a single UI extension', async () => {
            server.use(
                http.get(
                    `${getSyncBaseUri()}${getUiExtensionEndpoint(DEFAULT_UI_EXTENSION_ID)}`,
                    () => HttpResponse.json(DEFAULT_UI_EXTENSION, { status: 200 }),
                ),
            )
            const extension = await getTarget().getUiExtension(DEFAULT_UI_EXTENSION_ID)
            expect(extension).toEqual(DEFAULT_UI_EXTENSION)
        })
    })

    describe('getInstalledUiExtensions', () => {
        test('returns installed extensions as a discriminated union', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_APPS_UI_EXTENSIONS_INSTALLED}`, () =>
                    HttpResponse.json([DEFAULT_UI_EXTENSION], { status: 200 }),
                ),
            )
            const installed = await getTarget().getInstalledUiExtensions()
            expect(installed).toEqual([DEFAULT_UI_EXTENSION])
        })
    })

    describe('getUiExtensionsForApp', () => {
        test('lists extensions for an app', async () => {
            server.use(
                http.get(
                    `${getSyncBaseUri()}${getUiExtensionsByIntegrationEndpoint(DEFAULT_APP_ID)}`,
                    () => HttpResponse.json([DEFAULT_UI_EXTENSION], { status: 200 }),
                ),
            )
            const extensions = await getTarget().getUiExtensionsForApp(DEFAULT_APP_ID)
            expect(extensions).toEqual([DEFAULT_UI_EXTENSION])
        })
    })

    describe('addUiExtension', () => {
        test('creates an extension', async () => {
            let receivedBody: unknown
            server.use(
                http.post(
                    `${getSyncBaseUri()}${ENDPOINT_REST_APPS_UI_EXTENSIONS}`,
                    async ({ request }) => {
                        receivedBody = await request.json()
                        return HttpResponse.json(DEFAULT_UI_EXTENSION, { status: 200 })
                    },
                ),
            )
            const extension = await getTarget().addUiExtension({
                integrationId: DEFAULT_APP_ID,
                extensionType: 'context-menu',
                contextType: 'task',
                url: 'https://example.com/extension',
                name: 'My Extension',
                description: 'desc',
            })
            expect(extension).toEqual(DEFAULT_UI_EXTENSION)
            expect(receivedBody).toEqual({
                integration_id: DEFAULT_APP_ID,
                extension_type: 'context-menu',
                context_type: 'task',
                url: 'https://example.com/extension',
                name: 'My Extension',
                description: 'desc',
            })
        })
    })

    describe('updateUiExtension', () => {
        test('updates via PATCH', async () => {
            let receivedMethod: string | undefined
            server.use(
                http.patch(
                    `${getSyncBaseUri()}${getUiExtensionEndpoint(DEFAULT_UI_EXTENSION_ID)}`,
                    ({ request }) => {
                        receivedMethod = request.method
                        return HttpResponse.json(DEFAULT_UI_EXTENSION, { status: 200 })
                    },
                ),
            )
            const extension = await getTarget().updateUiExtension(DEFAULT_UI_EXTENSION_ID, {
                name: 'New Name',
            })
            expect(extension).toEqual(DEFAULT_UI_EXTENSION)
            expect(receivedMethod).toBe('PATCH')
        })
    })

    describe('deleteUiExtension', () => {
        test('returns true on success', async () => {
            server.use(
                http.delete(
                    `${getSyncBaseUri()}${getUiExtensionEndpoint(DEFAULT_UI_EXTENSION_ID)}`,
                    () => HttpResponse.json({ status: 'ok' }, { status: 200 }),
                ),
            )
            const result = await getTarget().deleteUiExtension(DEFAULT_UI_EXTENSION_ID)
            expect(result).toBe(true)
        })
    })

    describe('uploadUiExtensionIcon', () => {
        beforeEach(() => {
            mockedUploadMultipartFile.mockResolvedValue(DEFAULT_UI_EXTENSION)
        })

        test('uploads an icon', async () => {
            const result = await getTarget().uploadUiExtensionIcon({
                uiExtensionId: DEFAULT_UI_EXTENSION_ID,
                file: '/path/to/icon.png',
                fileName: 'icon.png',
            })

            expect(mockedUploadMultipartFile).toHaveBeenCalledWith({
                baseUrl: getSyncBaseUri(),
                authToken: DEFAULT_AUTH_TOKEN,
                endpoint: getUiExtensionIconEndpoint(DEFAULT_UI_EXTENSION_ID),
                file: '/path/to/icon.png',
                fileName: 'icon.png',
                additionalFields: { file_name: 'icon.png' },
                requestId: undefined,
                customFetch: undefined,
            })
            expect(result).toEqual(DEFAULT_UI_EXTENSION)
        })

        test('throws on empty buffer', async () => {
            await expect(
                getTarget().uploadUiExtensionIcon({
                    uiExtensionId: DEFAULT_UI_EXTENSION_ID,
                    file: Buffer.alloc(0),
                    fileName: 'icon.png',
                }),
            ).rejects.toThrow('Cannot upload empty image file')
        })
    })
})
