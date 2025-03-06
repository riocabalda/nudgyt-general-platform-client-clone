'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/(shared)/components/ui/dialog'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import usePageParams from '../_hooks/usePageParams'
import OrganizationInvitationForm from './basic/OrganizationInvitationForm'
import EnterpriseInvitationForm from './enterprise/EnterpriseInvitationForm'

function InvitationForm(props: { onSubmitSuccess?: () => void }) {
  const { onSubmitSuccess } = props
  const { params } = usePageParams()

  if (params.tab === 'basic') {
    return <OrganizationInvitationForm onSubmitSuccess={onSubmitSuccess} />
  }

  if (params.tab === 'enterprise') {
    return <EnterpriseInvitationForm onSubmitSuccess={onSubmitSuccess} />
  }

  return null
}

function TriggerText() {
  const { params } = usePageParams()

  if (params.tab === 'basic') {
    return 'Add Organization'
  }

  if (params.tab === 'enterprise') {
    return 'Add Enterprise'
  }

  return null
}

function AddOrganizationModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  function closeModal() {
    setIsModalOpen(false)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger className='hidden lg:flex' asChild>
        <Button className='gap-3'>
          <Plus className='size-5' />
          <TriggerText />
        </Button>
      </DialogTrigger>
      <DialogTrigger className='lg:hidden' asChild>
        <button className='w-full flex items-center gap-2 p-3 text-foreground-800 hover:bg-muted'>
          <Plus className='size-5' />
          <TriggerText />
        </button>
      </DialogTrigger>

      <DialogContent className='rounded-[8px] w-[90%] max-w-[600px] p-4 lg:p-6 gap-4 lg:gap-6'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold lg:text-2xl'>
            <TriggerText />
          </DialogTitle>

          <DialogDescription className='sr-only'>
            Invite new owner
          </DialogDescription>
        </DialogHeader>

        <InvitationForm onSubmitSuccess={closeModal} />
      </DialogContent>
    </Dialog>
  )
}

export default AddOrganizationModal
