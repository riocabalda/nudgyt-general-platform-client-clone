'use client'

import TableScrollArea from '@/app/(shared)/(tables)/TableScrollArea'
import DisplayRole from '@/app/(shared)/(users)/DisplayRole'
import { Card } from '@/app/(shared)/components/ui/card'
import { Checkbox } from '@/app/(shared)/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/app/(shared)/components/ui/table'
import { PaginatedUser } from '@/app/(shared)/services/admin/userService'
import { cn, convertUtcToLocal } from '@/app/(shared)/utils'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import useGetOrganizationUsers from '../_hooks/useGetOrganizationUsers'
import useOrganizationUserStore from '../_hooks/useOrganizationUserStore'
import usePageParams from '../_hooks/usePageParams'
import Status from './Status'

function useOrganizationUserPageHref(user: PaginatedUser) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const href = `${pathname}/${user._id}?${searchParams}`

  return { href }
}

function OrganizationUserRow(props: { user: PaginatedUser }) {
  const { user } = props
  const { viewedOrgSlug } = usePageParams()
  const selectedUsers = useOrganizationUserStore((store) => store.selectedUsers)
  const toggleUser = useOrganizationUserStore((store) => store.toggleUser)
  const { href: userPageLink } = useOrganizationUserPageHref(user)

  const orgMembership = user?.organizations?.find(
    (membership) => membership.organization.slug === viewedOrgSlug
  )

  const anySelected = selectedUsers.length > 0

  const isRowForOwner = orgMembership?.is_owner ?? false
  const areActionsHidden = isRowForOwner

  const joinDate = convertUtcToLocal(user.created_at, 'MMMM D, YYYY h:mm A')

  return (
    <TableRow className='group/row border-none hover:bg-muted'>
      <TableCell className='pl-[4px]'>
        <div className='z-20 flex items-center justify-center'>
          {!areActionsHidden && (
            <Checkbox
              className={cn(
                'transition opacity-0 group-hover/row:opacity-100',
                anySelected && 'opacity-100'
              )}
              checked={selectedUsers.some((r) => r._id === user._id)}
              onCheckedChange={() => toggleUser(user)}
            />
          )}
        </div>
      </TableCell>
      <TableCell className='pl-[4px] pr-6 py-[14px]'>
        <Status user={user} orgMembership={orgMembership} />
      </TableCell>
      <TableCell className='min-w-[200px] px-6 py-[14px] font-semibold'>
        <Link
          href={userPageLink}
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
        {joinDate}
      </TableCell>
      <TableCell className='px-6 py-[14px]'>{user.email}</TableCell>
      <TableCell className='px-6 py-[14px]'>{user.services ?? 'N/A'}</TableCell>
    </TableRow>
  )
}

function OrganizationUsersTable() {
  const { data: usersPagination } = useGetOrganizationUsers()

  const users = usersPagination?.data ?? []
  const hasUsers = users.length > 0

  return (
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
            <OrganizationUserRow key={user._id} user={user} />
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
  )
}

function OrganizationUsersTableCard() {
  const { isLoading } = useGetOrganizationUsers()

  return (
    <TableScrollArea>
      <Card
        className={cn(
          'overflow-hidden border-none rounded-none lg:rounded-sm',
          isLoading && 'opacity-50'
        )}
      >
        <OrganizationUsersTable />
      </Card>
    </TableScrollArea>
  )
}

export default OrganizationUsersTableCard
