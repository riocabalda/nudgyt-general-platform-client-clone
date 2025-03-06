import { create } from 'zustand'
import authTokenService from '../services/authTokenService'

type AuthState = {
  token: string
}

type AuthAction = {
  signIn: (token: string) => void
  signOut: () => void
}

const useAuthStore = create<AuthState & AuthAction>((set) => ({
  token: authTokenService.getAccessToken(),
  signIn: (token: string) => set(() => ({ token })),
  signOut: () => set(() => ({ token: undefined }))
}))

export default useAuthStore
