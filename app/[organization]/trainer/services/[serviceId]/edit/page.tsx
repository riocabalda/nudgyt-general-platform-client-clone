'use client'

import React, { useEffect, useState } from 'react'
import MainContainer from '@/app/(shared)/components/MainContainer'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import { roles } from '@/app/(shared)/services/userService'
import CancelButton from './components/CancelButton'
import DraftServiceButton from './components/DraftServiceButton'
import EditService from './components/EditService'
import { useServiceStore } from '../../create/hooks/useServiceStore'
import UnsavedEditServiceChangesModal from './components/UnsavedEditServiceChangesModal'

function EditServicePage() {
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

  const handleSaveSuccess = () => {
    // Clear the unsaved changes state
    setShowUnsavedModal(false)
    window.history.replaceState(null, '', window.location.href)
  }

  return (
    <RequireAuth role={[roles.trainer]}>
      <MainContainer
        headerMobile={
          <MainContainer.HeaderMobile title='Edit service' showBackBtn />
        }
        headerDesktop={
          <MainContainer.HeaderDesktop
            title='Edit service'
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
        <EditService />
      </MainContainer>

      <UnsavedEditServiceChangesModal
        isOpen={showUnsavedModal}
        onClose={() => {
          setShowUnsavedModal(false)
          handleSaveSuccess()
        }}
      />
    </RequireAuth>
  )
}

export default EditServicePage
