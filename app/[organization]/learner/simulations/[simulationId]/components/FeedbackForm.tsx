'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as z from 'zod'
import { Medal } from 'lucide-react'
import { cn } from '@/app/(shared)/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Card } from '@/app/(shared)/components/ui/card'
import { Input } from '@/app/(shared)/components/ui/input'
import { Button } from '@/app/(shared)/components/ui/button'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useGetSimulationSurvey } from '../hooks/useGetSimulationSurvey'
import InputGroup from '@/app/(shared)/components/form/InputGroup'
import InputError from '@/app/(shared)/components/form/InputError'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import simulationService from '@/app/(shared)/services/learner/simulationService'

const schema = z.object({
  confident: z
    .number()
    .min(1, { message: 'Please select a rating between 1 and 5.' })
    .max(5, { message: 'Please select a rating between 1 and 5.' }),
  useful: z
    .number()
    .min(1, { message: 'Please select a rating between 1 and 5.' })
    .max(5, { message: 'Please select a rating between 1 and 5.' }),
  easy: z
    .number()
    .min(1, { message: 'Please select a rating between 1 and 5.' })
    .max(5, { message: 'Please select a rating between 1 and 5.' }),
  comment: z.string().min(1, { message: 'Please provide your comments.' })
})

// Define the form data type based on the schema
type FormData = z.infer<typeof schema>

function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  const { orgSlug } = useOrganization()

  const choices = [1, 2, 3, 4, 5]
  const { simulationId } = useParams()

  const searchParams = useSearchParams()
  const router = useRouter()
  const params = new URLSearchParams(searchParams.toString())

  const { mutateSurvey } = useGetSimulationSurvey(orgSlug, String(simulationId))

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const confidenceRating = watch('confident')
  const simulationRating = watch('useful')
  const platformRating = watch('easy')
  const comments = watch('comment')

  const isFormValid =
    confidenceRating && simulationRating && platformRating && comments

  useEffect(() => {
    params.delete('panel')
    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.replace(newUrl)
  }, [])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true)
    const payload = {
      simulation: String(simulationId),
      ...data
    }

    try {
      await simulationService.createSimulationSurvey(orgSlug, payload)
      mutateSurvey()
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <div className='flex flex-col'>
      <Card className='flex flex-col gap-6 lg:gap-7 p-8 lg:p-10 mt-10 rounded-[8px]'>
        <Medal
          className='text-brandcolora mx-auto'
          strokeWidth={1.5}
          size={60}
        />
        <h3 className='text-lg text-neutral-gray-800 font-semibold text-center'>
          Well done!
        </h3>
        <h3 className='text-sm lg:text-base text-neutral-gray-800 px-[20px]'>
          We’d love to hear your feedback about your experience with the
          platform.
        </h3>
        <form
          id='feedbackForm'
          ref={formRef}
          className='flex flex-col gap-6 lg:gap-10 px-[20px]'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <span className='text-sm lg:text-base text-foreground-800 font-medium'>
              How useful has this scenario been?
            </span>
            <div className='flex gap-3 mt-2'>
              {choices.map((num) => (
                <Button
                  className={cn(
                    'text-sm lg:text-base w-[117px] py-1 h-fit',
                    simulationRating === num && 'disabled:text-foreground'
                  )}
                  key={num}
                  variant='outline'
                  disabled={simulationRating === num}
                  onClick={() => setValue('useful', num)}
                >
                  {num}
                </Button>
              ))}
            </div>
            <div className='flex justify-between text-xs text-gray-600 mt-2'>
              <span>Not useful</span>
              <span>Very useful</span>
            </div>
            {errors.useful && <InputError>{errors.useful.message}</InputError>}
          </div>
          <div>
            <span className='text-sm lg:text-base text-foreground-800 font-medium'>
              How easy has the platform been to use?
            </span>
            <div className='flex gap-3 mt-2'>
              {choices.map((num) => (
                <Button
                  className={cn(
                    'text-sm lg:text-base w-[117px] py-1 h-fit',
                    platformRating === num && 'disabled:text-foreground'
                  )}
                  key={num}
                  variant='outline'
                  disabled={platformRating === num}
                  onClick={() => setValue('easy', num)}
                >
                  {num}
                </Button>
              ))}
            </div>
            <div className='flex justify-between text-xs text-gray-600 mt-2'>
              <span>Not easy</span>
              <span>Very easy</span>
            </div>
            {errors.easy && <InputError>{errors.easy.message}</InputError>}
          </div>
          <div>
            <span className='text-sm lg:text-base text-foreground-800 font-medium'>
              Do you feel more confident after the practice?
            </span>
            <div className='flex gap-3 mt-2'>
              {choices.map((num) => (
                <Button
                  className={cn(
                    'text-sm lg:text-base w-[117px] py-1 h-fit',
                    confidenceRating === num && 'disabled:text-foreground'
                  )}
                  key={num}
                  variant='outline'
                  disabled={confidenceRating === num}
                  onClick={() => setValue('confident', num)}
                >
                  {num}
                </Button>
              ))}
            </div>
            <div className='flex justify-between text-xs text-gray-600 mt-2'>
              <span>Not confident</span>
              <span>Very confident</span>
            </div>
            {errors.confident && (
              <InputError>{errors.confident.message}</InputError>
            )}
          </div>
          <div>
            <span className='text-sm lg:text-base text-foreground-800 font-medium'>
              Do you have any comments on how to improve the simulation?
            </span>
            <div className='flex flex-col mt-2'>
              <InputGroup>
                <Input
                  {...register('comment')}
                  className='text-sm lg:text-base w-full rounded-sm focus:!ring-transparent'
                  placeholder='Share your feedback...'
                />
              </InputGroup>
              {errors.comment && (
                <InputError>{errors.comment.message}</InputError>
              )}
            </div>
          </div>
        </form>
      </Card>
      <Button
        variant='default'
        form='feedbackForm'
        type='submit'
        onClick={() => formRef.current?.requestSubmit()}
        className='w-full lg:w-[328px] lg:self-center mt-10 z-50'
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'View Results'}
      </Button>
    </div>
  )
}

export default FeedbackForm
