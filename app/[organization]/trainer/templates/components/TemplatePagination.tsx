'use client'

import React from 'react'
import { WithPagination } from '@/app/(shared)/types'
import Pagination from '@/app/(shared)/components/Pagination'

type TTemplatePaginationProps = {
  data?: WithPagination<any[] | undefined>
}

function TemplatePagination({ data }: TTemplatePaginationProps) {
  return (
    <div className='hidden lg:block text-sm font-medium pl-4'>
      <Pagination
        from={data?.from}
        to={data?.to}
        total={data?.total}
        prev={data?.prev_page || undefined}
        next={data?.next_page || undefined}
        currentPage={data?.current_page || 0}
      />
    </div>
  )
}

export default TemplatePagination
