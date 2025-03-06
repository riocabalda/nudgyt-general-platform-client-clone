import React from 'react'
import { cn } from '@/app/(shared)/utils'
import { Mic } from 'lucide-react'

function SpeechButton({
  isKeyHeld,
  isPressed,
  micPermission,
  handleSpeechBtn,
  className,
  ...props
}: {
  isKeyHeld: boolean
  isPressed: boolean
  micPermission: string | null
  handleSpeechBtn: () => void

  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'p-[6px] rounded-full bg-brandcolora/50 text-brandcolora focus:outline-none focus:ring-0 disabled:bg-muted',
        (isPressed || isKeyHeld) &&
          micPermission === 'granted' &&
          'text-white bg-destructive hover:bg-destructive/80 rounded-full',
        className
      )}
      onClick={handleSpeechBtn}
      {...props}
    >
      <Mic size={20} strokeWidth={1.5} />
    </button>
  )
}

export default SpeechButton
