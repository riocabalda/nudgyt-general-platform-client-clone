'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/app/(shared)/components/ui/dialog'
import { Lightbulb } from 'lucide-react'
import TipsContent from './TipsContent'

function TipsModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className='flex lg:hidden flex-col items-center gap-[10px] text-muted-foreground w-[72px]'>
          <Lightbulb size={24} strokeWidth={1.5} />
          <span className='text-[11px] font-medium'>Tips</span>
        </button>
      </DialogTrigger>
      <DialogContent className='rounded-[8px] max-w-[600px]  w-[90%] p-3'>
        <DialogHeader>
          <DialogTitle className='text-sm font-semibold text-foreground text-left'>
            Tips
          </DialogTitle>
        </DialogHeader>

        <TipsContent />
      </DialogContent>
    </Dialog>
  )
}

export default TipsModal
