import useAlertStore, {
  AlertVariant
} from '@/app/(shared)/components/alert/useAlertStore'
import { Button } from '@/app/(shared)/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/app/(shared)/components/ui/dialog'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import organizationService, {
  OrganizationStatus
} from '@/app/(shared)/services/admin/organizationService'
import { cn } from '@/app/(shared)/utils'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import useEnterprisesStore from '../../_hooks/useEnterprisesStore'
import useGetEnterprises from '../../_hooks/useGetEnterprises'

type Config = {
  title: string
  description: string
  buttonText: string
  loadingText: string
  successMessage: string
  variant: AlertVariant
}

const organizationStatusConfig: Record<OrganizationStatus, Config> = {
  Active: {
    title: 'Activate Organizations',
    description:
      'Are you sure you want to activate the selected organizations?',
    buttonText: 'Activate',
    loadingText: 'Activating',
    successMessage: 'Organizations activated successfully!',
    variant: 'success' as const
  },
  Inactive: {
    title: 'Deactivate Organizations',
    description:
      'Warning: You are about to deactivate the selected organizations.',
    buttonText: 'Deactivate',
    loadingText: 'Deactivating',
    successMessage: 'Organizations deactivated successfully!',
    variant: 'error' as const
  },
  Suspended: {
    title: 'Suspend Organizations',
    description:
      'Warning: You are about to suspend the selected organizations.',
    buttonText: 'Suspend',
    loadingText: 'Suspending',
    successMessage: 'Organizations suspended successfully!',
    variant: 'error' as const
  }
}

function EnterprisesBulkStatusChangeModal() {
  const { showAlert } = useAlertStore()
  const { orgSlug } = useOrganization()
  const selectedStatus = useEnterprisesStore((store) => store.selectedStatus)
  const setSelectedStatus = useEnterprisesStore(
    (store) => store.setSelectedStatus
  )
  const selectedEnterprises = useEnterprisesStore(
    (store) => store.selectedEnterprises
  )
  const clearEnterprises = useEnterprisesStore(
    (store) => store.clearEnterprises
  )
  const enterprisesFetch = useGetEnterprises()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOpen = selectedStatus !== null

  const selectedCt = selectedEnterprises.length
  const enterpriseIds = selectedEnterprises.map((org) => org._id)

  function closeModal() {
    setSelectedStatus(null)
  }

  function handleOpenChange(open: boolean) {
    if (open) return

    closeModal()
  }

  async function handleStatusChange() {
    setIsSubmitting(true)
    try {
      if (selectedStatus === null) {
        throw new Error('No status selected') // Should not be possible at this point...
      }

      await organizationService.bulkUpdateEnterprises(orgSlug, {
        enterpriseIds,
        status: selectedStatus
      })

      clearEnterprises()
      enterprisesFetch.mutate()
      closeModal()

      showAlert({
        message: <p>{config.successMessage}</p>,
        variant: config.variant
      })
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'An error occurred.'

      showAlert({
        message: <p>{errorMessage}</p>,
        variant: 'error'
      })
    }
    setIsSubmitting(false)
  }

  if (selectedStatus === null) {
    return null
  }

  const config = organizationStatusConfig[selectedStatus]

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='rounded-[8px] w-[90%] max-w-[420px] gap-[20px] p-[30px]'>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription
            className={cn(config.variant === 'error' && 'text-destructive')}
          >
            {config.description}
          </DialogDescription>
          <div className='mt-2 text-sm text-gray-500'>
            Selected organization(s): {selectedCt}
          </div>
        </DialogHeader>

        <div className='flex justify-end gap-[10px] mt-[30px]'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button
            variant={config.variant === 'error' ? 'destructive' : 'default'}
            type='submit'
            className='w-full'
            disabled={isSubmitting}
            onClick={handleStatusChange}
          >
            {isSubmitting ? (
              <>
                <Loader className='size-4 mr-2 animate-spin' />
                {config.loadingText}
              </>
            ) : (
              config.buttonText
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EnterprisesBulkStatusChangeModal
