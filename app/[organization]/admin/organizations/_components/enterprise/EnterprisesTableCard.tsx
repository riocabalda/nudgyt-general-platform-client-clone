'use client'

import TableScrollArea from '@/app/(shared)/(tables)/TableScrollArea'
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
import { EnterpriseUser } from '@/app/(shared)/services/admin/organizationService'
import { TierEnum } from '@/app/(shared)/types'
import { cn, convertUtcToLocal, formatPrice } from '@/app/(shared)/utils'
import useEnterprisesStore from '../../_hooks/useEnterprisesStore'
import useGetEnterprises from '../../_hooks/useGetEnterprises'
import OrganizationStatus from '../OrganizationStatus'

function EnterpriseOrganizationRow(props: { enterprise: EnterpriseUser }) {
  const { enterprise } = props

  const selectedEnterprises = useEnterprisesStore(
    (store) => store.selectedEnterprises
  )
  const toggleEnterprise = useEnterprisesStore(
    (store) => store.toggleEnterprise
  )

  const anySelected = selectedEnterprises.length > 0

  const currencyCode = 'USD' // Use from API?
  const rate = formatPrice(enterprise.monthly_amount, currencyCode)
  const joined = convertUtcToLocal(enterprise.created_at, 'MMMM D, YYYY h:mm A')

  return (
    <TableRow className='group/row border-none hover:bg-muted'>
      <TableCell className='pl-[4px]'>
        <div className='z-20 flex items-center justify-center'>
          <Checkbox
            className={cn(
              'transition opacity-0 group-hover/row:opacity-100',
              anySelected && 'opacity-100'
            )}
            checked={selectedEnterprises.some((r) => r._id === enterprise._id)}
            onCheckedChange={() => toggleEnterprise(enterprise)}
          />
        </div>
      </TableCell>
      <TableCell className='pl-[4px] pr-6 py-[14px]'>
        <OrganizationStatus
          tier={TierEnum.ENTERPRISE}
          key={enterprise.status}
          organization={enterprise}
        />
      </TableCell>
      <TableCell className='min-w-[200px] px-6 py-[14px] font-semibold'>
        {enterprise.organization_name}
      </TableCell>
      <TableCell className='truncate px-6 py-[14px]'>
        {enterprise.email}
      </TableCell>
      <TableCell className='px-6 py-[14px]'>{rate}</TableCell>
      <TableCell className='px-6 py-[14px]'>{enterprise.user_seats}</TableCell>
      <TableCell className='px-6 py-[14px]'>
        {enterprise.platform_url}
      </TableCell>
      <TableCell className='px-6 py-[14px] whitespace-nowrap'>
        {joined}
      </TableCell>
    </TableRow>
  )
}

function EnterprisesTable() {
  const { data } = useGetEnterprises()

  const enterprises = data?.data ?? []
  const hasEnterprises = enterprises.length > 0

  return (
    <Table>
      <TableHeader className='bg-white'>
        <TableRow className='hover:bg-inherit '>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'></TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
            Status
          </TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
            Name
          </TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
            Owner
          </TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
            Rate
          </TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
            Seats
          </TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
            Platform
          </TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
            Joined
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className='[&>*:nth-child(even)]:bg-muted border-b table-fixed'>
        {hasEnterprises ? (
          enterprises.map((enterprise) => (
            <EnterpriseOrganizationRow
              key={enterprise._id}
              enterprise={enterprise}
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

function EnterprisesTableCard() {
  const { isLoading } = useGetEnterprises()

  return (
    <TableScrollArea>
      <Card
        className={cn(
          'overflow-hidden border-none rounded-none lg:rounded-sm',
          isLoading && 'opacity-50'
        )}
      >
        <EnterprisesTable />
      </Card>
    </TableScrollArea>
  )
}

export default EnterprisesTableCard
