'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/app/(shared)/components/ui/select'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import dashboardService from '@/app/(shared)/services/admin/dashboardService'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import React, { useState } from 'react'
import useSWR from 'swr'

function MetricSection() {
  const { orgSlug } = useOrganization()
  const [timeFrame, setTimeFrame] = useState<
    'seven-days' | 'today' | 'yesterday' | 'weekly' | 'monthly' | 'yearly'
  >('seven-days')

  const { data: metrics } = useSWR(
    `${orgSlug}/admin/services/metrics?timeFrame=${timeFrame}`,
    () =>
      dashboardService
        .getServiceMetrics(timeFrame, orgSlug)
        .then((res) => res.data)
  )
  const handleTimeFrameChange = (value: string) => {
    setTimeFrame(
      value as
        | 'seven-days'
        | 'today'
        | 'yesterday'
        | 'weekly'
        | 'monthly'
        | 'yearly'
    )
  }

  return (
    <div className='bg-white rounded-none lg:rounded-lg p-6 metric-section'>
      <Select defaultValue='seven-days' onValueChange={handleTimeFrameChange}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select a metric' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Metrics</SelectLabel>
            <SelectItem value='today'>Today</SelectItem>
            <SelectItem value='yesterday'>Yesterday</SelectItem>
            <SelectItem value='seven-days'>Last 7 Days</SelectItem>
            <SelectItem value='monthly'>Monthly</SelectItem>
            <SelectItem value='yearly'>Yearly</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className='grid grid-rows-2 grid-cols-2 gap-x-8 gap-y-6 mt-6 lg:mt-14 grid-flow-col'>
        {metrics?.data?.map(
          (
            metric: any, // type any is temporary
            index: number
          ) => (
            <div key={index}>
              <p className='text-xs text-gray-800 uppercase font-medium tracking-widest'>
                {metric.label}
              </p>
              <p className='text-2xl font-semibold flex items-center mt-2 text-purple-shade-darkest2'>
                {metric.value}
                {metric.showTrend && metric.change ? (
                  <span className='inline-flex items-center ml-2 text-sm font-medium'>
                    <span
                      className={`flex items-center gap-1 ${metric.isIncrease ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {metric.change}
                      {metric.isIncrease ? (
                        <ArrowUpIcon className='w-3 h-3' />
                      ) : (
                        <ArrowDownIcon className='w-3 h-3' />
                      )}
                    </span>
                  </span>
                ) : null}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default MetricSection
