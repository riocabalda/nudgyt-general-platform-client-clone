import Pagination from '@/app/(shared)/components/Pagination'
import { Card } from '@/app/(shared)/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/app/(shared)/components/ui/table'
import { convertUtcToLocal } from '@/app/(shared)/utils'
import { ReactNode } from 'react'

type LearnersTabProps = {
  actionItems: ReactNode[]
}

const LEARNERS_DATA = [
  {
    name: 'John Doe',
    usage_hours: '08:45:30',
    joined: '2024-08-29T07:12:23.233Z',
    email: 'johndoe@example.com',
    last_service: 'Service 1',
    services: 12
  },
  {
    name: 'Jane Smith',
    usage_hours: '12:30:15',
    joined: '2024-09-15T14:30:45.123Z',
    email: 'janesmith@example.com',
    last_service: 'Service 2',
    services: 8
  },
  {
    name: 'Michael Johnson',
    usage_hours: '15:20:45',
    joined: '2024-07-03T09:45:12.445Z',
    email: 'mjohnson@example.com',
    last_service: 'Service 3',
    services: 23
  },
  {
    name: 'Sarah Williams',
    usage_hours: '06:15:00',
    joined: '2024-10-21T16:20:34.778Z',
    email: 'swilliams@example.com',
    last_service: 'Service 1',
    services: 5
  },
  {
    name: 'Robert Brown',
    usage_hours: '11:45:20',
    joined: '2024-06-18T11:55:09.990Z',
    email: 'rbrown@example.com',
    last_service: 'Service 2',
    services: 17
  },
  {
    name: 'Emily Davis',
    usage_hours: '09:30:40',
    joined: '2024-11-07T08:40:56.234Z',
    email: 'edavis@example.com',
    last_service: 'Service 3',
    services: 14
  },
  {
    name: 'William Miller',
    usage_hours: '14:25:10',
    joined: '2024-05-25T13:15:43.567Z',
    email: 'wmiller@example.com',
    last_service: 'Service 1',
    services: 31
  },
  {
    name: 'Elizabeth Wilson',
    usage_hours: '07:50:25',
    joined: '2024-12-30T15:35:21.890Z',
    email: 'ewilson@example.com',
    last_service: 'Service 2',
    services: 9
  },
  {
    name: 'David Moore',
    usage_hours: '13:10:55',
    joined: '2024-04-12T10:25:67.123Z',
    email: 'dmoore@example.com',
    last_service: 'Service 3',
    services: 20
  },
  {
    name: 'Jennifer Taylor',
    usage_hours: '10:40:15',
    joined: '2024-01-08T17:50:34.456Z',
    email: 'jtaylor@example.com',
    last_service: 'Service 1',
    services: 11
  },
  {
    name: 'Christopher Anderson',
    usage_hours: '16:05:30',
    joined: '2024-01-11T17:50:34.456Z',
    email: 'canderson@example.com',
    last_service: 'Service 2',
    services: 25
  },
  {
    name: 'Lisa Thomas',
    usage_hours: '05:55:45',
    joined: '2024-03-22T09:30:12.012Z',
    email: 'lthomas@example.com',
    last_service: 'Service 3',
    services: 7
  },
  {
    name: 'Daniel Jackson',
    usage_hours: '12:15:35',
    joined: '2024-08-05T14:45:43.345Z',
    email: 'djackson@example.com',
    last_service: 'Service 1',
    services: 19
  },
  {
    name: 'Michelle White',
    usage_hours: '08:35:50',
    joined: '2024-07-19T16:10:56.678Z',
    email: 'mwhite@example.com',
    last_service: 'Service 2',
    services: 13
  },
  {
    name: 'Kevin Harris',
    usage_hours: '11:20:40',
    joined: '2024-02-09T17:50:34.456Z',
    email: 'kharris@example.com',
    last_service: 'Service 3',
    services: 28
  },
  {
    name: 'Amanda Martinez',
    usage_hours: '14:50:20',
    joined: '2024-05-03T08:15:23.234Z',
    email: 'amartinez@example.com',
    last_service: 'Service 1',
    services: 16
  },
  {
    name: 'Brian Robinson',
    usage_hours: '07:25:15',
    joined: '2024-04-16T13:40:45.567Z',
    email: 'brobinson@example.com',
    last_service: 'Service 2',
    services: 22
  },
  {
    name: 'Jessica Clark',
    usage_hours: '13:40:30',
    joined: '2024-03-09T17:50:34.456Z',
    email: 'jclark@example.com',
    last_service: 'Service 3',
    services: 10
  },
  {
    name: 'Steven Rodriguez',
    usage_hours: '09:10:45',
    joined: '2024-02-28T10:20:12.123Z',
    email: 'srodriguez@example.com',
    last_service: 'Service 1',
    services: 33
  },
  {
    name: 'Rachel Lewis',
    usage_hours: '15:30:25',
    joined: '2024-01-14T17:35:34.456Z',
    email: 'rlewis@example.com',
    last_service: 'Service 2',
    services: 15
  }
]

function LearnersTab({ actionItems }: LearnersTabProps) {
  return (
    <>
      <div className='flex flex-col lg:flex-row p-2 gap-4 lg:p-0 items-stretch lg:items-center mb-6'>
        {...actionItems}
        <div className='m-0 lg:ml-5 w-full lg:w-auto'>
          <Pagination
            from={1}
            to={10}
            total={1000}
            prev={undefined}
            next={undefined}
            currentPage={1}
          />
        </div>
      </div>
      <Card className='overflow-hidden border-none rounded-none lg:rounded-sm'>
        <div className='max-h-[45vh] overflow-auto'>
          <Table>
            <TableHeader className='bg-white'>
              <TableRow className='hover:bg-inherit '>
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
              {LEARNERS_DATA ? (
                LEARNERS_DATA.map((learner) => (
                  <TableRow
                    key={learner.email}
                    className='border-none cursor-pointer hover:bg-muted'
                  >
                    <TableCell className='px-6 py-[14px]'>
                      {learner.name}
                    </TableCell>
                    <TableCell className='px-6 py-[14px]'>
                      {learner.usage_hours}
                    </TableCell>
                    <TableCell className='px-6 py-[14px]'>
                      {convertUtcToLocal(learner.joined, 'MMMM D, YYYY h:mm A')}
                    </TableCell>
                    <TableCell className='px-6 py-[14px]'>
                      {learner.email}
                    </TableCell>
                    <TableCell className='px-6 py-[14px]'>
                      {learner.last_service}
                    </TableCell>
                    <TableCell className='px-6 py-[14px]'>
                      {learner.services}
                    </TableCell>
                  </TableRow>
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
        </div>
      </Card>
    </>
  )
}

export default LearnersTab
