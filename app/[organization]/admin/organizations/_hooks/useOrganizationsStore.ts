import {
  OrganizationStatus,
  OrganizationUser
} from '@/app/(shared)/services/admin/organizationService'
import { create } from 'zustand'

type State = {
  selectedStatus: OrganizationStatus | null
  selectedOrganizations: OrganizationUser[]
  showMultipleCheckbox: boolean
}
type Action = {
  setSelectedStatus: (status: OrganizationStatus | null) => void
  toggleOrganization: (organization: OrganizationUser) => void
  clearOrganizations: () => void
  toggleMultipleCheckbox: () => void
}
type Store = {
  reset: () => void
} & State &
  Action

const DEFAULT_STATE: State = {
  selectedStatus: null,
  selectedOrganizations: [],
  showMultipleCheckbox: false
}

const useOrganizationsStore = create<Store>((set) => ({
  reset: () => set(DEFAULT_STATE),
  ...DEFAULT_STATE,

  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),

  toggleOrganization: (organization) =>
    set((state) => {
      let isExisting = false
      const newSelection = state.selectedOrganizations.filter((selection) => {
        const isMatch = selection._id === organization._id
        if (isMatch) {
          isExisting = true
        }

        return !isMatch
      })

      if (!isExisting) {
        newSelection.push(organization)
      }

      return {
        selectedOrganizations: newSelection
      }
    }),

  clearOrganizations: () => set({ selectedOrganizations: [] }),

  toggleMultipleCheckbox: () =>
    set((state) => ({ showMultipleCheckbox: !state.showMultipleCheckbox }))
}))

export default useOrganizationsStore
