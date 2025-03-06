'use client'

import React, { useState } from 'react'
import { Button } from '@/app/(shared)/components/ui/button'
import { useTemplateStore } from '../../../create/hooks/useTemplateStore'
import { UnsavedChangesModal } from '../../../create/components/UnsavedChangesModal'

function CancelButton() {
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

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedModal(true)
    } else {
      window.history.back()
    }
  }

  return (
    <>
      <Button variant='outline' onClick={handleCancel}>
        Cancel
      </Button>

      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
      />
    </>
  )
}

export default CancelButton
