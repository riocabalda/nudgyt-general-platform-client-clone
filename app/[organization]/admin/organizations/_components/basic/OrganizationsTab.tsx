'use client'

import FetchError from '@/app/(shared)/components/FetchError'
import Pagination from '@/app/(shared)/components/Pagination'
import Search from '@/app/(shared)/components/Search'
import { Loader } from 'lucide-react'
import { useEffect } from 'react'
import useGetOrganizations from '../../_hooks/useGetOrganizations'
import useOrganizationsStore from '../../_hooks/useOrganizationsStore'
import FilterPopover from '../FilterPopover'
import SortPopover from '../SortPopover'
import OrganizationsBulkStatusChangeModal from './OrganizationsBulkStatusChangeModal'
import OrganizationsBulkStatusDropdown from './OrganizationsBulkStatusDropdown'
import OrganizationsTableCard from './OrganizationsTableCard'
import AddExtraLearnersModal from '../../../users/components/AddExtraLearnersModal'
/** Reset store on unmount */
function useResetStoreOnLeave() {
  const resetStore = useOrganizationsStore((store) => store.reset)

  useEffect(() => {
    return () => {
      resetStore()
    }
  }, [])
}

function EndHeaderActions() {
  const selectedOrganizations = useOrganizationsStore(
    (store) => store.selectedOrganizations
  )
  const { data } = useGetOrganizations()

  const organizations = data?.data ?? []
  const hasOrganizations = organizations.length > 0
  const anySelected = selectedOrganizations.length > 0

  if (anySelected) {
    return <OrganizationsBulkStatusDropdown />
  }

  return (
    <div className='flex items-center gap-4'>
      {hasOrganizations && <SortPopover />}
      <FilterPopover />
    </div>
  )
}

function HeaderActions() {
  const { data } = useGetOrganizations()

  return (
    <header className='flex flex-col lg:flex-row p-2 gap-4 lg:p-0 items-stretch lg:items-center'>
      <Search
        key='basic-organizations'
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

function OrganizationsTab() {
  useResetStoreOnLeave()

  const { data, error, isLoading } = useGetOrganizations()

  const organizations = data?.data
  const hasStaleData = organizations !== undefined

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
      <OrganizationsTableCard />

      <OrganizationsBulkStatusChangeModal />
      <AddExtraLearnersModal />
    </article>
  )
}

export default OrganizationsTab
