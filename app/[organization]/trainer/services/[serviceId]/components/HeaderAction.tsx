'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import MoreOptionMenu from './MoreOptionMenu'
import PublishServiceBtn from './PublishServiceBtn'
import UnpublishServiceModal from './UnpublishServiceModal'
import useGetService from '../hooks/useGetService'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import TryServiceBtn from './TryServiceBtn'

function HeaderActions() {
  const { orgSlug } = useOrganization()
  const { serviceId } = useParams()
  const { serviceData } = useGetService(orgSlug, String(serviceId))
  const isPublished = serviceData?.is_published
  return (
    <div className='flex items-center gap-3'>
      <TryServiceBtn />
      {!isPublished ? <PublishServiceBtn /> : <UnpublishServiceModal />}
      <MoreOptionMenu />
    </div>
  )
}

export default HeaderActions
