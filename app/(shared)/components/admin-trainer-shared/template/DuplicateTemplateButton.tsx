'use client'

import React from 'react'
import { Button } from '@/app/(shared)/components/ui/button'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { useParams, useRouter } from 'next/navigation'

function DuplicateTemplateButton({ role = 'admin' }: { role?: string }) {
  const router = useRouter()
  const { orgSlug } = useOrganization()
  const { templateId } = useParams()

  const handleUseTemplate = () => {
    router.push(`/${orgSlug}/${role}/services/create?templateId=${templateId}`)
  }

  return <Button onClick={handleUseTemplate}>Use this template</Button>
}

export default DuplicateTemplateButton
