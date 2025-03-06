'use client'

import InputError from '@/app/(shared)/components/form/InputError'
import InputGroup from '@/app/(shared)/components/form/InputGroup'
import PasswordInput from '@/app/(shared)/components/PasswordInput'
import { Alert, AlertDescription } from '@/app/(shared)/components/ui/alert'
import { Button } from '@/app/(shared)/components/ui/button'
import { Input } from '@/app/(shared)/components/ui/input'
import { Label } from '@/app/(shared)/components/ui/label'
import useLoginRedirect from '@/app/(shared)/hooks/useLoginRedirect'
import authService from '@/app/(shared)/services/authService'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'

const FormSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter your email address.')
    .email('Invalid email address'),
  password: z.string().min(1, 'Please enter your password.')
})

type FormType = z.infer<typeof FormSchema>

export default function SignInForm() {
  const [error, setError] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { loginRedirect } = useLoginRedirect()

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    shouldFocusError: false
  })

  const regPassword = register('password')

  const onSubmit: SubmitHandler<FormType> = async (formData) => {
    setIsSubmitting(true)
    try {
      const { data } = await authService.signIn(formData)
      const { user, token } = data.data

      loginRedirect(user, token)
    } catch (error: any) {
      setError(error?.response?.data?.message || 'An error occurred.')
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className='flex flex-col space-y-12'
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='space-y-6'>
        {error && (
          <Alert variant='destructive' className='mb-[20px]'>
            <AlertDescription className='lg:text-base'>
              {error}
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

        <InputGroup>
          <div className='flex items-end justify-between'>
            <Label htmlFor='password' className='text-neutral-gray-800'>
              Password
            </Label>
            <Link
              href='/forgot-password'
              className='text-sm font-medium lg:text-base text-brandcolora'
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id='password'
            placeholder='Enter password'
            onChange={regPassword.onChange}
            onBlur={regPassword.onBlur}
            name={regPassword.name}
            inputRef={regPassword.ref}
            eye
            isError={!!errors.password}
            className='border-neutral-gray-400 placeholder:text-neutral-gray-500'
          />
          {errors.password && (
            <InputError>{errors.password.message}</InputError>
          )}
        </InputGroup>
      </div>

      <Button
        className='lg:text-base w-full lg:w-[212px] mx-auto'
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader className='w-4 h-4 mr-2 animate-spin' /> Logging in
          </>
        ) : (
          'Log in'
        )}
      </Button>

      {/* <p className='text-sm text-center lg:text-base text-neutral-gray-600'>
        Don&apos;t have an account?{' '}
        <Link
          href='/sign-up'
          className='font-medium underline underline-offset-2 lg:text-base text-brandcolora'
        >
          Sign up
        </Link>
      </p> */}
    </form>
  )
}
