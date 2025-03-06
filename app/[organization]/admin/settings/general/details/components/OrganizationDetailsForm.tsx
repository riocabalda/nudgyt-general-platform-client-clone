'use client'

import useAlertStore from '@/app/(shared)/components/alert/useAlertStore'
import InputFile from '@/app/(shared)/components/form/InputFile'
import { Alert, AlertDescription } from '@/app/(shared)/components/ui/alert'
import { Button } from '@/app/(shared)/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider
} from '@/app/(shared)/components/ui/form'
import { Input } from '@/app/(shared)/components/ui/input'
import useGetOrganization from '@/app/(shared)/hooks/useGetOrganization'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useUser from '@/app/(shared)/hooks/useUser'
import organizationService from '@/app/(shared)/services/organizationService'
import { OrganizationDisplay } from '@/app/(shared)/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type OrganizationDetailsFormData = z.infer<typeof OrganizationDetailsFormSchema>

const OrganizationDetailsFormSchema = z.object({
  organization_name: z
    .string()
    .min(1, 'Please enter an organization name')
    .optional()
    .transform((value) => {
      if (value === '') {
        return undefined
      }

      return value
    }),
  organization_logo: z.instanceof(FileList).optional()
})

/**
 * Also has the effect of closing the modal,
 * if the organization name/slug has not changed
 */
function useRedirectToPossiblyNewSlug(orgSlug: string) {
  const router = useRouter()

  function redirectToPossiblyNewSlug(newOrgSlug?: string) {
    const effectiveOrgSlug = newOrgSlug ?? orgSlug

    router.replace(`/${effectiveOrgSlug}/admin/settings/general`)
  }

  return { redirectToPossiblyNewSlug }
}

/** Add SWRs that need to be updated after submission  */
function useUpdateRelatedFetchers() {
  const swrUser = useUser()
  const swrOrganization = useGetOrganization()

  function updateRelatedFetchers() {
    swrUser.mutateUser()
    swrOrganization.mutate()
  }

  return { updateRelatedFetchers }
}

function useShowSuccessAlert() {
  const { showAlert } = useAlertStore()

  function showSuccessAlert() {
    showAlert({
      message: 'Organization updated successfully',
      variant: 'success'
    })
  }

  return { showSuccessAlert }
}

function useOrganizationDetailsForm(organization: OrganizationDisplay) {
  const { orgSlug } = useOrganization()

  const { updateRelatedFetchers } = useUpdateRelatedFetchers()
  const { redirectToPossiblyNewSlug } = useRedirectToPossiblyNewSlug(orgSlug)
  const { showSuccessAlert } = useShowSuccessAlert()

  const form = useForm<OrganizationDetailsFormData>({
    resolver: zodResolver(OrganizationDetailsFormSchema),
    defaultValues: {
      organization_name: organization.name,
      organization_logo: undefined
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const canSubmit = !isSubmitting && form.formState.isDirty

  const globalErrorMessage = form.formState.errors.root?.message
  const globalAlertElement = isSuccess ? (
    <Alert variant='success'>
      <AlertDescription className='lg:text-base'>
        Organization updated successfully
      </AlertDescription>
    </Alert>
  ) : globalErrorMessage !== undefined ? (
    <Alert variant='destructive'>
      <AlertDescription className='lg:text-base'>
        {globalErrorMessage}
      </AlertDescription>
    </Alert>
  ) : null

  const handleSubmission = form.handleSubmit(async (data) => {
    setIsSubmitting(true)
    try {
      const updatedOrg = await updateOrg(data)

      setIsSuccess(true)
      updateRelatedFetchers()
      redirectToPossiblyNewSlug(updatedOrg.slug)
      showSuccessAlert()
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Something went wrong'
      form.setError('root', { type: 'value', message })
    }
    setIsSubmitting(false)
  })

  async function updateOrg(data: OrganizationDetailsFormData) {
    const name = data.organization_name
    const logoFile = data.organization_logo?.[0]

    const response = await organizationService.updateOrganization(orgSlug, {
      name,
      logo: logoFile
    })
    const body = response.data
    const updatedOrg = body.data

    return updatedOrg
  }

  return {
    form,
    ...{ globalAlertElement },
    ...{ canSubmit, isSubmitting, handleSubmission }
  }
}

function OrganizationDetailsFormActual(props: {
  organization: OrganizationDisplay
}) {
  const { organization } = props

  const formWrapper = useOrganizationDetailsForm(organization)

  const { form, globalAlertElement } = formWrapper
  const { canSubmit, isSubmitting, handleSubmission } = formWrapper

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmission} className='space-y-6'>
        {globalAlertElement}

        <FormField
          control={form.control}
          name='organization_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Enter new name'
                  className='placeholder:text-neutral-gray-500 aria-[invalid=true]:text-destructive aria-[invalid=true]:placeholder:text-destructive aria-[invalid=true]:border-destructive'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='organization_logo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Logo</FormLabel>
              <FormControl>
                <InputFile.RHF field={field} />
              </FormControl>
              <FormDescription>
                Image must be in JPEG or PNG format, no larger than 5MB.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <footer className='flex flex-row-reverse'>
          <Button disabled={!canSubmit}>
            {isSubmitting ? 'Updating...' : 'Update Organization Details'}
          </Button>
        </footer>
      </form>
    </FormProvider>
  )
}

function OrganizationDetailsForm() {
  const { data: organization } = useGetOrganization()

  if (organization === undefined) {
    return null
  }

  return <OrganizationDetailsFormActual organization={organization} />
}

export default OrganizationDetailsForm
