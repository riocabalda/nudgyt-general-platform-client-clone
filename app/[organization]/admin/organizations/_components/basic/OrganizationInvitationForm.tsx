'use client'

import useAlertStore from '@/app/(shared)/components/alert/useAlertStore'
import { Alert, AlertDescription } from '@/app/(shared)/components/ui/alert'
import { Button } from '@/app/(shared)/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider
} from '@/app/(shared)/components/ui/form'
import { Input } from '@/app/(shared)/components/ui/input'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import userService from '@/app/(shared)/services/admin/userService'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type OrganizationInvitationFormData = z.infer<
  typeof OrganizationInvitationFormSchema
>

const OrganizationInvitationFormSchema = z.object({
  organizationName: z.string().min(1, 'Please enter an organization name'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Please enter an email address')
})

function OrganizationInvitationForm(props: { onSubmitSuccess?: () => void }) {
  const { onSubmitSuccess } = props
  const { orgSlug } = useOrganization()
  const form = useForm<OrganizationInvitationFormData>({
    resolver: zodResolver(OrganizationInvitationFormSchema),
    defaultValues: {
      organizationName: '',
      email: ''
    }
  })
  const { showAlert } = useAlertStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const globalErrorMessage = form.formState.errors.root?.message

  async function sendInvite(formData: OrganizationInvitationFormData) {
    setIsSubmitting(true)
    try {
      await userService.inviteOwnerBasic(orgSlug, formData)

      showAlert({
        message: (
          <p>
            <span className='font-bold'>{formData.email}</span> has been invited
            as the owner of{' '}
            <span className='font-bold'>{formData.organizationName}</span>
          </p>
        ),
        variant: 'success'
      })

      onSubmitSuccess?.()
    } catch (error) {
      const errorAsAny: any = error

      const message =
        errorAsAny?.response?.data?.message ?? 'Something went wrong'

      form.setError('root', { type: 'value', message })
    }
    setIsSubmitting(false)
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(sendInvite)}
        className='space-y-4 lg:space-y-6'
      >
        {globalErrorMessage !== undefined && (
          <Alert variant='destructive'>
            <AlertDescription className='lg:text-base'>
              {globalErrorMessage}
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name='organizationName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Enter name'
                  className='placeholder:text-neutral-gray-500 aria-[invalid=true]:text-destructive aria-[invalid=true]:placeholder:text-destructive aria-[invalid=true]:border-destructive'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Enter email'
                  className='placeholder:text-neutral-gray-500 aria-[invalid=true]:text-destructive aria-[invalid=true]:placeholder:text-destructive aria-[invalid=true]:border-destructive'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className='font-medium text-neutral-gray-600 text-sm lg:text-base'>
          A unique link will be sent to this email to set up their Organization
        </p>

        <footer className='grid lg:grid-cols-2'>
          <Button className='lg:col-start-2' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className='w-4 h-4 mr-2 animate-spin' /> Sending
              </>
            ) : (
              <>Send Invite</>
            )}
          </Button>
        </footer>
      </form>
    </FormProvider>
  )
}

export default OrganizationInvitationForm
