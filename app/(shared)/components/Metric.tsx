import { ArrowDown, ArrowUp } from 'lucide-react'
import { MetricProps } from '@/app/(shared)/types'
import { cn } from '../utils'

function Metric({
  title,
  className,
  changeDirection,
  percentageChange,
  value
}: MetricProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className='text-xs font-medium text-neutral-800'>{title}</p>
      <div className='flex items-center gap-2'>
        <h1 className='text-brandcolora text-xl lg:text-2xl font-semibold'>
          {value}
        </h1>
        <span
          className={cn(
            `text-sm flex items-center gap-1 font-medium`,
            changeDirection === 'decreased' && 'text-red-300',
            changeDirection === 'increased' && 'text-green-300'
          )}
        >
          {changeDirection !== 'unchanged' && (
            <>
              {percentageChange}
              {changeDirection === 'increased' && <ArrowUp size={12} />}
              {changeDirection === 'decreased' && <ArrowDown size={12} />}
            </>
          )}
        </span>
      </div>
    </div>
  )
}

export default Metric
