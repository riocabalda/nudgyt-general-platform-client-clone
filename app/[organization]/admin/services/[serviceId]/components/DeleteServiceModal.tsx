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
import { Loader } from 'lucide-react'
import serviceService from '@/app/(shared)/services/admin/serviceService'
import useGetService from '../hooks/useGetService'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function DeleteServiceModal({
  setDropdownOpen
}: {
  setDropdownOpen?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showAlert } = useAlertStore()

  const { serviceId } = useParams()
  const { orgSlug } = useOrganization()

  const { mutate } = useGetService(orgSlug, String(serviceId))
  const router = useRouter()

  const handleDeleteService = async () => {
    setIsSubmitting(true)
    try {
      await serviceService.deleteService(orgSlug, String(serviceId))
      mutate()
      router.push(`/${orgSlug}/admin/services`)
      showAlert({ message: 'Service deleted', variant: 'success' })
    } catch (error) {
      console.log(error)
    } finally {
      setOpen(false)
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='justify-start rounded-none text-left text-sm font-normal !px-3 h-fit py-2'
        >
          Delete Service
        </Button>
      </DialogTrigger>
      <DialogContent className='!rounded-[8px] lg:p-6 w-full max-w-[90%] lg:max-w-[600px] gap-0'>
        <DialogHeader>
          <DialogTitle className='text-left text-[20px] font-semibold lg:text-2xl text-foreground'>
            Delete Service
          </DialogTitle>
          <DialogDescription className='text-left lg:text-base text-neutral-gray-600 !mt-6'>
            Are you sure you want to delete this service?
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
            onClick={handleDeleteService}
          >
            {isSubmitting ? (
              <>
                <Loader className='w-4 h-4 mr-2 animate-spin' /> Deleting
              </>
            ) : (
              'Yes, delete'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteServiceModal
