import { PropsWithChildren, ReactNode } from 'react'
import { cn } from '../utils'
import BackButton from './BackButton'
import Sidebar from './Sidebar'
import SidebarDrawer from './SidebarMobile'

function MainContainer({
  children,
  headerMobile,
  headerDesktop,
  className,
  hideSidebar
}: PropsWithChildren<{
  className?: string
  headerMobile?: ReactNode
  headerDesktop?: ReactNode
  hideSidebar?: boolean
}>) {
  return (
    <div className='flex min-h-svh'>
      {!hideSidebar && <Sidebar />}
      <div className='w-full overflow-hidden'>
        {headerMobile}
        {headerDesktop}
        <main className={cn('pb-4 lg:pb-[24px] lg:overflow-y-auto', className)}>
          {children}
        </main>
      </div>
    </div>
  )
}

function HeaderMobile({
  title,
  hideMenuBtn,
  showBackBtn
}: {
  title: string
  hideMenuBtn?: boolean
  showBackBtn?: boolean
}) {
  return (
    <div className='flex items-center justify-between  border-b h-[60px] bg-white lg:hidden px-4'>
      <div className='flex items-center'>
        {showBackBtn && <BackButton />}
        <h1 className='font-medium font-inter'>{title}</h1>
      </div>
      {!hideMenuBtn && <SidebarDrawer />}
    </div>
  )
}

function HeaderDesktop({
  title,
  slotEnd,
  showBackBtn,
  onBackBtnClick
}: {
  title: string
  slotEnd?: ReactNode
  showBackBtn?: boolean
  onBackBtnClick?: () => void
}) {
  return (
    <div className='hidden lg:container lg:px-[40px] lg:flex flex-col gap-[20px] lg:flex-row lg:items-center justify-between py-[36px] px-[40px]'>
      <div className='flex items-center'>
        {showBackBtn && <BackButton onClick={onBackBtnClick} />}
        <h1 className='font-semibold lg:text-2xl'>{title}</h1>
      </div>
      {slotEnd}
    </div>
  )
}

MainContainer.HeaderMobile = HeaderMobile
MainContainer.HeaderDesktop = HeaderDesktop

export default MainContainer
