'use client'

import React from 'react'
import Pagination from '@/app/(shared)/components/Pagination'
import useSWR from 'swr'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import serviceService from '@/app/(shared)/services/learner/serviceService'
import { useSearchParams } from 'next/navigation'

function ServicesPagination() {
  const searchParams = useSearchParams()
  const { orgSlug } = useOrganization()

  const { data } = useSWR(
    `/${orgSlug}/learner/services?${searchParams.toString()}`,
    () =>
      serviceService
        .getServices(orgSlug, searchParams.toString())
        .then((res) => res.data)
  )

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
