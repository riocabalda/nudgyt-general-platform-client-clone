'use client'

import { Loader } from 'lucide-react'
import { useState } from 'react'
import useAlertStore from '../components/alert/useAlertStore'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog'
import useOrganization from '../hooks/useOrganization'
import userService, { PaginatedUser } from '../services/admin/userService'

interface StatusChangeModalProps {
  forceOrgSlug?: string
  users: PaginatedUser[]
  status: 'approve' | 'block' | 'unblock' | 'archive'
  onCancel: () => void
}

const userStatusConfig = {
  approve: {
    title: 'Approve Users',
    description: 'Are you sure you want to approve the selected users?',
    activeAdjective: 'approved',
    buttonText: 'Approve',
    loadingText: 'Approving',
    successMessage: 'Users approved successfully!',
    variant: 'success' as const
  },
  block: {
    title: 'Block Users',
    description:
      'Warning: You are about to block the selected users. They will not be able to access the system.',
    activeAdjective: 'blocked',
    buttonText: 'Block',
    loadingText: 'Blocking',
    successMessage: 'Users blocked successfully!',
    variant: 'error' as const
  },
  unblock: {
    title: 'Unblock Users',
    description: 'Are you sure you want to unblock the selected users?',
    activeAdjective: 'unblocked',
    buttonText: 'Unblock',
    loadingText: 'Unblocking',
    successMessage: 'Users unblocked successfully!',
    variant: 'success' as const
  },
  archive: {
    title: 'Archive Users',
    description:
      'Warning: You are about to archive the selected users. This action cannot be undone.',
    activeAdjective: 'archived',
    buttonText: 'Archive',
    loadingText: 'Archiving',
    successMessage: 'Users archived successfully!',
    variant: 'error' as const
  }
}

function isUserValid(
  user: StatusChangeModalProps['users'][number],
  status: StatusChangeModalProps['status'],
  orgSlug: string
) {
  const orgMembership = user?.organizations?.find(
    (membership) => membership.organization.slug === orgSlug
  )

  const approveDate = orgMembership?.approved_at ?? null
  const blockDate = orgMembership?.blocked_at ?? null

  if (status === 'approve') {
    return !approveDate && !blockDate && !user.archived_at
  }
  if (status === 'block') {
    return !blockDate && !user.archived_at
  }
  if (status === 'unblock') {
    return !!blockDate && !user.archived_at
  }
  if (status === 'archive') {
    return !user.archived_at
  }

  return false
}

function separateUsersByValidity(
  users: StatusChangeModalProps['users'],
  status: StatusChangeModalProps['status'],
  orgSlug: string
) {
  const validUsers: typeof users = []
  const invalidUsers: typeof users = []

  for (const user of users) {
    if (isUserValid(user, status, orgSlug)) {
      validUsers.push(user)
    } else {
      invalidUsers.push(user)
    }
  }

  return { validUsers, invalidUsers }
}

function StatusChangeModal({
  forceOrgSlug,
  users,
  status,
  onCancel
}: StatusChangeModalProps) {
  const { showAlert } = useAlertStore()
  const { orgSlug: currentOrgSlug } = useOrganization()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const orgSlug = forceOrgSlug ?? currentOrgSlug
  const config = userStatusConfig[status]

  const { validUsers, invalidUsers } = separateUsersByValidity(
    users,
    status,
    orgSlug
  )

  const validUserIds = validUsers.map((user) => user._id)
  const invalidUserCt = invalidUsers.length

  const areAllUsersInvalid = invalidUserCt === users.length

  const handleStatusChange = async () => {
    setIsSubmitting(true)
    try {
      if (status === 'approve') {
        await userService.bulkApproveUsers(orgSlug, {
          userIds: validUserIds
        })
      } else if (status === 'block') {
        await userService.bulkBlockUsers(orgSlug, {
          userIds: validUserIds
        })
      } else if (status === 'unblock') {
        await userService.bulkUnblockUsers(orgSlug, {
          userIds: validUserIds
        })
      } else if (status === 'archive') {
        await userService.bulkArchiveUsers(orgSlug, {
          userIds: validUserIds
        })
      }

      showAlert({
        message: <p>{config.successMessage}</p>,
        variant: config.variant
      })
      onCancel()
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'An error occurred.'
      showAlert({
        message: <p>{errorMessage}</p>,
        variant: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const triggerCancel = () => {
    onCancel()
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) triggerCancel()
      }}
    >
      <DialogContent className='rounded-[8px] w-[90%] max-w-[420px] gap-[20px] p-[30px]'>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>

          {areAllUsersInvalid ? (
            <DialogDescription className='text-destructive'>
              All selected user(s) are already {config.activeAdjective}
            </DialogDescription>
          ) : (
            <>
              <DialogDescription
                className={config.variant === 'error' ? 'text-destructive' : ''}
              >
                {config.description}
              </DialogDescription>
              <p className='mt-2 text-sm text-muted-foreground'>
                <span className='font-bold'>Selected user(s):</span>{' '}
                {users.length}
              </p>

              {invalidUserCt > 0 && (
                <p className='mt-2 text-sm text-muted-foreground'>
                  <span className='font-bold'>Ignored user(s):</span>{' '}
                  {invalidUserCt} (already {config.activeAdjective})
                </p>
              )}
            </>
          )}
        </DialogHeader>

        <div className='flex justify-end gap-[10px] mt-[30px]'>
          <Button type='button' variant='outline' onClick={triggerCancel}>
            Cancel
          </Button>
          <Button
            variant={config.variant === 'error' ? 'destructive' : 'default'}
            type='submit'
            className='w-full'
            disabled={areAllUsersInvalid || isSubmitting}
            onClick={handleStatusChange}
          >
            {isSubmitting ? (
              <>
                <Loader className='w-4 h-4 mr-2 animate-spin' />
                {config.loadingText}
              </>
            ) : (
              config.buttonText
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default StatusChangeModal
