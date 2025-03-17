'use client'

import ActionPopover from '@/app/(shared)/(users)/_mobile/ActionPopover'
import SetStatusModal from '@/app/(shared)/(users)/_mobile/SetStatusModal'
import UserCard from '@/app/(shared)/(users)/_mobile/UserCard'
import {
  LoadingMoreIndicator,
  LoadingSpinner
} from '@/app/(shared)/(users)/LoadingStates'
import FetchError from '@/app/(shared)/components/FetchError'
import Search from '@/app/(shared)/components/Search'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { useUserStore } from '@/app/(shared)/hooks/useUsersStore'
import userService from '@/app/(shared)/services/admin/userService'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWRInfinite from 'swr/infinite'

type PaginatedUserResponse = Awaited<
  ReturnType<typeof userService.getUsers>
>['data']

function UsersInfiniteScroll() {
  const { orgSlug } = useOrganization()
  const [scrollPosition, setScrollPosition] = useState(0)
  const [fetchLoading, setFetchLoading] = useState(false)
  const searchParams = useSearchParams()
  const { clearUsers } = useUserStore()

  const getKey = (
    pageIndex: number,
    previousPageData: PaginatedUserResponse | null
  ) => {
    const currentPageIndex = pageIndex + 1

    // If we reach the end, return null
    if (previousPageData && !previousPageData.next_page) return null

    // Build query string dynamically
    const keyParams = `page=${currentPageIndex}${searchParams.toString() && `&${searchParams.toString()}`}`

    // Return the key for the next page
    return keyParams
  }

  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite(
      getKey,
      async (params: string) => {
        const response = await userService.getUsers(orgSlug, params)
        return response.data
      },
      { keepPreviousData: true }
    )

  const hasStaleData = data !== undefined
  const usersData = data && data.flatMap((page) => page.data)
  const isTotalUsers = data?.at(-1)?.total === usersData?.length

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      const scrolledHeight = window.scrollY
      const percentageScrolled =
        (scrolledHeight / (totalHeight - viewportHeight)) * 100
      setScrollPosition(Number(percentageScrolled.toFixed()))
    }

    window.addEventListener('scroll', handleScroll)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (
      scrollPosition > 90 &&
      !fetchLoading &&
      !isValidating &&
      !isTotalUsers
    ) {
      setFetchLoading(true)
      setSize(size + 1)
    }

    if (!isValidating) {
      setFetchLoading(false)
    }
  }, [scrollPosition])

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

  const handleModalClose = () => {
    clearUsers()
    mutate() // Refresh the data after status change
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex gap-4 bg-white px-4 py-6 border-b border-b-gray-300'>
          <Search />
          <ActionPopover />
        </div>
        <div className='flex flex-col gap-4 px-4 py-6'>
          {usersData && usersData?.length ? (
            usersData.map((user) => (
              <UserCard key={user._id} user={user} orgSlug={orgSlug} />
            ))
          ) : (
            <p className='text-center text-foreground'>No data found.</p>
          )}
          {isValidating && !isTotalUsers && <LoadingMoreIndicator />}
        </div>
      </div>
      <SetStatusModal onCancel={handleModalClose} />
    </>
  )
}

export default UsersInfiniteScroll
