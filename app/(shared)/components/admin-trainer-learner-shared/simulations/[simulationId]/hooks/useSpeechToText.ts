import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import 'regenerator-runtime/runtime' // Place before 'react-speech-recognition'
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition'

function useSpeechToText(selectedLanguage: string) {
  const [micPermission, setMicPermission] = useState<string | null>(null)

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  const permissionPrompt = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: 'microphone' as PermissionName
      })

      // Set initial permission state
      setMicPermission(permissionStatus.state)

      // Listen for changes in permission state
      permissionStatus.onchange = () => {
        setMicPermission(permissionStatus.state)
        stopListening()
      }
    } catch (error) {
      console.error('Error querying microphone permissions:', error)
      setMicPermission(null)
    }
  }

  const openBrowserSettings = () => {
    const ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('chrome') > -1) {
      return 'Please go to Chrome settings > Privacy and security > Site settings > Microphone and allow access for this site.'
    } else if (ua.indexOf('firefox') > -1) {
      return 'Please go to Firefox settings > Privacy & Security > Permissions > Microphone and allow access for this site.'
    } else if (ua.indexOf('safari') > -1) {
      return 'Please go to Safari > Preferences > Websites > Microphone and allow access for this site.'
    } else if (ua.indexOf('edg') > -1) {
      return 'Please go to Edge settings > Cookies and site permissions > Microphone and allow access for this site.'
    } else {
      return 'Please enable microphone permissions in your browser settings.'
    }
  }

  const startListening = () =>
    SpeechRecognition.startListening({
      continuous: true,
      language: selectedLanguage
    })

  const stopListening = () => SpeechRecognition.abortListening()

  useEffect(() => {
    if (!browserSupportsSpeechRecognition)
      toast.warning(`Browser doesn't support speech recognition.`)
    permissionPrompt()

    return () => {
      stopListening()
    }
  }, [micPermission])

  return {
    transcript,
    listening,
    micPermission,
    resetTranscript,
    startListening,
    stopListening,
    openBrowserSettings
  }
}

export default useSpeechToText
