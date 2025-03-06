'use client'
import Pagination from '@/app/(shared)/components/Pagination'
import Search from '@/app/(shared)/components/Search'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/app/(shared)/components/ui/table'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import serviceService, {
  ServiceStat
} from '@/app/(shared)/services/admin/serviceService'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'

function ServiceStatTable() {
  const { orgSlug } = useOrganization()
  const queryParams = useSearchParams()
  const { data: stats } = useSWR(
    `${orgSlug}/admin/services/stats?${queryParams.toString()}`,
    () =>
      serviceService
        .getServicesStats(orgSlug, queryParams.toString())
        .then((res) => res.data.data)
  )

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap gap-4 lg:gap-10'>
        <Search containerClass='lg:w-full xl:w-[344px]' />
        <div className='lg:flex hidden align-middle'>
          <Pagination
            from={stats?.from}
            to={stats?.to}
            total={stats?.total}
            prev={stats?.prev_page ?? undefined}
            next={stats?.next_page ?? undefined}
            currentPage={stats?.current_page || 1}
          />
        </div>
      </div>
      <Table className='bg-white'>
        <TableHeader>
          <TableRow className='hover:bg-inherit border-b-[1px] border-neutral-gray-400'>
            <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
              Name
            </TableHead>
            <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
              Usage Hours
            </TableHead>
            <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
              Created
            </TableHead>
            <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
              Creator
            </TableHead>
            <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
              Learners
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='[&>*:nth-child(even)]:bg-muted border-b table-fixed'>
          {stats && stats.data.length ? (
            stats?.data?.map((service: ServiceStat, index: number) => (
              <TableRow key={index}>
                <TableCell>{service.service}</TableCell>
                <TableCell>{service.totalUsageTime}</TableCell>
                <TableCell>{service.createdAt}</TableCell>
                <TableCell>{service.creator}</TableCell>
                <TableCell>{service.totalLearners}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className='text-center' colSpan={6}>
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className='lg:hidden flex justify-end'>
        <Pagination
          from={stats?.from}
          to={stats?.to}
          total={stats?.total}
          prev={stats?.prev_page ?? undefined}
          next={stats?.next_page ?? undefined}
          currentPage={stats?.current_page || 1}
        />
      </div>
    </div>
  )
}

export default ServiceStatTable
