'use client'

import React, { useState } from 'react'
import { Loader } from 'lucide-react'
import { cn } from '@/app/(shared)/utils'
import { useParams } from 'next/navigation'
import { ServiceTypeEnum } from '@/app/(shared)/types'
import { Button } from '@/app/(shared)/components/ui/button'
import { Dialog, DialogTrigger } from '@/app/(shared)/components/ui/dialog'
import useUser from '@/app/(shared)/hooks/useUser'
import useGetService from '../hooks/useGetService'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useAlertStore from '@/app/(shared)/components/alert/useAlertStore'
import serviceService from '@/app/(shared)/services/admin/serviceService'
import '../style.css'

function PublishServiceBtn() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { serviceId } = useParams()
  const { orgSlug } = useOrganization()
  const { showAlert } = useAlertStore()

  const { serviceData, mutate } = useGetService(orgSlug, String(serviceId))
  const { user } = useUser()
  const isUserService = serviceData?.creator._id.toString() === user?._id

  const isBasicServiceLevel =
    serviceData?.service_type.type === ServiceTypeEnum.BASIC &&
    serviceData?.basic_level

  const hasEmptyServiceLevel = serviceData?.multi_level.some(
    (level) =>
      !level ||
      !level.characters.length ||
      typeof level.environment !== 'object' ||
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

  const handlePublishService = async () => {
    setIsSubmitting(true)
    try {
      await serviceService.publishService(orgSlug, String(serviceId))

      showAlert({
        message: 'Service  published',
        variant: 'success'
      })
      mutate()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Dialog>
      <DialogTrigger
        disabled={isSubmitting || !isPublishable}
        onClick={handlePublishService}
        asChild
      >
        <Button
          variant='default'
          className={cn('w-full', !isUserService && 'hidden')}
        >
          {isSubmitting ? (
            <>
              <Loader className='w-4 h-4 mr-2 animate-spin' /> Publishing
            </>
          ) : (
            'Publish'
          )}
        </Button>
      </DialogTrigger>
    </Dialog>
  )
}

export default PublishServiceBtn
