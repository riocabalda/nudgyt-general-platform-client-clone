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
  OrganizationStatus,
  OrganizationUser
} from '@/app/(shared)/services/admin/organizationService'
import { cn } from '@/app/(shared)/utils'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import useGetOrganizations from '../../_hooks/useGetOrganizations'
import useOrganizationsStore from '../../_hooks/useOrganizationsStore'

type Config = {
  title: string
  description: string
  activeAdjective: string
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
    activeAdjective: 'activated',
    buttonText: 'Activate',
    loadingText: 'Activating',
    successMessage: 'Organizations activated successfully!',
    variant: 'success' as const
  },
  Inactive: {
    title: 'Deactivate Organizations',
    description:
      'Warning: You are about to deactivate the selected organizations.',
    activeAdjective: 'deactivated',
    buttonText: 'Deactivate',
    loadingText: 'Deactivating',
    successMessage: 'Organizations deactivated successfully!',
    variant: 'error' as const
  },
  Suspended: {
    title: 'Suspend Organizations',
    description:
      'Warning: You are about to suspend the selected organizations.',
    activeAdjective: 'suspended',
    buttonText: 'Suspend',
    loadingText: 'Suspending',
    successMessage: 'Organizations suspended successfully!',
    variant: 'error' as const
  }
}

function isOrganizationValid(
  organization: OrganizationUser,
  status: OrganizationStatus | null
) {
  if (status === 'Active') {
    return organization.status !== 'Active'
  }
  if (status === 'Inactive') {
    return organization.status !== 'Inactive'
  }
  if (status === 'Suspended') {
    return organization.status !== 'Suspended'
  }

  return false
}

function separateOrganizationsByValidity(
  organizations: OrganizationUser[],
  status: OrganizationStatus | null
) {
  const validOrganizations: typeof organizations = []
  const invalidOrganizations: typeof organizations = []

  for (const org of organizations) {
    if (isOrganizationValid(org, status)) {
      validOrganizations.push(org)
    } else {
      invalidOrganizations.push(org)
    }
  }

  return { validOrganizations, invalidOrganizations }
}

function OrganizationsBulkStatusChangeModal() {
  const { showAlert } = useAlertStore()
  const { orgSlug } = useOrganization()
  const selectedStatus = useOrganizationsStore((store) => store.selectedStatus)
  const setSelectedStatus = useOrganizationsStore(
    (store) => store.setSelectedStatus
  )
  const selectedOrganizations = useOrganizationsStore(
    (store) => store.selectedOrganizations
  )
  const clearOrganizations = useOrganizationsStore(
    (store) => store.clearOrganizations
  )
  const basicOrgsFetch = useGetOrganizations()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOpen = selectedStatus !== null

  const selectedOrgCt = selectedOrganizations.length

  const { validOrganizations, invalidOrganizations } =
    separateOrganizationsByValidity(selectedOrganizations, selectedStatus)

  const validOrgIds = validOrganizations.map((org) => org._id)
  const invalidOrgCt = invalidOrganizations.length
  const areAllOrgsInvalid = invalidOrgCt === selectedOrganizations.length

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

      await organizationService.bulkUpdateOrganizations(orgSlug, {
        organizationIds: validOrgIds,
        status: selectedStatus
      })

      clearOrganizations()
      basicOrgsFetch.mutate()
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
          {areAllOrgsInvalid ? (
            <DialogDescription className='text-destructive'>
              All selected organization(s) are already {config.activeAdjective}
            </DialogDescription>
          ) : (
            <>
              <DialogDescription
                className={cn(config.variant === 'error' && 'text-destructive')}
              >
                {config.description}
              </DialogDescription>
              <p className='mt-2 text-sm text-muted-foreground'>
                <span className='font-bold'>Selected organization(s):</span>{' '}
                {selectedOrgCt}
              </p>
              {invalidOrgCt > 0 && (
                <p className='mt-2 text-sm text-muted-foreground'>
                  <span className='font-bold'>Ignored organization(s):</span>{' '}
                  {invalidOrgCt} (already {config.activeAdjective})
                </p>
              )}
            </>
          )}
        </DialogHeader>

        <div className='flex justify-end gap-[10px] mt-[30px]'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button
            variant={config.variant === 'error' ? 'destructive' : 'default'}
            type='submit'
            className='w-full'
            disabled={areAllOrgsInvalid || isSubmitting}
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

export default OrganizationsBulkStatusChangeModal
