'use client'

import React, { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Input } from '@/app/(shared)/components/ui/input'
import { Alert, AlertDescription } from '@/app/(shared)/components/ui/alert'
import { Button } from '@/app/(shared)/components/ui/button'
import { Label } from '@/app/(shared)/components/ui/label'
import { Subscription } from '@/app/(shared)/services/learner/subscriptionService'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const FormSchema = z.object({
  name: z.string().min(1, 'Please enter a name.'),
  price: z.string().min(1, 'Please enter a price.'),
  time: z.string().min(1, 'Please enter a time in minutes.'),
  features: z.string().min(1, 'Please enter some features.')
})

type FormType = z.infer<typeof FormSchema>

function EditSubscriptionForm({
  subscription,
  onCancel
}: {
  subscription: Subscription
  onCancel: () => void
}) {
  const [error] = useState()
  const [isSubmitting] = useState(false)

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors }
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: subscription?.name || '',
      price: subscription?.price || '',

      time: subscription?.time || '',

      features: subscription?.features || ''
    }
  })

  const onSubmit: SubmitHandler<FormType> = async () => {
    // setIsSubmitting(true)
    // try {
    //   await subscriptionService.updateSubscription(formData)
    // } catch (error: any) {
    //   setError(error?.response?.data?.message || 'An error occurred.')
    // } finally {
    //   setIsSubmitting(false)
    // }
  }

  useEffect(() => {
    if (subscription) {
      setValue('name', subscription.name)
      setValue('price', subscription.price)

      setValue('time', subscription.time)

      setValue('features', subscription.features)
    }
  }, [subscription, setValue])

  return (
    <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert variant='destructive' className='mt-[20px]'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className='grid w-full items-center gap-1.5 mt-[20px]'>
        <Label htmlFor='name' className='font-semibold lg:text-base'>
          Name
        </Label>
        <Input id='name' {...register('name')} />
      </div>
      {errors.name && (
        <span className='mt-1 text-xs text-red-500'>{errors.name.message}</span>
      )}

      <div className='flex w-full gap-4'>
        <div className='w-full'>
          <div className='grid w-full items-center gap-1.5 mt-[20px]'>
            <Label htmlFor='price' className='font-semibold lg:text-base'>
              Price
            </Label>
            <Input id='price' type='number' {...register('price')} />
          </div>
          {errors.price && (
            <span className='mt-1 text-xs text-red-500'>
              {errors.price.message}
            </span>
          )}
        </div>
        <div className='w-full'>
          <div className='grid w-full items-center gap-1.5 mt-[20px]'>
            <Label htmlFor='minutes' className='font-semibold lg:text-base'>
              Minutes
            </Label>
            <Input id='minutes' type='number' {...register('time')} />
          </div>
          {errors.time && (
            <span className='mt-1 text-xs text-red-500'>
              {errors.time.message}
            </span>
          )}
        </div>
      </div>

      <div className='grid w-full items-center gap-1.5 mt-[20px]'>
        <Label htmlFor='features' className='font-semibold lg:text-base'>
          Features
        </Label>
        <Controller
          name='features'
          control={control}
          render={({ field }) => (
            <ReactQuill
              theme='snow'
              {...field}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline', 'link'],
                  [{ list: 'ordered' }, { list: 'bullet' }]
                ]
              }}
            />
          )}
        />
      </div>
      {errors.features && (
        <span className='mt-1 text-xs text-red-500'>
          {errors.features.message}
        </span>
      )}

      <div className='flex justify-end gap-[10px] mt-[30px]'>
        <Button type='button' variant='destructive' onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader className='w-4 h-4 mr-2 animate-spin' /> Updating
            </>
          ) : (
            'Update'
          )}
        </Button>
      </div>
    </form>
  )
}

export default EditSubscriptionForm
