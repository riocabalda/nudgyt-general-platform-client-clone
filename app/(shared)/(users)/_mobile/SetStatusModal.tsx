'use client'

import { Loader } from 'lucide-react'
import { useState } from 'react'
import useAlertStore from '../../components/alert/useAlertStore'
import { Button } from '../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select'
import useOrganization from '../../hooks/useOrganization'
import { useUserStore } from '../../hooks/useUsersStore'
import userService from '../../services/admin/userService'

type UserStatusType = 'approve' | 'block' | 'unblock' | 'archive'

interface SetStatusModalProps {
  onCancel: () => void
}

const userStatusConfig = {
  approve: {
    message: 'Users approved successfully!',
    variant: 'success' as const
  },
  unblock: {
    message: 'Users unblocked successfully!',
    variant: 'success' as const
  },
  block: { message: 'Users blocked successfully!', variant: 'error' as const },
  archive: {
    message: 'Users archived successfully!',
    variant: 'error' as const
  }
}

const userStatusOptions = [
  { value: 'approve', label: 'Approve' },
  { value: 'unblock', label: 'Unblock' },
  { value: 'block', label: 'Block' },
  { value: 'archive', label: 'Archive' }
]

function SetStatusModal({ onCancel }: SetStatusModalProps) {
  const { showAlert } = useAlertStore()
  const { selectedUsers, showMultipleCheckbox, clearUsers } = useUserStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { orgSlug } = useOrganization()

  const selectedEntities = selectedUsers
  const entityText = 'user'
  const statusOptions = userStatusOptions

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status)
  }

  const handleContinue = async () => {
    if (!selectedStatus) return

    setIsSubmitting(true)

    try {
      const userIds = selectedUsers.map((user) => user._id)
      const config = userStatusConfig[selectedStatus as UserStatusType]

      switch (selectedStatus as UserStatusType) {
        case 'approve':
          await userService.bulkApproveUsers(orgSlug, { userIds })
          break
        case 'block':
          await userService.bulkBlockUsers(orgSlug, { userIds })
          break
        case 'unblock':
          await userService.bulkUnblockUsers(orgSlug, { userIds })
          break
        case 'archive':
          await userService.bulkArchiveUsers(orgSlug, { userIds })
          break
      }

      showAlert({
        message: <p>{config.message}</p>,
        variant: config.variant
      })

      setIsModalOpen(false)
      clearUsers()
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

  const showButton = showMultipleCheckbox && selectedUsers.length > 0

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
