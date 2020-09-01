export type AddTaskArgs = {
    content: string
    project_id?: number
    section_id?: number
    parent_id?: number
    order?: number
    label_ids?: number[]
    priority?: number
    due_string?: string
    due_lang?: string
    due_date?: string
    due_datetime?: string
    assignee?: number
}
