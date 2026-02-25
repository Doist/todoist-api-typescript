import type { SyncDueDate, ReminderService } from './shared'

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
          locTrigger?: 'on_enter' | 'on_leave'
          notifyUid?: string
      }

export type ReminderDeleteArgs = {
    id: string
}
