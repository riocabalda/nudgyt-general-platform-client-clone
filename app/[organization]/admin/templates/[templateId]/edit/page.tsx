'use client'

import MainContainer from '@/app/(shared)/components/MainContainer'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import { roles } from '@/app/(shared)/services/userService'
import React from 'react'
import EditTemplate from './components/EditTemplate'
import CancelButton from './components/CancelButton'
import SaveTemplateButton from './components/SaveTemplateButton'

function EditTemplatePage() {
  return (
    <RequireAuth role={[roles.trainer, roles.superadmin, roles.admin]}>
      <MainContainer
        className='!px-0'
        headerMobile={
          <MainContainer.HeaderMobile title={`Edit Template`} showBackBtn />
        }
        headerDesktop={
          <MainContainer.HeaderDesktop
            title='Edit Template'
            slotEnd={
              <div className='flex items-center gap-[12px]'>
                <CancelButton />
                <SaveTemplateButton />
              </div>
            }
            showBackBtn
          />
        }
      >
        <EditTemplate />
      </MainContainer>
    </RequireAuth>
  )
}

export default EditTemplatePage
