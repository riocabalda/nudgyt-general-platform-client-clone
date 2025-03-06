import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem
} from '@/app/(shared)/components/ui/dropdown-menu'
import { EllipsisVertical } from 'lucide-react'
import { cn } from '@/app/(shared)/utils'
import { TranscriptLanguageType } from '@/app/(shared)/types'

const speechRecognitionLanguages = [
  { name: 'English(UK)', code: 'en-GB' },
  { name: 'Mandarin Chinese', code: 'zh-CN' },
  { name: 'Malay', code: 'ms-MY' },
  { name: 'Tagalog', code: 'tl-PH' },
  { name: 'Tamil', code: 'ta-IN' }
]

function TranscriptLanguageSelector({
  selectedLanguage,
  handleLanguageChange
}: {
  selectedLanguage: TranscriptLanguageType
  handleLanguageChange: (languageCode: TranscriptLanguageType) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className='w-8 h-8 flex justify-center items-center focus:outline-none'>
        <EllipsisVertical size={20} strokeWidth={1.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-[160px] rounded-[8px] px-0 py-2 mt-0 mb-[10px] lg:mt-[10px] lg:mb-0 '
        align='end'
      >
        <DropdownMenuLabel className='text-xs text-neutral-gray-600 font-medium uppercase px-3 py-2'>
          Speech Language
        </DropdownMenuLabel>
        {speechRecognitionLanguages.map((language) => (
          <DropdownMenuItem
            key={language.name}
            className={cn(
              'text-sm text-neutral-gray-800 px-3 py-2 rounded-none',
              selectedLanguage?.name === language.name && 'bg-neutral-gray-300'
            )}
            onClick={() => handleLanguageChange(language)}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TranscriptLanguageSelector
