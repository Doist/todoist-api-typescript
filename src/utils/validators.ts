import {
    AttachmentSchema,
    SectionSchema,
    LabelSchema,
    CommentSchema,
    UserSchema,
    CurrentUserSchema,
    TaskSchema,
    type Attachment,
    type Task,
    type Section,
    type Label,
    type Comment,
    type User,
    type CurrentUser,
    type ProductivityStats,
    PersonalProjectSchema,
    WorkspaceProjectSchema,
    type WorkspaceProject,
    type PersonalProject,
    ProductivityStatsSchema,
    ActivityEventSchema,
    type ActivityEvent,
    WorkspaceUserSchema,
    type WorkspaceUser,
    WorkspaceInvitationSchema,
    type WorkspaceInvitation,
    WorkspacePlanDetailsSchema,
    type WorkspacePlanDetails,
    JoinWorkspaceResultSchema,
    type JoinWorkspaceResult,
    WorkspaceSchema,
    type Workspace,
} from '../types/entities'

import {
    FilterSchema,
    type Filter,
    CollaboratorSchema,
    type Collaborator,
    CollaboratorStateSchema,
    type CollaboratorState,
    FolderSchema,
    type Folder,
    NoteSchema,
    type Note,
    TooltipsSchema,
    type Tooltips,
    WorkspaceFilterSchema,
    type WorkspaceFilter,
    WorkspaceGoalSchema,
    type WorkspaceGoal,
    CalendarSchema,
    type Calendar,
    CalendarAccountSchema,
    type CalendarAccount,
    ReminderSchema,
    type Reminder,
    CompletedInfoSchema,
    type CompletedInfo,
    ViewOptionsSchema,
    type ViewOptions,
    ProjectViewOptionsDefaultsSchema,
    type ProjectViewOptionsDefaults,
    UserPlanLimitsSchema,
    type UserPlanLimits,
    LiveNotificationSchema,
    type LiveNotification,
    SyncWorkspaceSchema,
    type SyncWorkspace,
} from '../types/sync/resources'

export function validateTask(input: unknown): Task {
    return TaskSchema.parse(input)
}

export function validateTaskArray(input: unknown[]): Task[] {
    return input.map(validateTask)
}

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

export function validateSection(input: unknown): Section {
    return SectionSchema.parse(input)
}

export function validateSectionArray(input: unknown[]): Section[] {
    return input.map(validateSection)
}

export function validateLabel(input: unknown): Label {
    return LabelSchema.parse(input)
}

export function validateLabelArray(input: unknown[]): Label[] {
    return input.map(validateLabel)
}

export function validateComment(input: unknown): Comment {
    return CommentSchema.parse(input)
}

export function validateCommentArray(input: unknown[]): Comment[] {
    return input.map(validateComment)
}

export function validateUser(input: unknown): User {
    return UserSchema.parse(input)
}

export function validateUserArray(input: unknown[]): User[] {
    return input.map(validateUser)
}

export function validateProductivityStats(input: unknown): ProductivityStats {
    return ProductivityStatsSchema.parse(input)
}

export function validateCurrentUser(input: unknown): CurrentUser {
    return CurrentUserSchema.parse(input)
}

export function validateActivityEvent(input: unknown): ActivityEvent {
    return ActivityEventSchema.parse(input)
}

export function validateActivityEventArray(input: unknown[]): ActivityEvent[] {
    return input.map(validateActivityEvent)
}

export function validateAttachment(input: unknown): Attachment {
    return AttachmentSchema.parse(input)
}

export function validateWorkspaceUser(input: unknown): WorkspaceUser {
    return WorkspaceUserSchema.parse(input)
}

export function validateWorkspaceUserArray(input: unknown): WorkspaceUser[] {
    if (!Array.isArray(input)) {
        throw new Error(`Expected array for workspace users, got ${typeof input}`)
    }
    return input.map(validateWorkspaceUser)
}

export function validateWorkspaceInvitation(input: unknown): WorkspaceInvitation {
    return WorkspaceInvitationSchema.parse(input)
}

export function validateWorkspaceInvitationArray(input: unknown[]): WorkspaceInvitation[] {
    return input.map(validateWorkspaceInvitation)
}

export function validateWorkspacePlanDetails(input: unknown): WorkspacePlanDetails {
    return WorkspacePlanDetailsSchema.parse(input)
}

export function validateJoinWorkspaceResult(input: unknown): JoinWorkspaceResult {
    return JoinWorkspaceResultSchema.parse(input)
}

export function validateWorkspace(input: unknown): Workspace {
    return WorkspaceSchema.parse(input)
}

export function validateWorkspaceArray(input: unknown[]): Workspace[] {
    return input.map(validateWorkspace)
}

// Sync resource validators

export function validateFilter(input: unknown): Filter {
    return FilterSchema.parse(input)
}

export function validateFilterArray(input: unknown[]): Filter[] {
    return input.map(validateFilter)
}

export function validateCollaborator(input: unknown): Collaborator {
    return CollaboratorSchema.parse(input)
}

export function validateCollaboratorArray(input: unknown[]): Collaborator[] {
    return input.map(validateCollaborator)
}

export function validateCollaboratorState(input: unknown): CollaboratorState {
    return CollaboratorStateSchema.parse(input)
}

export function validateCollaboratorStateArray(input: unknown[]): CollaboratorState[] {
    return input.map(validateCollaboratorState)
}

export function validateFolder(input: unknown): Folder {
    return FolderSchema.parse(input)
}

export function validateFolderArray(input: unknown[]): Folder[] {
    return input.map(validateFolder)
}

export function validateNote(input: unknown): Note {
    return NoteSchema.parse(input)
}

export function validateNoteArray(input: unknown[]): Note[] {
    return input.map(validateNote)
}

export function validateTooltips(input: unknown): Tooltips {
    return TooltipsSchema.parse(input)
}

export function validateWorkspaceFilter(input: unknown): WorkspaceFilter {
    return WorkspaceFilterSchema.parse(input)
}

export function validateWorkspaceFilterArray(input: unknown[]): WorkspaceFilter[] {
    return input.map(validateWorkspaceFilter)
}

export function validateWorkspaceGoal(input: unknown): WorkspaceGoal {
    return WorkspaceGoalSchema.parse(input)
}

export function validateWorkspaceGoalArray(input: unknown[]): WorkspaceGoal[] {
    return input.map(validateWorkspaceGoal)
}

export function validateCalendar(input: unknown): Calendar {
    return CalendarSchema.parse(input)
}

export function validateCalendarArray(input: unknown[]): Calendar[] {
    return input.map(validateCalendar)
}

export function validateCalendarAccount(input: unknown): CalendarAccount {
    return CalendarAccountSchema.parse(input)
}

export function validateCalendarAccountArray(input: unknown[]): CalendarAccount[] {
    return input.map(validateCalendarAccount)
}

export function validateReminder(input: unknown): Reminder {
    return ReminderSchema.parse(input)
}

export function validateReminderArray(input: unknown[]): Reminder[] {
    return input.map(validateReminder)
}

export function validateCompletedInfo(input: unknown): CompletedInfo {
    return CompletedInfoSchema.parse(input)
}

export function validateCompletedInfoArray(input: unknown[]): CompletedInfo[] {
    return input.map(validateCompletedInfo)
}

export function validateViewOptions(input: unknown): ViewOptions {
    return ViewOptionsSchema.parse(input)
}

export function validateViewOptionsArray(input: unknown[]): ViewOptions[] {
    return input.map(validateViewOptions)
}

export function validateProjectViewOptionsDefaults(input: unknown): ProjectViewOptionsDefaults {
    return ProjectViewOptionsDefaultsSchema.parse(input)
}

export function validateProjectViewOptionsDefaultsArray(
    input: unknown[],
): ProjectViewOptionsDefaults[] {
    return input.map(validateProjectViewOptionsDefaults)
}

export function validateUserPlanLimits(input: unknown): UserPlanLimits {
    return UserPlanLimitsSchema.parse(input)
}

export function validateLiveNotification(input: unknown): LiveNotification {
    return LiveNotificationSchema.parse(input)
}

export function validateLiveNotificationArray(input: unknown[]): LiveNotification[] {
    return input.map(validateLiveNotification)
}

export function validateSyncWorkspace(input: unknown): SyncWorkspace {
    return SyncWorkspaceSchema.parse(input)
}

export function validateSyncWorkspaceArray(input: unknown[]): SyncWorkspace[] {
    return input.map(validateSyncWorkspace)
}
