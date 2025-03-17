'use client'

import React, { useState } from 'react'
import { Button } from '@/app/(shared)/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/app/(shared)/components/ui/dropdown-menu'
import { Ellipsis } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import DeleteServiceModal from './DeleteServiceModal'
import useUser from '@/app/(shared)/hooks/useUser'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useGetService from '../hooks/useGetService'
import { cn } from '@/app/(shared)/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/app/(shared)/components/ui/dialog'
import serviceService from '@/app/(shared)/services/admin/serviceService'

function MoreOptionMenu() {
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const { user } = useUser()
  const { serviceId } = useParams()
  const { orgSlug } = useOrganization()
  const { serviceData } = useGetService(orgSlug, String(serviceId))
  const isUserService = serviceData?.creator._id.toString() === user?._id

  const handleEditService = async () => {
    await serviceService.unpublishService(orgSlug, String(serviceId))
    router.push(`/${orgSlug}/admin/services/${serviceId}/edit`)
  }

  const handleShowEditModal = () => {
    if (serviceData?.is_published) {
      setShowEditModal(true)
    } else {
      router.push(`/${orgSlug}/admin/services/${serviceId}/edit`)
    }
  }

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className={cn(
              '!px-[14px] focus-visible:ring-0 focus-visible:ring-offset-0 text-brandcolorf',
              !isUserService && 'hidden'
            )}
          >
            <Ellipsis size={20} strokeWidth={1.5} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='min-w-[165px] rounded-sm flex flex-col px-0 py-2 mt-3'
          align='end'
        >
          <Button
            variant='ghost'
            className='w-full justify-start rounded-none text-sm font-normal !px-3 h-fit py-2 disabled:bg-white disabled:text-neutral-gray-600'
            onClick={handleShowEditModal}
          >
            Edit Service
          </Button>
          <DeleteServiceModal setDropdownOpen={setDropdownOpen} />
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className='!rounded-2xl w-[90%] max-w-[600px] gap-6 p-6'>
          <DialogHeader>
            <DialogTitle className='text-lg font-semibold lg:text-2xl text-left'>
              Edit published service
            </DialogTitle>
            <DialogDescription className='text-left lg:text-base text-neutral-gray-600 space-y-4 !mt-6'>
              <p>
                Editing this service will unpublish it will be saved as a draft.
                It can be published after it has been edited.
              </p>
              <p>Are you sure you want to edit this service?</p>
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col lg:flex-row items-center justify-end gap-6'>
            <Button
              variant='outline'
              className='w-full lg:w-[161px]'
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button
              className='!px-12 py-3 w-full lg:w-fit'
              onClick={handleEditService}
            >
              Yes, edit service
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MoreOptionMenu
