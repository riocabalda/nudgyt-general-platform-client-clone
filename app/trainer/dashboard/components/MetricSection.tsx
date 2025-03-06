import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/app/(shared)/components/ui/select'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import React from 'react'

function MetricSection() {
  const metrics = [
    {
      label: 'Total Learners',
      value: '1,234',
      change: '12.5%',
      showTrend: true,
      isIncrease: true
    },
    {
      label: 'Total Passing Rate',
      value: '85%',
      change: '5.2%',
      showTrend: true,
      isIncrease: true
    },
    {
      label: 'Total Services',
      value: '24',
      showTrend: false
    },
    {
      label: 'Average Score',
      value: '78.5',
      change: '3.8%',
      showTrend: true,
      isIncrease: false
    }
  ]

  return (
    <div className='bg-white rounded-none lg:rounded-lg p-6'>
      <Select defaultValue='seven-days'>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select a metric' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Metrics</SelectLabel>
            <SelectItem value='seven-days'>Last 7 Days</SelectItem>
            <SelectItem value='weekly'>Weekly</SelectItem>
            <SelectItem value='monthly'>Monthly</SelectItem>
            <SelectItem value='yearly'>Yearly</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6 lg:mt-14'>
        {metrics.map((metric, index) => (
          <div key={index}>
            <p className='text-xs text-gray-800 uppercase font-medium tracking-widest'>
              {metric.label}
            </p>
            <p className='text-2xl font-semibold flex items-center mt-2 text-purple-shade-darkest2'>
              {metric.value}
              {metric.showTrend && metric.change && (
                <span className='inline-flex items-center ml-2 text-sm font-medium'>
                  <span
                    className={`flex items-center gap-1 ${metric.isIncrease ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {metric.isIncrease ? '+' : '-'}
                    {metric.change}
                    {metric.isIncrease ? (
                      <ArrowUpIcon className='w-3 h-3' />
                    ) : (
                      <ArrowDownIcon className='w-3 h-3' />
                    )}
                  </span>
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MetricSection
