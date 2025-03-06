import DownloadLinkButton from '@/app/(shared)/components/admin-trainer-shared/services/DownloadLinkButton'
import CustomTimePicker from '@/app/(shared)/components/CustomTimePicker'
import InputFile from '@/app/(shared)/components/form/InputFile'
import { Card } from '@/app/(shared)/components/ui/card'
import { Checkbox } from '@/app/(shared)/components/ui/checkbox'
import { Input } from '@/app/(shared)/components/ui/input'
import { Label } from '@/app/(shared)/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/(shared)/components/ui/select'
import { Textarea } from '@/app/(shared)/components/ui/textarea'
import { cn } from '@/app/(shared)/utils'
import { CircleX } from 'lucide-react'
import React from 'react'
import { useTemplateStore } from '../hooks/useTemplateStore'
import NextStepButton from './NextStepButton'
import PrevStepButton from './PrevStepButton'

const TemplateDetails = () => {
  const {
    title,
    description,
    timelimit,
    customTimeLimit,
    rubrics,
    formQuestions,
    serviceHasForm,
    setTitle,
    setDescription,
    setTimelimit,
    setCustomTimeLimit,
    setRubrics,
    setFormQuestions,
    setServiceHasForm
  } = useTemplateStore()

  const handleRubricsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setRubrics(file)
    }
  }

  const handleFormQuestionsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormQuestions(file)
    }
  }

  return (
    <div className='px-4 lg:px-0 pt-0 lg:py-10 max-w-[712px] mx-auto'>
      <h2 className='text-base font-normal lg:text-2xl lg:font-semibold'>
        Enter service template details
      </h2>

      <div className='space-y-6 mt-[40px]'>
        <Card className='p-4 rounded-lg mt-6 flex flex-col gap-6'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              placeholder='Enter service title'
              value={title || ''}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              placeholder='Enter service description'
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
              className='min-h-[100px]'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='timelimit'>Time limit per simulation</Label>
            {timelimit === 'custom' ? (
              <div className='flex items-center gap-2'>
                <CustomTimePicker
                  customTimeLimit={customTimeLimit || ''}
                  setCustomTimeLimit={setCustomTimeLimit}
                />
                <CircleX
                  className='w-5 h-5 cursor-pointer hover:text-red-500'
                  onClick={() => {
                    setCustomTimeLimit('')
                    setTimelimit('')
                  }}
                />
              </div>
            ) : (
              <Select
                value={timelimit ?? ''}
                onValueChange={(e) => setTimelimit(e)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select time limit' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='00:15:00'>15 minutes</SelectItem>
                    <SelectItem value='00:30:00'>30 minutes</SelectItem>
                    <SelectItem value='01:00:00'>1 hour</SelectItem>
                    <SelectItem value='custom'>Custom time limit...</SelectItem>
                    <SelectItem value='unlimited'>Unlimited</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        </Card>

        <Card className='p-[16px] space-y-2'>
          <Label>Rubrics</Label>
          <InputFile
            id='rubrics'
            accept='.csv'
            onChange={handleRubricsChange}
            initialFilename={
              rubrics?.name
                ? rubrics?.name
                : rubrics !== null
                  ? 'rubrics.csv'
                  : 'Upload Rubrics CSV'
            }
          />
          <div className='pt-2'>
            <DownloadLinkButton type='rubric_template' />
          </div>
        </Card>

        <Card className='p-[16px] space-y-6'>
          <div className='space-y-2'>
            <Label>Form</Label>
            <Label
              className={cn(
                'h-[50px] flex items-center w-full rounded-sm border border-input bg-white px-3 py-2 text-sm lg:text-base',
                serviceHasForm &&
                  'bg-primary-100 ring-2 ring-offset-0 ring-brandcolorf'
              )}
            >
              <Checkbox
                className='mr-2 border-neutral-gray-400 w-[20px] h-[20px]'
                checked={serviceHasForm}
                onCheckedChange={setServiceHasForm}
              />
              This service has a form
            </Label>
            <p className='text-sm text-gray-500'>
              Select this option if this service has a form for Learners to
              answer.
            </p>
          </div>
          {serviceHasForm && (
            <div className='space-y-2'>
              <Label>Form Answers</Label>
              <InputFile
                id='form-answers'
                accept='.csv'
                onChange={handleFormQuestionsChange}
                initialFilename={
                  formQuestions?.name
                    ? formQuestions?.name
                    : formQuestions !== null
                      ? 'form_answers.csv'
                      : 'Upload Form Answers CSV'
                }
              />
              <div className='pt-2'>
                <DownloadLinkButton type='simulation_form_template' />
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className='mt-[24px] flex items-center justify-between'>
        <PrevStepButton prevStep={0} />
        <NextStepButton
          nextStep={2}
          disabled={
            !title ||
            !description ||
            !timelimit ||
            (timelimit === 'custom' && !customTimeLimit) ||
            (serviceHasForm && !formQuestions)
          }
        />
      </div>
    </div>
  )
}

export default TemplateDetails
