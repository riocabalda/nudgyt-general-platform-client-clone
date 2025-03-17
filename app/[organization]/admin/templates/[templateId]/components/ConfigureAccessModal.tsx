'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/app/(shared)/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/(shared)/components/ui/dialog'
import { MultiValue, PropsValue } from 'react-select'
import MultipleSelect from '@/app/(shared)/components/ui/multiple-select'
import { OptionType } from '../../create/hooks/useTemplateStore'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useGetOrganizations from '../hooks/useGetOrganizations'
import templateService from '@/app/(shared)/services/admin/templateService'
import { useParams } from 'next/navigation'
import useGetTemplate from '../hooks/useGetTemplate'
import useAlertStore from '@/app/(shared)/components/alert/useAlertStore'
import { Loader } from 'lucide-react'

function ConfigureAccessModal() {
  const { orgSlug } = useOrganization()
  const { templateId } = useParams()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedOrganizationIds, setSelectedOrganizationIds] = useState<
    PropsValue<OptionType>[]
  >([])

  const { showAlert } = useAlertStore()

  const { data: organizationData, isLoading } = useGetOrganizations(orgSlug)
  const { data: templateData, mutate } = useGetTemplate(
    orgSlug,
    String(templateId)
  )

  const organizations = useMemo(() => {
    return organizationData?.data.map((org) => ({
      label: org.slug,
      value: org._id
    }))
  }, [organizationData])

  useEffect(() => {
    if (templateData?.data?.shared_to_organizations) {
      const sharedOrgs = templateData.data.shared_to_organizations
        .map((orgId) => {
          const org = organizationData?.data.find(
            (o) => String(o._id) === String(orgId)
          )
          return org ? { label: org.slug, value: org._id } : null
        })
        .filter(Boolean) as OptionType[]

      setSelectedOrganizationIds(sharedOrgs)
    }
  }, [templateData, organizationData])

  const handleOrganizationChange = (newValue: MultiValue<OptionType>) => {
    setSelectedOrganizationIds([...newValue])
  }

  const onUpdateAccess = async () => {
    setIsSubmitting(true)
    const organizationIds =
      (selectedOrganizationIds as OptionType[])?.map((org) => org.value) ?? []

    const payload = {
      organization_ids: organizationIds,
      is_published: templateData?.data.is_published
    }

    await templateService.shareTemplate(orgSlug, String(templateId), payload)

    showAlert({
      message: 'Template access updated',
      variant: 'success'
    })

    mutate()
    setOpen(false)
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='hidden lg:block' asChild>
        <Button
          variant='ghost'
          className='w-full text-left text-sm font-normal !px-3 h-fit py-2 disabled:bg-white disabled:text-neutral-gray-600 disabled:cursor-not-allowed'
          disabled={!templateData?.data.is_published}
        >
          Configure Access
        </Button>
      </DialogTrigger>
      <DialogTrigger className='lg:hidden' asChild>
        <Button variant='destructive' className=' w-full text-base font-medium'>
          Configure Access
        </Button>
      </DialogTrigger>
      <DialogContent className='!rounded-[8px] lg:p-6 w-full max-w-[90%] lg:max-w-[600px] gap-0'>
        <DialogHeader>
          <DialogTitle className='text-left text-[20px] font-semibold lg:text-2xl text-foreground'>
            Configure Access
          </DialogTitle>
          <DialogDescription className='text-left lg:text-base !mt-6'>
            Select who can access and use this template
          </DialogDescription>
          <MultipleSelect
            id='languages'
            isLoading={isLoading}
            placeholder='Select organizations'
            value={selectedOrganizationIds as PropsValue<OptionType>}
            onChange={handleOrganizationChange}
            options={organizations as OptionType[]}
          />
        </DialogHeader>
        <div className='flex flex-col lg:flex-row items-center justify-end gap-6 mt-6'>
          <Button onClick={onUpdateAccess} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className='w-4 h-4 mr-2 animate-spin' /> Updating
              </>
            ) : (
              'Update'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfigureAccessModal
