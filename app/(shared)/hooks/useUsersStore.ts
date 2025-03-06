import { create } from 'zustand'
import { User } from '../services/userService'

type UserStore = {
  selectedUsers: User[]
  allUsers: User[]
  showMultipleCheckbox: boolean
  addUser: (user: User) => void
  removeUser: (id: string) => void
  toggleUser: (user: User) => void
  clearUsers: () => void
  setAllUsers: (users: User[]) => void
  toggleMultipleCheckbox: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  selectedUsers: [],
  allUsers: [],
  showMultipleCheckbox: false,
  addUser: (user) =>
    set((state) => ({
      selectedUsers: [...state.selectedUsers, user]
    })),
  removeUser: (id) =>
    set((state) => ({
      selectedUsers: state.selectedUsers.filter((user) => user._id !== id)
    })),
  toggleUser: (user) =>
    set((state) => {
      const exists = state.selectedUsers.some((r) => r._id === user._id)
      if (exists) {
        return {
          selectedUsers: state.selectedUsers.filter((r) => r._id !== user._id)
        }
      } else {
        return {
          selectedUsers: [...state.selectedUsers, user]
        }
      }
    }),
  clearUsers: () =>
    set(() => ({
      selectedUsers: []
    })),
  setAllUsers: (users) =>
    set(() => ({
      allUsers: users
    })),
  toggleMultipleCheckbox: () =>
    set((state) => ({
      showMultipleCheckbox: !state.showMultipleCheckbox
    }))
}))
