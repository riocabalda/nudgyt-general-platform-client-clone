'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { capitalize } from '@/app/(shared)/utils'
import { REQUIRED_FILTERS, SERVICE_VIEW } from '../constants'
import Search from '@/app/(shared)/components/Search'
import ServicesPreview from './ServicesPreview'
import ServicesView from './ServicesView'
import MainContainer from '@/app/(shared)/components/MainContainer'
import SortPopover from './SortPopover'
import SearchResult from './SearchResult'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useGetParamsFromURL from '@/app/(shared)/hooks/useGetParamsFromURL'
import ServicesPagination from './ServicesPagination'

export type TRequiredFilter = {
  service_view: string
  search: string
  page: string
}

function ServicesContainer() {
  const { isURLTampered, searchParams } = useGetParamsFromURL({
    service_view: ['recent', 'new'],
    sort_by: [
      'newest',
      'oldest',
      'alphabetical',
      'most_attempts',
      'least_attempts',
      'saved_simulation'
    ]
  })
  const router = useRouter()

  const { orgSlug } = useOrganization()

  const isValidServiceView = (view: string | null): boolean => {
    return Object.values(SERVICE_VIEW).includes(view as string)
  }

  const hasServiceView = searchParams.has('service_view')
  const serviceViewParamValue = searchParams.get(REQUIRED_FILTERS.SERVICE_VIEW)
  const searchParamValue = searchParams.get(REQUIRED_FILTERS.SEARCH)
  const headerTitle = serviceViewParamValue
    ? capitalize(`${serviceViewParamValue} services`)
    : 'Services'
  const isShowBackBtn = Boolean(
    serviceViewParamValue && isValidServiceView(serviceViewParamValue)
  )

  if (isURLTampered) {
    router.push(`/${orgSlug}/learner/services`)
  }

  const renderServices = () => {
    if (serviceViewParamValue)
      return <ServicesView serviceViewValue={serviceViewParamValue} />
    else if (searchParamValue) return <SearchResult />
    return (
      <>
        <div className='space-y-10 px-4 mt-4 lg:container lg:py-0 lg:mt-10 lg:px-[40px]'>
          <ServicesPreview
            title='Your recent services'
            href={`/${orgSlug}/learner/services?service_view=recent`}
            filterView='recent'
          />
          <ServicesPreview
            title='New services'
            href={`/${orgSlug}/learner/services?service_view=new`}
            filterView='new'
          />
        </div>
      </>
    )
  }

  return (
    <MainContainer
      headerMobile={
        <MainContainer.HeaderMobile
          title={headerTitle}
          showBackBtn={isShowBackBtn}
        />
      }
      headerDesktop={
        <MainContainer.HeaderDesktop
          title={headerTitle}
          showBackBtn={isShowBackBtn}
        />
      }
      className='lg:px-0'
    >
      <div>
        <div className='flex bg-white border-b border-b-slate-300 lg:border-b-0 lg:bg-transparent lg:container px-4 lg:px-10 py-6 lg:py-0 lg:grid grid-cols-3 gap-4 lg:gap-6 items-center'>
          <Search isRemovePageQueryOnSearch={true} />
          {hasServiceView && <ServicesPagination />}

          {serviceViewParamValue &&
            isValidServiceView(serviceViewParamValue) && (
              <div className='ml-auto'>
                <SortPopover />
              </div>
            )}
        </div>
        <div>{renderServices()}</div>
      </div>
    </MainContainer>
  )
}

export default ServicesContainer
