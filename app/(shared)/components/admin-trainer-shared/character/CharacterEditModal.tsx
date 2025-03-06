import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/(shared)/components/ui/dialog'
import PersonalityPicker from '@/app/(shared)/components/PersonalityPicker'
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
import { languageOptions } from '@/app/(shared)/types'
import { PropsWithChildren, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { Button } from '@/app/(shared)/components/ui/button'
import useAlertStore from '@/app/(shared)/components/alert/useAlertStore'
import PreviewVoice from '@/app/(shared)/components/PreviewVoice'
import { Loader } from 'lucide-react'
import { roles } from '@/app/(shared)/services/userService'
import { mutate } from 'swr'
import { cn, orgPrefixRoute } from '@/app/(shared)/utils'
import { ScrollBar } from '../../ui/scroll-area'
import { ScrollArea } from '../../ui/scroll-area'
import { Alert, AlertDescription } from '../../ui/alert'

const characterSchema = z.object({
  id: z.string(),
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

const loadCharacterService = async (role: string) => {
  switch (role) {
    case roles.superadmin:
    case roles.admin:
      return (await import('@/app/(shared)/services/admin/characterService'))
        .default
    case roles.trainer:
      return (await import('@/app/(shared)/services/trainer/characterService'))
        .default
    default:
      return (await import('@/app/(shared)/services/admin/characterService'))
        .default
  }
}

type CharacterFormValues = z.infer<typeof characterSchema>

function CharacterEditModalScrollArea(props: PropsWithChildren) {
  const { children } = props

  return (
    <ScrollArea
      scrollbar={
        <>
          <ScrollBar
            orientation='vertical'
            className='transition opacity-0 group-hover:opacity-100'
          />
          <ScrollBar
            orientation='horizontal'
            className='transition opacity-0 group-hover:opacity-100'
          />
        </>
      }
      className={cn(
        '[&_[data-radix-scroll-area-viewport]]:max-h-[600px] [&_[data-radix-scroll-area-viewport]]:flex',
        'group'
      )}
    >
      {children}
    </ScrollArea>
  )
}

export default function CharacterEditModal({
  characterId
}: {
  characterId: string
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [character, setCharacter] = useState<any>(null)
  const [isCharacterLoading, setIsCharacterLoading] = useState(false)
  const [updateCharacterError, setUpdateCharacterError] = useState<
    string | null
  >(null)
  const [voiceTypes, setVoiceTypes] = useState<any>(null)
  const { orgSlug, membership } = useOrganization()
  const role = membership?.roles[0]
  const voicePathLink = voiceTypes?.data?.find(
    (voice: any) => voice.voice_value === character?.data?.details?.voice_type
  )?.sample_link
  const [previewVoice, setPreviewVoice] = useState<string | null>(voicePathLink)
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
    form.reset({
      id: character._id,
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
    })
  }

  const onSubmit = async (data: CharacterFormValues) => {
    try {
      setIsSubmitting(true)
      const service = await loadCharacterService(role || '')
      const result = await service.updateCharacter(
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
        const rolePrefix = orgPrefixRoute(membership?.roles || [])
        mutate(`/${orgSlug}/${rolePrefix.toLowerCase()}/characters?`)
        resetForm(result.data)
        setIsOpen(false)
        showAlert({
          message: <p>Character updated successfully</p>,
          variant: 'success'
        })
      }
    } catch (error: any) {
      setUpdateCharacterError('Failed to update character.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpen = async () => {
    setIsCharacterLoading(true)
    try {
      const service = await loadCharacterService(role || '')
      const response = await service.getCharacter(orgSlug, characterId)
      const voiceTypesResponse = await service.getCharacterVoiceTypes(orgSlug)
      if (response.data) {
        setCharacter(response.data)
        setVoiceTypes(voiceTypesResponse.data)
        resetForm(response.data.data.details)
        setIsOpen(true)
      }
    } catch (error) {
      showAlert({
        message: <p className='z-10'>Failed to fetch character</p>,
        variant: 'error'
      })
    } finally {
      setIsCharacterLoading(false)
    }
  }

  useEffect(() => {
    if (form.formState.isDirty) {
      setIsDirty(true)
    }
  }, [form.formState.isDirty])

  return (
    <Dialog open={isOpen} {...(isOpen && { onOpenChange: setIsOpen })}>
      <DialogTrigger className='flex justify-end'>
        <Button
          variant='outline'
          className='text-sm lg:text-sm border rounded-sm hover:bg-gray-50 h-[32px] min-w-[88px]'
          onClick={handleOpen}
          disabled={isCharacterLoading}
        >
          {isCharacterLoading ? (
            <div className='flex items-center gap-2'>
              <Loader className='w-4 h-4 animate-spin' />
            </div>
          ) : (
            'Edit'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[712px] max-h-[90%] overflow-y-auto'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <DialogHeader className='px-1'>
            <DialogTitle className='text-xl font-semibold'>
              Edit Character
            </DialogTitle>
            <DialogDescription className='text-neutral-gray-500 text-base space-y-4 mt-4'>
              <p>
                Edit the character&apos;s name, age, and personality traits.
                Fill in all required fields before saving. Click
                &quot;Save&quot; to apply changes or &quot;Cancel&quot; to
                discard.
              </p>
            </DialogDescription>
            {updateCharacterError && (
              <div className=''>
                <Alert variant='destructive' className='mb-[20px] !mt-5'>
                  <AlertDescription className='lg:text-base'>
                    {updateCharacterError}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </DialogHeader>
          <CharacterEditModalScrollArea>
            <div className='grid gap-4 h-[600px] px-1'>
              <section>
                <div className='py-2 flex gap-6'>
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
                </div>
              </section>
              <section>
                <div className='py-2 flex gap-6'>
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
                        <div className='absolute top-[1.9rem] right-10 z-20'>
                          <PreviewVoice
                            path={previewVoice}
                            isShowLabel={false}
                          />
                        </div>
                      )}

                      {form.formState.errors.voiceType && (
                        <p className='text-sm text-red-500'>
                          {form.formState.errors.voiceType.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <div className='py-2 flex gap-6'>
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
                        behavior in interactions. This ensures consistency in
                        how your character communicates and responds.
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
                        A subtle layer of context shaping your character&apos;s
                        deeper motivations and nuances. This influences
                        responses without being directly revealed to users.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <div className='py-2 px-1'>
                  <label className='text-base font-semibold'>Personality</label>
                  <div className='mt-4 lg:mt-6 flex flex-col gap-8'>
                    <PersonalityPicker
                      personality='Openess'
                      startLabel='Dislikes exploring'
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
                </div>
              </section>
            </div>
          </CharacterEditModalScrollArea>
          <DialogFooter className='grid grid-cols-2 gap-2 mt-4'>
            <Button
              variant='outline'
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              type='button'
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting || !isDirty}>
              {isSubmitting ? (
                <div className='flex items-center gap-2'>
                  <Loader className='w-4 h-4 animate-spin' />
                  Saving
                </div>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
