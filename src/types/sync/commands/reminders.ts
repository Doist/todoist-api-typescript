import type { SyncDueDate, ReminderService } from './shared'
import type { LocationTrigger } from '../resources/reminders'

export type ReminderAddArgs =
    | {
          type: 'absolute'
          itemId: string
          service?: ReminderService
          notifyUid?: string
          due?: SyncDueDate
      }
    | {
          type: 'relative'
          itemId: string
          service?: ReminderService
          notifyUid?: string
          minuteOffset?: number
          due?: SyncDueDate
      }
    | {
          type: 'location'
          itemId: string
          name: string
          locLat: string
          locLong: string
          radius?: number
          locTrigger?: LocationTrigger
          notifyUid?: string
      }

export type ReminderUpdateArgs =
    | {
          id: string
          type: 'absolute'
          service?: ReminderService
          notifyUid?: string
          due?: SyncDueDate
      }
    | {
          id: string
          type: 'relative'
          service?: ReminderService
          notifyUid?: string
          minuteOffset?: number
          due?: SyncDueDate
      }
    | {
          id: string
          type: 'location'
          name?: string
          locLat?: string
          locLong?: string
          radius?: number
          locTrigger?: LocationTrigger
          notifyUid?: string
      }

export type ReminderDeleteArgs = {
    id: string
}
