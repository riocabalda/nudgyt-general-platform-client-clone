import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { cn } from '@/app/(shared)/utils'
import { useParams } from 'next/navigation'
import { MessageType } from '@/app/(shared)/types'
import { useGetTranscripts } from '../hooks/useGetTranscripts'
import { Textarea } from '@/app/(shared)/components/ui/textarea'
import { Service } from '@/app/(shared)/services/admin/serviceService'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useSpeechToText from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useSpeechToText'
import useCharacterStore from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useCharacterStore'
import SubmitButton from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/transcript/SubmitButton'
import SpeechButton from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/transcript/SpeechButton'
import CharacterSelector from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/transcript/CharacterSelector'

function SimulationFloatingActionButton({
  serviceData
}: {
  serviceData: Service
}) {
  const [text, setText] = useState('')
  const [lastTranscript, setLastTranscript] = useState('')
  const [showSpeechBtn, setShowSpeechBtn] = useState(true)
  const [isKeyHeld, setIsKeyHeld] = useState(false)
  const [showTextField, setShowTextField] = useState(false)
  const [isSpeechBtnPressed, setIsSpeechBtnPressed] = useState(false)
  const [messages, setMessages] = useState<MessageType[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { simulationId } = useParams()
  const { orgSlug } = useOrganization()
  const { charactersCount } = useCharacterStore()

  const { savedMessages } = useGetTranscripts(orgSlug, String(simulationId))

  const {
    transcript,
    listening,
    micPermission,
    resetTranscript,
    startListening,
    stopListening,
    openBrowserSettings
  } = useSpeechToText('en-GB')

  useEffect(() => {
    reset()
    setIsKeyHeld(false)
    setIsSpeechBtnPressed(false)
    stopListening()
  }, [micPermission])

  useEffect(() => {
    if (text && !listening) setShowSpeechBtn(false)
    if (listening && transcript && transcript !== text) {
      // Append new part of transcript to the text only if listening and transcript has changed
      const isEditing =
        inputRef.current && document.activeElement === inputRef.current
      const hasSpace = isEditing || (!lastTranscript && isKeyHeld) ? ' ' : ''

      // Update the text by replacing the last appended content with the corrected transcript
      setText((prev) => {
        const currentTextWithoutLast = prev.slice(
          0,
          prev.length - lastTranscript.length
        )
        return [currentTextWithoutLast, transcript].join(hasSpace).trim()
      })
      setLastTranscript(transcript)
      if (inputRef.current) inputRef.current.blur()
    }

    if (inputRef.current)
      inputRef.current.scrollTop = inputRef.current.scrollHeight
  }, [transcript, text, listening, messages, isKeyHeld])

  const reset = () => {
    resetTranscript()
    setText('')
    setShowSpeechBtn(true)
  }

  const handleEditTranscript = () => {
    resetTranscript()
    setLastTranscript('')
  }

  const handleStartListening = () => {
    setShowSpeechBtn(true)
    if (micPermission === 'denied')
      return toast(
        <div>
          <p>Microphone access denied.</p> <br />
          <p>{openBrowserSettings()}</p>
        </div>
      )
    startListening()
    setShowTextField(true)
  }

  const handleStopListening = () => {
    stopListening()
    resetTranscript()
    if (inputRef.current && text) inputRef.current.focus()
    if (text) {
      setShowSpeechBtn(false)
    }
  }

  const handleSubmitText = async () => {
    //  TODO: Refactor
    if (!showTextField) return setShowTextField(true)

    if (window.document) {
      const descriptor = {
        AIDialogue: text
      }
      const obj = {
        cmd: 'sendToUe4',
        value: descriptor
      }

      const iframe = document.getElementById('iframe_1') as HTMLIFrameElement
      if (iframe) {
        iframe.contentWindow?.postMessage(JSON.stringify(obj), '*')
      } else {
        console.error('iframe_1 not found.')
      }
    }

    reset()
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmitText()
    }
  }

  // holding down the key 'T'
  const handleKeyDown = (event: KeyboardEvent) => {
    const textArea = containerRef.current?.querySelector('textarea')
    const isTextAreaFocused = textArea === document.activeElement
    if (
      event.key.toLowerCase() === 't' &&
      !isTextAreaFocused &&
      !isSpeechBtnPressed
    ) {
      setIsKeyHeld(true)
      handleStartListening()
    }
  }
  // release from holding the key 'T'
  const handleKeyUp = (event: KeyboardEvent) => {
    const textArea = containerRef.current?.querySelector('textarea')
    const isTextAreaFocused = textArea === document.activeElement
    if (
      event.key.toLowerCase() === 't' &&
      !isTextAreaFocused &&
      !isSpeechBtnPressed
    ) {
      setIsKeyHeld(false)
      handleStopListening()
      if (!text) setShowTextField(false)
    }
  }

  const handleCloseField = () => {
    setShowTextField(false)
    setText('')
    setIsSpeechBtnPressed(false)
    stopListening()
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setText(newValue)
    resetTranscript()
  }

  const handleSpeechBtn = () => {
    // If mic permission is denied, a toast will be triggered in handleStartListening, but speech recognition will not start.
    if (micPermission === 'denied') return handleStartListening()
    if (isSpeechBtnPressed && !showTextField) {
      handleStartListening()

      return
    }
    if (!isSpeechBtnPressed) {
      handleStartListening()
    } else {
      handleStopListening()
    }
    setIsSpeechBtnPressed(!isSpeechBtnPressed)
  }

  useEffect(() => {
    if (savedMessages) {
      const newMessages: MessageType[] = savedMessages.map((message) => ({
        sender: message.from,
        recipient: message.to,
        from: message.from_type === 'character' ? 'AI' : 'Me',
        text: message.dialogue_value
      }))
      setMessages(newMessages)
      setMessages([])
    }
  }, [savedMessages])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [text, isSpeechBtnPressed, charactersCount])

  return (
    <div className='lg:static h-14 flex items-end gap-3 pl-4 pr-2 rounded-none lg:rounded-b-[8px]'>
      {showTextField && (
        <div ref={containerRef} className='relative'>
          {charactersCount > 1 && (
            <div className='absolute top-0 left-0 -translate-y-9'>
              <CharacterSelector
                serviceData={serviceData as Service}
                className='py-0 lg:gap-2'
              />
            </div>
          )}
          <Textarea
            ref={inputRef}
            className='text-sm border-none max-h-[36px] bg-neutral-gray-800/75 text-white w-[75vw] lg:w-[365px] scrollbar-thin focus-visible:ring-transparent focus-visible:ring-offset-transparent resize-none'
            placeholder={
              listening && micPermission === 'granted'
                ? 'Listening...'
                : 'Write a message...'
            }
            rows={3}
            onKeyDown={handleKeyPress}
            onChange={handleTextAreaChange}
            onFocus={handleEditTranscript}
            value={text}
          />
          <button
            className='absolute top-0 right-0 text-white p-1 rounded-full bg-black/50 hover:bg-black/60 translate-x-1/2 -translate-y-1/2'
            onClick={handleCloseField}
          >
            <X className='size-3' />
          </button>
        </div>
      )}
      <div className='flex gap-1 items-center'>
        {!listening && !showSpeechBtn && text && (
          <SubmitButton
            onSubmit={handleSubmitText}
            className='p-[6px] h-[48px] w-[48px]'
          />
        )}
        {(showSpeechBtn || listening || isKeyHeld || !text) && (
          <SpeechButton
            isKeyHeld={isKeyHeld}
            isPressed={isSpeechBtnPressed}
            disabled={isKeyHeld}
            micPermission={micPermission}
            handleSpeechBtn={handleSpeechBtn}
            className={cn(
              'flex justify-center items-center p-[6px] rounded-full bg-white text-red-500 h-[48px] w-[48px]',
              showSpeechBtn &&
                listening &&
                micPermission === 'granted' &&
                'text-white bg-destructive hover:bg-destructive/80 rounded-full'
            )}
          />
        )}
      </div>
    </div>
  )
}

export default SimulationFloatingActionButton
