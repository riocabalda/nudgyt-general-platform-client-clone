'use client'

import useAlertStore from '@/app/(shared)/components/alert/useAlertStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/app/(shared)/components/ui/dropdown-menu'
import useGetUser from '@/app/(shared)/hooks/useGetUser'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useUser from '@/app/(shared)/hooks/useUser'
import userService, {
  PaginatedUser
} from '@/app/(shared)/services/admin/userService'
import { invitationStatus, roles } from '@/app/(shared)/services/userService'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import useUsers from '../hooks/useUsers'

function StatusMenu({
  user,
  status,
  isForUserDetail
}: {
  user: PaginatedUser
  status: string
  isForUserDetail?: boolean
}) {
  const { user: loggedInUser } = useUser()
  const { showAlert } = useAlertStore()
  const [open, setOpen] = useState(false)
  // const [openArchive, setOpenArchive] = useState(false)
  const searchParams = useSearchParams()
  const { orgSlug } = useOrganization()
  const { mutate } = useUsers(orgSlug, searchParams.toString())
  const { mutate: currentUserMutate } = useGetUser(orgSlug, user._id)

  const orgMembership = user?.organizations?.find(
    (membership) => membership.organization.slug === orgSlug
  )
  const orgRole = orgMembership?.roles[0]
  const approveDate = orgMembership?.approved_at ?? null
  const blockDate = orgMembership?.blocked_at ?? null

  const isUserSameAsLoggedIn = loggedInUser?._id === user._id
  const isUserOwner = orgMembership?.is_owner ?? false
  const isMembershipAccepted =
    orgMembership?.status === invitationStatus.ACCEPTED

  const isBlocked = blockDate !== null
  const isArchived = user.archived_at !== null
  const isApproved = approveDate !== null
  const forApproval =
    user.email_verified_at !== null &&
    (orgRole === roles.admin || orgRole === roles.trainer)

  const areActionsHidden =
    isArchived || isUserSameAsLoggedIn || isUserOwner || !isMembershipAccepted

  const handleApproveClick = async () => {
    const confirmed = window.confirm(
      `Approve ${orgRole?.toLocaleLowerCase()} ${user.full_name}?`
    )

    if (confirmed) {
      toast.loading(`Approving ${orgRole?.toLocaleLowerCase()}...`, { id: 1 })
      try {
        await userService.approveUser(orgSlug, user._id)

        mutate()
        currentUserMutate()

        toast.dismiss(1)
        showAlert({
          message: <p>User approved!</p>,
          variant: 'success'
        })
      } catch (error: any) {
        console.log(error)
        toast.error(error?.response?.data?.message || 'An error occurred.')
      }
    }
  }

  const handleBlockClick = async () => {
    const confirmed = window.confirm(`Block user ${user.full_name}?`)

    if (confirmed) {
      toast.loading('Blocking user...', {
        id: 1
      })
      try {
        await userService.blockUser(orgSlug, user._id)

        mutate()
        currentUserMutate()

        toast.dismiss(1)
        showAlert({
          message: <p>User blocked!</p>,
          variant: 'error'
        })
      } catch (error: any) {
        console.log(error)
        toast.error(error?.response?.data?.message || 'An error occurred.')
      }
    }
  }

  const handleUnblockClick = async () => {
    const confirmed = window.confirm(`Unblock user ${user.full_name}?`)

    if (confirmed) {
      toast.loading('Unblocking user...', {
        id: 1
      })
      try {
        await userService.unblockUser(orgSlug, user._id)

        mutate()
        currentUserMutate()

        toast.dismiss(1)
        showAlert({
          message: <p>User unblocked!</p>,
          variant: 'success'
        })
      } catch (error: any) {
        console.log(error)
        toast.error(error?.response?.data?.message || 'An error occurred.')
      }
    }
  }

  // const handleArchiveClick = async (e: MouseEvent<HTMLDivElement>) => {
  //   e.stopPropagation()
  //   setOpenArchive(true)
  // }

  if (areActionsHidden) {
    return <span>{status}</span>
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          className={`outline-none flex items-center gap-[10px] ${isForUserDetail && 'justify-between w-full lg:justify-normal'}`}
        >
          {open ? (
            <>
              <span>{status}</span>
              <ChevronUp className='size-4 text-foreground-800' />
            </>
          ) : (
            <>
              <span>{status}</span>
              <ChevronDown className='size-4 text-foreground-800' />
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='px-0 min-w-[358px] fixed top-3 -right-[11px] lg:fixed lg:w-full lg:min-w-[120px]'
          align='end'
        >
          {forApproval && !isApproved && !isArchived && !isBlocked && (
            <DropdownMenuItem
              className='focus:bg-neutral-gray-300 rounded-none px-3 py-2 cursor-pointer'
              onClick={handleApproveClick}
            >
              Approve
            </DropdownMenuItem>
          )}

          {isBlocked ? (
            <DropdownMenuItem
              className='focus:bg-neutral-gray-300 rounded-none px-3 py-2 cursor-pointer'
              onClick={handleUnblockClick}
            >
              Unblock
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className='focus:bg-neutral-gray-300 rounded-none px-3 py-2 cursor-pointer'
              onClick={handleBlockClick}
            >
              Block
            </DropdownMenuItem>
          )}

          {/* <DropdownMenuItem
            className='focus:bg-neutral-gray-300 rounded-none px-3 py-2 cursor-pointer'
            onClick={(e) => handleArchiveClick(e)}
          >
            Archive
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* {openArchive && (
        <ArchiveUserModal user={user} onCancel={() => setOpenArchive(false)} />
      )} */}
    </>
  )
}

export default StatusMenu
