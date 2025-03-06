'use client'

import { Card } from '@/app/(shared)/components/ui/card'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useUser from '@/app/(shared)/hooks/useUser'

function PlatformOwner() {
  const { user } = useUser()
  const { membership } = useOrganization()

  const isOwner = membership?.is_owner ?? false

  if (user === undefined || !isOwner) {
    return null
  }

  return (
    <Card className='shadow-sm rounded-none lg:rounded-lg p-6'>
      <div className='flex justify-between'>
        <div className='space-y-3'>
          <header className='text-lg lg:text-xl font-semibold text-neutral-black'>
            Platform owner
          </header>

          <div>
            <p className='text-neutral-gray-600 font-semibold text-lg'>
              {user.full_name}
            </p>
            <p className='text-neutral-gray-600'>{user.email}</p>
          </div>
        </div>

        {/* <div><TransferOwnershipModal /></div> */}
      </div>
    </Card>
  )
}

export default PlatformOwner
