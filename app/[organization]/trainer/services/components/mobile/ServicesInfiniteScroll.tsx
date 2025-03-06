'use client'

import React, { useEffect, useState } from 'react'
import { Loader, SearchX } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'
import FetchError from '@/app/(shared)/components/FetchError'
import ServiceCard from '@/app/(shared)/components/ServiceCard'
import serviceService from '@/app/(shared)/services/trainer/serviceService'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function ServicesInfiniteScroll() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [fetchLoading, setFetchLoading] = useState(false)
  const { orgSlug } = useOrganization()

  const searchParams = useSearchParams()
  const search = searchParams.get('search')
  const sortBy = searchParams.get('sort_by')
  const userServices = searchParams.get('user_services')
  const isPublished = searchParams.get('is_published')

  const getKey = (pageIndex: number, previousPageData: any | null) => {
    const currentPageIndex = pageIndex + 1

    // If we reach the end, return null
    if (previousPageData && !previousPageData.has_next_page) return null

    // Build query string dynamically
    const queryParams = new URLSearchParams()
    if (search) queryParams.append('search', search)
    if (sortBy) queryParams.append('sort_by', sortBy)
    if (userServices) queryParams.append('user_services', userServices)
    if (isPublished) queryParams.append('is_published', isPublished)

    const keyParams = `page=${currentPageIndex}${queryParams.toString() && `&${queryParams.toString()}`}`

    // Return the key for the next page
    return keyParams
  }

  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite<any>(getKey, (params: string) => {
      return serviceService.getServices(orgSlug, params).then((res) => res.data)
    })

  const servicesData = data && data.flatMap((page) => page.data)
  const isTotalServices = data?.at(-1)?.total === servicesData?.length

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      const scrolledHeight = window.scrollY
      const percentageScrolled =
        (scrolledHeight / (totalHeight - viewportHeight)) * 100
      setScrollPosition(Number(percentageScrolled.toFixed()))
    }

    window.addEventListener('scroll', handleScroll)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (
      scrollPosition > 90 &&
      !fetchLoading &&
      !isValidating &&
      !isTotalServices
    ) {
      setFetchLoading(true)
      setSize(size + 1)
    }
    // Reset loading flag when fetch is completed
    if (!isValidating) {
      setFetchLoading(false)
    }
  }, [scrollPosition])

  if (error)
    return (
      <div className='grid place-items-center p-4'>
        <FetchError errorMessage={error?.response?.data?.message} />
      </div>
    )

  if (isLoading)
    return (
      <div className='grid place-items-center p-4'>
        <Loader className='w-4 h-4 mr-2 animate-spin' />
      </div>
    )

  if (servicesData && servicesData.length)
    return (
      <ul className='grid gap-[24px] lg:grid-cols-3'>
        {servicesData.map((serviceData) => (
          <li key={serviceData._id}>
            <ServiceCard
              type='trainer'
              serviceData={serviceData}
              link={`/${orgSlug}/trainer/services/${serviceData._id}`}
            />
          </li>
        ))}
        {isValidating && !isTotalServices && (
          <li className='flex items-center justify-center gap-2'>
            <Loader className='w-4 h-4 mr-2 animate-spin' />
            <span>Loading more services...</span>
          </li>
        )}
      </ul>
    )

  return (
    <div className='h-[500px] flex flex-col items-center justify-center'>
      <SearchX className='text-neutral-gray-300 size-[24px]' />
      <p className='text-sm text-muted-foreground mt-[10px]'>
        No recent services
      </p>
    </div>
  )
}

export default ServicesInfiniteScroll
