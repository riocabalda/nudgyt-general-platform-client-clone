'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/app/(shared)/components/ui/button'
import { Dialog, DialogTrigger } from '@/app/(shared)/components/ui/dialog'
import { Loader } from 'lucide-react'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useAlertStore from '@/app/(shared)/components/alert/useAlertStore'
import templateService from '@/app/(shared)/services/trainer/templateService'
import useGetTemplate from '../hooks/useGetTemplate'

function PublishTemplateButton() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { templateId } = useParams()
  const { orgSlug } = useOrganization()
  const { showAlert } = useAlertStore()

  const { data: templateData, mutate } = useGetTemplate(
    String(orgSlug),
    String(templateId)
  )

  const isPublishable =
    !!templateData &&
    !!templateData.data.title &&
    !!templateData.data.description &&
    !!templateData.data.service_type &&
    !!templateData.data.characters &&
    !!templateData.data.environment

  const handlePublishUnpublishTemplate = async () => {
    setIsSubmitting(true)
    try {
      if (templateData?.data.is_published) {
        await templateService.unpublishTemplate(orgSlug, String(templateId))
      } else {
        await templateService.publishTemplate(orgSlug, String(templateId))
      }

      mutate()

      showAlert({
        message: `Template ${
          templateData?.data.is_published ? 'unpublished' : 'published'
        }`,
        variant: 'success'
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        disabled={isSubmitting || !isPublishable}
        onClick={handlePublishUnpublishTemplate}
        asChild
      >
        <Button
          variant={templateData?.data.is_published ? 'destructive' : 'default'}
          className='w-full'
        >
          {isSubmitting ? (
            <>
              <Loader className='w-4 h-4 mr-2 animate-spin' />
              {templateData?.data.is_published
                ? ' Unpublishing'
                : ' Publishing'}
            </>
          ) : templateData?.data.is_published ? (
            'Unpublish'
          ) : (
            'Publish'
          )}
        </Button>
      </DialogTrigger>
    </Dialog>
  )
}

export default PublishTemplateButton
