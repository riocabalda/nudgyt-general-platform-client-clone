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
import userService from '@/app/(shared)/services/admin/userService'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'

function LearnerStatTable() {
  const { orgSlug } = useOrganization()
  const queryParams = useSearchParams()
  const { data: stats } = useSWR(
    `${orgSlug}/admin/users/stats?${queryParams.toString()}`,
    () =>
      userService
        .getLearnerStats(orgSlug, queryParams.toString())
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
              Joined
            </TableHead>
            <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
              Email Address
            </TableHead>
            <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
              Last Service Used
            </TableHead>
            <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
              Services
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='[&>*:nth-child(even)]:bg-muted border-b table-fixed'>
          {stats && stats.data.length ? (
            stats.data.map((learner: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{learner.fullName}</TableCell>
                <TableCell>{learner.usageHours}</TableCell>
                <TableCell>{learner.joinedDate}</TableCell>
                <TableCell>{learner.email}</TableCell>
                <TableCell>{learner.recentUsedService}</TableCell>
                <TableCell>{learner.services.join(', ')}</TableCell>
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

export default LearnerStatTable
