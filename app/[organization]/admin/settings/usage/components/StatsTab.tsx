'use client'
import { StyledTabItem, StyledTabs } from '@/app/(shared)/components/StyledTabs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import LearnerStatTable from './LearnerStatTable'
import ServiceStatTable from './ServiceStatTable'

function StatsTab() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedTab = searchParams.get('tab') ?? 'learners'

  function reflectTabInParams(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', value)

    router.replace(`${pathname}?${params}`)
  }

  return (
    <div className='overflow-x-hidden w-full'>
      <StyledTabs value={selectedTab} onValueChange={reflectTabInParams}>
        <StyledTabItem name='Learners' value='learners' className='lg:pt-8'>
          <LearnerStatTable />
        </StyledTabItem>

        <StyledTabItem name='Services' value='services' className='lg:pt-8'>
          <ServiceStatTable />
        </StyledTabItem>
      </StyledTabs>
    </div>
  )
}

export default StatsTab
