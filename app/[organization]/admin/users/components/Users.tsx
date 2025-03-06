'use client'

import TableScrollArea from '@/app/(shared)/(tables)/TableScrollArea'
import DisplayRole from '@/app/(shared)/(users)/DisplayRole'
import FilterPopover from '@/app/(shared)/(users)/FilterPopover'
import SortPopover from '@/app/(shared)/(users)/SortPopover'
import StatusChangeModal from '@/app/(shared)/(users)/StatusChangeModal'
import FetchError from '@/app/(shared)/components/FetchError'
import Pagination from '@/app/(shared)/components/Pagination'
import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import { Checkbox } from '@/app/(shared)/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/app/(shared)/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/app/(shared)/components/ui/table'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useUser from '@/app/(shared)/hooks/useUser'
import { useUserStore } from '@/app/(shared)/hooks/useUsersStore'
import { PaginatedUser } from '@/app/(shared)/services/admin/userService'
import { cn, convertUtcToLocal } from '@/app/(shared)/utils'
import { ChevronDown, Loader } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import useUsers from '../hooks/useUsers'
import Status from './Status'

export type StatusType = 'approve' | 'block' | 'unblock' | 'archive'

type UserTableProps = {
  actionItems: ReactNode[]
}

function UserRow(props: {
  user: PaginatedUser
  anySelected: boolean
  selectedUsers: PaginatedUser[]
  toggleUser: (user: PaginatedUser) => void
}) {
  const { user } = props
  const { selectedUsers, anySelected } = props
  const { toggleUser } = props

  const { user: loggedInUser } = useUser()
  const { orgSlug } = useOrganization()

  const orgMembership = user?.organizations?.find(
    (membership) => membership.organization.slug === orgSlug
  )

  const isRowForLoggedInUser = loggedInUser?._id === user._id
  const isRowForOwner = orgMembership?.is_owner ?? false

  const areActionsHidden = isRowForLoggedInUser || isRowForOwner

  return (
    <TableRow key={user._id} className='group/row border-none hover:bg-muted'>
      <TableCell className='pl-[4px]'>
        {!areActionsHidden && (
          <div className='z-20 flex items-center justify-center'>
            <Checkbox
              className={cn(
                'transition opacity-0 group-hover/row:opacity-100',
                anySelected && 'opacity-100'
              )}
              checked={selectedUsers.some((r) => r._id === user._id)}
              onCheckedChange={() => toggleUser(user)}
            />
          </div>
        )}
      </TableCell>
      <TableCell className='pl-[4px] pr-6 py-[14px]'>
        <Status user={user} orgMembership={orgMembership} />
      </TableCell>
      <TableCell className='min-w-[200px] px-6 py-[14px] font-semibold'>
        <Link
          href={`/${orgSlug}/admin/users/${user._id}`}
          className={cn(
            'underline underline-offset-4',
            'transition decoration-transparent hover:decoration-inherit'
          )}
        >
          {user.full_name}
        </Link>
      </TableCell>
      <TableCell className='truncate px-6 py-[14px]'>
        <DisplayRole orgMembership={orgMembership} />
      </TableCell>
      <TableCell className='min-w-[200px] px-6 py-[14px] whitespace-nowrap'>
        {convertUtcToLocal(user.created_at, 'MMMM D, YYYY h:mm A')}
      </TableCell>
      <TableCell className='px-6 py-[14px]'>{user.email}</TableCell>
      <TableCell className='px-6 py-[14px]'>{user.services ?? 'N/A'}</TableCell>
    </TableRow>
  )
}

function UsersTableCard(props: {
  isLoading: boolean
  users: PaginatedUser[]
  anySelected: boolean
  selectedUsers: PaginatedUser[]
  toggleUser: (user: PaginatedUser) => void
}) {
  const { isLoading } = props
  const { users, selectedUsers, anySelected } = props
  const { toggleUser } = props

  const hasUsers = users.length > 0

  return (
    <TableScrollArea>
      <Card
        className={cn(
          'overflow-hidden border-none rounded-none lg:rounded-sm',
          isLoading && 'opacity-50'
        )}
      >
        <Table>
          <TableHeader className='bg-white'>
            <TableRow className='hover:bg-inherit '>
              <TableHead className='sticky px-[20px]'></TableHead>
              <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
                Status
              </TableHead>
              <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
                Name
              </TableHead>
              <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
                Type
              </TableHead>
              <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
                Joined
              </TableHead>
              <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
                Email address
              </TableHead>
              <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
                Services
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='[&>*:nth-child(even)]:bg-muted border-b table-fixed'>
            {hasUsers ? (
              users.map((user) => (
                <UserRow
                  key={user._id}
                  user={user}
                  anySelected={anySelected}
                  selectedUsers={selectedUsers}
                  toggleUser={toggleUser}
                />
              ))
            ) : (
              <TableRow>
                <TableCell className='text-center' colSpan={9}>
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </TableScrollArea>
  )
}

function SetMultipleStatusDropdown(props: {
  open: boolean
  setOpen: (open: boolean) => void
  handleStatusAction: (status: StatusType) => void
}) {
  const { open, setOpen, handleStatusAction } = props

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className='group'>
        <Button
          variant='outline'
          className='!px-8 bg-white flex items-center justify-center gap-[10px] border-brandcolora border-2 text-brandcolora'
        >
          <span>Set Status</span>
          <ChevronDown
            className={cn(
              'size-4',
              'transition group-data-[state=open]:-rotate-180'
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='px-0 min-w-[358px] fixed top-3 -right-[1px] lg:fixed lg:w-full lg:min-w-[137px]'
        align='end'
      >
        <DropdownMenuItem
          className='focus:bg-neutral-gray-300 rounded-none px-3 py-2 cursor-pointer'
          onClick={() => handleStatusAction('approve')}
        >
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem
          className='focus:bg-neutral-gray-300 rounded-none px-3 py-2 cursor-pointer'
          onClick={() => handleStatusAction('unblock')}
        >
          Unblock
        </DropdownMenuItem>
        <DropdownMenuItem
          className='focus:bg-neutral-gray-300 rounded-none px-3 py-2 cursor-pointer'
          onClick={() => handleStatusAction('block')}
        >
          Block
        </DropdownMenuItem>
        <DropdownMenuItem
          className='focus:bg-neutral-gray-300 rounded-none px-3 py-2 cursor-pointer'
          onClick={() => handleStatusAction('archive')}
        >
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Users({ actionItems }: UserTableProps) {
  const { selectedUsers, toggleUser, clearUsers, setAllUsers } = useUserStore()
  const [open, setOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null)
  const searchParams = useSearchParams()
  const { orgSlug } = useOrganization()
  const orgName = searchParams.get('org-name')?.toString()

  const { data, error, isLoading, mutate } = useUsers(
    orgName ?? orgSlug,
    searchParams.toString()
  )

  useEffect(() => {
    clearUsers()
  }, [searchParams, clearUsers])

  useEffect(() => {
    if (data?.data) {
      setAllUsers(data.data)
    }
  }, [data, setAllUsers])

  const users = data?.data ?? []
  const hasUsers = users.length > 0
  const anySelected = selectedUsers.length > 0
  const hasStaleData = data !== undefined

  const handleStatusAction = (status: StatusType) => {
    setSelectedStatus(status)
    setOpen(false)
  }

  const handleModalClose = () => {
    setSelectedStatus(null)
    clearUsers()
    mutate() // Refresh the data after status change
  }

  if (error) return <FetchError errorMessage={error?.response?.data?.message} />

  if (isLoading && !hasStaleData)
    return (
      <div className='flex justify-center items-center h-full'>
        <Loader className='w-4 h-4 mr-2 animate-spin' />
      </div>
    )

  return (
    <div className='lg:container'>
      {selectedStatus && (
        <StatusChangeModal
          users={selectedUsers}
          status={selectedStatus}
          onCancel={handleModalClose}
        />
      )}

      <div className='flex flex-col lg:flex-row p-2 gap-4 lg:p-0 items-stretch lg:items-center mb-6'>
        {...actionItems}
        <div className='m-0 lg:ml-5 w-full lg:w-auto'>
          <Pagination
            from={data?.from}
            to={data?.to}
            total={data?.total}
            prev={data?.prev_page ?? undefined}
            next={data?.next_page ?? undefined}
            currentPage={data?.current_page || 1}
          />
        </div>
        <div className='ml-auto'>
          {anySelected ? (
            <SetMultipleStatusDropdown
              open={open}
              setOpen={setOpen}
              handleStatusAction={handleStatusAction}
            />
          ) : (
            <div className='flex items-center gap-4'>
              {hasUsers && <SortPopover />}
              <FilterPopover />
            </div>
          )}
        </div>
      </div>

      <UsersTableCard
        isLoading={isLoading}
        users={users}
        anySelected={anySelected}
        selectedUsers={selectedUsers}
        toggleUser={toggleUser}
      />
    </div>
  )
}

export default Users
