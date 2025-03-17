'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import useInvitations from '../hooks/useInvitations'
import { cn } from '../utils'

type Nav = {
  label: string
  pathname: string
  icon: ReactNode
}

type NavigationsProps = {
  navs: Nav[]
}

function NotificationMark() {
  return (
    <div
      className={cn(
        'select-none',
        'w-7 h-5 rounded-[100px] bg-brandcolora',
        'text-xs text-white font-semibold',
        'grid place-items-center'
      )}
    >
      !
    </div>
  )
}

function AccountNotificationMark(props: { nav: Nav }) {
  const { nav } = props
  const { hasInvitations } = useInvitations()

  const isCorrectNav = nav.pathname.includes('/account')
  if (!isCorrectNav) {
    return null
  }

  if (!hasInvitations) {
    return null
  }

  return <NotificationMark />
}

function NavigationLink(props: { nav: Nav }) {
  const { nav } = props

  const pathname = usePathname()

  const isActive = pathname.includes(nav.pathname)

  return (
    <Link
      key={nav.pathname}
      href={nav.pathname}
      className={cn(
        'h-12',
        'flex items-center gap-4 lg:gap-8 p-4 rounded-[8px]',
        'text-foreground-800 font-medium',
        !isActive && 'transition hover:bg-brandcolora/10',
        isActive && 'bg-brandcolora/10 font-bold'
      )}
    >
      {nav.icon} {nav.label}
      <span className='ml-auto'>
        <AccountNotificationMark nav={nav} />
      </span>
    </Link>
  )
}

function Navigations({ navs }: NavigationsProps) {
  return navs.map((nav) => <NavigationLink key={nav.pathname} nav={nav} />)
}

export default Navigations
