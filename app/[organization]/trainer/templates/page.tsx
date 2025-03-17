'use client'

import React, { useEffect } from 'react'
import MainContainer from '@/app/(shared)/components/MainContainer'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import { roles } from '@/app/(shared)/services/userService'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import CreateTemplateButton from './components/CreateTemplateButton'
import Search from '@/app/(shared)/components/Search'
import TemplatePagination from './components/TemplatePagination'
import FilterPopover from './components/FilterPopover'
import FilterPopoverMobile from './components/mobile/FilterPopoverMobile'
import Templates from './components/Templates'
import TemplateInfiniteScroll from './components/mobile/TemplateInfiniteScroll'
import useSWR from 'swr'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import templateService from '@/app/(shared)/services/trainer/templateService'
import TemplatesTab from './components/TemplatesTab'

function TemplatesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { orgSlug } = useOrganization()

  useEffect(() => {
    if (searchParams.get('page') === null) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', '1')
      router.replace(`${pathname}?${params.toString()}`)
    }
  }, [searchParams, pathname, router])

  const { data: templateData } = useSWR(
    orgSlug ? `/${orgSlug}/trainer/templates?${searchParams.toString()}` : null,
    () =>
      templateService
        .getTemplates(orgSlug ?? '', searchParams.toString())
        .then((res) => res.data)
  )

  useEffect(() => {
    if (searchParams.get('search') && searchParams.get('page')) {
      const params = new URLSearchParams(searchParams.toString())

      params.set('page', '1')
      router.replace(`${pathname}?${params.toString()}`)
    }
  }, [searchParams.get('search')])

  return (
    <RequireAuth role={[roles.superadmin, roles.admin, roles.trainer]}>
      <MainContainer
        headerMobile={
          <MainContainer.HeaderMobile title='Templates' showBackBtn />
        }
        headerDesktop={
          <MainContainer.HeaderDesktop
            title='Templates'
            slotEnd={<CreateTemplateButton />}
          />
        }
        className='lg:px-0'
      >
        <>
          <div className='hidden lg:block'>
            <TemplatesTab />
          </div>
          <div className='flex bg-white border-b border-b-slate-300 lg:border-b-0 lg:bg-transparent lg:container px-4 lg:px-10 py-6 lg:py-10 lg:pb-0 lg:grid grid-cols-3 gap-4 lg:gap-6 items-center'>
            <Search
              isRemovePageQueryOnSearch={false}
              containerClass='lg:w-full'
            />
            <TemplatePagination data={templateData} />
            {templateData?.data && templateData?.data.length > 0 && (
              <div className='hidden lg:flex justify-end gap-[24px]'>
                <FilterPopover />
              </div>
            )}
            <div className='lg:hidden'>
              <FilterPopoverMobile />
            </div>
          </div>

          <div className='lg:hidden mt-4 overflow-x-auto pb-[2px] lg:!pb-0'>
            <TemplatesTab />
          </div>
          <div className='hidden lg:block lg:mt-6 lg:container px-4 lg:px-[40px]'>
            <Templates />
          </div>
          <div className='mt-4 px-4 lg:hidden'>
            <TemplateInfiniteScroll />
          </div>
        </>
      </MainContainer>
    </RequireAuth>
  )
}

export default TemplatesPage
