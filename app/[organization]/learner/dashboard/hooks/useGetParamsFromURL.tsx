'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type TUseGetParamsFromURLProps = {
  keysToCheck: string[]
  valuesToCheck: string[]
}

export default function useGetParamsFromURL<T extends object>({
  keysToCheck,
  valuesToCheck
}: TUseGetParamsFromURLProps) {
  const searchParams = useSearchParams()
  const paramObj: T = searchParams.toString()
    ? JSON.parse(
        '{"' +
          decodeURI(
            searchParams.toString().replace(/&/g, '","').replace(/=/g, '":"')
          ) +
          '"}'
      )
    : {}
  const paramKeys = Object.keys(paramObj)
  const paramValue = Object.values(paramObj)
  const [isURLTampered, setIsURLTampered] = useState<boolean>(false)

  useEffect(() => {
    // Check if 'search' is a key
    const hasSearchKey = paramKeys.includes('search')

    // If 'search' is a key, skip value checks
    if (hasSearchKey) {
      setIsURLTampered(false)
      return
    }

    // Check keys
    for (const key of paramKeys) {
      if (!keysToCheck.includes(key)) {
        setIsURLTampered(true)
        return
      }
    }

    // Check values
    for (const value of paramValue) {
      if (!valuesToCheck.includes(value)) {
        setIsURLTampered(true)
        return
      }
    }

    // If both checks pass, set to false
    setIsURLTampered(false)
  }, [searchParams.toString()])

  return { isURLTampered, paramJson: paramObj, searchParams }
}
