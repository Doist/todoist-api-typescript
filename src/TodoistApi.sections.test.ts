import { TodoistApi } from '.'
import { DEFAULT_AUTH_TOKEN, DEFAULT_REQUEST_ID, DEFAULT_SECTION } from './testUtils/testDefaults'
import { getSyncBaseUri, ENDPOINT_REST_SECTIONS } from './consts/endpoints'
import { setupRestClientMock } from './testUtils/mocks'
import { getSectionUrl } from './utils/urlHelpers'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi section endpoints', () => {
    describe('getSection', () => {
        test('calls get request with expected url', async () => {
            const sectionId = '12'
            const requestMock = setupRestClientMock(DEFAULT_SECTION)
            const api = getTarget()

            await api.getSection(sectionId)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: `${ENDPOINT_REST_SECTIONS}/${sectionId}`,
                apiToken: DEFAULT_AUTH_TOKEN,
            })
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(DEFAULT_SECTION)
            const api = getTarget()

            const section = await api.getSection('123')

            expect(section).toEqual(DEFAULT_SECTION)
            expect(section.url).toBe(getSectionUrl(section.id, section.name))
        })
    })

    describe('getSections', () => {
        test('calls get on sections endpoint', async () => {
            const projectId = '123'
            const requestMock = setupRestClientMock({
                results: [DEFAULT_SECTION],
                nextCursor: '123',
            })
            const api = getTarget()

            const args = { projectId, limit: 10, cursor: '0' }
            await api.getSections(args)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_SECTIONS,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: args,
            })
        })

        test('returns result from rest client', async () => {
            const sections = [DEFAULT_SECTION]
            setupRestClientMock({ results: sections, nextCursor: '123' })
            const api = getTarget()

            const { results, nextCursor } = await api.getSections({ projectId: '123' })

            expect(results).toEqual(sections)
            expect(nextCursor).toBe('123')
        })
    })

    describe('addSection', () => {
        const DEFAULT_ADD_SECTION_ARGS = {
            name: 'This is a section',
            projectId: '123',
        }

        test('calls post on restClient with expected parameters', async () => {
            const requestMock = setupRestClientMock(DEFAULT_SECTION)
            const api = getTarget()

            await api.addSection(DEFAULT_ADD_SECTION_ARGS, DEFAULT_REQUEST_ID)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'POST',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_SECTIONS,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: DEFAULT_ADD_SECTION_ARGS,
                requestId: DEFAULT_REQUEST_ID,
            })
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(DEFAULT_SECTION)
            const api = getTarget()

            const section = await api.addSection(DEFAULT_ADD_SECTION_ARGS)

            expect(section).toEqual(DEFAULT_SECTION)
        })
    })

    describe('updateSection', () => {
        const DEFAULT_UPDATE_SECTION_ARGS = { name: 'a new name' }

        test('calls post on restClient with expected parameters', async () => {
            const sectionId = '123'
            const requestMock = setupRestClientMock(DEFAULT_SECTION, 204)
            const api = getTarget()

            await api.updateSection(sectionId, DEFAULT_UPDATE_SECTION_ARGS, DEFAULT_REQUEST_ID)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'POST',
                baseUri: getSyncBaseUri(),
                relativePath: `${ENDPOINT_REST_SECTIONS}/${sectionId}`,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: DEFAULT_UPDATE_SECTION_ARGS,
                requestId: DEFAULT_REQUEST_ID,
            })
        })

        test('returns success result from rest client', async () => {
            const returnedSection = {
                ...DEFAULT_SECTION,
                ...DEFAULT_UPDATE_SECTION_ARGS,
                id: '123',
                url: getSectionUrl('123', 'a new name'),
            }
            setupRestClientMock(returnedSection, 204)
            const api = getTarget()

            const response = await api.updateSection('123', DEFAULT_UPDATE_SECTION_ARGS)

            expect(response).toEqual(returnedSection)
        })
    })

    describe('deleteSection', () => {
        test('calls delete on expected section', async () => {
            const sectionId = '123'
            const requestMock = setupRestClientMock(true)
            const api = getTarget()

            await api.deleteSection(sectionId, DEFAULT_REQUEST_ID)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'DELETE',
                baseUri: getSyncBaseUri(),
                relativePath: `${ENDPOINT_REST_SECTIONS}/${sectionId}`,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: undefined,
                requestId: DEFAULT_REQUEST_ID,
            })
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const response = await api.deleteSection('123')

            expect(response).toEqual(true)
        })
    })
})
