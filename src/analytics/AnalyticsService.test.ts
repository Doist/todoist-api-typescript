import { AnalyticsService } from './AnalyticsService'
import Axios from 'axios'
jest.mock('axios')

const DEFAULT_ENDPOINT = 'https://someurl.com'
const DEFAULT_TRACKING_ID = 'SomeTrackingId'
const DEFAULT_CLIENT_ID = 'SomeRandomClientId'

const DEFAULT_CATEGORY = 'SOME_CATEGORY'
const DEFAULT_ACTION = 'SOME_ACTION'
const DEFAULT_LABEL = 'SOME_LABEL'

const DEFAULT_EVENT = {
    category: DEFAULT_CATEGORY,
    action: DEFAULT_ACTION,
}

const EVENT_WITH_LABEL = {
    ...DEFAULT_EVENT,
    label: DEFAULT_LABEL,
}

const setupAxiosMock = () => Axios as jest.Mocked<typeof Axios>

const getTarget = () => new AnalyticsService(DEFAULT_ENDPOINT, DEFAULT_TRACKING_ID)

describe('AnalyticsService', () => {
    const axiosMock = setupAxiosMock()

    test('trackEvents sends expected data for events', async () => {
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(DEFAULT_CLIENT_ID)

        const expectedPostData = `v=1&tid=${DEFAULT_TRACKING_ID}&cid=${DEFAULT_CLIENT_ID}&t=event&ec=${DEFAULT_CATEGORY}&ea=${DEFAULT_ACTION}\nv=1&tid=${DEFAULT_TRACKING_ID}&cid=${DEFAULT_CLIENT_ID}&t=event&ec=${DEFAULT_CATEGORY}&ea=${DEFAULT_ACTION}&el=${DEFAULT_LABEL}\n`

        const target = getTarget()

        await target.trackEvents([DEFAULT_EVENT, EVENT_WITH_LABEL])

        expect(axiosMock.post).toBeCalledTimes(1)
        expect(axiosMock.post).toBeCalledWith(DEFAULT_ENDPOINT, expectedPostData)
    })
})
