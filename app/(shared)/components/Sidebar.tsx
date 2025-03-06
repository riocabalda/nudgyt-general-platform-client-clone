'use client'

import {
  BookCopy,
  Building2,
  ChartNoAxesColumn,
  Home,
  // LayoutDashboard,
  LibraryBig,
  // ReceiptText,
  Settings,
  TimerReset,
  User,
  Users,
  UserSquare
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import useIsUserPublicAdmin from '../hooks/useIsUserPublicAdmin'
import useOrganization from '../hooks/useOrganization'
import useUser from '../hooks/useUser'
import { roles } from '../services/userService'
import { cn, withoutFalsy } from '../utils'
import AccountSwitcher from './AccountSwitcher'
import SidebarSection from './SidebarSection'
import SignOut from './SignOut'

const ADMIN_NAVIGATION_DATA = (
  orgSlug: string,
  options?: {
    isOwner?: boolean
    withOrganizationsLink?: boolean
  }
) => ({
  Dashboard: withoutFalsy(
    {
      label: 'Dashboard',
      pathname: encodeURI(`/${orgSlug}/admin/dashboard`),
      icon: <Home className='size-5 text-brandcolora' />
    },
    {
      label: 'Services',
      pathname: encodeURI(`/${orgSlug}/admin/services`),
      icon: <LibraryBig className='size-5 text-brandcolora' />
    },
    {
      label: 'Templates',
      pathname: encodeURI(`/${orgSlug}/admin/templates`),
      icon: <BookCopy className='size-5 text-brandcolora' />
    },
    {
      label: 'Users',
      pathname: encodeURI(`/${orgSlug}/admin/users`),
      icon: <Users className='size-5 text-brandcolora' />
    },
    options?.withOrganizationsLink && {
      label: 'Organizations',
      pathname: encodeURI(`/${orgSlug}/admin/organizations`),
      icon: <Building2 className='size-5 text-brandcolora' />
    },
    {
      label: 'Characters',
      pathname: encodeURI(`/${orgSlug}/admin/characters`),
      icon: <UserSquare className='size-5 text-brandcolora' />
    },
    // {
    //   label: 'Subscriptions',
    //   pathname: encodeURI(`/${orgSlug}/admin/subscriptions`),
    //   icon: <LayoutDashboard className='size-5 text-brandcolora' />
    // },
    {
      label: 'Activity Logs',
      pathname: encodeURI(`/${orgSlug}/admin/activity-logs`),
      icon: <TimerReset className='size-5 text-brandcolora' />
    }
  ),
  Settings: withoutFalsy(
    options?.isOwner && {
      label: 'General',
      pathname: encodeURI(`/${orgSlug}/admin/settings/general`),
      icon: <Settings className='size-5 text-brandcolora' />
    },
    options?.isOwner && {
      label: 'Usage',
      pathname: encodeURI(`/${orgSlug}/admin/settings/usage`),
      icon: <ChartNoAxesColumn className='size-5 text-brandcolora' />
    }
  ),
  Account: [
    {
      label: 'Account',
      pathname: encodeURI(`/${orgSlug}/admin/account`),
      icon: <User className='size-5 text-brandcolora' />
    }
    // {
    //   label: 'Billing',
    //   pathname: encodeURI(`/${orgSlug}/admin/billing`),
    //   icon: <ReceiptText className='size-5 text-brandcolora' />
    // }
  ]
})

export const NAVIGATION_DATA = (
  orgSlug: string,
  options?: {
    isOwner?: boolean
    withOrganizationsLink?: boolean
  }
) => ({
  [roles.superadmin]: ADMIN_NAVIGATION_DATA(orgSlug, options),
  [roles.admin]: ADMIN_NAVIGATION_DATA(orgSlug, options),

  [roles.trainer]: {
    Dashboard: [
      {
        label: 'Dashboard',
        pathname: encodeURI(`/${orgSlug}/trainer/dashboard`),
        icon: <Home className='size-5 text-brandcolora' />
      },
      {
        label: 'Services',
        pathname: encodeURI(`/${orgSlug}/trainer/services`),
        icon: <LibraryBig className='size-5 text-brandcolora' />
      },
      {
        label: 'Templates',
        pathname: encodeURI(`/${orgSlug}/trainer/templates`),
        icon: <BookCopy className='size-5 text-brandcolora' />
      },
      {
        label: 'Characters',
        pathname: encodeURI(`/${orgSlug}/trainer/characters`),
        icon: <UserSquare className='size-5 text-brandcolora' />
      }
    ],
    Settings: [],
    Account: [
      {
        label: 'Account',
        pathname: encodeURI(`/${orgSlug}/trainer/account`),
        icon: <User className='size-5 text-brandcolora' />
      }
    ]
  },

  [roles.learner]: {
    Dashboard: [
      {
        label: 'Dashboard',
        pathname: encodeURI(`/${orgSlug}/learner/dashboard`),
        icon: <Home className='size-5 text-brandcolora' />
      },
      {
        label: 'Services',
        pathname: encodeURI(`/${orgSlug}/learner/services`),
        icon: <LibraryBig className='size-5 text-brandcolora' />
      }
      // {
      //   label: 'Subscriptions',
      //   pathname: encodeURI(`/${orgSlug}/learner/subscriptions`),
      //   icon: <LayoutDashboard className='size-5 text-brandcolora' />
      // }
    ],
    Settings: [],
    Account: [
      {
        label: 'Account',
        pathname: encodeURI(`/${orgSlug}/learner/account`),
        icon: <User className='size-5 text-brandcolora' />
      }
    ]
  }
})

function Sidebar() {
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
    <div className='group'>
      <aside
        className={cn(
          'sticky top-0 h-screen overflow-y-auto',
          'min-w-[300px] max-w-[300px]',
          'hidden lg:flex flex-col p-5',
          'bg-white',
          'scrollbar-thin scrollbar-thumb-transparent group-hover:scrollbar-thumb-inherit' // Show scrollbar only on hover
        )}
      >
        {/* Logo */}
        <Link href='/'>
          <Image
            src='/images/nudgyt-logo.png'
            alt='Nudgyt logo'
            height={56}
            width={232}
            quality={100}
            className='lg:block object-contain object-left relative left-[10px]'
          />
        </Link>

        <AccountSwitcher className='mt-[18px]' />

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
      </aside>
    </div>
  )
}

export default Sidebar
