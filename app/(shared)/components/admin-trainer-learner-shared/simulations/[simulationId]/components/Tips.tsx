'use client'

import React, { useState } from 'react'
import { Card } from '@/app/(shared)/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'
import TipsContent from './TipsContent'

function Tips() {
  const [open, setOpen] = useState(true)

  return (
    <Card className='hidden lg:block rounded-[8px] border mt-4'>
      <header>
        <button
          className='w-full flex items-center justify-between px-[10px] py-3'
          onClick={() => setOpen(!open)}
        >
          <span className='text-foreground font-semibold'>Tips</span>
          {open ? (
            <ChevronUp size={24} strokeWidth={1} />
          ) : (
            <ChevronDown size={24} strokeWidth={1} />
          )}
        </button>
      </header>
      {open && (
        <div className='px-3 py-4 border-t'>
          <TipsContent />
        </div>
      )}
    </Card>
  )
}

export default Tips
