'use client'

import React, { useEffect } from 'react'
import serverConfig from '../(shared)/config/serverConfig'
import authTokenService from '../(shared)/services/authTokenService'
import io from 'socket.io-client'

function WebSocketTestPage() {
  const accessToken = authTokenService.getAccessToken()

  useEffect(() => {
    const socket = io(serverConfig.socketUrl, {
      reconnection: true,
      auth: {
        accessToken: `Bearer ${accessToken}`,
        payload: {}
      }
    })

    socket.on('connect', () => {
      console.log('Connected to simulation server')
    })

    return () => {
      socket.disconnect()
    }
  }, [])
  return <div>page</div>
}

export default WebSocketTestPage
