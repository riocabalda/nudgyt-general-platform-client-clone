import PersonalityPicker from '@/app/(shared)/components/PersonalityPicker'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/app/(shared)/components/ui/avatar'
import { Card } from '@/app/(shared)/components/ui/card'
import { Input } from '@/app/(shared)/components/ui/input'
import { Label } from '@/app/(shared)/components/ui/label'
import MultipleSelect from '@/app/(shared)/components/ui/multiple-select'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/(shared)/components/ui/select'
import { Textarea } from '@/app/(shared)/components/ui/textarea'
import useGetCharacter from '../../hooks/useGetCharacter'
import { useCharacterFormStore } from '../../hooks/useCharacterFormStore'
import { languageOptions } from '@/app/(shared)/types'
import { useEffect, useState, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import characterService from '@/app/(shared)/services/admin/characterService'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { Button } from '@/app/(shared)/components/ui/button'
import { Loader } from 'lucide-react'
import useAlertStore from '@/app/(shared)/components/alert/useAlertStore'
import PreviewVoice from '@/app/(shared)/components/PreviewVoice'
import FetchError from '@/app/(shared)/components/FetchError'

const characterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.string().min(1, 'Age is required'),
  languages: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .min(1, 'At least one language is required'),
  voiceType: z.string().min(1, 'Voice type is required'),
  backstory: z.string(),
  hiddenBackstory: z.string(),
  personality: z.object({
    openess: z.string(),
    meticulousness: z.string(),
    extraversion: z.string(),
    agreeableness: z.string(),
    sensitivity: z.string()
  })
})

type CharacterFormValues = z.infer<typeof characterSchema>

function CharacterEdit() {
  const [isCharacterSet, setIsCharacterSet] = useState(false)
  const {
    character,
    isCharacterLoading,
    voiceTypes,
    voiceTypesError,
    characterError,
    isVoiceTypesLoading
  } = useGetCharacter()
  const [avatar, setAvatar] = useState('')
  const { orgSlug } = useOrganization()
  const voicePathLink = voiceTypes?.data?.find(
    (voice: any) => voice.voice_value === character?.data?.details?.voice_type
  )?.sample_link
  const [previewVoice, setPreviewVoice] = useState<string | null>(voicePathLink)

  const {
    setIsReadyToSubmit,
    isReadyToSubmit,
    setIsDisableSaveButton,
    isDisableSaveButton,
    isSubmitting,
    setIsSubmitting,
    setShowUnsavedModal
  } = useCharacterFormStore()
  const formRef = useRef<HTMLFormElement>(null)
  const { showAlert } = useAlertStore()
  const form = useForm<CharacterFormValues>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: '',
      age: '',
      languages: [],
      voiceType: '',
      backstory: '',
      hiddenBackstory: '',
      personality: {
        openess: '',
        meticulousness: '',
        extraversion: '',
        agreeableness: '',
        sensitivity: ''
      }
    }
  })

  const resetForm = (character: any) => {
    form.reset(
      {
        name: character.name,
        age: character.age,
        languages: character.languages.map((language: string) => ({
          value: language,
          label: language
        })),
        voiceType: character.voice_type,
        backstory: character.backstory,
        hiddenBackstory: character.hidden_backstory,
        personality: {
          openess: character.personality.openess,
          meticulousness: character.personality.meticulousness,
          extraversion: character.personality.extraversion,
          agreeableness: character.personality.agreeableness,
          sensitivity: character.personality.sensitivity
        }
      },
      {
        keepDirty: false
      }
    )
    setIsCharacterSet(true)
  }

  useEffect(() => {
    if (form.formState.isDirty) {
      setIsDisableSaveButton(false)
    } else {
      setIsDisableSaveButton(true)
    }
  }, [form.formState.isDirty, isSubmitting])

  useEffect(() => {
    if (formRef.current && isReadyToSubmit) {
      form.handleSubmit(onSubmit)()
      setIsReadyToSubmit(false)
    }
  }, [isReadyToSubmit, formRef.current])

  useEffect(() => {
    if (character && !isCharacterSet) {
      setAvatar(character.data.details.avatar.image_path)
      resetForm(character.data.details)
      setIsCharacterSet(true)
    }
  }, [character])

  const onSubmit = async (data: CharacterFormValues) => {
    try {
      setIsSubmitting(true)
      setIsDisableSaveButton(true)
      if (character?.data?.details?._id && form.formState.isDirty) {
        const result = await characterService.updateCharacter(
          orgSlug,
          character.data.details._id,
          {
            name: data.name,
            age: data.age,
            languages: data.languages.map((language) => language.value),
            voice_type: data.voiceType,
            backstory: data.backstory,
            hidden_backstory: data.hiddenBackstory,
            personality: {
              openess: data.personality.openess,
              meticulousness: data.personality.meticulousness,
              extraversion: data.personality.extraversion,
              agreeableness: data.personality.agreeableness,
              sensitivity: data.personality.sensitivity
            }
          }
        )

        if (result?.data) {
          resetForm(result.data)
          setShowUnsavedModal(false)
          showAlert({
            message: <p>Character updated successfully</p>,
            variant: 'success'
          })
        }
      }
    } catch (error: any) {
      showAlert({
        message: <p>{error.message}</p>,
        variant: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCharacterLoading || isVoiceTypesLoading) {
    return (
      <div className='grid place-items-center p-4 col-span-full'>
        <Loader className='w-4 h-4 mr-2 animate-spin' />
      </div>
    )
  }

  if (characterError || voiceTypesError) {
    return (
      <div className='grid place-items-center p-4 col-span-full'>
        <FetchError
          errorMessage={characterError?.message || voiceTypesError?.message}
        />
      </div>
    )
  }

  return (
    <>
      <form ref={formRef} className='space-y-6'>
        <section>
          <Card className='p-6 flex gap-6'>
            <Avatar className='size-[80px]'>
              <AvatarImage
                src={avatar || ''}
                className='size-[80px] object-cover bg-muted'
              />
              <AvatarFallback>NA</AvatarFallback>
            </Avatar>
            <div className='flex-1 space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  type='text'
                  placeholder='Character Name'
                  disabled={isCharacterLoading}
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='age'>Age</Label>
                <Input
                  id='age'
                  type='number'
                  placeholder='Character Age'
                  disabled={isCharacterLoading}
                  min='0'
                  onKeyDown={(e) => {
                    // Prevent decimal point and letter 'e' in number input
                    if (e.key === '.' || e.key === 'e') {
                      e.preventDefault()
                    }
                  }}
                  {...form.register('age')}
                />
                {form.formState.errors.age && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.age.message}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </section>
        <section>
          <Card className='p-6 flex gap-6'>
            <div className='flex-1 space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='languages'>Languages</Label>
                <MultipleSelect
                  options={languageOptions}
                  onChange={(value) => {
                    if (value) {
                      form.setValue('languages', [...value], {
                        shouldValidate: true,
                        shouldDirty: true
                      })
                    }
                  }}
                  value={form.getValues('languages') || []}
                  disabled={isCharacterLoading}
                />
                {form.formState.errors.languages && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.languages.message}
                  </p>
                )}
              </div>
              <div className='space-y-2 relative'>
                <Label htmlFor='voice'>Voice</Label>
                <Select
                  onValueChange={(value) => {
                    if (value) {
                      form.setValue('voiceType', value, {
                        shouldValidate: true,
                        shouldDirty: true
                      })
                      setPreviewVoice(
                        voiceTypes?.data?.find(
                          (voice: any) => voice.voice_value === value
                        )?.sample_link
                      )
                    }
                  }}
                  value={form.getValues('voiceType')}
                  disabled={isCharacterLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select the voice for your character' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {voiceTypes?.data?.map((voiceType: any) => (
                        <SelectItem
                          key={voiceType.voice_value}
                          value={voiceType.voice_value}
                        >
                          {voiceType.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {previewVoice && (
                  <div className='flex justify-end'>
                    <PreviewVoice path={previewVoice} />
                  </div>
                )}

                {form.formState.errors.voiceType && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.voiceType.message}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </section>
        <section>
          <Card className='p-6 flex gap-6'>
            <div className='flex-1 space-y-10'>
              <div className='space-y-2'>
                <Label htmlFor='backstory'>Backstory</Label>
                <Textarea
                  id='backstory'
                  placeholder='Character Backstory'
                  disabled={isCharacterLoading}
                  {...form.register('backstory')}
                  style={{ resize: 'none' }}
                  rows={5}
                />
                {form.formState.errors.backstory && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.backstory.message}
                  </p>
                )}
                <p className='text-muted-foreground'>
                  A visible foundation that defines personality, tone, and
                  behavior in interactions. This ensures consistency in how your
                  character communicates and responds.
                </p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='hiddenStory'>Hidden Story</Label>
                <Textarea
                  id='hiddenStory'
                  placeholder='Character Hidden Story'
                  disabled={isCharacterLoading}
                  {...form.register('hiddenBackstory')}
                  style={{ resize: 'none' }}
                  rows={5}
                />
                {form.formState.errors.hiddenBackstory && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.hiddenBackstory.message}
                  </p>
                )}
                <p className='text-muted-foreground'>
                  A subtle layer of context shaping your character&apos;s deeper
                  motivations and nuances. This influences responses without
                  being directly revealed to users.
                </p>
              </div>
            </div>
          </Card>
        </section>
        <section>
          <Card className='p-6'>
            <label className='text-lg font-semibold'>Personality</label>
            <div className='mt-4 lg:mt-6 flex flex-col gap-8'>
              <PersonalityPicker
                personality='Openess'
                startLabel='Dislikes Changes'
                endLabel='Likes exploring'
                value={form.getValues('personality.openess') || ''}
                onChange={(e) =>
                  form.setValue('personality.openess', e, {
                    shouldValidate: true,
                    shouldDirty: true
                  })
                }
                disabled={isCharacterLoading}
              />
              <PersonalityPicker
                personality='Meticulousness'
                startLabel='Lets things happen'
                endLabel='More attention to details'
                value={form.getValues('personality.meticulousness') || ''}
                onChange={(e) =>
                  form.setValue('personality.meticulousness', e, {
                    shouldValidate: true,
                    shouldDirty: true
                  })
                }
                disabled={isCharacterLoading}
              />
              <PersonalityPicker
                personality='Extraversion'
                startLabel='Introvert'
                endLabel='Extrovert'
                value={form.getValues('personality.extraversion') || ''}
                onChange={(e) =>
                  form.setValue('personality.extraversion', e, {
                    shouldValidate: true,
                    shouldDirty: true
                  })
                }
                disabled={isCharacterLoading}
              />
              <PersonalityPicker
                personality='Agreeableness'
                startLabel='Competitive'
                endLabel='Agreeable'
                value={form.getValues('personality.agreeableness') || ''}
                onChange={(e) =>
                  form.setValue('personality.agreeableness', e, {
                    shouldValidate: true,
                    shouldDirty: true
                  })
                }
                disabled={isCharacterLoading}
              />
              <PersonalityPicker
                personality='Sensitivity'
                startLabel='Rarely Emotional'
                endLabel='Highly Emotional'
                value={form.getValues('personality.sensitivity') || ''}
                onChange={(e) =>
                  form.setValue('personality.sensitivity', e, {
                    shouldValidate: true,
                    shouldDirty: true
                  })
                }
                disabled={isCharacterLoading}
              />
            </div>
          </Card>
        </section>

        <Button
          type='button'
          onClick={() => setIsReadyToSubmit(true)}
          className='bg-purple-shade-darkest2 block lg:hidden w-full lg:w-auto'
          disabled={isDisableSaveButton || isSubmitting}
        >
          Save
        </Button>
      </form>
    </>
  )
}

export default CharacterEdit
