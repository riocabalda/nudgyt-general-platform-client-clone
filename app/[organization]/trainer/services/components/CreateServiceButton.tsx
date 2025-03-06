'use client'

import React from 'react'
import { Button } from '@/app/(shared)/components/ui/button'
import Link from 'next/link'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function CreateServiceButton() {
  const { orgSlug } = useOrganization()

  return (
    <Link href={`/${orgSlug}/trainer/services/create`}>
      <Button className='w-full'>Create Service</Button>
    </Link>
  )
}

export default CreateServiceButton
