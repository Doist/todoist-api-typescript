import { TodoistApi, type CurrentUser, type ProductivityStats } from '.'
import { DEFAULT_AUTH_TOKEN } from './testUtils/testDefaults'
import { getSyncBaseUri, ENDPOINT_REST_USER, ENDPOINT_REST_PRODUCTIVITY } from './consts/endpoints'
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

const PRODUCTIVITY_STATS_RESPONSE: ProductivityStats = {
    completedCount: 42,
    daysItems: [
        {
            date: '2025-01-01',
            items: [],
            totalCompleted: 0,
        },
        {
            date: '2025-01-02',
            items: [{ completed: 2, id: 'dummy-id-1' }],
            totalCompleted: 2,
        },
    ],
    goals: {
        currentDailyStreak: { count: 3, end: '2025-01-02', start: '2025-01-01' },
        currentWeeklyStreak: { count: 1, end: '2025-01-02', start: '2025-01-01' },
        dailyGoal: 5,
        ignoreDays: [5, 6],
        karmaDisabled: 0,
        lastDailyStreak: { count: 2, end: '2025-01-01', start: '2024-12-31' },
        lastWeeklyStreak: { count: 1, end: '2024-12-31', start: '2024-12-25' },
        maxDailyStreak: { count: 4, end: '2024-12-20', start: '2024-12-17' },
        maxWeeklyStreak: { count: 2, end: '2024-12-10', start: '2024-12-03' },
        user: 'dummy-user',
        userId: 'dummy-user-id',
        vacationMode: 1,
        weeklyGoal: 10,
    },
    karma: 1234,
    karmaGraphData: [{ date: '2025-01-01', karmaAvg: 1000 }],
    karmaLastUpdate: 5,
    karmaTrend: 'down',
    karmaUpdateReasons: [
        {
            negativeKarma: 1,
            negativeKarmaReasons: ['reason1'],
            newKarma: 1234,
            positiveKarma: 2,
            positiveKarmaReasons: ['reasonA'],
            time: '2025-01-02T12:00:00.000Z',
        },
    ],
    projectColors: { 'dummy-project-id': 'blue' },
    weekItems: [
        {
            from: '2025-01-01',
            items: [{ completed: 3, id: 'dummy-id-2' }],
            to: '2025-01-07',
            totalCompleted: 3,
        },
    ],
}

describe('TodoistApi user endpoints', () => {
    describe('getUser', () => {
        test('calls get on restClient with expected parameters', async () => {
            const requestMock = setupRestClientMock(DEFAULT_CURRENT_USER_RESPONSE)
            const api = getTarget()

            await api.getUser()

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_USER,
                apiToken: DEFAULT_AUTH_TOKEN,
            })
        })

        test('calls get on restClient with expected parameters against staging', async () => {
            const requestMock = setupRestClientMock(DEFAULT_CURRENT_USER_RESPONSE)
            const stagingBaseUrl = 'https://api.todoist-staging.com'
            const api = getTarget(stagingBaseUrl)

            await api.getUser()

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(stagingBaseUrl),
                relativePath: ENDPOINT_REST_USER,
                apiToken: DEFAULT_AUTH_TOKEN,
            })
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

    describe('getProductivityStats', () => {
        test('calls get on expected url', async () => {
            const requestMock = setupRestClientMock(PRODUCTIVITY_STATS_RESPONSE)
            const api = getTarget()
            await api.getProductivityStats()
            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_PRODUCTIVITY,
                apiToken: DEFAULT_AUTH_TOKEN,
            })
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(PRODUCTIVITY_STATS_RESPONSE)
            const api = getTarget()
            const stats = await api.getProductivityStats()
            expect(stats).toEqual(PRODUCTIVITY_STATS_RESPONSE)
        })
    })
})
