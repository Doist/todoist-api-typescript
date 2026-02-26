import { z } from 'zod'

export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY'
export type TimeFormat = '24h' | '12h'
export type DayOfWeek =
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday'

const DATE_FORMAT_FROM_API = { 0: 'DD/MM/YYYY', 1: 'MM/DD/YYYY' } as const
const TIME_FORMAT_FROM_API = { 0: '24h', 1: '12h' } as const
const DAY_OF_WEEK_FROM_API = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
} as const

export const DATE_FORMAT_TO_API: Record<DateFormat, 0 | 1> = {
    'DD/MM/YYYY': 0,
    'MM/DD/YYYY': 1,
}
export const TIME_FORMAT_TO_API: Record<TimeFormat, 0 | 1> = { '24h': 0, '12h': 1 }
export const DAY_OF_WEEK_TO_API: Record<DayOfWeek, 1 | 2 | 3 | 4 | 5 | 6 | 7> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
}

/** Zod read-schema: parse API 0/1 integer, emit boolean */
export const BooleanFromZeroOneSchema = z
    .union([z.literal(0), z.literal(1)])
    .transform((v) => v === 1)

/** Zod read-schemas: parse API numbers, emit descriptive strings */
export const DateFormatSchema = z
    .union([z.literal(0), z.literal(1)])
    .transform((v): DateFormat => DATE_FORMAT_FROM_API[v])

export const TimeFormatSchema = z
    .union([z.literal(0), z.literal(1)])
    .transform((v): TimeFormat => TIME_FORMAT_FROM_API[v])

export const DayOfWeekSchema = z
    .union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
        z.literal(7),
    ])
    .transform((v): DayOfWeek => DAY_OF_WEEK_FROM_API[v])
