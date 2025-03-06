import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/app/(shared)/utils'
import { useParams } from 'next/navigation'
import { Card } from '@/app/(shared)/components/ui/card'
import { useGetTranscripts } from '../hooks/useGetTranscripts'
import { Service } from '@/app/(shared)/services/learner/serviceService'
import { MessageType, TranscriptLanguageType } from '@/app/(shared)/types'
import TextareaAutosize from 'react-textarea-autosize'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useSpeechToText from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useSpeechToText'
import useCharacterStore from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useCharacterStore'
import SubmitButton from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/transcript/SubmitButton'
import SpeechButton from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/transcript/SpeechButton'
import CharacterSelector from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/transcript/CharacterSelector'
import TranscriptMessages from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/transcript/TranscriptMessages'
import TranscriptLanguageSelector from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/transcript/TranscriptLanguageSelector'

function Transcript({ serviceData }: { serviceData: Service }) {
  const [text, setText] = useState('')
  const [lastTranscript, setLastTranscript] = useState('')
  const [showSpeechBtn, setShowSpeechBtn] = useState(true)
  const [isKeyHeld, setIsKeyHeld] = useState(false)
  const [isSpeechBtnPressed, setIsSpeechBtnPressed] = useState(false)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [selectedLanguage, setSelectedLanguage] =
    useState<TranscriptLanguageType>({
      name: 'English(UK)',
      code: 'en-GB'
    })
  const containerRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const { simulationId } = useParams()
  const { orgSlug } = useOrganization()

  const { savedMessages } = useGetTranscripts(orgSlug, String(simulationId))
  const {
    selectedPersonalityId,
    disableSelection: disableCharacterSelection,
    charactersCount,
    isCharacterInitialized
  } = useCharacterStore()

  const {
    transcript,
    listening,
    micPermission,
    resetTranscript,
    startListening,
    stopListening,
    openBrowserSettings
  } = useSpeechToText(selectedLanguage.code)

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
        textAreaRef.current && document.activeElement === textAreaRef.current
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
      if (textAreaRef.current) textAreaRef.current.blur()
    }

    if (containerRef.current)
      containerRef.current.scrollTop = containerRef.current.scrollHeight

    if (textAreaRef.current)
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight
  }, [transcript, text, listening, messages, isKeyHeld])

  const reset = () => {
    resetTranscript()
    setText('')
    setShowSpeechBtn(true)
  }

  const handleStartListening = () => {
    setShowSpeechBtn(true)

    if (micPermission === 'denied')
      return toast(
        <div>
          <p>Microphone access denied.</p> <br />
          <p>{openBrowserSettings()}</p>
          <p>
            <a href='http://' target='_blank' rel='noopener noreferrer'></a>
          </p>
        </div>
      )

    startListening()
  }

  const handleStopListening = () => {
    stopListening()
    resetTranscript()
    if (text) setShowSpeechBtn(false)
    if (textAreaRef.current && textAreaRef.current.value)
      textAreaRef.current.focus()
  }

  const handleEditTranscript = () => {
    resetTranscript()
    setLastTranscript('')
  }

  const handleSubmitText = async () => {
    if (window.document) {
      const descriptor = {
        AIDialogue: `${selectedPersonalityId} : ${text}`
      }
      const obj = {
        cmd: 'sendToUe4',
        value: descriptor
      }

      const iframe = document.getElementById('iframe_1') as HTMLIFrameElement
      if (iframe) {
        iframe.contentWindow?.postMessage(JSON.stringify(obj), '*')
        disableCharacterSelection()
      } else {
        console.error('iframe_1 not found.')
      }
    }

    reset()
  }

  const getPlaceholderText = () => {
    if (listening && micPermission === 'granted') {
      return 'Listening...'
    }
    return 'Write a message...'
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmitText()
    }
  }

  const handleLanguageChange = (language: TranscriptLanguageType) => {
    setSelectedLanguage(language)
  }

  // holding down the key 'T'
  const handleKeyDown = (event: KeyboardEvent) => {
    const textArea = textAreaRef.current
    const isTextAreaFocused = textArea === document.activeElement
    if (
      event.key.toLowerCase() === 't' &&
      !isTextAreaFocused &&
      !isSpeechBtnPressed &&
      isCharacterInitialized
    ) {
      setIsKeyHeld(true)
      handleStartListening()
    }
  }
  // release from holding the key 'T'
  const handleKeyUp = (event: KeyboardEvent) => {
    const textArea = textAreaRef.current
    const isTextAreaFocused = textArea === document.activeElement
    if (
      event.key.toLowerCase() === 't' &&
      !isTextAreaFocused &&
      !isSpeechBtnPressed &&
      isCharacterInitialized
    ) {
      setIsKeyHeld(false)
      handleStopListening()
    }
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setText(newValue)
    resetTranscript()
  }

  const handleSpeechBtn = () => {
    // If mic permission is denied, a toast will be triggered in handleStartListening, but speech recognition will not start.
    if (isKeyHeld) return
    if (micPermission === 'denied') return handleStartListening()

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
    }
  }, [savedMessages])

  useEffect(() => {
    // handle hold and release the 't' key to speak
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      // Clean up event listeners on component unmount
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isSpeechBtnPressed, isCharacterInitialized])

  return (
    <>
      <Card
        ref={containerRef}
        className='flex-1 flex flex-col p-4 lg:pb-4 gap-4 w-full rounded-none rounded-t-[8px] border border-b-0 overflow-y-auto custom-scrollbar-thin'
      >
        <TranscriptMessages messages={messages} />
      </Card>

      <Card className='mb-[74px] pl-4 pr-2 py-2 lg:mb-0 w-full rounded-none lg:rounded-b-[8px] border-t lg:border '>
        {charactersCount > 1 && (
          <CharacterSelector serviceData={serviceData as Service} />
        )}
        <div className='min-h-14 flex items-center gap-3'>
          <TextareaAutosize
            disabled={!isCharacterInitialized}
            ref={textAreaRef}
            className={cn(
              'w-full  p-0 resize-none border-none custom-scrollbar-thin active:outline-none focus:outline-none focus:ring-transparent',
              !isCharacterInitialized && 'hover:cursor-progress'
            )}
            value={text}
            minRows={1}
            maxRows={3}
            placeholder={getPlaceholderText()}
            onKeyDown={handleKeyPress}
            onChange={handleTextAreaChange}
            onFocus={handleEditTranscript}
          />
          <div className='flex gap-1 items-center'>
            {!listening && !showSpeechBtn && text && (
              <SubmitButton onSubmit={handleSubmitText} />
            )}
            {(showSpeechBtn || listening || isKeyHeld || !text) && (
              <SpeechButton
                className={`${!isCharacterInitialized && 'hover:cursor-progress'}`}
                isKeyHeld={isKeyHeld}
                isPressed={isSpeechBtnPressed}
                disabled={!isCharacterInitialized}
                micPermission={micPermission}
                handleSpeechBtn={handleSpeechBtn}
              />
            )}
            <TranscriptLanguageSelector
              selectedLanguage={selectedLanguage}
              handleLanguageChange={handleLanguageChange}
            />
          </div>
        </div>
      </Card>
    </>
  )
}

export default Transcript
