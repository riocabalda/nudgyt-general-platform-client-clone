import React, { useState, useEffect } from 'react'
import { Input } from './ui/input'
import useAlertStore from './alert/useAlertStore'
interface CustomTimePickerProps {
  customTimeLimit: string
  setCustomTimeLimit: (value: string) => void
}

const CustomTimePicker = ({
  customTimeLimit,
  setCustomTimeLimit
}: CustomTimePickerProps) => {
  const [hour, setHour] = useState<string>('')
  const [minute, setMinute] = useState<string>('')
  const { showAlert } = useAlertStore()

  useEffect(() => {
    if (customTimeLimit) {
      const [h, m] = customTimeLimit.split(':')
      setHour(h || '')
      setMinute(m || '')
    }
  }, [customTimeLimit])

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numValue = parseInt(value)

    if (numValue < 0) {
      showAlert({
        message: 'Hours cannot be negative',
        variant: 'error'
      })
      return
    }

    setHour(value)
    const currentMinute = minute || '0'
    setCustomTimeLimit(`${value}:${currentMinute}:00`)
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numValue = parseInt(value)

    if (numValue < 0) {
      showAlert({
        message: 'Minutes cannot be negative',
        variant: 'error'
      })
      return
    }

    if (numValue > 59) {
      showAlert({
        message: 'Minutes must be less than 60',
        variant: 'error'
      })
      return
    }

    setMinute(value)
    const currentHour = hour || '0'
    setCustomTimeLimit(`${currentHour}:${value}:00`)
  }

  return (
    <div className='flex gap-2 items-center w-full'>
      <Input
        type='number'
        value={hour}
        onChange={handleHourChange}
        placeholder='Hours'
        className='w-full p-2 border rounded'
      />
      <Input
        type='number'
        min='0'
        max='59'
        value={minute}
        onChange={handleMinuteChange}
        placeholder='Minutes'
        className='w-full p-2 border rounded'
      />
    </div>
  )
}

export default CustomTimePicker
