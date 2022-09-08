import { TodoistApi } from '.'
import {
    DEFAULT_AUTH_TOKEN,
    DEFAULT_REQUEST_ID,
    DEFAULT_SECTION,
    INVALID_ENTITY_ID,
} from './testUtils/testDefaults'
import { getRestBaseUri, ENDPOINT_REST_SECTIONS } from './consts/endpoints'
import { setupRestClientMock } from './testUtils/mocks'
import { assertInputValidationError } from './testUtils/asserts'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi section endpoints', () => {
    describe('getSection', () => {
        test('calls get request with expected url', async () => {
            const sectionId = 12
            const requestMock = setupRestClientMock(DEFAULT_SECTION)
            const api = getTarget()

            await api.getSection(sectionId)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                getRestBaseUri(),
                `${ENDPOINT_REST_SECTIONS}/${sectionId}`,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(DEFAULT_SECTION)
            const api = getTarget()

            const section = await api.getSection(123)

            expect(section).toEqual(DEFAULT_SECTION)
        })

        test('throws validation error for invalid id input', async () => {
            await assertInputValidationError(
                async () => await getTarget().getSection(INVALID_ENTITY_ID),
            )
        })
    })

    describe('getSections', () => {
        test('calls get on sections endpoint', async () => {
            const projectId = 123
            const requestMock = setupRestClientMock([DEFAULT_SECTION])
            const api = getTarget()

            await api.getSections(projectId)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                getRestBaseUri(),
                ENDPOINT_REST_SECTIONS,
                DEFAULT_AUTH_TOKEN,
                { projectId },
            )
        })

        test('returns result from rest client', async () => {
            const sections = [DEFAULT_SECTION]
            setupRestClientMock(sections)
            const api = getTarget()

            const response = await api.getSections()

            expect(response).toEqual(sections)
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

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                getRestBaseUri(),
                ENDPOINT_REST_SECTIONS,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_ADD_SECTION_ARGS,
                DEFAULT_REQUEST_ID,
            )
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
            const sectionId = 123
            const requestMock = setupRestClientMock(DEFAULT_SECTION, 204)
            const api = getTarget()

            await api.updateSection(sectionId, DEFAULT_UPDATE_SECTION_ARGS, DEFAULT_REQUEST_ID)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                getRestBaseUri(),
                `${ENDPOINT_REST_SECTIONS}/${sectionId}`,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_UPDATE_SECTION_ARGS,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns success result from rest client', async () => {
            const returnedSection = { ...DEFAULT_SECTION, ...DEFAULT_UPDATE_SECTION_ARGS }
            setupRestClientMock(returnedSection, 204)
            const api = getTarget()

            const response = await api.updateSection(123, DEFAULT_UPDATE_SECTION_ARGS)

            expect(response).toEqual(returnedSection)
        })

        test('throws validation error for invalid id input', async () => {
            await assertInputValidationError(
                async () =>
                    await getTarget().updateSection(INVALID_ENTITY_ID, DEFAULT_UPDATE_SECTION_ARGS),
            )
        })
    })

    describe('deleteSection', () => {
        test('calls delete on expected section', async () => {
            const sectionId = 123
            const requestMock = setupRestClientMock(true)
            const api = getTarget()

            await api.deleteSection(sectionId, DEFAULT_REQUEST_ID)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'DELETE',
                getRestBaseUri(),
                `${ENDPOINT_REST_SECTIONS}/${sectionId}`,
                DEFAULT_AUTH_TOKEN,
                undefined,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const response = await api.deleteSection(123)

            expect(response).toEqual(true)
        })

        test('throws validation error for invalid id input', async () => {
            await assertInputValidationError(
                async () => await getTarget().deleteSection(INVALID_ENTITY_ID),
            )
        })
    })
})
