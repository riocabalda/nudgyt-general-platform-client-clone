import { Card } from '@/app/(shared)/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/app/(shared)/components/ui/table'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils'

export type TableColumn = {
  header: string
  accessor: string
  width?: string
}

export type TableData = {
  [key: string]: string | number
}

type FormQuestionsTableProps = {
  title?: string
  columns: TableColumn[]
  data: TableData[]
  itemsPerPage?: number
  isRubricTable?: boolean
}

function FormQuestionsTable({
  title = 'Form Answers',
  columns,
  data,
  itemsPerPage = 20,
  isRubricTable = false
}: FormQuestionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(data?.length / itemsPerPage)

  const hasPrevPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  return (
    <div>
      <div className='flex items-center'>
        <h4 className='text-[20px] font-semibold'>{title}</h4>
        <div
          className={cn(
            'flex justify-start items-center gap-6 text-sm',
            title && 'ml-6'
          )}
        >
          <span>{`${indexOfFirstItem + 1} - ${Math.min(
            indexOfLastItem,
            data?.length ?? 0
          )} of ${data?.length ?? 0}`}</span>

          <button
            onClick={handlePrevPage}
            disabled={!hasPrevPage}
            className={`p-1 ${hasPrevPage ? 'text-black' : 'text-gray-300'}`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className={`p-1 ${hasNextPage ? 'text-black' : 'text-gray-300'}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <Card className='rounded-[8px] mt-[30px] overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              {columns?.map((column, index) => (
                <TableHead
                  key={index}
                  className='whitespace-nowrap font-semibold text-sm text-foreground'
                  style={{ width: column.width || 'auto' }}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems?.map((row, rowIndex) => (
              <TableRow key={rowIndex} className='even:bg-neutral-gray-100'>
                {columns?.map((column, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className={cn(
                      'text-sm',
                      isRubricTable && cellIndex === 0 && 'font-bold',
                      isRubricTable && 'align-top '
                    )}
                    style={{
                      width: column.width || 'auto',
                      maxWidth: column.width || 'auto',
                      overflow: 'hidden',
                      textOverflow: (!isRubricTable && 'ellipsis') || '',
                      whiteSpace: (!isRubricTable && 'nowrap') || ''
                    }}
                  >
                    {row[column.accessor]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default FormQuestionsTable
