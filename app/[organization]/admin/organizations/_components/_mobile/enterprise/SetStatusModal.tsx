'use client'

import useAlertStore from '@/app/(shared)/components/alert/useAlertStore'
import { Button } from '@/app/(shared)/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/(shared)/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/(shared)/components/ui/select'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import organizationService, {
  OrganizationStatus
} from '@/app/(shared)/services/admin/organizationService'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import useEnterprisesStore from '../../../_hooks/useEnterprisesStore'

interface SetStatusModalProps {
  onCancel: () => void
}

const organizationStatusConfig = {
  [OrganizationStatus.Active]: {
    message: 'Organizations activated successfully!',
    variant: 'success' as const
  },
  [OrganizationStatus.Inactive]: {
    message: 'Organizations deactivated successfully!',
    variant: 'error' as const
  },
  [OrganizationStatus.Suspended]: {
    message: 'Organizations suspended successfully!',
    variant: 'error' as const
  }
}

const organizationStatusOptions = [
  { value: OrganizationStatus.Active, label: 'Activate' },
  { value: OrganizationStatus.Inactive, label: 'Deactivate' },
  { value: OrganizationStatus.Suspended, label: 'Suspend' }
]

function SetStatusModal({ onCancel }: SetStatusModalProps) {
  const { showAlert } = useAlertStore()
  const { orgSlug } = useOrganization()
  const { selectedEnterprises, showMultipleCheckbox, clearEnterprises } =
    useEnterprisesStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedEntities = selectedEnterprises
  const entityText = 'organization'
  const statusOptions = organizationStatusOptions

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status)
  }

  const handleContinue = async () => {
    if (!selectedStatus) return

    setIsSubmitting(true)

    try {
      const enterpriseIds = selectedEnterprises.map((org) => org._id)
      await organizationService.bulkUpdateEnterprises(orgSlug, {
        enterpriseIds,
        status: selectedStatus as OrganizationStatus
      })

      const config =
        organizationStatusConfig[selectedStatus as OrganizationStatus]
      showAlert({
        message: <p>{config.message}</p>,
        variant: config.variant
      })

      setIsModalOpen(false)
      clearEnterprises()
      onCancel()
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'An error occurred.'
      showAlert({
        message: <p>{errorMessage}</p>,
        variant: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const showButton = showMultipleCheckbox && selectedEnterprises.length > 0

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger
        className='fixed lg:hidden bottom-0 left-0 right-0 flex justify-center m-5 z-40'
        asChild
      >
        {showButton && (
          <Button variant='default' className='shadow-lg rounded-sm'>
            Set Status
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='rounded-[8px] w-[90%] max-w-[600px] gap-0 p-6'>
        <DialogHeader>
          <DialogTitle className='font-semibold text-xl mb-10'>
            Set Status
          </DialogTitle>
        </DialogHeader>
        <p className='text-neutral-600 text-sm mb-4'>
          Select a status for {selectedEntities.length} selected {entityText}
          {selectedEntities.length !== 1 ? 's' : ''}
        </p>
        <Select onValueChange={handleStatusSelect}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className='w-full flex flex-col mt-10'>
          <Button
            onClick={handleContinue}
            disabled={!selectedStatus || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className='w-4 h-4 mr-2 animate-spin' /> Processing
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SetStatusModal
