import useAlertStore from '@/app/(shared)/components/alert/useAlertStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/app/(shared)/components/ui/dropdown-menu'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import organizationService, {
  EnterpriseUser,
  OrganizationStatus,
  OrganizationUser
} from '@/app/(shared)/services/admin/organizationService'
import { TierEnum } from '@/app/(shared)/types'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import useGetEnterprises from '../_hooks/useGetEnterprises'
import useGetOrganizations from '../_hooks/useGetOrganizations'

type OrganizationStatusMenuProps = {
  tier: TierEnum
  organization: OrganizationUser | EnterpriseUser
  status: OrganizationStatus
}

const getStatusActionLabel = (status: OrganizationStatus) => {
  switch (status) {
    case OrganizationStatus.Active:
      return 'Activate'
    case OrganizationStatus.Inactive:
      return 'Deactivate'
    case OrganizationStatus.Suspended:
      return 'Suspend'
    default:
      return status
  }
}

function OrganizationStatusMenu({
  tier,
  organization,
  status
}: OrganizationStatusMenuProps) {
  const { showAlert } = useAlertStore()
  const [open, setOpen] = useState(false)
  const { orgSlug } = useOrganization()
  const basicOrgsFetch = useGetOrganizations()
  const enterpriseOrgsFetch = useGetEnterprises()

  const availableStatuses = useMemo(() => {
    const statuses = new Set<OrganizationStatus>()

    switch (status) {
      case OrganizationStatus.Active:
        statuses.add(OrganizationStatus.Inactive)
        statuses.add(OrganizationStatus.Suspended)
        break
      case OrganizationStatus.Inactive:
        statuses.add(OrganizationStatus.Active)
        statuses.add(OrganizationStatus.Suspended)
        break
      case OrganizationStatus.Suspended:
        statuses.add(OrganizationStatus.Active)
        statuses.add(OrganizationStatus.Inactive)
        break
    }

    return Array.from(statuses)
  }, [status])

  const handleStatusChange = async (newStatus: OrganizationStatus) => {
    const name =
      'name' in organization
        ? organization.name
        : organization.organization_name

    const actionLabel = getStatusActionLabel(newStatus)
    const confirmed = window.confirm(`${actionLabel} ${name}?`)

    if (!confirmed) {
      return
    }

    const toastId = 1
    toast.loading(`Setting ${name} status to ${newStatus}...`, {
      id: toastId
    })

    try {
      if (tier === TierEnum.BASIC) {
        await organizationService.updateOrganization(
          orgSlug,
          organization._id,
          { status: newStatus }
        )

        basicOrgsFetch.mutate()
      } else if (tier === TierEnum.ENTERPRISE) {
        await organizationService.updateEnterprise(orgSlug, organization._id, {
          status: newStatus
        })

        enterpriseOrgsFetch.mutate()
      } else {
        throw new Error('Invalid tier')
      }

      toast.dismiss(toastId)
      showAlert({
        message: (
          <p>{`${name} status changed to ${newStatus} successfully!`}</p>
        ),
        variant: newStatus === OrganizationStatus.Active ? 'success' : 'error'
      })
      setOpen(false)
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to update organization status'
      console.error('Error updating organization status:', error)

      toast.dismiss(toastId)
      showAlert({
        message: <p>{errorMessage}</p>,
        variant: 'error'
      })
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className='outline-none flex items-center gap-[10px]'>
        {open ? (
          <>
            <span>{status}</span>
            <ChevronUp className='size-4 text-foreground-800' />
          </>
        ) : (
          <>
            <span>{status}</span>
            <ChevronDown className='size-4 text-foreground-800' />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='px-0 min-w-[358px] fixed top-3 -right-[11px] lg:fixed lg:w-full lg:min-w-[120px]'
        align='end'
      >
        {availableStatuses.map((newStatus) => (
          <DropdownMenuItem
            key={newStatus}
            className='px-3 py-2 cursor-pointer'
            onClick={() => {
              handleStatusChange(newStatus)
            }}
          >
            {getStatusActionLabel(newStatus)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default OrganizationStatusMenu
