'use client'

import React, { useState } from 'react'
import { Button } from '@/app/(shared)/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/app/(shared)/components/ui/dropdown-menu'
import { Ellipsis } from 'lucide-react'
import templateService from '@/app/(shared)/services/admin/templateService'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { useParams, useRouter } from 'next/navigation'
import useAlertStore from '../../alert/useAlertStore'
import useGetTemplate from '@/app/[organization]/admin/templates/[templateId]/hooks/useGetTemplate'
import useUser from '@/app/(shared)/hooks/useUser'

function MoreOptionsButton({ role = 'admin' }: { role?: string }) {
  const router = useRouter()
  const { orgSlug } = useOrganization()
  const { templateId } = useParams()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { showAlert } = useAlertStore()
  const { user } = useUser()

  const { data: templateData } = useGetTemplate(orgSlug, String(templateId))

  const isCreator =
    user && user._id === (templateData?.data.creator as unknown as string)

  const handleEditTemplate = () => {
    router.push(`/${orgSlug}/${role}/templates/${templateId}/edit`)
  }

  const handleDuplicateTemplate = async () => {
    try {
      const { data } = await templateService.duplicateTemplate(
        String(orgSlug),
        String(templateId)
      )
      router.replace(`/${orgSlug}/${role}/templates/${data.data._id}`)
      showAlert({
        message: 'Template duplicated successfully',
        variant: 'success'
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleUseTemplate = () => {
    router.push(`/${orgSlug}/${role}/services/create?templateId=${templateId}`)
  }

  return (
    <>
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
          {isCreator && (
            <Button
              variant='ghost'
              className='w-full !justify-start text-sm font-normal !px-3 h-fit py-2 disabled:bg-white disabled:text-neutral-gray-600'
              disabled={templateData?.data.is_published}
              onClick={handleEditTemplate}
            >
              Edit Template
            </Button>
          )}
          {templateData?.data.is_published && (
            <Button
              variant='ghost'
              className='w-full !justify-start text-sm font-normal !px-3 h-fit py-2 disabled:bg-white disabled:text-neutral-gray-600'
              onClick={handleUseTemplate}
            >
              Use Template
            </Button>
          )}
          <Button
            variant='ghost'
            className='w-full !justify-start text-sm font-normal !px-3 h-fit py-2 disabled:bg-white disabled:text-neutral-gray-600'
            onClick={handleDuplicateTemplate}
          >
            Duplicate Template
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default MoreOptionsButton
