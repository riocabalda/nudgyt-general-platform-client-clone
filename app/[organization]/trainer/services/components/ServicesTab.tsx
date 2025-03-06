'use client'

import { StyledTabItem, StyledTabs } from '@/app/(shared)/components/StyledTabs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const ServicePageTab = {
  ALL: 'all',
  MY_SERVICES: 'my-services',
  PUBLISHED: 'published',
  DRAFTS: 'drafts'
} as const

function ServicesTab() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function getDefaultTab() {
    if (
      !searchParams.has('is_published') &&
      !searchParams.has('user_services')
    ) {
      return ServicePageTab.ALL
    }

    if (searchParams.get('user_services')) {
      return ServicePageTab.MY_SERVICES
    }

    if (searchParams.get('is_published') === 'true') {
      return ServicePageTab.PUBLISHED
    }

    if (searchParams.get('is_published') === 'false') {
      return ServicePageTab.DRAFTS
    }

    throw new Error('Unknown default tab')
  }

  function isPublishedParam(isPublished?: boolean | null) {
    const params = new URLSearchParams(searchParams.toString())
    const filterParam = searchParams.get('sort_by')
    const pageParam = searchParams.get('page')

    if (pageParam && pageParam !== '1') {
      params.delete('page')
    }

    if (filterParam) {
      params.delete('sort_by')
    }

    if (isPublished === null) {
      params.delete('is_published')
      params.delete('user_services')
    } else if (isPublished !== undefined) {
      params.set('is_published', String(isPublished))
      params.delete('user_services')
    } else {
      params.delete('is_published')
      params.set('user_services', 'true')
    }

    return params.toString()
  }

  function getParamsFromTabValue(tab: string) {
    if (tab === ServicePageTab.ALL) {
      return isPublishedParam(null)
    }
    if (tab === ServicePageTab.MY_SERVICES) {
      return isPublishedParam()
    }
    if (tab === ServicePageTab.PUBLISHED) {
      return isPublishedParam(true)
    }
    if (tab === ServicePageTab.DRAFTS) {
      return isPublishedParam(false)
    }

    throw new Error('Unknown tab value')
  }

  function reflectTabInParams(tab: string) {
    const params = getParamsFromTabValue(tab)

    router.replace(`${pathname}?${params}`)
  }

  /** Tab contents are rendered separately... */
  return (
    <div className='overflow-x-hidden w-full pb-1'>
      <StyledTabs
        value={getDefaultTab()}
        onValueChange={reflectTabInParams}
        className='min-h-fit'
      >
        <StyledTabItem
          name='All'
          value={ServicePageTab.ALL}
          className='lg:p-0'
        />
        <StyledTabItem
          name='My Services'
          value={ServicePageTab.MY_SERVICES}
          className='lg:p-0'
        />
        <StyledTabItem
          name='Published'
          value={ServicePageTab.PUBLISHED}
          className='lg:p-0'
        />
        <StyledTabItem
          name='Drafts'
          value={ServicePageTab.DRAFTS}
          className='lg:p-0'
        />
      </StyledTabs>
    </div>
  )
}

export default ServicesTab
