import { TodoistApi, type CurrentUser } from '.'
import { DEFAULT_AUTH_TOKEN } from './testUtils/testDefaults'
import { getSyncBaseUri, ENDPOINT_REST_USER } from './consts/endpoints'
import { setupRestClientMock } from './testUtils/mocks'

function getTarget(baseUrl = 'https://api.todoist.com') {
    return new TodoistApi(DEFAULT_AUTH_TOKEN, baseUrl)
}

const DEFAULT_CURRENT_USER_RESPONSE: CurrentUser = {
    id: '123456789',
    email: 'test.user@example.com',
    fullName: 'Test User',
    avatarBig: 'https://example.com/avatars/test_user_big.jpg',
    avatarMedium: 'https://example.com/avatars/test_user_medium.jpg',
    avatarS640: 'https://example.com/avatars/test_user_s640.jpg',
    avatarSmall: 'https://example.com/avatars/test_user_small.jpg',
    businessAccountId: null,
    isPremium: true,
    dateFormat: 0,
    timeFormat: 0,
    weeklyGoal: 100,
    dailyGoal: 10,
    completedCount: 102920,
    completedToday: 12,
    karma: 86394.0,
    karmaTrend: 'up',
    lang: 'en',
    nextWeek: 1,
    startDay: 1,
    startPage: 'project?id=test_project_123',
    tzInfo: {
        gmtString: '+02:00',
        hours: 2,
        isDst: 1,
        minutes: 0,
        timezone: 'Europe/Madrid',
    },
    inboxProjectId: 'test_project_123',
    daysOff: [6, 7],
    weekendStartDay: 6,
}

describe('TodoistApi user endpoints', () => {
    describe('getUser', () => {
        test('calls get on restClient with expected parameters', async () => {
            const requestMock = setupRestClientMock(DEFAULT_CURRENT_USER_RESPONSE)
            const api = getTarget()

            await api.getUser()

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith(
                'GET',
                getSyncBaseUri(),
                ENDPOINT_REST_USER,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('calls get on restClient with expected parameters against staging', async () => {
            const requestMock = setupRestClientMock(DEFAULT_CURRENT_USER_RESPONSE)
            const stagingBaseUrl = 'https://api.todoist-staging.com'
            const api = getTarget(stagingBaseUrl)

            await api.getUser()

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith(
                'GET',
                getSyncBaseUri(stagingBaseUrl),
                ENDPOINT_REST_USER,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('handles user with null business account id', async () => {
            const responseWithNullBusinessAccount = {
                ...DEFAULT_CURRENT_USER_RESPONSE,
                businessAccountId: null,
            }
            setupRestClientMock(responseWithNullBusinessAccount)
            const api = getTarget()

            const actual = await api.getUser()

            expect(actual.businessAccountId).toBeNull()
        })

        test('handles user with null avatar fields', async () => {
            const responseWithNullAvatars = {
                ...DEFAULT_CURRENT_USER_RESPONSE,
                avatarBig: null,
                avatarMedium: null,
                avatarS640: null,
                avatarSmall: null,
            }
            setupRestClientMock(responseWithNullAvatars)
            const api = getTarget()

            const actual = await api.getUser()

            expect(actual.avatarBig).toBeNull()
            expect(actual.avatarMedium).toBeNull()
            expect(actual.avatarS640).toBeNull()
            expect(actual.avatarSmall).toBeNull()
        })

        test('handles user with tzInfo field', async () => {
            setupRestClientMock(DEFAULT_CURRENT_USER_RESPONSE)
            const api = getTarget()

            const actual = await api.getUser()

            expect(actual.tzInfo).toEqual({
                gmtString: '+02:00',
                hours: 2,
                isDst: 1,
                minutes: 0,
                timezone: 'Europe/Madrid',
            })
            expect(actual.tzInfo.timezone).toBe('Europe/Madrid')
        })
    })
})
