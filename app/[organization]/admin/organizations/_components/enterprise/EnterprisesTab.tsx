'use client'

import FetchError from '@/app/(shared)/components/FetchError'
import Pagination from '@/app/(shared)/components/Pagination'
import Search from '@/app/(shared)/components/Search'
import { TierEnum } from '@/app/(shared)/types'
import { Loader } from 'lucide-react'
import { useEffect } from 'react'
import useEnterprisesStore from '../../_hooks/useEnterprisesStore'
import useGetEnterprises from '../../_hooks/useGetEnterprises'
import FilterPopover from '../FilterPopover'
import SortPopover from '../SortPopover'
import EnterprisesBulkStatusChangeModal from './EnterprisesBulkStatusChangeModal'
import EnterprisesBulkStatusDropdown from './EnterprisesBulkStatusDropdown'
import EnterprisesTableCard from './EnterprisesTableCard'

/** Reset store on unmount */
function useResetStoreOnLeave() {
  const resetStore = useEnterprisesStore((store) => store.reset)

  useEffect(() => {
    return () => {
      resetStore()
    }
  }, [])
}

function EndHeaderActions() {
  const selectedEnterprises = useEnterprisesStore(
    (store) => store.selectedEnterprises
  )
  const { data } = useGetEnterprises()

  const enterprises = data?.data ?? []
  const hasEnterprises = enterprises.length > 0
  const anySelected = selectedEnterprises.length > 0

  if (anySelected) {
    return <EnterprisesBulkStatusDropdown />
  }

  return (
    <div className='flex items-center gap-4'>
      {hasEnterprises && <SortPopover tier={TierEnum.ENTERPRISE} />}
      <FilterPopover />
    </div>
  )
}

function HeaderActions() {
  const { data } = useGetEnterprises()

  return (
    <header className='flex flex-col lg:flex-row p-2 gap-4 lg:p-0 items-stretch lg:items-center'>
      <Search
        key='enterprise-organizations'
        containerClass='lg:w-full xl:w-[344px]'
      />

      <div className='m-0 lg:ml-5 w-full lg:w-auto'>
        <Pagination
          from={data?.from ?? 1}
          to={data?.to ?? data?.total}
          total={data?.total}
          prev={data?.prev_page ?? undefined}
          next={data?.next_page ?? undefined}
          currentPage={data?.current_page ?? 1}
        />
      </div>

      <div className='ml-auto'>
        <EndHeaderActions />
      </div>
    </header>
  )
}

function EnterprisesTab() {
  useResetStoreOnLeave()

  const { data, error, isLoading } = useGetEnterprises()

  const enterprises = data?.data
  const hasStaleData = enterprises !== undefined

  if (error) {
    return <FetchError errorMessage={error?.response?.data?.message} />
  }

  if (isLoading && !hasStaleData) {
    return (
      <div className='flex justify-center items-center h-full'>
        <Loader className='w-4 h-4 mr-2 animate-spin' />
      </div>
    )
  }

  return (
    <article className='space-y-6'>
      <HeaderActions />
      <EnterprisesTableCard />

      <EnterprisesBulkStatusChangeModal />
    </article>
  )
}

export default EnterprisesTab
