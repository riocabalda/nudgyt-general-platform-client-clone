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
import ConfigureAccessModal from './ConfigureAccessModal'
import templateService from '@/app/(shared)/services/admin/templateService'
import useAlertStore from '@/app/(shared)/components/alert/useAlertStore'
import useUser from '@/app/(shared)/hooks/useUser'

function MoreOptionsButton() {
  const router = useRouter()
  const { templateId } = useParams()
  const { orgSlug, membership } = useOrganization()
  const { showAlert } = useAlertStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user } = useUser()

  const { data: templateData } = useGetTemplate(orgSlug, String(templateId))

  const isTemplateShared = templateData?.data.shared_to_organizations.includes(
    membership?.organization?._id as string
  )

  const isCreator =
    user && user._id === (templateData?.data.creator as unknown as string)

  const isSuperAdmin = user?.is_super_admin ?? false

  const handleEditTemplate = () => {
    router.push(`/${orgSlug}/admin/templates/${templateId}/edit`)
  }

  const handleUseTemplate = () => {
    router.push(`/${orgSlug}/admin/services/create?templateId=${templateId}`)
  }

  const handleDuplicateTemplate = async () => {
    try {
      const { data } = await templateService.duplicateTemplate(
        String(orgSlug),
        String(templateId)
      )
      showAlert({
        message: 'Template duplicated successfully',
        variant: 'success'
      })
      router.replace(`/${orgSlug}/admin/templates/${data.data._id}`)
    } catch (error) {
      console.error(error)
    }
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
          className='w-full !justify-start text-sm font-normal !px-3 h-fit py-2 disabled:bg-white disabled:text-neutral-gray-600 rounded-none'
          onClick={handleEditTemplate}
          disabled={templateData?.data.is_published}
        >
          Edit Template
        </Button>
        {templateData?.data.is_published && isTemplateShared && (
          <Button
            variant='ghost'
            className='w-full !justify-start text-sm font-normal !px-3 h-fit py-2 disabled:bg-white disabled:text-neutral-gray-600 rounded-none'
            onClick={handleUseTemplate}
          >
            Use Template
          </Button>
        )}
        <DeleteTemplateModal setDropdownOpen={setDropdownOpen} />
        {isCreator && isSuperAdmin && (
          <Button
            variant='ghost'
            className='w-full !justify-start text-sm font-normal !px-3 h-fit py-2 disabled:bg-white disabled:text-neutral-gray-600 rounded-none'
            onClick={handleDuplicateTemplate}
          >
            Duplicate Template
          </Button>
        )}
        <ConfigureAccessModal />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MoreOptionsButton
