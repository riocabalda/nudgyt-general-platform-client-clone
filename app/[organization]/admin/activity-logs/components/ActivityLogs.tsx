'use client'

import TableScrollArea from '@/app/(shared)/(tables)/TableScrollArea'
import FetchError from '@/app/(shared)/components/FetchError'
import Pagination from '@/app/(shared)/components/Pagination'
import Search from '@/app/(shared)/components/Search'
import { Card } from '@/app/(shared)/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/app/(shared)/components/ui/table'
import { ActivityLog } from '@/app/(shared)/services/admin/log.service'
import { cn, convertUtcToLocal } from '@/app/(shared)/utils'
import { Loader } from 'lucide-react'
import useGetLogs from '../hooks/useGetLogs'
import FilterPopover from './FilterPopover'

function ActivityLogRow(props: { log: ActivityLog }) {
  const { log } = props

  return (
    <TableRow className='border-none hover:bg-muted'>
      <TableCell className='px-6 py-[14px]'>{log.type}</TableCell>
      <TableCell className='min-w-[350px] px-6 py-[14px]'>
        {log.activity}
      </TableCell>
      <TableCell className='px-6 py-[14px]'>
        {convertUtcToLocal(log.created_at, 'MMMM D, YYYY')}
      </TableCell>
      <TableCell className='px-6 py-[14px]'>
        {convertUtcToLocal(log.created_at, 'h:mm A')}
      </TableCell>
    </TableRow>
  )
}

function ActivityLogsTable() {
  const { data } = useGetLogs()

  const logs = data?.data ?? []
  const hasLogs = logs.length > 0

  return (
    <Table>
      <TableHeader className='bg-white'>
        <TableRow className='hover:bg-inherit '>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
            Type
          </TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
            Activity
          </TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
            Date
          </TableHead>
          <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground '>
            Time
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className='[&>*:nth-child(even)]:bg-muted border-b table-fixed'>
        {hasLogs ? (
          logs.map((log) => <ActivityLogRow key={log._id} log={log} />)
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

function ActivityLogsTableCard() {
  const { isLoading } = useGetLogs()

  return (
    <TableScrollArea>
      <Card
        className={cn(
          'overflow-hidden border-none rounded-none lg:rounded-sm',
          isLoading && 'opacity-50'
        )}
      >
        <ActivityLogsTable />
      </Card>
    </TableScrollArea>
  )
}

function ActivityLogs() {
  const { data, error, isLoading } = useGetLogs()

  const hasStaleData = data !== undefined

  if (error)
    return (
      <div className='grid place-items-center p-4'>
        <FetchError errorMessage={error?.response?.data?.message} />
      </div>
    )

  if (isLoading && !hasStaleData)
    return (
      <div className='grid place-items-center p-4'>
        <Loader className='w-4 h-4 mr-2 animate-spin' />
      </div>
    )

  return (
    <div className='lg:px-0'>
      <div className='flex flex-col lg:flex-row p-2 gap-4 lg:p-0 items-stretch lg:items-center mb-6'>
        <div className='flex gap-2'>
          <Search containerClass='lg:w-full xl:w-[344px]' />
          <div className='block lg:hidden'>
            <FilterPopover />
          </div>
        </div>

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

        <div className='ml-auto hidden lg:block'>
          <FilterPopover />
        </div>
      </div>

      <ActivityLogsTableCard />
    </div>
  )
}

export default ActivityLogs
