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

const removeStyleFormatting = (input: string): string => {
    if (input.indexOf('!') === -1 && input.indexOf('*') === -1 && input.indexOf('_') === -1) {
        return input
    }

    const removeMarkdown = (match: string, prefix: string, text: string) => `${prefix}${text}`

    input = input.replace(BOLD_ITALIC_FORMAT, removeMarkdown)
    input = input.replace(BOLD_FORMAT, removeMarkdown)
    input = input.replace(ITALIC_FORMAT, removeMarkdown)

    return input
}

const removeCodeFormatting = (input: string): string => {
    const removeMarkdown = (match: string, text: string) => text

    input = input.replace(CODE_BLOCK_FORMAT, removeMarkdown)
    input = input.replace(CODE_INLINE_FORMAT, removeMarkdown)

    return input
}

const removeFakeSectionFormatting = (input: string): string => {
    if (input.startsWith(FAKE_SECTION_PREFIX)) {
        input = input.slice(FAKE_SECTION_PREFIX.length)
    }

    if (input.endsWith(FAKE_SECTION_SUFFIX)) {
        input = input.slice(0, input.length - FAKE_SECTION_SUFFIX.length)
    }

    return input
}

const removeMarkdownLinks = (input: string) => {
    if (input.indexOf('[') === -1 || input.indexOf(']') === -1) {
        return input
    }

    const removeMarkdown = (match: string, text: string) => text

    return input.replace(MARKDOWN_LINK, removeMarkdown)
}

const removeTodoistLinks = (input: string) => {
    if (input.indexOf('(') === -1 || input.indexOf(')') === -1) {
        return input
    }

    const removeMarkdown = (match: string, url: string, text: string) => text

    return input.replace(TODOIST_LINK, removeMarkdown)
}

const removeAppLinks = (input: string) => {
    if (input.indexOf('gmail') != -1) {
        input = input.replace(GMAIL_LINK, (match: string, id: string, text: string) => text)
    }

    if (input.indexOf('outlook') != -1) {
        input = input.replace(OUTLOOK_LINK, (match: string, id: string, text: string) => text)
    }

    if (input.indexOf('thunderbird') != -1) {
        input = input.replace(THUNDERBIRD_LINK, (match: string, text: string) => text)
    }

    return input
}

export const getSanitizedContent = (input: string): string => {
    input = removeStyleFormatting(input)
    input = removeCodeFormatting(input)
    input = removeFakeSectionFormatting(input)
    input = removeMarkdownLinks(input)
    input = removeTodoistLinks(input)
    input = removeAppLinks(input)

    return input
}

export const getSanitizedTasks = (tasks: Task[]): TaskWithSanitizedContent[] =>
    tasks.map((task) => ({ ...task, sanitizedContent: getSanitizedContent(task.content) }))
