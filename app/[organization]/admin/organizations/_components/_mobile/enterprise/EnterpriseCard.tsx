'use client'

import { OrganizationStatusIndicator } from '@/app/(shared)/(users)/StatusIndicator'
import { Card } from '@/app/(shared)/components/ui/card'
import { Checkbox } from '@/app/(shared)/components/ui/checkbox'
import { EnterpriseUser } from '@/app/(shared)/services/admin/organizationService'
import { cn } from '@/app/(shared)/utils'
import useEnterprisesStore from '../../../_hooks/useEnterprisesStore'

function EnterpriseCard(props: { enterprise: EnterpriseUser }) {
  const { enterprise } = props

  const { selectedEnterprises, toggleEnterprise, showMultipleCheckbox } =
    useEnterprisesStore()

  const selectedUser = selectedEnterprises.some((r) => r._id === enterprise._id)

  return (
    <Card
      className={cn('block p-4 rounded-[8px] cursor-pointer', {
        'border-2 border-brandcolora': showMultipleCheckbox && selectedUser
      })}
      onClick={() =>
        showMultipleCheckbox ? toggleEnterprise(enterprise) : null
      }
    >
      <div className='block text-foreground'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start gap-3'>
            {showMultipleCheckbox && (
              <Checkbox
                className='mt-1'
                checked={selectedUser}
                onCheckedChange={() => toggleEnterprise(enterprise)}
              />
            )}
            <div className='flex flex-col justify-start'>
              <h2 className='font-semibold '>{enterprise.organization_name}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between mt-4'>
        <p className='text-sm text-brandcolora'>{enterprise.email}</p>
        <div className='flex items-center gap-2'>
          <OrganizationStatusIndicator status={enterprise.status} />
          <p className='text-sm'>{enterprise.status}</p>
        </div>
      </div>
    </Card>
  )
}

export default EnterpriseCard
