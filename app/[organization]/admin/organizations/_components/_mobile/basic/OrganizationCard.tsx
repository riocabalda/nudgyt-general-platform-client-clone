import { OrganizationIndicatorColor } from '@/app/(shared)/(users)/indicator-color'
import { Card } from '@/app/(shared)/components/ui/card'
import { Checkbox } from '@/app/(shared)/components/ui/checkbox'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { OrganizationUser } from '@/app/(shared)/services/admin/organizationService'
import { cn } from '@/app/(shared)/utils'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import useOrganizationsStore from '../../../_hooks/useOrganizationsStore'

function OrganizationCard(props: { organization: OrganizationUser }) {
  const { organization } = props

  const router = useRouter()
  const { orgSlug } = useOrganization()
  const { selectedOrganizations, toggleOrganization, showMultipleCheckbox } =
    useOrganizationsStore()

  const selectedUser = selectedOrganizations.some(
    (r) => r._id === organization._id
  )
  const bgColor = OrganizationIndicatorColor[organization.status]

  function goToOrganizationPage() {
    const params = new URLSearchParams({
      organization: organization.slug
    })

    router.push(
      `/${orgSlug}/admin/organizations/${organization._id}/users?${params}`
    )
  }

  return (
    <Card
      className={cn('block p-4 rounded-[8px] cursor-pointer', {
        'border-2 border-brandcolora': showMultipleCheckbox && selectedUser
      })}
      onClick={() =>
        showMultipleCheckbox
          ? toggleOrganization(organization)
          : goToOrganizationPage()
      }
    >
      <div className='block text-foreground'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start gap-3'>
            {showMultipleCheckbox && (
              <Checkbox
                className='mt-1'
                checked={selectedUser}
                onCheckedChange={() => toggleOrganization(organization)}
              />
            )}
            <div className='flex flex-col justify-start'>
              <h2 className='font-semibold '>{organization.name}</h2>
            </div>
          </div>
          {!showMultipleCheckbox && (
            <span>
              <ChevronRight size={24} strokeWidth={1.5} />
            </span>
          )}
        </div>
      </div>
      <div className='flex items-center justify-between mt-4'>
        <p className='text-sm text-brandcolora'>
          {organization.members} members
        </p>
        <div className='flex items-center gap-2'>
          <span
            className='block w-[10px] h-[10px] rounded-full bg-brandcolora'
            style={{ backgroundColor: bgColor }}
          />
          <p className='text-sm'>{organization.status}</p>
        </div>
      </div>
    </Card>
  )
}

export default OrganizationCard
