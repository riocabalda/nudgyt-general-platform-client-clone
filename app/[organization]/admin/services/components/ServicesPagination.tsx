'use client'

import React from 'react'
import Pagination from '@/app/(shared)/components/Pagination'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useGetServices from '../hooks/useGetServices'
import { useSearchParams } from 'next/navigation'

function ServicesPagination() {
  const searchParams = useSearchParams()
  const { orgSlug } = useOrganization()

  const { data } = useGetServices(orgSlug, String(searchParams))

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

export default ServicesPagination
