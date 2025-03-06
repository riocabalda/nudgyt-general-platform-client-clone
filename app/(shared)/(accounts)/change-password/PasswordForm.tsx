'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import 'react-international-phone/style.css'
import { toast } from 'sonner'
import * as z from 'zod'
import InputError from '../../components/form/InputError'
import InputGroup from '../../components/form/InputGroup'
import PasswordInput from '../../components/PasswordInput'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import regex from '../../regex'
import accountService from '../../services/accountService'

const FormSchema = z
  .object({
    current_password: z.string().min(1, 'Please enter your current password.'),
    password: z
      .string()
      .min(1, 'Please enter your new password.')
      .regex(
        regex.password,
        'Minimum of 8 characters with at least one uppercase, one lowercase, one number, and one special character.'
      ),
    confirm_password: z.string().min(1, 'Please confirm your password.')
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Password does not match.'
  })

export type FormType = z.infer<typeof FormSchema>

function PasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty }
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema)
  })

  const regCurrentPassword = register('current_password')
  const regPassword = register('password')
  const regConfirmPassword = register('confirm_password')

  const onSubmit: SubmitHandler<FormType> = async (formData) => {
    setIsSubmitting(true)
    try {
      await accountService.updatePassword(formData)

      toast.success('Password updated!')
      reset()
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <InputGroup>
        <Label htmlFor='current_password'>Current Password</Label>
        <PasswordInput
          id='current_password'
          placeholder='Enter password'
          onChange={regCurrentPassword.onChange}
          onBlur={regCurrentPassword.onBlur}
          name={regCurrentPassword.name}
          inputRef={regCurrentPassword.ref}
          eye
        />
        {errors.current_password && (
          <InputError>{errors.current_password.message}</InputError>
        )}
      </InputGroup>

      <InputGroup>
        <Label htmlFor='password'>New Password</Label>
        <PasswordInput
          id='password'
          placeholder='Enter password'
          onChange={regPassword.onChange}
          onBlur={regPassword.onBlur}
          name={regPassword.name}
          inputRef={regPassword.ref}
          eye
        />
        {errors.password && <InputError>{errors.password.message}</InputError>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor='confirm_password'>Confirm Password</Label>
        <PasswordInput
          type='password'
          id='confirm_password'
          placeholder='Enter password'
          onChange={regConfirmPassword.onChange}
          onBlur={regConfirmPassword.onBlur}
          name={regConfirmPassword.name}
          inputRef={regConfirmPassword.ref}
          eye
        />
        {errors.confirm_password && (
          <InputError>{errors.confirm_password.message}</InputError>
        )}
      </InputGroup>

      <Button
        type='submit'
        className='w-full lg:w-max float-end bg-primary-500 hover:bg-primary-500/90'
        disabled={!isDirty || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader className='w-4 h-4 mr-2 animate-spin' /> Changing Password
          </>
        ) : (
          'Change Password'
        )}
      </Button>
    </form>
  )
}

export default PasswordForm
