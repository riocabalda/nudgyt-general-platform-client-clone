'use client'

import React, { useEffect, useState } from 'react'
import { AlertTriangle, Loader } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Input } from '@/app/(shared)/components/ui/input'
import { Alert, AlertDescription } from '@/app/(shared)/components/ui/alert'
import { Button } from '@/app/(shared)/components/ui/button'
import { Label } from '@/app/(shared)/components/ui/label'
import subscriptionService, {
  OldSubscription
} from '@/app/(shared)/services/admin/subscriptionService'
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
  subscription: OldSubscription
  onCancel: () => void
}) {
  const [error, setError] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const onSubmit: SubmitHandler<FormType> = async (formData) => {
    setIsSubmitting(true)
    try {
      await subscriptionService.updateSubscription(formData)
    } catch (error: any) {
      setError(error?.response?.data?.message || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
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
      <div className='grid w-full items-center gap-2 mt-6 '>
        <Label
          htmlFor='name'
          className='font-semibold lg:text-base text-foreground-800'
        >
          Name
        </Label>
        <Input
          id='name'
          className='text-foreground-800'
          {...register('name')}
        />
      </div>
      {errors.name && (
        <span className='mt-1 text-xs text-red-500'>{errors.name.message}</span>
      )}

      <div className='flex w-full gap-4'>
        <div className='w-full'>
          <div className='grid w-full items-center gap-2 mt-6'>
            <Label
              htmlFor='price'
              className='font-semibold lg:text-base text-foreground-800'
            >
              Price Monthly
            </Label>
            <Input
              id='price'
              className='text-foreground-800'
              type='number'
              {...register('price')}
            />
          </div>
          {errors.price && (
            <span className='mt-1 text-xs text-red-500'>
              {errors.price.message}
            </span>
          )}
        </div>
        <div className='w-full'>
          <div className='grid w-full items-center gap-2 mt-6'>
            <Label
              htmlFor='time'
              className='font-semibold lg:text-base text-foreground-800'
            >
              Minutes
            </Label>
            <Input
              id='time'
              className='text-foreground-800'
              type='number'
              {...register('time')}
            />
          </div>
          {errors.time && (
            <span className='mt-1 text-xs text-red-500'>
              {errors.time.message}
            </span>
          )}
        </div>
      </div>

      <div className='grid w-full items-center gap-2 mt-6 text-foreground-800'>
        <Label htmlFor='features' className='font-semibold lg:text-base '>
          Description
        </Label>
        <Controller
          name='features'
          control={control}
          render={({ field }) => (
            <ReactQuill
              theme='snow'
              className='text-foreground-800'
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

      {error && (
        <div className='mt-6 flex items-center gap-3 text-destructive'>
          <AlertTriangle className='w-6 h-6' />
          <Alert variant='destructive' className=' p-0 border-none'>
            <AlertDescription className='text-base'>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className='flex justify-between mt-6'>
        <Button
          type='button'
          variant='outline'
          className='h-fit !px-12 py-3 text-foreground-800'
          onClick={onCancel}
        >
          Delete
        </Button>
        <Button disabled={isSubmitting} className='h-fit !px-12 py-3'>
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
