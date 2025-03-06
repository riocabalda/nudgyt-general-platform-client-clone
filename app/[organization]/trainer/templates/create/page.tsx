'use client'

import React, { useState, useEffect } from 'react'
import MainContainer from '@/app/(shared)/components/MainContainer'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import { roles } from '@/app/(shared)/services/userService'
import CancelButton from './components/CancelButton'
import CreateTemplate from './components/CreateTemplate'
import DraftServiceButton from './components/SaveTemplateButton'
import { useTemplateStore } from './hooks/useTemplateStore'
import { UnsavedChangesModal } from './components/UnsavedChangesModal'

function CreateTemplatePage() {
  const [showUnsavedModal, setShowUnsavedModal] = useState(false)
  const {
    serviceTypeId,
    title,
    description,
    environmentId,
    characterIds,
    serviceHasForm,
    formQuestions
  } = useTemplateStore()

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

  const handleBackDialogButtonClick = () => {
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
    <>
      <RequireAuth role={[roles.superadmin, roles.admin, roles.trainer]}>
        <MainContainer
          headerMobile={
            <MainContainer.HeaderMobile title='Create template' showBackBtn />
          }
          headerDesktop={
            <MainContainer.HeaderDesktop
              title='Create template'
              slotEnd={
                <div className='flex items-center gap-[12px]'>
                  <CancelButton />
                  <DraftServiceButton />
                </div>
              }
              showBackBtn
              onBackBtnClick={handleBackDialogButtonClick}
            />
          }
          className='lg:px-0'
        >
          <CreateTemplate />
        </MainContainer>
      </RequireAuth>

      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
      />
    </>
  )
}

export default CreateTemplatePage
