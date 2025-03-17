'use client'

import React, { useState } from 'react'
import { Loader } from 'lucide-react'
import { cn } from '@/app/(shared)/utils'
import { useParams } from 'next/navigation'
import { ServiceTypeEnum } from '@/app/(shared)/types'
import { Button } from '@/app/(shared)/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/(shared)/components/ui/dialog'
import useGetService from '../hooks/useGetService'
import useUser from '@/app/(shared)/hooks/useUser'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import serviceService from '@/app/(shared)/services/admin/serviceService'
import useAlertStore from '@/app/(shared)/components/alert/useAlertStore'
import '../style.css'

function UnpublishServiceModal() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { serviceId } = useParams()
  const { orgSlug } = useOrganization()
  const { showAlert } = useAlertStore()

  const { serviceData, mutate } = useGetService(orgSlug, String(serviceId))
  const { user } = useUser()

  const isUserService = serviceData?.creator._id.toString() === user?._id

  const isBasicServiceLevel =
    serviceData?.service_type.type === ServiceTypeEnum.BASIC ||
    serviceData?.basic_level

  const hasEmptyServiceLevel = serviceData?.multi_level.some(
    (level) =>
      !level ||
      !('character' in level) ||
      !('environment' in level) ||
      !level.character ||
      !level.environment ||
      !level.title?.trim() ||
      !level.description?.trim()
  )

  const isPublishable =
    !!isUserService &&
    serviceData &&
    !!serviceData.service_type &&
    (isBasicServiceLevel
      ? !!serviceData?.basic_level.characters.length &&
        !!serviceData?.basic_level.environment &&
        !!serviceData?.basic_level.title &&
        !!serviceData?.basic_level.description
      : !hasEmptyServiceLevel)

  const handleUnpublishService = async () => {
    setIsSubmitting(true)
    try {
      await serviceService.unpublishService(orgSlug, String(serviceId))
      showAlert({
        message: 'Service unpublished',
        variant: 'error'
      })
      mutate()
    } catch (error) {
      console.log(error)
    } finally {
      setIsModalOpen(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger disabled={isSubmitting || !isPublishable} asChild>
        <Button
          variant='destructive'
          className={cn('w-full', !isUserService && 'hidden')}
        >
          Unpublish
        </Button>
      </DialogTrigger>

      <DialogContent className='!rounded-2xl w-[90%] max-w-[600px] gap-6 p-6'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold lg:text-2xl text-left'>
            Unpublish service
          </DialogTitle>
          <DialogDescription className='text-left lg:text-base text-neutral-gray-600 !mt-6'>
            Are you sure you want to unpublish this service?
          </DialogDescription>
        </DialogHeader>
        {/*
         // TODO: Finalize the feature before implementation 
  
        <PublishUnpublishedModalContent
          isPublished={!!serviceData?.is_published}
          selectedOptions={selectedOptions}
          userOrgData={userOrgData}
          getSelectLabel={getSelectLabel}
          handleSelectionChange={handleSelectionChange}
          buttonAction={{
            variant: 'destructive',
            onClick: handleUnpublishService
          }}
        />
        
        // ====================== End ==========================
        */}

        <div className='flex flex-col lg:flex-row items-center justify-end gap-6'>
          <Button
            variant='outline'
            className='w-full lg:w-[161px]'
            disabled={isSubmitting}
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            className='!px-12 py-3 w-full lg:w-fit'
            onClick={handleUnpublishService}
          >
            {isSubmitting ? (
              <>
                <Loader className='w-4 h-4 mr-2 animate-spin' /> Unpublishing
              </>
            ) : (
              'Yes, unpublish service'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UnpublishServiceModal
