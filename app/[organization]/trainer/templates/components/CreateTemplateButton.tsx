'use client'

import React from 'react'
import { Button } from '@/app/(shared)/components/ui/button'
import Link from 'next/link'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function CreateTemplateButton() {
  const { orgSlug } = useOrganization()

  return (
    <Link href={`/${orgSlug}/trainer/templates/create`}>
      <Button className='w-full'>Create Template</Button>
    </Link>
  )
}

export default CreateTemplateButton
