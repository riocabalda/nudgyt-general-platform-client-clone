'use client'

import React, { useEffect } from 'react'
import {
  FileEditIcon,
  Lightbulb,
  MessagesSquare,
  UserCircle2
} from 'lucide-react'
import { cn } from '@/app/(shared)/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { Simulation } from '@/app/(shared)/services/admin/simulationService'
import TipsModal from './TipsModal'

const navItems = [
  {
    name: 'Transcript',
    param: 'transcript',
    icon: <MessagesSquare size={24} strokeWidth={1.5} />
  },
  {
    name: 'Form',
    param: 'form',
    icon: <FileEditIcon size={24} strokeWidth={1.5} />
  },
  {
    name: 'Profile',
    param: 'profile',
    icon: <UserCircle2 size={24} strokeWidth={1.5} />
  },
  {
    name: 'Tips',
    param: 'tips',
    icon: <Lightbulb size={24} strokeWidth={1.5} />
  }
]

function NavigationPanel({ simulationData }: { simulationData: Simulation }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = new URLSearchParams(searchParams.toString())

  const navParam = params.get('panel')

  const isValidTab =
    navParam !== null && navItems.some((item) => item.param === navParam)

  useEffect(() => {
    if (!isValidTab) {
      params.set('panel', 'form')
      const newUrl = `${window.location.pathname}?${params.toString()}`
      router.replace(newUrl)
    }
  }, [params])

  const handleSelectedPanel = (value: string) => {
    params.set('panel', value)
    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.replace(newUrl)
  }

  return (
    <nav className='flex items-center lg:items-start justify-evenly md:justify-evenly gap-4 border-t px-3 py-2 h-[90px] lg:p-4 w-full bg-white lg:border lg:rounded-[8px] lg:mt-4'>
      {navItems.map((item) =>
        item.name === 'Tips' ? (
          <TipsModal key={item.name} />
        ) : (
          <button
            key={item.name}
            className={cn(
              'flex flex-col items-center gap-[10px] text-muted-foreground min-w-[72px]',
              navParam === item.param && 'text-brandcolora',
              item.param === 'form' &&
                !simulationData?.form_answers.length &&
                'hidden'
            )}
            onClick={() => handleSelectedPanel(item.param)}
          >
            {item.icon}
            <span
              className={cn(
                'text-[11px] font-medium',
                navParam === item.param && 'font-semibold'
              )}
            >
              {item.name}
            </span>
          </button>
        )
      )}
    </nav>
  )
}

export default NavigationPanel
