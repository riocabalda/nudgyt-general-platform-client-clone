'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import 'react-international-phone/style.css'
import { toast } from 'sonner'
import * as z from 'zod'
import InputError from '../../components/form/InputError'
import InputGroup from '../../components/form/InputGroup'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import useUser from '../../hooks/useUser'
import accountService from '../../services/accountService'

const FormSchema = z.object({
  full_name: z.string().min(1, 'Required.'),
  email: z
    .string()
    .min(1, 'Please enter your email address.')
    .email('Invalid email address')
})

export type FormType = z.infer<typeof FormSchema>

function PersonalDetailsForm() {
  const { user, mutateUser } = useUser()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty }
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema)
  })

  const onSubmit: SubmitHandler<FormType> = async (formData) => {
    setIsSubmitting(true)
    try {
      await accountService.updatePersonalDetails({
        full_name: formData.full_name
      })
      mutateUser()
      toast.success('Personal details updated!')
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name,
        email: user.email
      })
    }
  }, [user])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup>
        <Label htmlFor='full_name'>Full name</Label>
        <Input
          id='full_name'
          {...register('full_name')}
          placeholder='John Doe'
        />
        {errors.full_name && (
          <InputError>{errors.full_name.message}</InputError>
        )}
      </InputGroup>

      <InputGroup className='mt-[24px]'>
        <Label htmlFor='email'>Email address</Label>
        <Input
          type='email'
          id='email'
          {...register('email')}
          placeholder='example@email.com'
          disabled
        />
        {errors.email && <InputError>{errors.email.message}</InputError>}
      </InputGroup>

      <Button
        type='submit'
        className='mt-[24px] w-full lg:w-max float-end'
        disabled={!isDirty || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader className='w-4 h-4 mr-2 animate-spin' /> Updating
          </>
        ) : (
          'Update Personal Details'
        )}
      </Button>
    </form>
  )
}

export default PersonalDetailsForm
