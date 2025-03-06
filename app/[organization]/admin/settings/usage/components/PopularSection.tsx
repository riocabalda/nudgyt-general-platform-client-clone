'use client'
import usageService from '@/app/(shared)/services/admin/usageService'
import React from 'react'
import useSWR from 'swr'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { SearchX } from 'lucide-react'

function PopularSection() {
  const { orgSlug } = useOrganization()
  const { data: popularData } = useSWR(
    `${orgSlug}/admin/services/popularity`,
    () => usageService.getServicePopularity(orgSlug).then((res) => res.data)
  )

  return (
    <div className='bg-white rounded-none lg:rounded-lg p-6 popular-services'>
      <h5 className='text-xl font-semibold'>Popular</h5>
      <div className='grid grid-cols-12 gap-4 mt-4 lg:mt-9'>
        <div className='col-span-10 mb-2'>
          <h6 className='text-xs font-medium text-neutral-gray-800  uppercase tracking-widest'>
            Service
          </h6>
        </div>
        <div className='col-span-2 flex justify-end mb-2'>
          <h6 className='text-xs font-medium text-neutral-gray-800  uppercase tracking-widest'>
            Learners
          </h6>
        </div>
        {(popularData?.data?.length ?? 0 > 0) ? (
          popularData?.data?.map(
            (
              item: any // type any is temporary
            ) => (
              <React.Fragment key={item.service}>
                <div className='col-span-10'>
                  <p className='text-sm text-neutral-gray-600 truncate'>
                    {item.service}
                  </p>
                </div>
                <div className='col-span-2 flex justify-end'>
                  <p className='text-sm text-neutral-gray-600 text-left'>
                    {item.totalLearners}
                  </p>
                </div>
              </React.Fragment>
            )
          )
        ) : (
          <div className='flex flex-col items-center py-10 lg:pt-4 col-span-full'>
            <SearchX className='text-neutral-gray-300' />
            <p className='text-[14px] font-[400]'>No recent services</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PopularSection
