import { create } from 'zustand'

type ExtraLearnerModalStore = {
  selectedOrgSlug: string | undefined
  isModalOpen: boolean
  openModal: (orgSlug: string) => void
  closeModal: () => void
}

export const useExtraLearnerModalStore = create<ExtraLearnerModalStore>(
  (set) => ({
    selectedOrgSlug: undefined,
    isModalOpen: false,
    openModal: (orgSlug) =>
      set(() => ({
        selectedOrgSlug: orgSlug,
        isModalOpen: true
      })),
    closeModal: () =>
      set(() => ({
        selectedOrgSlug: undefined,
        isModalOpen: false
      }))
  })
)
