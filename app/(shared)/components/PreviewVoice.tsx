import useSound from 'use-sound'
import { CircleStop, Speech } from 'lucide-react'
import { Button } from '@/app/(shared)/components/ui/button'
import { useEffect, useState } from 'react'

type PreviewVoiceProps = {
  path: string
  isShowLabel?: boolean
}

const VOLUME = 0.1

const PreviewVoice = ({ path, isShowLabel = true }: PreviewVoiceProps) => {
  const [play, { stop, duration }] = useSound(path, {
    volume: VOLUME
  })
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlayback = () => {
    if (isPlaying) {
      stop()
    } else {
      play()
    }
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    stop()
    setIsPlaying(false)
  }, [path])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (isPlaying && duration) {
      timer = setTimeout(() => setIsPlaying(false), duration)
    }
    return () => clearTimeout(timer)
  }, [isPlaying, duration])

  return (
    <div className='flex items-center gap-[12px] text-brandcolora'>
      <Button
        type='button'
        variant='link'
        size='sm'
        className='p-0 m-0 lg:p-0 lg:m-0 leading-none text-xs lg:text-sm no-underline flex items-center gap-2 h-max'
        onClick={togglePlayback}
      >
        {isPlaying ? (
          <CircleStop className='size-4' />
        ) : (
          <Speech className='size-4' />
        )}
        {isShowLabel ? (isPlaying ? 'Stop' : 'Preview Voice') : ''}
      </Button>
    </div>
  )
}

export default PreviewVoice
