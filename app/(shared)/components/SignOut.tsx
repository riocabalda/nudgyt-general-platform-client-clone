'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import authTokenService from '../services/authTokenService'

function SignOut() {
  const router = useRouter()

  const handleSignOutClick = () => {
    authTokenService.removeTokens()
    router.replace('/sign-in')
  }

  return (
    <button
      onClick={handleSignOutClick}
      className='flex items-center gap-4 lg:gap-[32px] p-4 font-medium rounded-[8px] text-foreground-800 hover:bg-primary-100 h-[48px]'
    >
      <LogOut className='size-5 text-brandcolora' /> Logout
    </button>
  )
}

export default SignOut
