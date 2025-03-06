'use client'

import InputError from '@/app/(shared)/components/form/InputError'
import InputGroup from '@/app/(shared)/components/form/InputGroup'
import { Alert, AlertDescription } from '@/app/(shared)/components/ui/alert'
import { Button } from '@/app/(shared)/components/ui/button'
import { Input } from '@/app/(shared)/components/ui/input'
import { Label } from '@/app/(shared)/components/ui/label'
import userService from '@/app/(shared)/services/userService'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'

const ForgotPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter your email address.')
    .email('Invalid email address')
})

type ForgotPasswordFormType = z.infer<typeof ForgotPasswordFormSchema>

function ForgotPasswordForm() {
  const [errorForgotPassword, setErrorForgotPassword] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(ForgotPasswordFormSchema)
  })

  const onSubmit: SubmitHandler<ForgotPasswordFormType> = async (formData) => {
    setErrorForgotPassword(undefined)
    setIsSuccessful(false)
    setIsSubmitting(true)
    try {
      await userService.forgotPassword(formData)
      setIsSuccessful(true)
      reset()
    } catch (error: any) {
      setErrorForgotPassword(
        error?.response?.data?.message || 'An error occurred.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
      {isSuccessful && (
        <Alert variant='success' className='mb-[20px]'>
          <AlertDescription className='lg:text-base'>
            We have emailed your password reset link.
          </AlertDescription>
        </Alert>
      )}

      {errorForgotPassword && (
        <Alert variant='destructive' className='mb-[20px]'>
          <AlertDescription className='lg:text-base'>
            {errorForgotPassword}
          </AlertDescription>
        </Alert>
      )}

      <InputGroup>
        <Label htmlFor='email' className='text-neutral-gray-800'>
          Email address
        </Label>
        <Input
          type='email'
          id='email'
          {...register('email')}
          placeholder='example@email.com'
          isError={!!errors.email}
          className='border-neutral-gray-400 placeholder:text-neutral-gray-500'
        />
        {errors.email && <InputError>{errors.email.message}</InputError>}
      </InputGroup>

      <Button
        className='mt-[40px] w-full lg:w-[212px] mx-auto'
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader className='w-4 h-4 mr-2 animate-spin' /> Reset password
          </>
        ) : (
          'Reset password'
        )}
      </Button>
    </form>
  )
}

export default ForgotPasswordForm
