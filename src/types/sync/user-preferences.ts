import { z } from 'zod'

/** Available date format options. */
export const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY'] as const
/** User date format preference. */
export type DateFormat = (typeof DATE_FORMATS)[number]

/** Available time format options. */
export const TIME_FORMATS = ['24h', '12h'] as const
/** User time format preference. */
export type TimeFormat = (typeof TIME_FORMATS)[number]

/** Available days of the week. */
export const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
] as const
/** Day of the week. */
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number]

export const DATE_FORMAT_FROM_API: Record<0 | 1, DateFormat> = { 0: 'DD/MM/YYYY', 1: 'MM/DD/YYYY' }
export const TIME_FORMAT_FROM_API: Record<0 | 1, TimeFormat> = { 0: '24h', 1: '12h' }
export const DAY_OF_WEEK_FROM_API: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, DayOfWeek> = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
}

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
