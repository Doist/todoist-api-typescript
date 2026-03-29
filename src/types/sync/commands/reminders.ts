import type { SyncDueDate, ReminderService } from './shared'
import type { LocationTrigger, ReminderType } from '../resources/reminders'

export type ReminderAddArgs =
    | {
          type: Extract<ReminderType, 'absolute'>
          itemId: string
          service?: ReminderService
          notifyUid?: string
          due?: SyncDueDate
      }
    | {
          type: Extract<ReminderType, 'relative'>
          itemId: string
          service?: ReminderService
          notifyUid?: string
          minuteOffset?: number
          due?: SyncDueDate
      }
    | {
          type: Extract<ReminderType, 'location'>
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
          type: Extract<ReminderType, 'absolute'>
          service?: ReminderService
          notifyUid?: string
          due?: SyncDueDate
      }
    | {
          id: string
          type: Extract<ReminderType, 'relative'>
          service?: ReminderService
          notifyUid?: string
          minuteOffset?: number
          due?: SyncDueDate
      }
    | {
          id: string
          type: Extract<ReminderType, 'location'>
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
