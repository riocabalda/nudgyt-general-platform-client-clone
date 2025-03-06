'use client'

import { PropsWithChildren, useEffect } from 'react'
import useAuthStore from '../../hooks/useAuthStore'
import authTokenService from '../../services/authTokenService'

function InitAuth({ children }: PropsWithChildren) {
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe(({ token }) => {
      if (token) {
        authTokenService.setAccessToken(token)
      } else {
        authTokenService.removeTokens()
      }
    })

    return () => unsubscribe()
  }, [])
  return children
}

export default InitAuth
