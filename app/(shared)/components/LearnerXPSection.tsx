import React from 'react'
import { Card } from './ui/card'
import { cn } from '../utils'
import { Sparkle, Trophy } from 'lucide-react'
import colors from '../tailwind/colors'

type LearnerXPSectionProps = {
  experience: number
  tier: string
  nextLevelExp: number | string
  expUntilNextLevel: number | string
  percentage: number | string
  nextTier: string
  status: string
  isFromLearner?: boolean
  fullname?: string
  userType?: string
  numberOfCases?: number
}

export default function LearnerXPSection({
  experience,
  tier,
  nextLevelExp,
  expUntilNextLevel,
  percentage,
  nextTier,
  status,
  isFromLearner,
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
      className={`rounded-none col-span-1 w-full h-full lg:rounded-lg lg:p-6 overflow-hidden`}
    >
      <div>
        <div className='items-center justify-between hidden lg:flex'>
          <div className='flex items-center gap-3'>
            {isFromLearner ? (
              <>
                <div className='flex items-center text-white space-x-2 lg:text-black lg:p-3 lg:rounded-[8px] lg:gap-3 lg:bg-gradient-to-b lg:from-neutral-gray-100 lg:to-white'>
                  <Sparkle fill='#fff' className='block lg:hidden' />
                  <Sparkle
                    fill={colors['purple-shade'].darkest2}
                    stroke={colors['purple-shade'].darkest2}
                    className='hidden lg:block'
                  />
                  <h1 className='font-medium text-xl lg:text-base'>
                    {experience?.toLocaleString()} XP
                  </h1>
                </div>
                <p className='font-semibold text-purple-shade-darkest2 text-base hidden lg:block'>
                  {status}
                </p>
              </>
            ) : (
              <>
                <h3 className='font-semibold text-xl'>{fullname}</h3>
              </>
            )}
          </div>
          <div
            className={cn(
              `hidden px-[12px] py-[6px] rounded-[8px] lg:flex items-center gap-3 lg:min-h-[41px] lg:min-w-[111px] lg:text-white lg:bg-gradient-to-b`,
              tier?.toLowerCase() === TIER.bronze &&
                'lg:from-tier-bronze-from lg:to-tier-bronze-to',
              tier?.toLowerCase() === TIER.silver &&
                'lg:from-tier-silver-from lg:to-tier-silver-to',
              tier?.toLowerCase() === TIER.gold &&
                'lg:from-tier-gold-from lg:to-tier-gold-to'
            )}
          >
            <Trophy className='h-4 w-4 lg:h-5 lg:w-5' />
            <p className='text-sm font-medium lg:text-base capitalize'>
              {tier}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div
          className={cn(
            `bg-gradient-to-b p-0 m-0 rounded-[8px] lg:bg-none lg:bg-white mt-0`,
            isFromLearner ? 'lg:mt-6' : 'lg:mt-10',
            tier?.toLowerCase() === TIER.bronze &&
              'from-tier-bronze-from to-tier-bronze-to',
            tier?.toLowerCase() === TIER.silver &&
              'from-tier-silver-from to-tier-silver-to',
            tier?.toLowerCase() === TIER.gold &&
              'from-tier-gold-from to-tier-gold-to'
          )}
        >
          <div className={cn('p-4 flex flex-col justify-between lg:p-0')}>
            {!isFromLearner && (
              <div className='items-center gap-3 hidden lg:flex'>
                <div className='flex items-center text-white space-x-2 lg:text-black lg:p-3 lg:rounded-[8px] lg:gap-3 lg:bg-gradient-to-b lg:from-neutral-gray-100 lg:to-white'>
                  <Sparkle fill='#fff' className='block lg:hidden' />
                  <Sparkle
                    fill={colors['purple-shade'].darkest2}
                    stroke={colors['purple-shade'].darkest2}
                    className='hidden lg:block'
                  />
                  <h1 className='font-semibold text-xl lg:text-base'>
                    {experience?.toLocaleString()} XP
                  </h1>
                </div>
                <p className='font-semibold text-purple-shade-darkest2 text-base hidden lg:block'>
                  {status}
                </p>
              </div>
            )}
            <div className='flex justify-between lg:hidden lg:mt-4'>
              <div className='space-y-3 block lg:flex lg:gap-3'>
                <div className='flex items-center text-white space-x-2 lg:text-black lg:p-3 lg:rounded-[8px] lg:gap-3 lg:bg-gradient-to-b lg:from-neutral-gray-100 lg:to-white'>
                  <Sparkle fill='#fff' />
                  <h1 className='font-semibold text-xl lg:text-base'>
                    {experience?.toLocaleString()} XP
                  </h1>
                </div>
                <p className='font-[300] text-[12px] text-white lg:text-black'>
                  {experience && experience >= MAX_XP
                    ? 'Max XP'
                    : `${expUntilNextLevel?.toLocaleString()} XP until ${nextTier}`}
                </p>
              </div>
              <div className='px-3 py-[6px] max-h-[32px] max-w-[100px] bg-white rounded-[8px] flex items-center gap-3 lg:hidden '>
                <Trophy className='h-4 w-4 lg:h-5 lg:w-5' />
                <p className='text-[14px] leading-5 font-medium lg:text-base capitalize'>
                  {tier}
                </p>
              </div>
            </div>
            <div className='space-y-0 lg:space-y-[10px] mt-10 lg:mt-4'>
              <div className='space-y-[12px] flex flex-col lg:flex lg:flex-row lg:flex-grow lg:space-y-0 lg:items-center lg:gap-[16px] w-full'>
                <div className='flex items-center w-full'>
                  <div className='w-full bg-white overflow-hidden lg:bg-neutral-gray-200 rounded-1'>
                    <div
                      className='bg-gradient-to-r from-purple-gradient-start to-purple-gradient-end h-2 border-[1px] border-white rounded-[4px] lg:bg-none lg:bg-purple-shade-darkest2 progress-bar'
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <p className='font-[400] text-nowrap leading-4 text-xs text-white lg:text-[14px] lg:font-semibold lg:text-neutral-gray-600 lg:leading-5'>
                  {experience?.toLocaleString()} /{' '}
                  {nextLevelExp?.toLocaleString()} XP
                </p>
              </div>
              <p className='hidden font-normal text-base lg:block text-white lg:text-black leading-[24.8px]'>
                {experience && experience >= MAX_XP
                  ? 'Max XP'
                  : `${expUntilNextLevel?.toLocaleString()} XP until ${nextTier}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
