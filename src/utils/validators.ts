import { z, type ZodType } from 'zod'

import { ActivityEventSchema } from '../types/activity/types'
import { BackupSchema } from '../types/backups/types'
import { AttachmentSchema, CommentSchema } from '../types/comments/types'
import { IdMappingSchema, MovedIdSchema } from '../types/id-mappings/types'
import {
    ProjectActivityStatsSchema,
    ProjectHealthSchema,
    ProjectHealthContextSchema,
    ProjectProgressSchema,
    WorkspaceInsightsSchema,
} from '../types/insights/types'
import { LabelSchema } from '../types/labels/types'
import { ProductivityStatsSchema } from '../types/productivity/types'
import { WorkspaceProjectSchema, ProjectSchema, type Project } from '../types/projects/types'
import { SectionSchema } from '../types/sections/types'
import { type SyncResponse, SyncResponseSchema } from '../types/sync/response'
import { TaskSchema } from '../types/tasks/types'
import { UserSchema, CurrentUserSchema } from '../types/users/types'
import {
    WorkspaceUserSchema,
    WorkspaceInvitationSchema,
    WorkspacePlanDetailsSchema,
    JoinWorkspaceResultSchema,
    WorkspaceSchema,
    MemberActivityInfoSchema,
    WorkspaceUserTaskSchema,
} from '../types/workspaces/types'

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
    LocationReminderSchema,
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

function createArrayValidator<T>(schema: ZodType<T>): (input: unknown) => T[] {
    return (input: unknown): T[] => z.array(schema).parse(input)
}

// Entity validators

export const validateTask = createValidator(TaskSchema)
export const validateTaskArray = createArrayValidator(TaskSchema)

/**
 * Validates and parses a project input.
 * @param input The input to validate
 * @returns A validated project (either PersonalProject or WorkspaceProject)
 */
export const validateProject: (input: unknown) => Project = createValidator(ProjectSchema)
export const validateProjectArray = createArrayValidator(ProjectSchema)

export const validateWorkspaceProject = createValidator(WorkspaceProjectSchema)
export const validateWorkspaceProjectArray = createArrayValidator(WorkspaceProjectSchema)

export const validateSection = createValidator(SectionSchema)
export const validateSectionArray = createArrayValidator(SectionSchema)

export const validateLabel = createValidator(LabelSchema)
export const validateLabelArray = createArrayValidator(LabelSchema)

export const validateComment = createValidator(CommentSchema)
export const validateCommentArray = createArrayValidator(CommentSchema)

export const validateUser = createValidator(UserSchema)
export const validateUserArray = createArrayValidator(UserSchema)

export const validateProductivityStats = createValidator(ProductivityStatsSchema)

export const validateCurrentUser = createValidator(CurrentUserSchema)

export const validateActivityEvent = createValidator(ActivityEventSchema)
export const validateActivityEventArray = createArrayValidator(ActivityEventSchema)

export const validateAttachment = createValidator(AttachmentSchema)

export const validateWorkspaceUser = createValidator(WorkspaceUserSchema)

export const validateWorkspaceUserArray = createArrayValidator(WorkspaceUserSchema)

export const validateWorkspaceInvitation = createValidator(WorkspaceInvitationSchema)
export const validateWorkspaceInvitationArray = createArrayValidator(WorkspaceInvitationSchema)

export const validateWorkspacePlanDetails = createValidator(WorkspacePlanDetailsSchema)

export const validateJoinWorkspaceResult = createValidator(JoinWorkspaceResultSchema)

export const validateWorkspace = createValidator(WorkspaceSchema)
export const validateWorkspaceArray = createArrayValidator(WorkspaceSchema)

export const validateMemberActivityInfo = createValidator(MemberActivityInfoSchema)
export const validateMemberActivityInfoArray = createArrayValidator(MemberActivityInfoSchema)

export const validateWorkspaceUserTask = createValidator(WorkspaceUserTaskSchema)
export const validateWorkspaceUserTaskArray = createArrayValidator(WorkspaceUserTaskSchema)

export const validateProjectActivityStats = createValidator(ProjectActivityStatsSchema)
export const validateProjectHealth = createValidator(ProjectHealthSchema)
export const validateProjectHealthContext = createValidator(ProjectHealthContextSchema)
export const validateProjectProgress = createValidator(ProjectProgressSchema)
export const validateWorkspaceInsights = createValidator(WorkspaceInsightsSchema)

export const validateBackup = createValidator(BackupSchema)
export const validateBackupArray = createArrayValidator(BackupSchema)

export const validateIdMapping = createValidator(IdMappingSchema)
export const validateIdMappingArray = createArrayValidator(IdMappingSchema)

export const validateMovedId = createValidator(MovedIdSchema)
export const validateMovedIdArray = createArrayValidator(MovedIdSchema)

// Sync resource validators

export const validateFilter = createValidator(FilterSchema)
export const validateFilterArray = createArrayValidator(FilterSchema)

export const validateCollaborator = createValidator(CollaboratorSchema)
export const validateCollaboratorArray = createArrayValidator(CollaboratorSchema)

export const validateCollaboratorState = createValidator(CollaboratorStateSchema)
export const validateCollaboratorStateArray = createArrayValidator(CollaboratorStateSchema)

export const validateFolder = createValidator(FolderSchema)
export const validateFolderArray = createArrayValidator(FolderSchema)

export const validateNote = createValidator(NoteSchema)
export const validateNoteArray = createArrayValidator(NoteSchema)

export const validateTooltips = createValidator(TooltipsSchema)

export const validateWorkspaceFilter = createValidator(WorkspaceFilterSchema)
export const validateWorkspaceFilterArray = createArrayValidator(WorkspaceFilterSchema)

export const validateWorkspaceGoal = createValidator(WorkspaceGoalSchema)
export const validateWorkspaceGoalArray = createArrayValidator(WorkspaceGoalSchema)

export const validateCalendar = createValidator(CalendarSchema)
export const validateCalendarArray = createArrayValidator(CalendarSchema)

export const validateCalendarAccount = createValidator(CalendarAccountSchema)
export const validateCalendarAccountArray = createArrayValidator(CalendarAccountSchema)

export const validateReminder = createValidator(ReminderSchema)
export const validateReminderArray = createArrayValidator(ReminderSchema)

export const validateLocationReminder = createValidator(LocationReminderSchema)
export const validateLocationReminderArray = createArrayValidator(LocationReminderSchema)

export const validateCompletedInfo = createValidator(CompletedInfoSchema)
export const validateCompletedInfoArray = createArrayValidator(CompletedInfoSchema)

export const validateViewOptions = createValidator(ViewOptionsSchema)
export const validateViewOptionsArray = createArrayValidator(ViewOptionsSchema)

export const validateProjectViewOptionsDefaults = createValidator(ProjectViewOptionsDefaultsSchema)
export const validateProjectViewOptionsDefaultsArray = createArrayValidator(
    ProjectViewOptionsDefaultsSchema,
)

export const validateUserPlanLimits = createValidator(UserPlanLimitsSchema)

export const validateLiveNotification = createValidator(LiveNotificationSchema)
export const validateLiveNotificationArray = createArrayValidator(LiveNotificationSchema)

export const validateSyncWorkspace = createValidator(SyncWorkspaceSchema)
export const validateSyncWorkspaceArray = createArrayValidator(SyncWorkspaceSchema)

export const validateSyncUser = createValidator(SyncUserSchema)

export const validateUserSettings = createValidator(UserSettingsSchema)

export const validateSuggestion = createValidator(SuggestionSchema)
export const validateSuggestionArray = createArrayValidator(SuggestionSchema)

export function parseSyncResponse(raw: Record<string, unknown>): SyncResponse {
    return SyncResponseSchema.parse(raw)
}
