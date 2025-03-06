import { create } from 'zustand'

type CharacterStoreValues = {
  isReadyToSubmit: boolean
  isDisableSaveButton: boolean
  isSubmitting: boolean
  showUnsavedModal: boolean
}

type CharacterStore = CharacterStoreValues & {
  setIsReadyToSubmit: (isReadyToSubmit: boolean) => void
  setIsSubmitting: (isSubmitting: boolean) => void
  setIsDisableSaveButton: (isDisableSaveButton: boolean) => void
  setShowUnsavedModal: (showUnsavedModal: boolean) => void
}

const initialState: CharacterStoreValues = {
  isReadyToSubmit: false,
  isDisableSaveButton: true,
  isSubmitting: false,
  showUnsavedModal: false
}

export const useCharacterFormStore = create<CharacterStore>()((set) => ({
  ...initialState,
  setIsReadyToSubmit: (isReadyToSubmit) => {
    set({ isReadyToSubmit })
  },
  setIsDisableSaveButton: (isDisableSaveButton) => {
    set({ isDisableSaveButton })
  },
  setIsSubmitting: (isSubmitting) => {
    set({ isSubmitting })
  },
  setShowUnsavedModal: (showUnsavedModal) => {
    set({ showUnsavedModal })
  }
}))
