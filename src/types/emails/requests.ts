/** Object types that support email forwarding. */
export const EMAIL_OBJECT_TYPES = ['project', 'project_comments', 'task'] as const
/** Object type that supports email forwarding. */
export type EmailObjectType = (typeof EMAIL_OBJECT_TYPES)[number]

/**
 * Arguments for getting or creating an email forwarding address.
 * @see https://developer.todoist.com/api/v1/#tag/Emails/operation/email_get_or_create_api_v1_emails_put
 */
export type GetOrCreateEmailArgs = {
    /** The type of object to forward emails to. */
    objType: EmailObjectType
    /** The ID of the object. */
    objId: string
}

/**
 * Response from getting or creating an email forwarding address.
 */
export type GetOrCreateEmailResponse = {
    email: string
}

/**
 * Arguments for disabling email forwarding.
 * @see https://developer.todoist.com/api/v1/#tag/Emails/operation/email_disable_api_v1_emails_delete
 */
export type DisableEmailArgs = {
    /** The type of object to disable forwarding for. */
    objType: EmailObjectType
    /** The ID of the object. */
    objId: string
}
