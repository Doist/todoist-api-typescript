import { TodoistApi } from './TodoistApi'
import { setupRestClientMock } from './testUtils/mocks'
import { getSyncBaseUri } from './consts/endpoints'
import { uploadMultipartFile } from './utils/multipartUpload'

// Mock the multipart upload helper
jest.mock('./utils/multipartUpload')
const mockedUploadMultipartFile = uploadMultipartFile as jest.MockedFunction<
    typeof uploadMultipartFile
>

describe('TodoistApi workspaces', () => {
    const api = new TodoistApi('token')

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('getWorkspaceInvitations', () => {
        test('gets workspace invitations', async () => {
            const mockResponse = ['user1@example.com', 'user2@example.com']
            const requestMock = setupRestClientMock(mockResponse)

            const result = await api.getWorkspaceInvitations({ workspaceId: 123 })

            expect(requestMock).toHaveBeenCalledWith(
                'GET',
                getSyncBaseUri(),
                'workspaces/invitations',
                'token',
                undefined,
                undefined,
                false,
                undefined,
                { workspace_id: 123 },
            )
            expect(result).toEqual(mockResponse)
        })

        test('gets workspace invitations with requestId', async () => {
            const mockResponse = ['user@example.com']
            const requestMock = setupRestClientMock(mockResponse)
            const requestId = 'test-request'

            await api.getWorkspaceInvitations({ workspaceId: 456 }, requestId)

            expect(requestMock).toHaveBeenCalledWith(
                'GET',
                getSyncBaseUri(),
                'workspaces/invitations',
                'token',
                undefined,
                requestId,
                false,
                undefined,
                { workspace_id: 456 },
            )
        })
    })

    describe('getAllWorkspaceInvitations', () => {
        test('gets all workspace invitations', async () => {
            const mockResponse = ['admin@example.com']
            const requestMock = setupRestClientMock(mockResponse)

            const result = await api.getAllWorkspaceInvitations()

            expect(requestMock).toHaveBeenCalledWith(
                'GET',
                getSyncBaseUri(),
                'workspaces/invitations/all',
                'token',
                undefined,
                undefined,
            )
            expect(result).toEqual(mockResponse)
        })

        test('gets all workspace invitations with requestId', async () => {
            const requestMock = setupRestClientMock([])
            const requestId = 'admin-request'

            await api.getAllWorkspaceInvitations({}, requestId)

            expect(requestMock).toHaveBeenCalledWith(
                'GET',
                getSyncBaseUri(),
                'workspaces/invitations/all',
                'token',
                undefined,
                requestId,
            )
        })
    })

    describe('deleteWorkspaceInvitation', () => {
        const mockInvitation = {
            id: '123',
            inviterId: '456',
            userEmail: 'user@example.com',
            workspaceId: '789',
            role: 'MEMBER' as const,
            isExistingUser: false,
        }

        test('deletes workspace invitation', async () => {
            const requestMock = setupRestClientMock(mockInvitation)

            const result = await api.deleteWorkspaceInvitation({
                workspaceId: 789,
                userEmail: 'user@example.com',
            })

            expect(requestMock).toHaveBeenCalledWith(
                'POST',
                getSyncBaseUri(),
                'workspaces/invitations/delete',
                'token',
                {
                    workspace_id: 789,
                    user_email: 'user@example.com',
                },
                undefined,
            )
            expect(result).toEqual(mockInvitation)
        })
    })

    describe('acceptWorkspaceInvitation', () => {
        const mockInvitation = {
            id: '123',
            inviterId: '456',
            userEmail: 'user@example.com',
            workspaceId: '789',
            role: 'GUEST' as const,
            isExistingUser: true,
        }

        test('accepts workspace invitation', async () => {
            const requestMock = setupRestClientMock(mockInvitation)

            const result = await api.acceptWorkspaceInvitation({ inviteCode: 'abc123' })

            expect(requestMock).toHaveBeenCalledWith(
                'PUT',
                getSyncBaseUri(),
                'workspaces/invitations/abc123/accept',
                'token',
                undefined,
                undefined,
            )
            expect(result).toEqual(mockInvitation)
        })
    })

    describe('rejectWorkspaceInvitation', () => {
        const mockInvitation = {
            id: '123',
            inviterId: '456',
            userEmail: 'user@example.com',
            workspaceId: '789',
            role: 'ADMIN' as const,
            isExistingUser: false,
        }

        test('rejects workspace invitation', async () => {
            const requestMock = setupRestClientMock(mockInvitation)

            const result = await api.rejectWorkspaceInvitation({ inviteCode: 'def456' })

            expect(requestMock).toHaveBeenCalledWith(
                'PUT',
                getSyncBaseUri(),
                'workspaces/invitations/def456/reject',
                'token',
                undefined,
                undefined,
            )
            expect(result).toEqual(mockInvitation)
        })
    })

    describe('joinWorkspace', () => {
        const mockWorkspaceUser = {
            userId: '123',
            workspaceId: '456',
            userEmail: 'user@example.com',
            fullName: 'Test User',
            timezone: 'UTC',
            role: 'MEMBER' as const,
            imageId: null,
            isDeleted: false,
        }

        test('joins workspace via invite code', async () => {
            const requestMock = setupRestClientMock(mockWorkspaceUser)

            const result = await api.joinWorkspace({ inviteCode: 'invite123' })

            expect(requestMock).toHaveBeenCalledWith(
                'POST',
                getSyncBaseUri(),
                'workspaces/join',
                'token',
                {
                    invite_code: 'invite123',
                    workspace_id: undefined,
                },
                undefined,
            )
            expect(result).toEqual(mockWorkspaceUser)
        })

        test('joins workspace via workspace ID', async () => {
            const requestMock = setupRestClientMock(mockWorkspaceUser)

            const result = await api.joinWorkspace({ workspaceId: 789 })

            expect(requestMock).toHaveBeenCalledWith(
                'POST',
                getSyncBaseUri(),
                'workspaces/join',
                'token',
                {
                    invite_code: undefined,
                    workspace_id: 789,
                },
                undefined,
            )
            expect(result).toEqual(mockWorkspaceUser)
        })
    })

    describe('uploadWorkspaceLogo', () => {
        const mockLogoResponse = { logoUrl: 'https://example.com/logo.png' }

        beforeEach(() => {
            mockedUploadMultipartFile.mockResolvedValue(mockLogoResponse)
        })

        test('uploads workspace logo from file', async () => {
            const result = await api.uploadWorkspaceLogo({
                workspaceId: 123,
                file: '/path/to/logo.png',
                fileName: 'logo.png',
            })

            expect(mockedUploadMultipartFile).toHaveBeenCalledWith(
                getSyncBaseUri(),
                'token',
                'workspaces/logo',
                '/path/to/logo.png',
                'logo.png',
                { workspace_id: 123 },
                undefined,
            )
            expect(result).toEqual(mockLogoResponse)
        })

        test('uploads workspace logo from Buffer', async () => {
            const buffer = Buffer.from('logo data')

            await api.uploadWorkspaceLogo({
                workspaceId: 456,
                file: buffer,
                fileName: 'logo.jpg',
            })

            expect(mockedUploadMultipartFile).toHaveBeenCalledWith(
                getSyncBaseUri(),
                'token',
                'workspaces/logo',
                buffer,
                'logo.jpg',
                { workspace_id: 456 },
                undefined,
            )
        })

        test('deletes workspace logo', async () => {
            await api.uploadWorkspaceLogo({
                workspaceId: 789,
                delete: true,
            })

            expect(mockedUploadMultipartFile).toHaveBeenCalledWith(
                getSyncBaseUri(),
                'token',
                'workspaces/logo',
                expect.any(Buffer),
                'delete',
                {
                    workspace_id: 789,
                    delete: true,
                },
                undefined,
            )
        })

        test('throws error when file missing and not deleting', async () => {
            await expect(
                api.uploadWorkspaceLogo({
                    workspaceId: 123,
                }),
            ).rejects.toThrow('file is required when not deleting logo')
        })
    })

    describe('getWorkspacePlanDetails', () => {
        const mockPlanDetails = {
            currentMemberCount: 5,
            currentPlan: 'Business' as const,
            currentPlanStatus: 'Active' as const,
            downgradeAt: null,
            currentActiveProjects: 10,
            maximumActiveProjects: 300,
            priceList: [],
            workspaceId: 123,
            isTrialing: false,
            trialEndsAt: null,
            cancelAtPeriodEnd: false,
            hasTrialed: true,
            planPrice: null,
            hasBillingPortal: true,
            hasBillingPortalSwitchToAnnual: false,
        }

        test('gets workspace plan details', async () => {
            const requestMock = setupRestClientMock(mockPlanDetails)

            const result = await api.getWorkspacePlanDetails({ workspaceId: 123 })

            expect(requestMock).toHaveBeenCalledWith(
                'GET',
                getSyncBaseUri(),
                'workspaces/plan_details',
                'token',
                undefined,
                undefined,
                false,
                undefined,
                { workspace_id: 123 },
            )
            expect(result).toEqual(mockPlanDetails)
        })
    })

    describe('getWorkspaceUsers', () => {
        const mockUsers = [
            {
                userId: '1',
                workspaceId: '123',
                userEmail: 'user1@example.com',
                fullName: 'User One',
                timezone: 'UTC',
                role: 'ADMIN' as const,
                imageId: null,
                isDeleted: false,
            },
            {
                userId: '2',
                workspaceId: '123',
                userEmail: 'user2@example.com',
                fullName: 'User Two',
                timezone: 'PST',
                role: 'MEMBER' as const,
                imageId: 'img123',
                isDeleted: false,
            },
        ]

        const mockResponse = {
            has_more: false,
            next_cursor: undefined,
            workspace_users: mockUsers,
        }

        test('gets workspace users with default parameters', async () => {
            const requestMock = setupRestClientMock(mockResponse)

            const result = await api.getWorkspaceUsers()

            expect(requestMock).toHaveBeenCalledWith(
                'GET',
                getSyncBaseUri(),
                'workspaces/users',
                'token',
                undefined,
                undefined,
                false,
                undefined,
                {},
            )
            expect(result).toEqual({
                hasMore: false,
                nextCursor: undefined,
                workspaceUsers: mockUsers,
            })
        })

        test('gets workspace users with all parameters', async () => {
            const requestMock = setupRestClientMock(mockResponse)

            await api.getWorkspaceUsers({
                workspaceId: 456,
                cursor: 'cursor123',
                limit: 50,
            })

            expect(requestMock).toHaveBeenCalledWith(
                'GET',
                getSyncBaseUri(),
                'workspaces/users',
                'token',
                undefined,
                undefined,
                false,
                undefined,
                {
                    workspace_id: 456,
                    cursor: 'cursor123',
                    limit: 50,
                },
            )
        })

        test('handles null workspace ID', async () => {
            const requestMock = setupRestClientMock(mockResponse)

            await api.getWorkspaceUsers({ workspaceId: null })

            expect(requestMock).toHaveBeenCalledWith(
                'GET',
                getSyncBaseUri(),
                'workspaces/users',
                'token',
                undefined,
                undefined,
                false,
                undefined,
                {},
            )
        })
    })

    describe('getWorkspaceActiveProjects', () => {
        const mockProjects = [
            {
                id: '1',
                name: 'Project 1',
                color: 'blue',
                parentId: null,
                inboxProject: false,
                isShared: false,
                isFavorite: false,
                viewStyle: 'list' as const,
                url: 'https://app.todoist.com/app/project/project-1-1',
                canAssignTasks: true,
                childOrder: 0,
                createdAt: '2023-01-01T00:00:00Z',
                isArchived: false,
                isDeleted: false,
                isFrozen: false,
                updatedAt: '2023-01-01T00:00:00Z',
                defaultOrder: 0,
                description: '',
                isCollapsed: false,
            },
        ]

        const mockResponse = {
            projects: mockProjects,
            hasMore: true,
            nextCursor: 'next123',
        }

        test('gets workspace active projects', async () => {
            const requestMock = setupRestClientMock(mockResponse)

            const result = await api.getWorkspaceActiveProjects({
                workspaceId: 123,
                cursor: 'cursor456',
                limit: 25,
            })

            expect(requestMock).toHaveBeenCalledWith(
                'GET',
                getSyncBaseUri(),
                'workspaces/123/projects/active',
                'token',
                undefined,
                undefined,
                false,
                undefined,
                {
                    cursor: 'cursor456',
                    limit: 25,
                },
            )
            expect(result.results).toEqual(mockProjects)
        })
    })

    describe('getWorkspaceArchivedProjects', () => {
        const mockResponse = {
            results: [],
            nextCursor: null,
        }

        test('gets workspace archived projects', async () => {
            const requestMock = setupRestClientMock(mockResponse)

            const result = await api.getWorkspaceArchivedProjects({
                workspaceId: 789,
            })

            expect(requestMock).toHaveBeenCalledWith(
                'GET',
                getSyncBaseUri(),
                'workspaces/789/projects/archived',
                'token',
                undefined,
                undefined,
                false,
                undefined,
                {},
            )
            expect(result.results).toEqual([])
        })
    })
})
