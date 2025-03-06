'use client'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import MainContainer from '@/app/(shared)/components/MainContainer'
import { roles } from '@/app/(shared)/services/userService'
import CharacterEdit from './components/CharacterEdit'
import CharacterUpdateButton from './components/CharacterUpdateButton'
import { useEffect, useState } from 'react'
import { useCharacterFormStore } from '../hooks/useCharacterFormStore'
import UnsavedChangesModal from './components/UnsavedChangesModal'

function CharactersPage() {
  const { isDisableSaveButton: isFormChanged, setShowUnsavedModal } =
    useCharacterFormStore()
  const [checkUrl, setCheckUrl] = useState('')

  const onHandleBackDialogButtonClick = () => {
    if (!isFormChanged) {
      setShowUnsavedModal(true)
    } else {
      window.history.back()
    }
  }

  useEffect(() => {
    if (!isFormChanged) {
      if (checkUrl !== window.location.href) {
        window.history.pushState(null, '', window.location.href)
        setCheckUrl(window.location.href)
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFormChanged) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    const handlePopState = () => {
      if (!isFormChanged) {
        setShowUnsavedModal(true)
        return false
      }
      return true
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isFormChanged, setShowUnsavedModal])

  return (
    <>
      <RequireAuth role={[roles.admin, roles.superadmin]}>
        <MainContainer
          headerMobile={<MainContainer.HeaderMobile title='Edit Character' />}
          headerDesktop={
            <MainContainer.HeaderDesktop
              title='Edit Character'
              showBackBtn
              slotEnd={<CharacterUpdateButton />}
              onBackBtnClick={onHandleBackDialogButtonClick}
            />
          }
        >
          <div className='max-w-[712px] mx-auto px-4 lg:px-[40px] space-y-6 mt-4 lg:mt-0'>
            <CharacterEdit />
          </div>
        </MainContainer>
      </RequireAuth>
      <UnsavedChangesModal />
    </>
  )
}

export default CharactersPage
