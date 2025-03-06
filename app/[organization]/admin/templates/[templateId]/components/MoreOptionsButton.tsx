'use client'

import React, { useState } from 'react'
import { Button } from '@/app/(shared)/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/app/(shared)/components/ui/dropdown-menu'
import { Ellipsis } from 'lucide-react'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { useParams, useRouter } from 'next/navigation'
import DeleteTemplateModal from './DeleteTemplateModal'
import useGetTemplate from '../hooks/useGetTemplate'

function MoreOptionsButton() {
  const router = useRouter()
  const { templateId } = useParams()
  const { orgSlug, membership } = useOrganization()

  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { data: templateData } = useGetTemplate(orgSlug, String(templateId))

  const isTemplateShared = templateData?.data.shared_to_organizations.includes(
    membership?.organization?._id as string
  )

  const handleEditTemplate = () => {
    router.push(`/${orgSlug}/admin/templates/${templateId}/edit`)
  }

  const handleUseTemplate = () => {
    router.push(`/${orgSlug}/admin/services/create?templateId=${templateId}`)
  }

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='!px-[14px] focus-visible:ring-0 focus-visible:ring-offset-0 text-brandcolora'
        >
          <Ellipsis size={20} strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-[215px] rounded-sm px-0 py-2 mt-3'
        align='end'
      >
        <Button
          variant='ghost'
          className='w-full !justify-start text-sm font-normal !px-3 h-fit py-2 disabled:bg-white disabled:text-neutral-gray-600'
          onClick={handleEditTemplate}
        >
          Edit template
        </Button>
        {templateData?.data.is_published && isTemplateShared && (
          <Button
            variant='ghost'
            className='w-full !justify-start text-sm font-normal !px-3 h-fit py-2 disabled:bg-white disabled:text-neutral-gray-600'
            onClick={handleUseTemplate}
          >
            Use template
          </Button>
        )}
        <DeleteTemplateModal setDropdownOpen={setDropdownOpen} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MoreOptionsButton
