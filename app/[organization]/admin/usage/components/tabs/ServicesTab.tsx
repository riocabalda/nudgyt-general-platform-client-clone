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

type ServicesTabProps = {
  actionItems: ReactNode[]
}

const SERVICES_DATA = [
  {
    name: 'Learning Path A',
    usage_hours: '08:45:30',
    created: '2024-08-29T07:12:23.233Z',
    creator: 'John Smith',
    learners: 45
  },
  {
    name: 'Learning Path B',
    usage_hours: '12:30:15',
    created: '2024-09-15T14:30:45.123Z',
    creator: 'Sarah Johnson',
    learners: 32
  },
  {
    name: 'Learning Path C',
    usage_hours: '15:20:45',
    created: '2024-07-03T09:45:12.445Z',
    creator: 'Michael Brown',
    learners: 67
  }
]

function ServicesTab({ actionItems }: ServicesTabProps) {
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
              <TableRow className='hover:bg-inherit'>
                <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
                  Name
                </TableHead>
                <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
                  Usage Hours
                </TableHead>
                <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
                  Created
                </TableHead>
                <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
                  Creator
                </TableHead>
                <TableHead className='sticky top-0 px-6 py-2 font-semibold text-foreground'>
                  Learners
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='[&>*:nth-child(even)]:bg-muted border-b table-fixed'>
              {SERVICES_DATA ? (
                SERVICES_DATA.map((service) => (
                  <TableRow
                    key={service.name}
                    className='border-none cursor-pointer hover:bg-muted'
                  >
                    <TableCell className='px-6 py-[14px]'>
                      {service.name}
                    </TableCell>
                    <TableCell className='px-6 py-[14px]'>
                      {service.usage_hours}
                    </TableCell>
                    <TableCell className='px-6 py-[14px]'>
                      {convertUtcToLocal(
                        service.created,
                        'MMMM D, YYYY h:mm A'
                      )}
                    </TableCell>
                    <TableCell className='px-6 py-[14px]'>
                      {service.creator}
                    </TableCell>
                    <TableCell className='px-6 py-[14px]'>
                      {service.learners}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className='text-center' colSpan={5}>
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

export default ServicesTab
