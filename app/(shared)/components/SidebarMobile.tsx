'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/app/(shared)/components/ui/sheet'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import useIsUserPublicAdmin from '../hooks/useIsUserPublicAdmin'
import useOrganization from '../hooks/useOrganization'
import useUser from '../hooks/useUser'
import AccountSwitcher from './AccountSwitcher'
import { NAVIGATION_DATA } from './Sidebar'
import SidebarSection from './SidebarSection'
import SignOut from './SignOut'

function SidebarDrawer() {
  const { user } = useUser()
  const { orgSlug, membership } = useOrganization()
  const { isUserPublicAdmin } = useIsUserPublicAdmin()

  const isSuperAdmin = user?.is_super_admin ?? false
  const isOwner = membership?.is_owner ?? false

  const withOrganizationsLink = isSuperAdmin || isUserPublicAdmin

  const firstOrgRole = membership?.roles[0]

  if (firstOrgRole === undefined) {
    return null
  }

  const navData = NAVIGATION_DATA(orgSlug, { isOwner, withOrganizationsLink })[
    firstOrgRole
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='bg-transparent border-none hover:bg-muted translate-x-[8px]'
        >
          <Menu className='size-[32px]' strokeWidth='1.5' />
        </Button>
      </SheetTrigger>

      <SheetContent
        side='right'
        className='px-4 border-none bg-white overflow-y-auto flex flex-col gap-0'
      >
        <SheetHeader className='mb-6 sr-only'>
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>Select an action</SheetDescription>
        </SheetHeader>

        {/* Logo */}
        <Link href='/'>
          <Image
            src='/images/nudgyt-logo.png'
            alt='Nudgyt logo'
            height={50}
            width={200}
            quality={100}
            className='lg:block object-contain object-left'
          />
        </Link>

        <AccountSwitcher className='mt-[40px]' />

        <nav className='flex flex-col gap-1 grow'>
          <SidebarSection title='Dashboard' data={navData.Dashboard} />
          <SidebarSection
            title='Organization Settings'
            data={navData.Settings}
          />

          <div className='grow' />

          <SidebarSection title='Account' data={navData.Account} />

          <SignOut />
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default SidebarDrawer
