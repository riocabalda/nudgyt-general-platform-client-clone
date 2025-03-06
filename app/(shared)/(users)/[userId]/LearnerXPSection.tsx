import { Card } from '@/app/(shared)/components/ui/card'
import colors from '@/app/(shared)/tailwind/colors'
import { cn } from '@/app/(shared)/utils'
import { Sparkle, Trophy } from 'lucide-react'

type LearnerXPSectionProps = {
  experience: number
  tier: string
  nextLevelExp: number | string
  expUntilNextLevel: number | string
  percentage: number | string
  nextTier: string
  status: string
  fullname?: string
}

export default function LearnerXPSection({
  experience,
  tier,
  nextLevelExp,
  expUntilNextLevel,
  percentage,
  nextTier,
  status,
  fullname
}: LearnerXPSectionProps) {
  const TIER = {
    bronze: 'bronze',
    silver: 'silver',
    gold: 'gold'
  }
  const MAX_XP = 10000

  return (
    <Card
      className={`rounded-none col-span-1 w-full h-full lg:rounded-lg p-4 lg:p-6 overflow-hidden space-y-6 lg:space-y-10`}
    >
      <div>
        <div className='items-center justify-between flex'>
          <div className='flex items-center gap-3'>
            <h3 className='font-semibold text-2xl'>{fullname}</h3>
          </div>
          <div
            className={cn(
              `px-[12px] py-[6px] rounded-[8px] flex items-center gap-3 min-h-[41px] text-white min-w-[111px] bg-gradient-to-b`,
              tier?.toLowerCase() === TIER.bronze &&
                'from-tier-bronze-from to-tier-bronze-to',
              tier?.toLowerCase() === TIER.silver &&
                'from-tier-silver-from to-tier-silver-to',
              tier?.toLowerCase() === TIER.gold &&
                'from-tier-gold-from to-tier-gold-to'
            )}
          >
            <Trophy className='h-4 w-4 lg:h-5 lg:w-5' />
            <p className='font-medium text-base capitalize'>{tier}</p>
          </div>
        </div>
      </div>
      <div className={`bg-gradient-to-b m-0 rounded-[8px] lg:bg-none mt-0`}>
        <div className={'flex flex-col justify-between'}>
          <div className='items-center gap-3 flex'>
            <div className='flex items-center space-x-2 text-black lg:p-3 rounded-[8px] gap-3 bg-gradient-to-b from-neutral-gray-100'>
              <Sparkle
                fill={colors['purple-shade'].darkest2}
                stroke={colors['purple-shade'].darkest2}
                className='block'
              />
              <h1 className='font-semibold text-xl lg:text-base'>
                {experience?.toLocaleString()} XP
              </h1>
            </div>
            <p className='font-semibold text-purple-shade-darkest2 text-base block'>
              {status}
            </p>
          </div>
          <div className='space-y-4 lg:space-y-[10px] mt-4 lg:mt-4'>
            <div className='flex flex-row flex-grow lg:space-y-0 items-center gap-4 w-full'>
              <div className='flex items-center w-full'>
                <div className='w-full overflow-hidden bg-neutral-gray-200 rounded-1'>
                  <div
                    className='h-2 border-[1px] border-white rounded-[4px] bg-none bg-purple-shade-darkest2 progress-bar'
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
              <p className='font-[400] text-nowrap leading-4 text-xs lg:text-[14px] lg:font-semibold text-neutral-gray-600 lg:leading-5'>
                {experience?.toLocaleString()} /{' '}
                {nextLevelExp?.toLocaleString()} XP
              </p>
            </div>
            <p className='font-normal text-base lg:mt-0 lg:block text-black leading-[24.8px]'>
              {experience && experience >= MAX_XP
                ? 'Max XP'
                : `${expUntilNextLevel?.toLocaleString()} XP until ${nextTier}`}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
