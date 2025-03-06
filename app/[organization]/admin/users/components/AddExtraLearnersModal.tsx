import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/app/(shared)/components/ui/dialog'
import organizationService from '@/app/(shared)/services/admin/organizationService'
import { Input } from '@/app/(shared)/components/ui/input'
import { Button } from '@/app/(shared)/components/ui/button'
import { Label } from '@/app/(shared)/components/ui/label'
import { BuildingIcon, Loader } from 'lucide-react'
import { useParams } from 'next/navigation'
import useAlertStore from '@/app/(shared)/components/alert/useAlertStore'
import { useGetOrganizationBySlug } from '../hooks/useGetOrganizationBySlug'
import { useExtraLearnerModalStore } from '../../organizations/_hooks/useExtraLearnerModalStore'
import { useGetOrganizationLearnersCount } from '../hooks/useGetOrganizationLearnersCount'

type FormValues = {
  extraLearners: number
}

function AddExtraLearnersModal() {
  const orgSlug = useParams().organization as string
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showAlert } = useAlertStore()

  const { selectedOrgSlug, isModalOpen, closeModal } =
    useExtraLearnerModalStore()

  const { data: orgData, mutate: mutateOrgData } = useGetOrganizationBySlug(
    orgSlug,
    selectedOrgSlug
  )
  const { data: learnersCountData } = useGetOrganizationLearnersCount(
    orgSlug,
    selectedOrgSlug
  )

  const orgName = orgData?.data?.name
  const learnerLimit =
    orgData?.data?.subscription?.subscription_plan?.max_learners
  const extraLearners = orgData?.data?.subscription?.extra_learners || 0
  const learnersCount = learnersCountData?.data || 0

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    if (
      window.confirm(
        'Are you sure you want to update organization extra learners?'
      )
    ) {
      setIsSubmitting(true)
      try {
        await organizationService.addOrgExtraLearners(
          orgSlug,
          selectedOrgSlug!,
          data
        )
        mutateOrgData()
        reset()
        closeModal()
        showAlert({
          variant: 'success',
          message: 'Organization extra learners updated successfully.'
        })
      } catch (error) {
        showAlert({
          variant: 'error',
          message: 'Failed to update organization extra learners.'
        })
        console.error(error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const isOpen = !!selectedOrgSlug && isModalOpen
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className='max-w-[92%] lg:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle>Learner limit</DialogTitle>
          <DialogDescription className='!mt-2'>
            Set the number of extra learners for this organization.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-6'>
          <div className='grid gap-4'>
            <div className='rounded bg-gray-100 p-3'>
              <p className='text-xs font-medium flex items-center gap-1'>
                <BuildingIcon className='size-[12px]' />
                <span>Organization</span>
              </p>
              <p className='font-bold mt-2'>{orgName}</p>
            </div>
            <div className='rounded bg-gray-100 p-3 flex justify-between items-center lg:h-[48px]'>
              <p className='text-xs font-medium'>Learner limit</p>
              <p className='font-bold'>{learnerLimit}</p>
            </div>
            <div className='rounded bg-gray-100 p-3 flex justify-between items-center lg:h-[48px]'>
              <p className='text-xs font-medium'>Current learners</p>
              <p className='font-bold'>{learnersCount}</p>
            </div>
            <div className='rounded bg-gray-100 p-3 flex justify-between items-center lg:h-[48px]'>
              <p className='text-xs font-medium'>Extra learners</p>
              <p className='font-bold'>{extraLearners}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='extraLearners'>Add extra learners</Label>
              <Input
                id='extraLearners'
                type='number'
                placeholder='Enter the number of extra learners'
                className='font-bold placeholder:font-normal'
                min={1}
                {...register('extraLearners', {
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: 'Extra learners must be at least 1'
                  }
                })}
              />
              {errors.extraLearners && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.extraLearners.message}
                </p>
              )}
            </div>
            <Button
              disabled={isSubmitting}
              type='submit'
              className='w-full lg:w-auto lg:float-right'
            >
              {isSubmitting ? (
                <>
                  <Loader className='w-4 h-4 mr-2 animate-spin' />
                  Adding...
                </>
              ) : (
                <>Add</>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddExtraLearnersModal
