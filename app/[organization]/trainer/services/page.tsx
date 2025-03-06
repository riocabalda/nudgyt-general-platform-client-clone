import MainContainer from '@/app/(shared)/components/MainContainer'
import Search from '@/app/(shared)/components/Search'
import SortPopoverMobile from '@/app/(shared)/components/admin-trainer-shared/services/mobile/SortPopoverMobile'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import { roles } from '@/app/(shared)/services/userService'
import CreateServiceButton from './components/CreateServiceButton'
import Services from './components/Services'
import ServicesPagination from './components/ServicesPagination'
import ServicesTab from './components/ServicesTab'
import SortPopover from './components/SortPopover'
import ServicesInfiniteScroll from './components/mobile/ServicesInfiniteScroll'

function ServicesPage() {
  return (
    <RequireAuth role={[roles.trainer]}>
      <MainContainer
        headerMobile={
          <MainContainer.HeaderMobile title='Services' showBackBtn />
        }
        headerDesktop={
          <MainContainer.HeaderDesktop
            title='Services'
            slotEnd={<CreateServiceButton />}
          />
        }
        className='lg:px-0'
      >
        <div>
          <div className='hidden lg:block'>
            <ServicesTab />
          </div>
          <div className='flex bg-white border-b border-b-slate-300 lg:border-b-0 lg:bg-transparent lg:container px-4 lg:px-10 py-6 lg:py-10 lg:pb-0 lg:grid grid-cols-3 gap-4 lg:gap-6 items-center'>
            <Search
              isRemovePageQueryOnSearch={false}
              containerClass='lg:w-full'
            />
            <ServicesPagination />
            <div className='hidden lg:flex justify-end gap-[24px]'>
              <SortPopover />
            </div>
            <div className='lg:hidden'>
              <SortPopoverMobile />
            </div>
          </div>

          <div className='lg:hidden mt-4 overflow-x-auto pb-[2px] lg:!pb-0'>
            <ServicesTab />
          </div>

          <div className='hidden lg:block lg:mt-6 lg:container px-4 lg:px-[40px]'>
            <Services />
          </div>
          <div className='mt-4 px-4 lg:hidden'>
            <ServicesInfiniteScroll />
          </div>
        </div>
      </MainContainer>
    </RequireAuth>
  )
}

export default ServicesPage
