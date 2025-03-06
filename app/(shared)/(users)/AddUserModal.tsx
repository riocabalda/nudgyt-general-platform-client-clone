'use client'

import { Alert, AlertDescription } from '@/app/(shared)/components/ui/alert'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider
} from '@/app/(shared)/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader, Plus } from 'lucide-react'
import { ComponentProps, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import useAlertStore from '../components/alert/useAlertStore'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select'
import organizationConfig from '../config/organizationConfig'
import useOrganization from '../hooks/useOrganization'
import userService from '../services/admin/userService'
import { OrganizationMembership, roles } from '../services/userService'
import { aOrAn } from '../utils'

type AddUserFormData = z.infer<typeof AddUserFormSchema>

const AddUserFormSchema = z.object({
  role: z.string().min(1, 'Please select a role.'),
  email: z
    .string()
    .min(1, 'Please enter an email address.')
    .email('Invalid email address'),
  organization: z.string()
})

function useAddUserForm(args: ComponentProps<typeof AddUserForm>) {
  const { defaultOrgName, isInvitingToPublicOrg } = args
  const { onSuccess, onError, onSettled } = args

  const defaultRole = isInvitingToPublicOrg ? roles.admin : undefined

  const { showAlert } = useAlertStore()
  const { orgSlug } = useOrganization()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AddUserFormData>({
    resolver: zodResolver(AddUserFormSchema),
    defaultValues: {
      role: defaultRole,
      email: '',
      organization: defaultOrgName
    }
  })

  const canSubmit = !isSubmitting && form.formState.isDirty

  const globalErrorMessage = form.formState.errors.root?.message
  const globalAlertElement =
    globalErrorMessage !== undefined ? (
      <Alert variant='destructive'>
        <AlertDescription className='lg:text-base'>
          {globalErrorMessage}
        </AlertDescription>
      </Alert>
    ) : null

  const handleSubmission = form.handleSubmit(async (data) => {
    setIsSubmitting(true)
    try {
      await userService.sendRegistrationLink(orgSlug, {
        email: data.email,
        role: data.role,
        organization: data.organization
      })

      form.reset()
      showAlert({
        message: (
          <p>
            <strong>{data.email}</strong> has been invited as {aOrAn(data.role)}{' '}
            {data.role}
          </p>
        ),
        variant: 'success'
      })
      onSuccess?.()
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Something went wrong'
      form.setError('root', { type: 'value', message })
      onError?.(error)
    }
    setIsSubmitting(false)
    onSettled?.()
  })

  return {
    form,
    ...{ globalAlertElement },
    ...{ canSubmit, isSubmitting, handleSubmission }
  }
}

function AddUserForm(props: {
  defaultOrgName?: string
  isInvitingToPublicOrg: boolean
  onSuccess?: () => void
  onError?: (error: Error) => void
  onSettled?: () => void
}) {
  const { isInvitingToPublicOrg } = props
  const formWrapper = useAddUserForm(props)

  const { form, globalAlertElement } = formWrapper
  const { canSubmit, isSubmitting, handleSubmission } = formWrapper

  const formElement = (
    <form onSubmit={handleSubmission} className='space-y-6'>
      {globalAlertElement}

      <FormField
        control={form.control}
        name='role'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isInvitingToPublicOrg} // Default value set via form hook
            >
              <FormControl>
                <SelectTrigger className='data-[placeholder]:text-neutral-gray-500 aria-[invalid=true]:text-destructive aria-[invalid=true]:data-[placeholder]:text-destructive aria-[invalid=true]:border-destructive'>
                  <SelectValue placeholder='Choose Role' />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                <SelectItem
                  value={roles.learner}
                  className='focus:bg-brandcolora focus:text-white'
                >
                  Learner
                </SelectItem>
                <SelectItem
                  value={roles.trainer}
                  className='focus:bg-brandcolora focus:text-white'
                >
                  Trainer
                </SelectItem>
                <SelectItem
                  value={roles.admin}
                  className='focus:bg-brandcolora focus:text-white'
                >
                  Admin
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='email'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder='Enter Email'
                className='placeholder:text-neutral-gray-500 aria-[invalid=true]:text-destructive aria-[invalid=true]:placeholder:text-destructive aria-[invalid=true]:border-destructive'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <footer className='flex flex-row-reverse'>
        <Button disabled={!canSubmit}>
          {isSubmitting ? (
            <>
              <Loader className='size-4 mr-2 animate-spin' /> Sending
            </>
          ) : (
            'Send Invite'
          )}
        </Button>
      </footer>
    </form>
  )

  return <FormProvider {...form}>{formElement}</FormProvider>
}

function getModalTitleText(args: {
  defaultOrgName?: string
  isInvitingToPublicOrg: boolean
  membership?: OrganizationMembership
}) {
  const { isInvitingToPublicOrg, defaultOrgName } = args
  const { membership } = args

  const isPublicMember =
    membership?.organization.name ===
    organizationConfig.PUBLIC_ORGANIZATION_NAME

  if (isInvitingToPublicOrg && isPublicMember) {
    return 'Add Public User'
  }

  return `Add User to ${defaultOrgName}`
}

function AddUserModal(props: {
  forceOrgName?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
  onSettled?: () => void
}) {
  const { forceOrgName } = props
  const { onSuccess, onError, onSettled } = props

  const { membership } = useOrganization()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const defaultOrgName = forceOrgName ?? membership?.organization.name
  const isInvitingToPublicOrg =
    defaultOrgName === organizationConfig.PUBLIC_ORGANIZATION_NAME

  const titleText = getModalTitleText({
    isInvitingToPublicOrg,
    defaultOrgName,
    membership
  })

  function handleSuccess() {
    setIsModalOpen(false)

    onSuccess?.()
  }

  if (defaultOrgName === undefined) {
    return null // Should be impossible...
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger className='hidden lg:flex' asChild>
        <Button
          variant='default'
          className='bg-brandcolora hover:bg-brandcolora/90 gap-[10px]'
        >
          <Plus className='w-5 h-5' />
          Add User
        </Button>
      </DialogTrigger>
      <DialogTrigger className='lg:hidden' asChild>
        <button className='w-full flex items-center gap-2 p-3 text-foreground-800 hover:bg-muted'>
          <Plus size={20} />
          <span>Add user</span>
        </button>
      </DialogTrigger>

      <DialogContent className='rounded-[8px] w-[90%] max-w-[600px] gap-6 p-6'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold lg:text-2xl'>
            {titleText}
          </DialogTitle>
        </DialogHeader>

        <AddUserForm
          defaultOrgName={defaultOrgName}
          isInvitingToPublicOrg={isInvitingToPublicOrg}
          onSuccess={handleSuccess}
          onError={onError}
          onSettled={onSettled}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddUserModal
