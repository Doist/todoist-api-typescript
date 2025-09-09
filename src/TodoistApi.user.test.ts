import { TodoistApi } from '.'
import { DEFAULT_AUTH_TOKEN } from './testUtils/testDefaults'
import { getSyncBaseUri, ENDPOINT_REST_USER } from './consts/endpoints'
import { setupRestClientMock } from './testUtils/mocks'
import { CurrentUser } from './types/entities'

function getTarget(baseUrl = 'https://api.todoist.com') {
    return new TodoistApi(DEFAULT_AUTH_TOKEN, baseUrl)
}

const DEFAULT_CURRENT_USER_RESPONSE = {
    id: '123456789',
    email: 'test.user@example.com',
    full_name: 'Test User',
    avatar_big: 'https://example.com/avatars/test_user_big.jpg',
    avatar_medium: 'https://example.com/avatars/test_user_medium.jpg',
    avatar_s640: 'https://example.com/avatars/test_user_s640.jpg',
    avatar_small: 'https://example.com/avatars/test_user_small.jpg',
    business_account_id: null,
    is_premium: true,
    date_format: 0,
    time_format: 0,
    weekly_goal: 100,
    daily_goal: 10,
    completed_count: 102920,
    completed_today: 12,
    karma: 86394.0,
    karma_trend: 'up',
    lang: 'en',
    next_week: 1,
    start_day: 1,
    start_page: 'project?id=test_project_123',
    timezone: 'Europe/Madrid',
    inbox_project_id: 'test_project_123',
    days_off: [6, 7],
    weekend_start_day: 6,
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
                business_account_id: null,
            }
            setupRestClientMock(responseWithNullBusinessAccount)
            const api = getTarget()

            const actual = await api.getUser()

            expect(actual.businessAccountId).toBeNull()
        })

        test('handles user with null avatar fields', async () => {
            const responseWithNullAvatars = {
                ...DEFAULT_CURRENT_USER_RESPONSE,
                avatar_big: null,
                avatar_medium: null,
                avatar_s640: null,
                avatar_small: null,
            }
            setupRestClientMock(responseWithNullAvatars)
            const api = getTarget()

            const actual = await api.getUser()

            expect(actual.avatarBig).toBeNull()
            expect(actual.avatarMedium).toBeNull()
            expect(actual.avatarS640).toBeNull()
            expect(actual.avatarSmall).toBeNull()
        })
    })
})
