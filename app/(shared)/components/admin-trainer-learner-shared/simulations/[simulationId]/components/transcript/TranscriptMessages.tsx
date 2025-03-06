import React from 'react'
import { MessageType } from '@/app/(shared)/types'
import { cn, compactName, getFirstName } from '@/app/(shared)/utils'
import useCharacterStore from '../../hooks/useCharacterStore'

function TranscriptMessages({ messages }: { messages: MessageType[] }) {
  const { charactersCount } = useCharacterStore()

  if (messages.length === 0) return null

  return (
    <>
      {messages?.map((message, index) => {
        const sender = message.sender
        const recipient = message.recipient ?? null

        const isTranscriptFromAICharacter = sender !== null && 'name' in sender
        const isTranscriptForSpecificCharacter =
          recipient !== null && 'name' in recipient

        return (
          <div
            key={index}
            className={cn(
              'w-[220px] border border-gray-100 rounded-sm text-sm  px-3 py-2',
              message.from === 'Me'
                ? 'self-end text-foreground bg-gray-200'
                : 'self-start text-foreground-800 bg-white',
              'grid gap-1'
            )}
          >
            {charactersCount > 1 && isTranscriptFromAICharacter && (
              <h3 className='text-brandcolora text-xs uppercase font-bold'>
                {compactName(sender.name)}
              </h3>
            )}

            <p>
              {charactersCount > 1 && isTranscriptForSpecificCharacter && (
                <span className='text-brandcolora font-semibold'>
                  @{getFirstName(recipient.name)}
                </span>
              )}{' '}
              {message.text.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div>
        )
      })}
    </>
  )
}

export default TranscriptMessages
