import Axios from 'axios'
import { AnalyticsEvent } from './events'
import { createId } from '../utils/uuidGenerator'

const GOOGLE_ANALYTICS_URI = 'https://www.google-analytics.com/batch'
const CLIENT_ID_STORAGE_KEY = 'AnalyticsClientId'

export class AnalyticsService {
    private readonly clientId: string

    constructor(private trackingId: string) {
        this.clientId = this.getClientId()
    }

    trackEvents = async (events: AnalyticsEvent[]): Promise<void> => {
        const postData = events.reduce((previous, event) => previous + this.getEventData(event), '')

        await Axios.post(GOOGLE_ANALYTICS_URI, postData)
    }

    private getEventData = (event: AnalyticsEvent): string => {
        const labelData = event.label ? `&el=${event.label}` : ''
        return `v=1&tid=${this.trackingId}&cid=${this.clientId}&t=event&ec=${event.category}&ea=${event.action}${labelData}\n`
    }

    private getClientId = (): string => {
        let clientId = localStorage.getItem(CLIENT_ID_STORAGE_KEY)

        if (!clientId) {
            clientId = createId()
            localStorage.setItem(CLIENT_ID_STORAGE_KEY, clientId)
        }

        return clientId
    }
}
