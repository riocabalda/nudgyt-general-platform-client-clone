'use client'

import React, { useEffect, useState } from 'react'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import MainContainer from '@/app/(shared)/components/MainContainer'
import { roles } from '@/app/(shared)/services/userService'
import TemplateDetails from './components/TemplateDetails'
import { useTemplateStore } from '../create/hooks/useTemplateStore'
import { UnsavedChangesModal } from '../create/components/UnsavedChangesModal'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { useParams, useRouter } from 'next/navigation'
import useGetTemplate from './hooks/useGetTemplate'
import DuplicateTemplateButton from '@/app/(shared)/components/admin-trainer-shared/template/DuplicateTemplateButton'
import PublishTemplateButton from './components/PublishTemplateButton'
import useUser from '@/app/(shared)/hooks/useUser'
import { Button } from '@/app/(shared)/components/ui/button'
import MoreOptionsButton from './components/TrainerMoreOptionsButton'

function TemplateDetailsPage() {
  const router = useRouter()
  const { orgSlug, membership } = useOrganization()
  const { templateId } = useParams()
  const { user } = useUser()

  const [showUnsavedModal, setShowUnsavedModal] = useState(false)

  const {
    serviceTypeId,
    title,
    description,
    environmentId,
    characterIds,
    serviceHasForm,
    formQuestions,
    isShared,
    setIsShared
  } = useTemplateStore()

  const { data: templateData } = useGetTemplate(
    String(orgSlug),
    String(templateId)
  )

  const isCreator =
    user && user._id === (templateData?.data.creator as unknown as string)

  useEffect(() => {
    if (templateData?.data && membership?.organization?._id) {
      const isTemplateShared =
        templateData.data.shared_to_organizations.includes(
          membership.organization._id
        )

      if (isTemplateShared !== isShared) {
        setIsShared(isTemplateShared)
      }
    }
  }, [templateData?.data, membership?.organization?._id, setIsShared, isShared])

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

  const handleUseTemplate = () => {
    router.push(`/${orgSlug}/trainer/services/create?templateId=${templateId}`)
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
      <RequireAuth role={[roles.trainer, roles.superadmin, roles.admin]}>
        <MainContainer
          headerMobile={
            <MainContainer.HeaderMobile title='Template Details' showBackBtn />
          }
          headerDesktop={
            <MainContainer.HeaderDesktop
              title='Template Details'
              slotEnd={
                isCreator ? (
                  <div className='flex items-center gap-[12px]'>
                    <PublishTemplateButton />
                    <MoreOptionsButton />
                  </div>
                ) : (
                  <div className='flex items-center gap-[12px]'>
                    {isShared ? (
                      <>
                        <DuplicateTemplateButton role='trainer' />
                        <MoreOptionsButton />
                      </>
                    ) : (
                      <Button onClick={handleUseTemplate}>
                        Use this template
                      </Button>
                    )}
                  </div>
                )
              }
              showBackBtn
              onBackBtnClick={handleBackDialogButtonClick}
            />
          }
        >
          <TemplateDetails />
        </MainContainer>
      </RequireAuth>

      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
      />
    </>
  )
}

export default TemplateDetailsPage
