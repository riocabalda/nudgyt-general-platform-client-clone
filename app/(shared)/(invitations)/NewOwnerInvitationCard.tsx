'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider
} from '../components/ui/form'
import { Input } from '../components/ui/input'
import useOrganization from '../hooks/useOrganization'
import useUser from '../hooks/useUser'
import organizationService from '../services/organizationService'
import { PendingOrganization } from '../services/userService'

type NewOwnerInvitationFormData = z.infer<typeof NewOwnerInvitationFormSchema>

const NewOwnerInvitationFormSchema = z.object({
  organizationName: z.string().min(1, 'Please enter an organization name')
})

function DeclineInvitationModal(props: {
  pendingOrganization: PendingOrganization
}) {
  const { pendingOrganization } = props
  const { mutateUser } = useUser()
  const { orgSlug } = useOrganization()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  async function decline() {
    setIsSubmitting(true)
    try {
      const organizationName = pendingOrganization.name

      await organizationService.updateOwnerInvitation(
        orgSlug,
        pendingOrganization._id,
        { action: 'decline', organizationName }
      )

      setIsModalOpen(false)
      mutateUser()
      toast.warning('Invitation declined.')
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'An error occurred.')
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Decline</Button>
      </DialogTrigger>

      <DialogContent className='rounded-[8px] w-[90%] max-w-[600px] grid gap-4 lg:gap-6 p-4 lg:p-6'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold lg:text-2xl'>
            Decline Invitation
          </DialogTitle>

          <DialogDescription className='lg:text-base'>
            Are you sure you want to decline this invitation to become an
            organization owner?
          </DialogDescription>
        </DialogHeader>

        <footer className='grid lg:grid-cols-2 gap-4 lg:gap-6'>
          <DialogClose asChild>
            <Button variant='outline'>Go back</Button>
          </DialogClose>

          <Button
            disabled={isSubmitting}
            onClick={decline}
            className='w-full bg-primary-500 hover:bg-primary-500/90'
          >
            {isSubmitting ? (
              <>
                <Loader className='w-4 h-4 mr-2 animate-spin' />
                Declining...
              </>
            ) : (
              <>Decline</>
            )}
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  )
}

function NewOwnerInvitationForm(props: {
  pendingOrganization: PendingOrganization
}) {
  const { pendingOrganization } = props
  const router = useRouter()
  const { mutateUser } = useUser()
  const { orgSlug } = useOrganization()

  const form = useForm<NewOwnerInvitationFormData>({
    resolver: zodResolver(NewOwnerInvitationFormSchema),
    defaultValues: {
      organizationName: pendingOrganization.name
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const globalErrorMessage = form.formState.errors.root?.message

  async function createOrganization(formData: NewOwnerInvitationFormData) {
    setIsSubmitting(true)
    try {
      const { organizationName } = formData

      const res = await organizationService.updateOwnerInvitation(
        orgSlug,
        pendingOrganization._id,
        { action: 'accept', organizationName }
      )
      await mutateUser()

      const body = res.data
      const org = body.data
      if (org === null) {
        throw new Error('Organization info not available')
      }

      router.push(encodeURI(`/${org.slug}/admin/dashboard`)) // Redirect to admin route because they are owners!
    } catch (error) {
      const errorAsAny: any = error

      const message =
        errorAsAny?.response?.data?.message ?? 'Something went wrong'

      form.setError('root', { type: 'value', message })

      setIsSubmitting(false)
    }
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(createOrganization)}
        className='space-y-6'
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

        <footer className='grid lg:grid-cols-2 gap-4'>
          <DeclineInvitationModal pendingOrganization={pendingOrganization} />

          <Button
            disabled={isSubmitting}
            className='w-full bg-primary-500 hover:bg-primary-500/90'
          >
            {isSubmitting ? (
              <>
                <Loader className='w-4 h-4 mr-2 animate-spin' />
                Creating...
              </>
            ) : (
              <>Create Organization</>
            )}
          </Button>
        </footer>
      </form>
    </FormProvider>
  )
}

function NewOwnerInvitationCard(props: {
  pendingOrganization: PendingOrganization
}) {
  const { pendingOrganization } = props

  return (
    <Card className='mx-4 lg:mx-0 rounded-[8px] px-6 py-10 lg:px-20 space-y-6 border-2 border-primary-500'>
      <h3 className='text-center text-neutral-gray-800 font-semibold text-2xl'>
        You&rsquo;ve been invited as a new organization owner
      </h3>

      <p className='text-neutral-gray-600 text-sm'>
        Members of your organization will gain access to exclusive tools and
        resources, including AI-powered services tailored for your organization.
      </p>

      <NewOwnerInvitationForm pendingOrganization={pendingOrganization} />
    </Card>
  )
}

export default NewOwnerInvitationCard
