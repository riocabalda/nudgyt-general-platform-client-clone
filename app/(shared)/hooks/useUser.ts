'use client'

import useSWR from 'swr'
import authService from '../services/authService'
import { User } from '../services/userService'

function useUser(options?: Record<string, any>) {
  const {
    data: user,
    error: errorUser,
    isLoading: isLoadingUser,
    mutate: mutateUser
  } = useSWR<User>(
    '/user',
    () => authService.getAuthUser().then((res) => res.data.data),
    options
  )
  return { user, errorUser, isLoadingUser, mutateUser }
}

export default useUser
