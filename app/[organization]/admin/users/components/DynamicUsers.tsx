'use client'

import FilterPopover from '@/app/(shared)/(users)/FilterPopover'
import Search from '@/app/(shared)/components/Search'
import Users from './Users'
import UsersInfiniteScroll from './mobile/UsersInfiniteScroll'

function DynamicUsersMobile() {
  return <UsersInfiniteScroll />
}

function DynamicUsersDesktop() {
  const actionItems = [
    <div key='search-filter' className='flex gap-2'>
      <Search containerClass='lg:w-full xl:w-[344px]' />
      <div className='block lg:hidden'>
        <FilterPopover />
      </div>
    </div>
  ]

  return <Users actionItems={actionItems} />
}

function DynamicUsers() {
  return (
    <>
      <div className='hidden lg:block'>
        <DynamicUsersDesktop />
      </div>

      <div className='lg:hidden'>
        <DynamicUsersMobile />
      </div>
    </>
  )
}

export default DynamicUsers
