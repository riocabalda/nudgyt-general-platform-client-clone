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
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import {
  cn,
  getLastUrlSegment,
  millisecondsToTimeString
} from '@/app/(shared)/utils'
import { CircleX } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { ComponentProps } from 'react'
import useGetSharedTemplates from '../../../create/hooks/useGetSharedTemplates'
import { useServiceStore } from '../../../create/hooks/useServiceStore'
import useGetService from '../../hooks/useGetService'
import NextStepButton from './NextStepButton'
import PrevStepButton from './PrevStepButton'

function useCurrentServiceData() {
  const { orgSlug } = useOrganization()
  const { serviceId } = useParams()
  const { serviceData } = useGetService(orgSlug, String(serviceId))

  return serviceData
}

function useSelectedTemplate() {
  const { orgSlug } = useOrganization()
  const { data: sharedTemplates } = useGetSharedTemplates(orgSlug)

  const templateId = useServiceStore((store) => store.templateId)

  const selectedTemplate = sharedTemplates?.data.find(
    (template: any) => template._id === templateId
  )

  return selectedTemplate
}

function ExistingRubricsLink() {
  const selectedTemplate = useSelectedTemplate()
  const serviceData = useCurrentServiceData()

  const href: string | undefined =
    selectedTemplate?.rubrics?.file ??
    serviceData?.basic_level?.rubrics?.file ??
    undefined

  const linkText = href === undefined ? undefined : getLastUrlSegment(href)

  if (href === undefined || linkText === undefined) {
    return null
  }

  return (
    <Link
      href={href}
      className={cn(
        'underline underline-offset-4',
        'transition decoration-transparent hover:decoration-inherit'
      )}
    >
      {linkText}
    </Link>
  )
}

function ExistingFormAnswersLink() {
  const selectedTemplate = useSelectedTemplate()
  const serviceData = useCurrentServiceData()

  const href =
    selectedTemplate?.form_questions_file ??
    serviceData?.basic_level.form_questions_file ??
    undefined

  const linkText = href === undefined ? undefined : getLastUrlSegment(href)

  if (href === undefined || linkText === undefined) {
    return null
  }

  return (
    <Link
      href={href}
      className={cn(
        'underline underline-offset-4',
        'transition decoration-transparent hover:decoration-inherit'
      )}
    >
      {linkText}
    </Link>
  )
}

function RubricsInput(props: {
  rubrics: File | null
  onChange?: ComponentProps<typeof InputFile>['onChange']
  defaultFilename?: string
}) {
  const { rubrics, onChange } = props
  const { defaultFilename = 'rubrics.csv' } = props

  const inputKey =
    rubrics?.name || typeof rubrics === 'string' ? 'no-rubrics' : 'rubrics'

  const initialFilename = rubrics?.name
    ? rubrics?.name
    : rubrics !== null
      ? defaultFilename
      : 'Upload Rubrics CSV'

  const forceLabelText =
    initialFilename === defaultFilename ? <ExistingRubricsLink /> : undefined

  return (
    <Card className='p-[16px] space-y-2'>
      <Label>Rubrics</Label>
      <InputFile
        key={inputKey}
        id='rubrics'
        accept='.csv'
        onChange={onChange}
        initialFilename={initialFilename}
        forceLabelText={forceLabelText}
      />
      <div className='pt-2'>
        <DownloadLinkButton type='rubric_template' />
      </div>
    </Card>
  )
}

function FormAnswersInput(props: {
  formQuestions: File | null
  onChange?: ComponentProps<typeof InputFile>['onChange']
  defaultFilename?: string
}) {
  const { formQuestions, onChange } = props
  const { defaultFilename = 'form_answers.csv' } = props

  const initialFilename = formQuestions?.name
    ? formQuestions?.name
    : formQuestions !== null
      ? defaultFilename
      : 'Upload Form Answers CSV'

  const forceLabelText =
    initialFilename === defaultFilename ? (
      <ExistingFormAnswersLink />
    ) : undefined

  return (
    <div className='space-y-2'>
      <Label>Form Answers</Label>
      <InputFile
        id='form-answers'
        accept='.csv'
        onChange={onChange}
        initialFilename={initialFilename}
        forceLabelText={forceLabelText}
      />
      <div className='pt-2'>
        <DownloadLinkButton type='simulation_form_template' />
      </div>
    </div>
  )
}

const ServiceDetails = () => {
  const { orgSlug } = useOrganization()

  const {
    title,
    description,
    timelimit,
    customTimeLimit,
    rubrics,
    formQuestions,
    serviceHasForm,
    isTemplate,
    templateId,
    setTitle,
    setDescription,
    setTimelimit,
    setCustomTimeLimit,
    setRubrics,
    setFormQuestions,
    setServiceHasForm,
    setCharacterIds,
    setEnvironmentId,
    setIsTemplate,
    setTemplateId
  } = useServiceStore()

  const { data: sharedTemplates } = useGetSharedTemplates(orgSlug)

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

  const handleTemplateSelect = (templateId: string) => {
    const selectedTemplate = sharedTemplates?.data.find(
      (template: any) => template._id === templateId
    )

    if (selectedTemplate) {
      setTemplateId(templateId)
      setTitle(selectedTemplate.title)
      setDescription(selectedTemplate.description)

      const timeString = millisecondsToTimeString(selectedTemplate.time_limit)

      if (
        ['00:15:00', '00:30:00', '01:00:00', 'unlimited'].includes(timeString)
      ) {
        setTimelimit(timeString)
        setCustomTimeLimit('')
      } else {
        setTimelimit('custom')
        setCustomTimeLimit(timeString.slice(0, 5))
      }
      setFormQuestions(selectedTemplate.form_questions)
      setRubrics(selectedTemplate.rubrics)
      setServiceHasForm(selectedTemplate.form_questions.length > 0)
      setCharacterIds(selectedTemplate.characters)
      setEnvironmentId(selectedTemplate.environment)
    }
  }

  return (
    <div className='px-4 lg:px-0 pt-0 lg:py-10 max-w-[712px] mx-auto'>
      <h2 className='text-base font-normal lg:text-2xl lg:font-semibold'>
        Enter service details
      </h2>

      <Label
        className={cn(
          'mt-[40px] min-h-[50px] flex w-full rounded-sm border bg-white border-neutral-gray-300 px-[16px] pb-[16px] pt-[16px] text-sm lg:text-base',
          isTemplate &&
            'flex-col gap-4 bg-primary-100 ring-2 ring-offset-0 ring-brandcolorf'
        )}
      >
        <div className='flex items-start'>
          <Checkbox
            className='mr-3 border-neutral-gray-400 w-[20px] h-[20px] mt-0.5'
            checked={isTemplate}
            onCheckedChange={(checked) => setIsTemplate(checked as boolean)}
          />
          Create from template
        </div>

        {isTemplate && (
          <Select
            onValueChange={handleTemplateSelect}
            value={templateId ?? undefined}
          >
            <SelectTrigger className='w-full bg-white'>
              <SelectValue placeholder='Select template' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sharedTemplates?.data.length > 0 ? (
                  sharedTemplates?.data.map((template: any) => (
                    <SelectItem key={template._id} value={template._id}>
                      {template.title}
                    </SelectItem>
                  ))
                ) : (
                  <div className='flex items-center justify-center h-full py-4'>
                    <p className='text-gray-500'>No templates available</p>
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </Label>

      <div className='space-y-6'>
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

        <RubricsInput rubrics={rubrics} onChange={handleRubricsChange} />

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
            <FormAnswersInput
              formQuestions={formQuestions}
              onChange={handleFormQuestionsChange}
            />
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

export default ServiceDetails
