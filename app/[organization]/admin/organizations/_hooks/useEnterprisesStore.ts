import {
  EnterpriseUser,
  OrganizationStatus
} from '@/app/(shared)/services/admin/organizationService'
import { create } from 'zustand'

type State = {
  selectedStatus: OrganizationStatus | null
  selectedEnterprises: EnterpriseUser[]
  showMultipleCheckbox: boolean
}
type Action = {
  setSelectedStatus: (status: OrganizationStatus | null) => void
  toggleEnterprise: (enterprise: EnterpriseUser) => void
  clearEnterprises: () => void
  toggleMultipleCheckbox: () => void
}
type Store = {
  reset: () => void
} & State &
  Action

const DEFAULT_STATE: State = {
  selectedStatus: null,
  selectedEnterprises: [],
  showMultipleCheckbox: false
}

const useEnterprisesStore = create<Store>((set) => ({
  reset: () => set(DEFAULT_STATE),
  ...DEFAULT_STATE,

  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),

  toggleEnterprise: (enterprise) =>
    set((state) => {
      let isExisting = false
      const newSelection = state.selectedEnterprises.filter((selection) => {
        const isMatch = selection._id === enterprise._id
        if (isMatch) {
          isExisting = true
        }

        return !isMatch
      })

      if (!isExisting) {
        newSelection.push(enterprise)
      }

      return {
        selectedEnterprises: newSelection
      }
    }),

  clearEnterprises: () => set({ selectedEnterprises: [] }),

  toggleMultipleCheckbox: () =>
    set((state) => ({ showMultipleCheckbox: !state.showMultipleCheckbox }))
}))

export default useEnterprisesStore
