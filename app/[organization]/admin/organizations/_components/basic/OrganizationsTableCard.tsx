import TableScrollArea from '@/app/(shared)/(tables)/TableScrollArea'
import ThreeDots from '@/app/(shared)/components/svg/ThreeDots'
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
import { OrganizationUser } from '@/app/(shared)/services/admin/organizationService'
import { TierEnum } from '@/app/(shared)/types'
import { cn, convertUtcToLocal } from '@/app/(shared)/utils'
import Link from 'next/link'
import { useExtraLearnerModalStore } from '../../_hooks/useExtraLearnerModalStore'
import useGetOrganizations from '../../_hooks/useGetOrganizations'
import useOrganizationsStore from '../../_hooks/useOrganizationsStore'
import OrganizationStatus from '../OrganizationStatus'

function OrgActionsDropdown(props: { organization: OrganizationUser }) {
  const { organization } = props

  const { openModal } = useExtraLearnerModalStore()

  const handleAddExtraLearners = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    openModal(organization.slug)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='border-none h-full w-[24px] hover:bg-gray-200 relative top-[2px]'
        >
          <ThreeDots />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-[180px]'>
        <DropdownMenuItem onClick={handleAddExtraLearners}>
          Add extra learners
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function BasicOrganizationRow(props: { organization: OrganizationUser }) {
  const { organization } = props

  const { orgSlug } = useOrganization()
  const selectedOrganizations = useOrganizationsStore(
    (store) => store.selectedOrganizations
  )
  const toggleOrganization = useOrganizationsStore(
    (store) => store.toggleOrganization
  )

  const anySelected = selectedOrganizations.length > 0

  const linkParams = new URLSearchParams({
    organization: organization.slug
  })

  return (
    <TableRow className='group/row border-none hover:bg-muted'>
      <TableCell className='pl-[4px]'>
        <div className='z-20 flex items-center justify-center'>
          <Checkbox
            className={cn(
              'transition opacity-0 group-hover/row:opacity-100',
              anySelected && 'opacity-100'
            )}
            checked={selectedOrganizations.some(
              (r) => r._id === organization._id
            )}
            onCheckedChange={() => toggleOrganization(organization)}
          />
        </div>
      </TableCell>
      <TableCell className='pl-[4px] pr-6 py-[14px]'>
        <OrganizationStatus
          tier={TierEnum.BASIC}
          key={organization.status}
          organization={organization}
        />
      </TableCell>
      <TableCell className='min-w-[200px] px-6 py-[14px] font-semibold'>
        <Link
          href={`/${orgSlug}/admin/organizations/${organization._id}/users?${linkParams}`}
          className={cn(
            'underline underline-offset-4',
            'transition decoration-transparent hover:decoration-inherit'
          )}
        >
          {organization.name}
        </Link>
      </TableCell>
      <TableCell className='truncate px-6 py-[14px]'>
        {organization.owner}
      </TableCell>
      <TableCell className='px-6 py-[14px]'>
        {organization.members.toString()}
      </TableCell>
      <TableCell className='px-6 py-[14px] whitespace-nowrap'>
        {convertUtcToLocal(organization.created_at, 'MMMM D, YYYY h:mm A')}
      </TableCell>
      <TableCell className='px-6 py-[14px] whitespace-nowrap'>
        <OrgActionsDropdown organization={organization} />
      </TableCell>
    </TableRow>
  )
}

function OrganizationsTable() {
  const { data } = useGetOrganizations()

  const organizations = data?.data ?? []
  const hasOrganizations = organizations.length > 0

  return (
    <Table>
      <TableHeader className='bg-white'>
        <TableRow className='hover:bg-inherit '>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '></TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
            Status
          </TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
            Name
          </TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
            Owner
          </TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
            Members
          </TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
            Joined
          </TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className='[&>*:nth-child(even)]:bg-muted border-b table-fixed'>
        {hasOrganizations ? (
          organizations.map((organization) => (
            <BasicOrganizationRow
              key={organization._id}
              organization={organization}
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
  )
}

function OrganizationsTableCard() {
  const { isLoading } = useGetOrganizations()

  return (
    <TableScrollArea>
      <Card
        className={cn(
          'overflow-hidden border-none rounded-none lg:rounded-sm',
          isLoading && 'opacity-50'
        )}
      >
        <OrganizationsTable />
      </Card>
    </TableScrollArea>
  )
}

export default OrganizationsTableCard
