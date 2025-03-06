import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import { cn } from '@/app/(shared)/utils'
import { ReactNode } from 'react'
import UpgradePlanModal from './UpgradePlanModal'

function PlanSelectionCard(props: {
  title: ReactNode
  rate: ReactNode
  description: ReactNode[]
  footer?: 'selected' | 'selectable'
  className?: string
}) {
  const { title, rate, description } = props
  const { footer, className } = props

  return (
    <Card
      className={cn(
        'h-full max-w-[333px] flex flex-col gap-4 lg:gap-6 p-6',
        className
      )}
    >
      <header>
        <h2 className='text-lg lg:text-xl text-neutral-gray-800'>{title}</h2>
      </header>

      <p className='text-neutral-gray-800 text-sm'>{rate}</p>

      <ul className='list-disc ml-5'>
        {description.map((item, idx) => (
          <li key={idx} className='text-neutral-gray-600 text-sm'>
            {item}
          </li>
        ))}
      </ul>

      {footer !== undefined && (
        <footer className='mt-auto grid'>
          {footer === 'selected' && (
            <Button
              disabled
              variant='outline'
              className='bg-transparent disabled:bg-muted disabled:text-input'
            >
              Current plan
            </Button>
          )}
          {footer === 'selectable' && (
            <UpgradePlanModal
              body={
                <PlanSelectionCard
                  title={title}
                  rate={rate}
                  description={description}
                  className='h-fit max-w-full border border-neutral-gray-400'
                />
              }
            />
          )}
        </footer>
      )}
    </Card>
  )
}

export default PlanSelectionCard
