'use client'

import { StyledTabItem, StyledTabs } from '@/app/(shared)/components/StyledTabs'
import { usePathname, useRouter } from 'next/navigation'
import usePageParams, { PageTab } from '../_hooks/usePageParams'
import OrganizationsTabInfinite from './_mobile/basic/OrganizationsTabInfinite'
import EnterprisesTabInfinite from './_mobile/enterprise/EnterprisesTabInfinite'
import OrganizationsTab from './basic/OrganizationsTab'
import EnterprisesTab from './enterprise/EnterprisesTab'

function OrganizationTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const { params } = usePageParams()

  function reflectTabInParams(value: string) {
    const params = new URLSearchParams({
      tab: value
    })

    router.replace(`${pathname}?${params}`)
  }

  return (
    <div className='overflow-x-hidden w-full'>
      <StyledTabs value={params.tab} onValueChange={reflectTabInParams}>
        <StyledTabItem name='Basic' value={PageTab.BASIC} className='lg:pt-8'>
          <div className='hidden lg:block'>
            <OrganizationsTab />
          </div>

          <div className='lg:hidden'>
            <OrganizationsTabInfinite />
          </div>
        </StyledTabItem>

        <StyledTabItem
          name='Enterprise'
          value={PageTab.ENTERPRISE}
          className='lg:pt-8'
        >
          <div className='hidden lg:block'>
            <EnterprisesTab />
          </div>

          <div className='lg:hidden'>
            <EnterprisesTabInfinite />
          </div>
        </StyledTabItem>
      </StyledTabs>
    </div>
  )
}

export default OrganizationTabs
