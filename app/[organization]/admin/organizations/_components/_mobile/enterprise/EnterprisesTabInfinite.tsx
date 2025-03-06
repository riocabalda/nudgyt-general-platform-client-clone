'use client'

import {
  LoadingMoreIndicator,
  LoadingSpinner
} from '@/app/(shared)/(users)/LoadingStates'
import FetchError from '@/app/(shared)/components/FetchError'
import Search from '@/app/(shared)/components/Search'
import { useIntersectionObserver } from 'usehooks-ts'
import useEnterprisesStore from '../../../_hooks/useEnterprisesStore'
import useGetEnterprisesInfinite from '../../../_hooks/useGetEnterprisesInfinite'
import EnterpriseActionPopover from './EnterpriseActionPopover'
import EnterpriseCard from './EnterpriseCard'
import SetStatusModal from './SetStatusModal'

function EnterprisesTabEnd() {
  const {
    swrInfinite: { isValidating, setSize },
    isTotalEnterprises
  } = useGetEnterprisesInfinite()

  const { ref } = useIntersectionObserver({
    onChange(isIntersecting) {
      if (!isIntersecting) {
        return
      }

      extendInfiniteFetch()
    }
  })

  function extendInfiniteFetch() {
    setSize((size) => size + 1)
  }

  if (isTotalEnterprises) {
    return null // Remove observer if no more data
  }

  return (
    <div ref={ref}>
      {isValidating && <LoadingMoreIndicator type='organizations' />}
    </div>
  )
}

function EnterprisesTabInfinite() {
  const { clearEnterprises } = useEnterprisesStore()
  const {
    swrInfinite: { data, error, isLoading, mutate },
    enterprises
  } = useGetEnterprisesInfinite()

  const hasStaleData = data !== undefined
  const hasEnterprises = enterprises.length > 0

  function handleModalClose() {
    clearEnterprises()
    mutate() // Refresh the data after status change
  }

  if (error) {
    return (
      <div className='grid place-items-center p-4'>
        <FetchError errorMessage={error?.response?.data?.message} />
      </div>
    )
  }

  if (isLoading && !hasStaleData) {
    return <LoadingSpinner />
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex gap-4 bg-white px-4 py-6 border-b border-b-gray-300'>
          <Search />
          <EnterpriseActionPopover />
        </div>
        <div className='flex flex-col gap-4 px-4 py-6'>
          {hasEnterprises ? (
            enterprises.map((enterprise) => (
              <EnterpriseCard key={enterprise._id} enterprise={enterprise} />
            ))
          ) : (
            <p className='text-center text-foreground'>No data found.</p>
          )}

          <EnterprisesTabEnd />
        </div>
      </div>
      <SetStatusModal onCancel={handleModalClose} />
    </>
  )
}

export default EnterprisesTabInfinite
