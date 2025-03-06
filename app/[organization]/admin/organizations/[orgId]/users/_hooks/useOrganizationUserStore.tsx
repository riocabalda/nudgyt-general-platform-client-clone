import { PaginatedUser } from '@/app/(shared)/services/admin/userService'
import { create } from 'zustand'

type StatusType = 'approve' | 'block' | 'unblock' | 'archive'

type State = {
  selectedStatus: StatusType | null
  selectedUsers: PaginatedUser[]
}

type Action = {
  setSelectedStatus: (status: StatusType | null) => void
  toggleUser: (user: PaginatedUser) => void
  clearUsers: () => void
}

type Store = State &
  Action & {
    reset: () => void
  }

const DEFAULT_STATE: State = {
  selectedStatus: null,
  selectedUsers: []
}

const useOrganizationUserStore = create<Store>((set) => ({
  reset: () => set(DEFAULT_STATE),
  ...DEFAULT_STATE,

  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),

  toggleUser: (user: PaginatedUser) =>
    set((state) => {
      let isExisting = false
      const newSelection = state.selectedUsers.filter((selection) => {
        const isMatch = selection._id === user._id
        if (isMatch) {
          isExisting = true
        }

        return !isMatch
      })

      if (!isExisting) {
        newSelection.push(user)
      }

      return {
        selectedUsers: newSelection
      }
    }),

  clearUsers: () => set({ selectedUsers: [] })
}))

export default useOrganizationUserStore
