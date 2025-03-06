'use client'

import { useSearchParams } from 'next/navigation'

/**
 * A hook to validate URL search parameters against a set of accepted keys and values
 *
 * @param acceptedParams - An object defining valid keys and their accepted values.
 *                        Example: { tab: ['learners', 'form-answers', 'rubrics'], level: ['1', '2', '3'] }
 * @returns {Object}
 *   - isURLTampered: boolean indicating if URL contains invalid params/values
 *   - paramJson: parsed URL parameters as an object
 *   - searchParams: raw Next.js searchParams object
 */

export default function useGetParamsFromURL(
  acceptedParams: Record<string, string[]>
) {
  const searchParams = useSearchParams()
  const paramObj = Object.fromEntries(searchParams.entries())
  const paramKeys = Object.keys(paramObj)

  const isURLTampered = paramKeys.some((key) => {
    if (acceptedParams[key]) {
      const currentValue = paramObj[key]
      return !acceptedParams[key].includes(currentValue)
    }
    return false
  })

  return { isURLTampered, paramJson: paramObj, searchParams }
}
