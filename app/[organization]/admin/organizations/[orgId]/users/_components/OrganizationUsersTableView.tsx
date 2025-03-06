'use client'

import FilterPopover from '@/app/(shared)/(users)/FilterPopover'
import SortPopover from '@/app/(shared)/(users)/SortPopover'
import StatusChangeModal from '@/app/(shared)/(users)/StatusChangeModal'
import FetchError from '@/app/(shared)/components/FetchError'
import Pagination from '@/app/(shared)/components/Pagination'
import Search from '@/app/(shared)/components/Search'
import { Loader } from 'lucide-react'
import { useEffect } from 'react'
import useGetOrganizationUsers from '../_hooks/useGetOrganizationUsers'
import useOrganizationUserStore from '../_hooks/useOrganizationUserStore'
import usePageParams from '../_hooks/usePageParams'
import OrganizationUsersTableCard from './OrganizationUsersTableCard'
import SelectedUsersDropdown from './SelectedUsersDropdown'

/** Reset store on unmount */
function useResetStoreOnLeave() {
  const resetStore = useOrganizationUserStore((store) => store.reset)

  useEffect(() => {
    return () => {
      resetStore()
    }
  }, [])
}

function StatusChangeModalWrapper() {
  const { viewedOrgSlug } = usePageParams()
  const orgUsersFetch = useGetOrganizationUsers()
  const selectedStatus = useOrganizationUserStore(
    (store) => store.selectedStatus
  )
  const selectedUsers = useOrganizationUserStore((store) => store.selectedUsers)

  const setSelectedStatus = useOrganizationUserStore(
    (store) => store.setSelectedStatus
  )
  const clearUsers = useOrganizationUserStore((store) => store.clearUsers)

  function handleModalClose() {
    setSelectedStatus(null)
    clearUsers()
    orgUsersFetch.mutate()
  }

  if (!selectedStatus) {
    return null
  }

  return (
    <StatusChangeModal
      forceOrgSlug={viewedOrgSlug}
      users={selectedUsers}
      status={selectedStatus}
      onCancel={handleModalClose}
    />
  )
}

function EndHeaderActions() {
  const { data: usersPagination } = useGetOrganizationUsers()
  const selectedUsers = useOrganizationUserStore((store) => store.selectedUsers)

  const users = usersPagination?.data ?? []
  const hasUsers = users.length > 0
  const anySelected = selectedUsers.length > 0

  if (anySelected) {
    return <SelectedUsersDropdown />
  }

  return (
    <div className='ml-auto flex items-center gap-4'>
      {hasUsers && <SortPopover />}
      <FilterPopover />
    </div>
  )
}

function HeaderActions() {
  const { data } = useGetOrganizationUsers()

  return (
    <header className='flex flex-col lg:flex-row p-2 gap-4 lg:p-0 items-stretch lg:items-center mb-6'>
      <Search
        key='organization-users'
        containerClass='lg:w-full xl:w-[344px]'
      />

      <div className='m-0 lg:ml-5 w-full lg:w-auto'>
        <Pagination
          from={data?.from}
          to={data?.to}
          total={data?.total}
          prev={data?.prev_page ?? undefined}
          next={data?.next_page ?? undefined}
          currentPage={data?.current_page || 1}
        />
      </div>

      <div className='ml-auto'>
        <EndHeaderActions />
      </div>
    </header>
  )
}

function OrganizationUsersTableView() {
  useResetStoreOnLeave()

  const { data, error, isLoading } = useGetOrganizationUsers()

  const hasStaleData = data !== undefined

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
      <OrganizationUsersTableCard />

      <StatusChangeModalWrapper />
    </article>
  )
}

export default OrganizationUsersTableView
