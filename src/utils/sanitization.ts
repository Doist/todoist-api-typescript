import { Task } from '../types'

const BOLD_FORMAT = /(^|[\s!?,;>:]+)(?:\*\*|__|!!)(.+?)(\*\*|__|!!)(?=$|[\s!?,;><:]+)/gi
const ITALIC_FORMAT = /(^|[\s!?,;>:]+)(?:\*|_|!)(.+?)(\*|_|!)(?=$|[\s!?,;><:]+)/gi
const BOLD_ITALIC_FORMAT = /(^|[\s!?,;>:]+)(?:\*\*\*|___|!!!)(.+?)(\*\*\*|___|!!!)(?=$|[\s!?,;><:]+)/gi
const CODE_BLOCK_FORMAT = /```([\s\S]*?)```/gi
const CODE_INLINE_FORMAT = /`([^`]+)`/gi

const TODOIST_LINK = /((?:(?:onenote:)?[\w-]+):\/\/[^\s]+)\s+[[(]([^)]+)[\])]/gi
const MARKDOWN_LINK = /\[(.+?)\]\((.+?)\)/gi
const GMAIL_LINK = /\[\[gmail=(.+?),\s*(.+?)\]\]/gi
const OUTLOOK_LINK = /\[\[outlook=(.+?),\s*(.+?)\]\]/gi
const THUNDERBIRD_LINK = /\[\[thunderbird\n(.+)\n(.+)\n\s*\]\]/gi

const FAKE_SECTION_PREFIX = '* '
const FAKE_SECTION_SUFFIX = ':'

export type TaskWithSanitizedContent = Task & {
    sanitizedContent: string
}

function removeStyleFormatting(input: string): string {
    if (!input.includes('!') && !input.includes('*') && !input.includes('_')) {
        return input
    }

    function removeMarkdown(match: string, prefix: string, text: string) {
        return `${prefix}${text}`
    }

    input = input.replace(BOLD_ITALIC_FORMAT, removeMarkdown)
    input = input.replace(BOLD_FORMAT, removeMarkdown)
    input = input.replace(ITALIC_FORMAT, removeMarkdown)

    return input
}

function removeCodeFormatting(input: string): string {
    function removeMarkdown(match: string, text: string) {
        return text
    }

    input = input.replace(CODE_BLOCK_FORMAT, removeMarkdown)
    input = input.replace(CODE_INLINE_FORMAT, removeMarkdown)

    return input
}

function removeFakeSectionFormatting(input: string): string {
    if (input.startsWith(FAKE_SECTION_PREFIX)) {
        input = input.slice(FAKE_SECTION_PREFIX.length)
    }

    if (input.endsWith(FAKE_SECTION_SUFFIX)) {
        input = input.slice(0, input.length - FAKE_SECTION_SUFFIX.length)
    }

    return input
}

function removeMarkdownLinks(input: string) {
    if (!input.includes('[') || !input.includes(']')) {
        return input
    }

    function removeMarkdown(match: string, text: string) {
        return text
    }

    return input.replace(MARKDOWN_LINK, removeMarkdown)
}

function removeTodoistLinks(input: string) {
    if (!input.includes('(') || !input.includes(')')) {
        return input
    }

    function removeMarkdown(match: string, url: string, text: string) {
        return text
    }

    return input.replace(TODOIST_LINK, removeMarkdown)
}

function removeAppLinks(input: string) {
    if (input.includes('gmail')) {
        input = input.replace(GMAIL_LINK, (match: string, id: string, text: string) => text)
    }

    if (input.includes('outlook')) {
        input = input.replace(OUTLOOK_LINK, (match: string, id: string, text: string) => text)
    }

    if (input.includes('thunderbird')) {
        input = input.replace(THUNDERBIRD_LINK, (match: string, text: string) => text)
    }

    return input
}

export function getSanitizedContent(input: string): string {
    input = removeStyleFormatting(input)
    input = removeCodeFormatting(input)
    input = removeFakeSectionFormatting(input)
    input = removeMarkdownLinks(input)
    input = removeTodoistLinks(input)
    input = removeAppLinks(input)

    return input
}

export function getSanitizedTasks(tasks: Task[]): TaskWithSanitizedContent[] {
    return tasks.map((task) => ({ ...task, sanitizedContent: getSanitizedContent(task.content) }))
}
