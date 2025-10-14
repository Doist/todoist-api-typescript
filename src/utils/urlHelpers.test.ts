import { formatDateToYYYYMMDD, getTaskUrl, getProjectUrl, getSectionUrl } from './urlHelpers'

describe('formatDateToYYYYMMDD', () => {
    test('formats Date object to YYYY-MM-DD string', () => {
        const date = new Date('2025-01-15T10:30:00Z')
        expect(formatDateToYYYYMMDD(date)).toBe('2025-01-15')
    })

    test('pads month with leading zero', () => {
        const date = new Date('2025-03-05T00:00:00Z')
        expect(formatDateToYYYYMMDD(date)).toBe('2025-03-05')
    })

    test('pads day with leading zero', () => {
        const date = new Date('2025-12-07T00:00:00Z')
        expect(formatDateToYYYYMMDD(date)).toBe('2025-12-07')
    })

    test('handles end of month correctly', () => {
        const date = new Date('2025-02-28T23:59:59Z')
        expect(formatDateToYYYYMMDD(date)).toBe('2025-02-28')
    })

    test('handles leap year correctly', () => {
        const date = new Date('2024-02-29T12:00:00Z')
        expect(formatDateToYYYYMMDD(date)).toBe('2024-02-29')
    })

    test('uses local timezone for date components', () => {
        // Create a date using local timezone (not UTC)
        const date = new Date(2025, 0, 15, 23, 59, 59) // January 15, 2025, 23:59:59 local time
        const result = formatDateToYYYYMMDD(date)
        expect(result).toBe('2025-01-15')
    })
})

describe('getTaskUrl', () => {
    test('generates URL with task ID only', () => {
        expect(getTaskUrl('12345')).toBe('https://app.todoist.com/app/task/12345')
    })

    test('generates URL with task ID and content', () => {
        const url = getTaskUrl('12345', 'Buy groceries')
        expect(url).toBe('https://app.todoist.com/app/task/buy-groceries-12345')
    })
})

describe('getProjectUrl', () => {
    test('generates URL with project ID only', () => {
        expect(getProjectUrl('67890')).toBe('https://app.todoist.com/app/project/67890')
    })

    test('generates URL with project ID and name', () => {
        const url = getProjectUrl('67890', 'Work Project')
        expect(url).toBe('https://app.todoist.com/app/project/work-project-67890')
    })
})

describe('getSectionUrl', () => {
    test('generates URL with section ID only', () => {
        expect(getSectionUrl('11111')).toBe('https://app.todoist.com/app/section/11111')
    })

    test('generates URL with section ID and name', () => {
        const url = getSectionUrl('11111', 'To Do')
        expect(url).toBe('https://app.todoist.com/app/section/to-do-11111')
    })
})
