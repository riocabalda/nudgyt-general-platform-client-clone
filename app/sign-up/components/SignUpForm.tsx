'use client'

import InputError from '@/app/(shared)/components/form/InputError'
import InputGroup from '@/app/(shared)/components/form/InputGroup'
import PasswordInput from '@/app/(shared)/components/PasswordInput'
import { Alert, AlertDescription } from '@/app/(shared)/components/ui/alert'
import { Button } from '@/app/(shared)/components/ui/button'
import { Checkbox } from '@/app/(shared)/components/ui/checkbox'
import { Input } from '@/app/(shared)/components/ui/input'
import { Label } from '@/app/(shared)/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/app/(shared)/components/ui/tabs'
import useLoginRedirect from '@/app/(shared)/hooks/useLoginRedirect'
import regex from '@/app/(shared)/regex'
import authService from '@/app/(shared)/services/authService'
import { roles } from '@/app/(shared)/services/userService'
import { cn } from '@/app/(shared)/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import 'react-international-phone/style.css'
import * as z from 'zod'

const ORGANIZATION_TAB_VALUE = 'Organization'

const InvitationTypeSchema = z
  .enum([
    'enterprise-organization-owner',
    'basic-organization-owner',
    'organization-user',
    'public-user'
  ])
  .nullable()

const FormSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Please enter your email address.')
      .email('Invalid email address'),
    fullName: z.string().min(1, 'Please enter your full name.'),
    organizationName: z
      .string()
      .min(1, 'Please enter your organization name.')
      .nullable(),
    organizationCode: z
      .string()
      .min(1, 'Please enter an organization code.')
      .nullable(),
    role: z.string().min(1, 'Please select a user type.'),
    password: z
      .string()
      .min(1, 'Please enter your password.')
      .regex(
        regex.password,
        'Minimum of 8 characters with at least one uppercase, one lowercase, one number, and one special character.'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    isTermsAndConditionsAccepted: z
      .boolean({
        required_error:
          "You must agree to the platform's Terms & Conditions, Privacy Policy, and Nudgyt Privacy Policy to sign up."
      })
      .refine(
        (val) => val === true,
        "You must agree to the platform's Terms & Conditions, Privacy Policy, and Nudgyt Privacy Policy to sign up."
      )
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password does not match.'
  })

type FormType = z.infer<typeof FormSchema>

export default function SignUpForm() {
  const [error, setError] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const searchParams = useSearchParams()
  const [role, setUserType] = useState(ORGANIZATION_TAB_VALUE)

  const emailParam = searchParams.get('email') || ''
  const roleParam = searchParams.get('role') || ''
  const orgParam = searchParams.get('organization') || ''
  const invitationToken = searchParams.get('invitation_token') ?? undefined
  const invitationType = InvitationTypeSchema.parse(searchParams.get('type'))

  const isInvited = invitationType !== null
  const isEnterpriseOrganizationOwnerInvitation =
    invitationType === 'enterprise-organization-owner'
  const isBasicOrganizationOwnerInvitation =
    invitationType === 'basic-organization-owner'
  const isOrganizationInvitation = invitationType === 'organization-user'

  const isOrgRoleSelected = role === ORGANIZATION_TAB_VALUE
  const showOrgNameField =
    (!isInvited && isOrgRoleSelected) ||
    (isInvited &&
      (isBasicOrganizationOwnerInvitation ||
        isEnterpriseOrganizationOwnerInvitation))

  const router = useRouter()
  const { loginRedirect } = useLoginRedirect()

  // Temporarily disable public signup
  if (!isInvited) {
    router.replace('/sign-in')
  }

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
    watch
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    shouldFocusError: false,
    defaultValues: {
      isTermsAndConditionsAccepted: false
    }
  })

  /** Set organization name as null for learners and trainers signing up */
  useEffect(() => {
    if (role === ORGANIZATION_TAB_VALUE) {
      setValue('organizationName', '')
    } else {
      setValue('organizationName', null)
    }
  }, [role])

  /** Set organization code as null for organizations signing up */
  useEffect(() => {
    if (role === ORGANIZATION_TAB_VALUE) {
      setValue('organizationCode', null)
    } else {
      setValue('organizationCode', '')
    }
  }, [role])

  /**
   * Remove organization code for invites
   *
   * Must also run when role changes because of the above effect
   */
  useEffect(() => {
    const isInvited = invitationToken !== undefined
    if (!isInvited) return

    setValue('organizationCode', null)
  }, [role, invitationToken])

  /** Mirror tab selection on form state */
  useEffect(() => {
    setValue('role', role)
  }, [setValue, role])

  /** Add invite query values on form */
  useEffect(() => {
    if (emailParam && roleParam) {
      setValue('email', emailParam)
      setValue('role', roleParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailParam, roleParam])
  useEffect(() => {
    if (orgParam) {
      setValue('organizationName', orgParam)
    }
  }, [orgParam])

  /** Use role-specific forms for non-org invites */
  useEffect(() => {
    if (emailParam && roleParam && !orgParam) {
      setUserType(roleParam)
    }
  }, [emailParam, roleParam, orgParam])

  const regPassword = register('password')
  const regConfirmPassword = register('confirmPassword')

  const onSubmit: SubmitHandler<FormType> = async (formData) => {
    const payload = { ...formData, invitationToken }

    setIsSubmitting(true)
    try {
      const response = await authService.signUp(payload)
      const body = response.data
      const bodyData = body.data

      const isAutoLogin = bodyData !== undefined
      if (isAutoLogin) {
        const { user, token } = bodyData

        loginRedirect(user, token)
      } else {
        const params = new URLSearchParams({
          email: formData.email
        })
        if (invitationToken) {
          params.set('invitation_token', invitationToken)
        }

        router.replace(`/sign-up/successful?${params}`)
      }
    } catch (error: any) {
      setError(error?.response?.data?.message || 'An error occurred.')
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Tab - Mobile */}
      {!roleParam && (
        <Tabs
          value={role}
          onValueChange={(ut) => setUserType(ut)}
          className='lg:hidden w-full mb-[40px]'
        >
          <TabsList className='grid w-full grid-cols-2 h-[56px] border-b rounded-none p-0 bg-transparent'>
            <TabsTrigger
              value={roles.learner}
              className='relative h-full rounded-none font-medium border-b-[3px] border-transparent data-[state=active]:shadow-none data-[state=active]:bg-white data-[state=active]:border-brandcolora data-[state=active]:text-brandcolora'
            >
              Learner
            </TabsTrigger>
            {/* <TabsTrigger
              value={roles.trainer}
              className='relative h-full rounded-none font-medium border-b-[3px] border-transparent data-[state=active]:shadow-none data-[state=active]:bg-white data-[state=active]:border-brandcolora data-[state=active]:text-brandcolora'
            >
              Trainer
            </TabsTrigger> */}
            <TabsTrigger
              value={ORGANIZATION_TAB_VALUE}
              className='relative h-full rounded-none font-medium border-b-[3px] border-transparent data-[state=active]:shadow-none data-[state=active]:bg-white data-[state=active]:border-brandcolora data-[state=active]:text-brandcolora'
            >
              Organization
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Logo */}
      <Link href='/' className='mb-[60px]'>
        <Image
          src='/images/nudgyt-logo.png'
          alt='Nudgyt logo'
          height={65}
          width={228}
          quality={100}
          className='hidden lg:block object-contain mx-auto'
        />
        <Image
          src='/images/nudgyt-logo.png'
          alt='Nudgyt logo'
          height={100}
          width={200}
          quality={100}
          className='lg:hidden py-12 object-contain mx-auto'
        />
      </Link>

      {/* Tab - Desktop */}
      {!roleParam && (
        <Tabs
          value={role}
          onValueChange={(ut) => setUserType(ut)}
          className='hidden lg:block w-full mb-[40px]'
        >
          <TabsList className='grid w-full grid-cols-2 border h-[56px] rounded-[8px] bg-white'>
            <TabsTrigger
              value={roles.learner}
              className='relative h-full font-medium text-brandcolora data-[state=active]:bg-brandcolora data-[state=active]:text-white'
            >
              Learner
            </TabsTrigger>
            {/* <TabsTrigger
              value={roles.trainer}
              className='relative h-full font-medium text-brandcolora data-[state=active]:bg-brandcolora data-[state=active]:text-white'
            >
              Trainer
            </TabsTrigger> */}
            <TabsTrigger
              value={ORGANIZATION_TAB_VALUE}
              className='relative h-full font-medium text-brandcolora data-[state=active]:bg-brandcolora data-[state=active]:text-white'
            >
              Organization
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {isOrganizationInvitation && (
        <header className='mb-10 space-y-4 lg:space-y-6 px-4 lg:px-0'>
          <h1 className='text-xl lg:text-2xl font-semibold'>
            You&rsquo;ve been invited to join {orgParam}
          </h1>

          <p className='text-neutral-gray-600 text-xs lg:text-sm'>
            As part of this organization, you&rsquo;ll gain access to exclusive
            tools and resources, including AI-powered services tailored for your
            organization.
          </p>
        </header>
      )}

      <form
        className='flex flex-col px-4 lg:px-0'
        onSubmit={handleSubmit(onSubmit)}
      >
        {error && (
          <Alert variant='destructive' className='mb-[20px]'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <InputGroup>
          <Label htmlFor='fullName' className='text-neutral-gray-800'>
            Full name
          </Label>
          <Input
            id='fullName'
            {...register('fullName')}
            placeholder='John Doe'
            isError={!!errors.fullName}
            className='border-neutral-gray-400 placeholder:text-neutral-gray-500'
          />
          {errors.fullName && (
            <InputError>{errors.fullName.message}</InputError>
          )}
        </InputGroup>

        {showOrgNameField && (
          <InputGroup className='mt-[24px]'>
            <Label htmlFor='organizationName' className='text-neutral-gray-800'>
              Organization name
            </Label>
            <Input
              id='organizationName'
              {...register('organizationName')}
              placeholder='Enterprises Inc.'
              disabled={
                !!orgParam &&
                !isBasicOrganizationOwnerInvitation &&
                !isEnterpriseOrganizationOwnerInvitation
              }
              isError={!!errors.organizationName}
              className='border-neutral-gray-400 placeholder:text-neutral-gray-500'
            />
            {errors.organizationName && (
              <InputError>{errors.organizationName.message}</InputError>
            )}
          </InputGroup>
        )}

        {role === roles.learner && (
          <InputGroup className='mt-[24px]'>
            <Label htmlFor='organizationCode' className='text-neutral-gray-800'>
              Organization code
            </Label>
            <Input
              id='organizationCode'
              {...register('organizationCode')}
              isError={!!errors.organizationCode}
              className='border-neutral-gray-400 placeholder:text-neutral-gray-500'
            />
            {errors.organizationCode && (
              <InputError>{errors.organizationCode.message}</InputError>
            )}
          </InputGroup>
        )}

        <InputGroup className='mt-[24px]'>
          <Label htmlFor='email' className='text-neutral-gray-800'>
            Email address
          </Label>
          <Input
            type='email'
            id='email'
            {...register('email')}
            placeholder='example@email.com'
            className={cn(
              'border-neutral-gray-400 placeholder:text-neutral-gray-500',
              emailParam && 'bg-muted'
            )}
            disabled={!!emailParam}
            isError={!!errors.email}
          />
          {errors.email && <InputError>{errors.email.message}</InputError>}
        </InputGroup>

        <InputGroup className='mt-[24px]'>
          <Label htmlFor='password' className='text-neutral-gray-800'>
            Password
          </Label>
          <PasswordInput
            id='password'
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

        <InputGroup className='mt-[24px]'>
          <Label htmlFor='confirmPassword' className='text-neutral-gray-800'>
            Confirm password
          </Label>
          <PasswordInput
            type='password'
            id='confirmPassword'
            onChange={regConfirmPassword.onChange}
            onBlur={regConfirmPassword.onBlur}
            name={regConfirmPassword.name}
            inputRef={regConfirmPassword.ref}
            eye
            isError={!!errors.confirmPassword}
            className='border-neutral-gray-400 placeholder:text-neutral-gray-500'
          />
          {errors.confirmPassword && (
            <InputError>{errors.confirmPassword.message}</InputError>
          )}
        </InputGroup>

        <InputGroup className='mt-[24px]'>
          <Controller
            name='isTermsAndConditionsAccepted'
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className='flex items-start gap-3'>
                <Checkbox
                  id='isTermsAndConditionsAccepted'
                  onCheckedChange={onChange}
                  checked={value}
                  {...register('isTermsAndConditionsAccepted')}
                  className='lg:mt-0.5 size-5 border-neutral-gray-500 data-[state=checked]:border-transparent'
                />
                <Label
                  htmlFor='isTermsAndConditionsAccepted'
                  className='text-neutral-gray-800 leading-5'
                >
                  I agree to the platform&apos;s{' '}
                  <Link
                    href='https://www.nudgyt.com/terms-of-service'
                    target='_blank'
                    className='font-medium text-brandcolora hover:text-brandcolora/90'
                  >
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link
                    href='https://www.nudgyt.com/privacy'
                    target='_blank'
                    className='font-medium text-brandcolora hover:text-brandcolora/90'
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            )}
          />
        </InputGroup>

        <Button
          className='mt-[40px] w-full lg:w-[212px] mx-auto'
          disabled={isSubmitting || !watch('isTermsAndConditionsAccepted')}
        >
          {isSubmitting ? (
            <>
              <Loader className='w-4 h-4 mr-2 animate-spin' /> Signing up
            </>
          ) : (
            'Sign up'
          )}
        </Button>

        <p className='mt-[40px] text-sm text-center lg:text-base'>
          Already have an account?{' '}
          <Link
            href='/sign-in'
            className='font-medium underline lg:text-base text-brandcolora'
          >
            Log in
          </Link>
        </p>
      </form>
    </>
  )
}
