import { type ZodType } from 'zod'

import {
    AttachmentSchema,
    SectionSchema,
    LabelSchema,
    CommentSchema,
    UserSchema,
    CurrentUserSchema,
    TaskSchema,
    PersonalProjectSchema,
    WorkspaceProjectSchema,
    type WorkspaceProject,
    type PersonalProject,
    ProductivityStatsSchema,
    ActivityEventSchema,
    WorkspaceUserSchema,
    type WorkspaceUser,
    WorkspaceInvitationSchema,
    WorkspacePlanDetailsSchema,
    JoinWorkspaceResultSchema,
    WorkspaceSchema,
} from '../types/entities'

import {
    FilterSchema,
    CollaboratorSchema,
    CollaboratorStateSchema,
    FolderSchema,
    NoteSchema,
    TooltipsSchema,
    WorkspaceFilterSchema,
    WorkspaceGoalSchema,
    CalendarSchema,
    CalendarAccountSchema,
    ReminderSchema,
    CompletedInfoSchema,
    ViewOptionsSchema,
    ProjectViewOptionsDefaultsSchema,
    UserPlanLimitsSchema,
    LiveNotificationSchema,
    SyncWorkspaceSchema,
    SyncUserSchema,
    UserSettingsSchema,
    SuggestionSchema,
} from '../types/sync/resources'

function createValidator<T>(schema: ZodType<T>): (input: unknown) => T {
    return (input: unknown): T => schema.parse(input)
}

function createArrayValidator<T>(validateItem: (input: unknown) => T): (input: unknown[]) => T[] {
    return (input: unknown[]): T[] => input.map(validateItem)
}

// Entity validators

export const validateTask = createValidator(TaskSchema)
export const validateTaskArray = createArrayValidator(validateTask)

/**
 * Type guard to check if a project is a workspace project.
 * @param project The project to check
 * @returns True if the project is a workspace project
 */
export function isWorkspaceProject(
    project: PersonalProject | WorkspaceProject,
): project is WorkspaceProject {
    return 'workspaceId' in project
}

/**
 * Type guard to check if a project is a personal project.
 * @param project The project to check
 * @returns True if the project is a personal project
 */
export function isPersonalProject(
    project: PersonalProject | WorkspaceProject,
): project is PersonalProject {
    return !isWorkspaceProject(project)
}

/**
 * Validates and parses a project input.
 * @param input The input to validate
 * @returns A validated project (either PersonalProject or WorkspaceProject)
 */
export function validateProject(input: unknown): PersonalProject | WorkspaceProject {
    if ('workspaceId' in (input as WorkspaceProject)) {
        return WorkspaceProjectSchema.parse(input)
    }
    return PersonalProjectSchema.parse(input)
}

export function validateProjectArray(input: unknown[]): (PersonalProject | WorkspaceProject)[] {
    return input.map(validateProject)
}

export const validateSection = createValidator(SectionSchema)
export const validateSectionArray = createArrayValidator(validateSection)

export const validateLabel = createValidator(LabelSchema)
export const validateLabelArray = createArrayValidator(validateLabel)

export const validateComment = createValidator(CommentSchema)
export const validateCommentArray = createArrayValidator(validateComment)

export const validateUser = createValidator(UserSchema)
export const validateUserArray = createArrayValidator(validateUser)

export const validateProductivityStats = createValidator(ProductivityStatsSchema)

export const validateCurrentUser = createValidator(CurrentUserSchema)

export const validateActivityEvent = createValidator(ActivityEventSchema)
export const validateActivityEventArray = createArrayValidator(validateActivityEvent)

export const validateAttachment = createValidator(AttachmentSchema)

export const validateWorkspaceUser = createValidator(WorkspaceUserSchema)

export function validateWorkspaceUserArray(input: unknown): WorkspaceUser[] {
    if (!Array.isArray(input)) {
        throw new Error(`Expected array for workspace users, got ${typeof input}`)
    }
    return input.map(validateWorkspaceUser)
}

export const validateWorkspaceInvitation = createValidator(WorkspaceInvitationSchema)
export const validateWorkspaceInvitationArray = createArrayValidator(validateWorkspaceInvitation)

export const validateWorkspacePlanDetails = createValidator(WorkspacePlanDetailsSchema)

export const validateJoinWorkspaceResult = createValidator(JoinWorkspaceResultSchema)

export const validateWorkspace = createValidator(WorkspaceSchema)
export const validateWorkspaceArray = createArrayValidator(validateWorkspace)

// Sync resource validators

export const validateFilter = createValidator(FilterSchema)
export const validateFilterArray = createArrayValidator(validateFilter)

export const validateCollaborator = createValidator(CollaboratorSchema)
export const validateCollaboratorArray = createArrayValidator(validateCollaborator)

export const validateCollaboratorState = createValidator(CollaboratorStateSchema)
export const validateCollaboratorStateArray = createArrayValidator(validateCollaboratorState)

export const validateFolder = createValidator(FolderSchema)
export const validateFolderArray = createArrayValidator(validateFolder)

export const validateNote = createValidator(NoteSchema)
export const validateNoteArray = createArrayValidator(validateNote)

export const validateTooltips = createValidator(TooltipsSchema)

export const validateWorkspaceFilter = createValidator(WorkspaceFilterSchema)
export const validateWorkspaceFilterArray = createArrayValidator(validateWorkspaceFilter)

export const validateWorkspaceGoal = createValidator(WorkspaceGoalSchema)
export const validateWorkspaceGoalArray = createArrayValidator(validateWorkspaceGoal)

export const validateCalendar = createValidator(CalendarSchema)
export const validateCalendarArray = createArrayValidator(validateCalendar)

export const validateCalendarAccount = createValidator(CalendarAccountSchema)
export const validateCalendarAccountArray = createArrayValidator(validateCalendarAccount)

export const validateReminder = createValidator(ReminderSchema)
export const validateReminderArray = createArrayValidator(validateReminder)

export const validateCompletedInfo = createValidator(CompletedInfoSchema)
export const validateCompletedInfoArray = createArrayValidator(validateCompletedInfo)

export const validateViewOptions = createValidator(ViewOptionsSchema)
export const validateViewOptionsArray = createArrayValidator(validateViewOptions)

export const validateProjectViewOptionsDefaults = createValidator(ProjectViewOptionsDefaultsSchema)
export const validateProjectViewOptionsDefaultsArray = createArrayValidator(
    validateProjectViewOptionsDefaults,
)

export const validateUserPlanLimits = createValidator(UserPlanLimitsSchema)

export const validateLiveNotification = createValidator(LiveNotificationSchema)
export const validateLiveNotificationArray = createArrayValidator(validateLiveNotification)

export const validateSyncWorkspace = createValidator(SyncWorkspaceSchema)
export const validateSyncWorkspaceArray = createArrayValidator(validateSyncWorkspace)

export const validateSyncUser = createValidator(SyncUserSchema)

export const validateUserSettings = createValidator(UserSettingsSchema)

export const validateSuggestion = createValidator(SuggestionSchema)
export const validateSuggestionArray = createArrayValidator(validateSuggestion)
