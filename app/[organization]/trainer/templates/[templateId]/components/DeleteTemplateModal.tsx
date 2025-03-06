'use client'

import React, { useState } from 'react'
import useAlertStore from '@/app/(shared)/components/alert/useAlertStore'
import { Button } from '@/app/(shared)/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/(shared)/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useParams, useRouter } from 'next/navigation'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import templateService from '@/app/(shared)/services/trainer/templateService'
import useGetTemplate from '../hooks/useGetTemplate'

function DeleteTemplateModal({
  setDropdownOpen
}: {
  setDropdownOpen?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showAlert } = useAlertStore()

  const { templateId } = useParams()
  const { orgSlug } = useOrganization()

  const { data: templateData } = useGetTemplate(
    String(orgSlug),
    String(templateId)
  )

  const router = useRouter()

  const handleDeleteTemplate = async () => {
    setIsSubmitting(true)
    try {
      await templateService.deleteTemplate(String(orgSlug), String(templateId))
      router.push(`/${orgSlug}/trainer/templates`)
      showAlert({ message: 'Template deleted', variant: 'success' })
    } catch (error) {
      console.log(error)
    } finally {
      setOpen(false)
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='hidden lg:block' asChild>
        <Button
          variant='ghost'
          className='w-full text-left text-sm font-normal !px-3 h-fit py-2 disabled:bg-white disabled:text-neutral-gray-600 disabled:cursor-not-allowed'
          disabled={templateData?.data.is_published}
        >
          Delete template
        </Button>
      </DialogTrigger>
      <DialogTrigger className='lg:hidden' asChild>
        <Button variant='destructive' className=' w-full text-base font-medium'>
          Delete template
        </Button>
      </DialogTrigger>
      <DialogContent className='!rounded-[8px] lg:p-6 w-full max-w-[90%] lg:max-w-[600px] gap-0'>
        <DialogHeader>
          <DialogTitle className='text-left text-[20px] font-semibold lg:text-2xl text-foreground'>
            Delete template
          </DialogTitle>
          <DialogDescription className='text-left lg:text-base text-neutral-gray-600 !mt-6'>
            Are you sure you want to delete this template?
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col lg:flex-row items-center justify-end gap-6 mt-6'>
          <Button
            variant='outline'
            className='w-full lg:w-[161px]'
            disabled={isSubmitting}
            onClick={() => {
              setOpen(false)
              if (setDropdownOpen) setDropdownOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button
            className='w-full lg:w-[183px] bg-destructive hover:bg-destructive/80'
            disabled={isSubmitting}
            onClick={handleDeleteTemplate}
          >
            Yes, delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteTemplateModal
