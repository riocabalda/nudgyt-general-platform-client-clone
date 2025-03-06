'use client'

import React, { useEffect, useState } from 'react'
import MainContainer from '@/app/(shared)/components/MainContainer'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import { roles } from '@/app/(shared)/services/userService'
import CancelButton from './components/CancelButton'
import DraftServiceButton from './components/DraftServiceButton'
import CreateService from './components/CreateService'
import { useServiceStore } from './hooks/useServiceStore'
import { UnsavedChangesModal } from './components/UnsavedChangesModal'

function CreateServicePage() {
  const [showUnsavedModal, setShowUnsavedModal] = useState(false)
  const {
    serviceTypeId,
    title,
    description,
    environmentId,
    characterIds,
    serviceHasForm,
    formQuestions
  } = useServiceStore()

  const hasUnsavedChanges = () => {
    return !!(
      serviceTypeId ||
      title ||
      description ||
      environmentId ||
      characterIds?.length ||
      (serviceHasForm && formQuestions)
    )
  }

  const handleBackButtonClick = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedModal(true)
    } else {
      window.history.back()
    }
  }

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    const handlePopState = () => {
      if (hasUnsavedChanges()) {
        window.history.pushState(null, '', window.location.href)
        setShowUnsavedModal(true)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [
    serviceTypeId,
    title,
    description,
    environmentId,
    characterIds,
    serviceHasForm,
    formQuestions
  ])

  return (
    <RequireAuth role={[roles.superadmin, roles.admin, roles.trainer]}>
      <MainContainer
        headerMobile={
          <MainContainer.HeaderMobile title='Create service' showBackBtn />
        }
        headerDesktop={
          <MainContainer.HeaderDesktop
            title='Create service'
            slotEnd={
              <div className='flex items-center gap-[12px]'>
                <CancelButton />
                <DraftServiceButton />
              </div>
            }
            showBackBtn
            onBackBtnClick={handleBackButtonClick}
          />
        }
        className='lg:px-0'
      >
        <CreateService />
      </MainContainer>

      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
      />
    </RequireAuth>
  )
}

export default CreateServicePage
