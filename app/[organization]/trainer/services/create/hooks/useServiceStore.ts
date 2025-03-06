import { create } from 'zustand'

export type Step = 0 | 1 | 2 | 3

export type Personality = {
  openess: string
  meticulousness: string
  extraversion: string
  agreeableness: string
  sensitivity: string
}

export type OptionType = { value: string; label: string }

export type LanguageType = {
  value: string
  label: string
}

export const languageOptions: OptionType[] = [
  { value: 'English', label: 'English' },
  { value: 'Mandarin', label: 'Mandarin' },
  { value: 'Filipino', label: 'Filipino' }
]

type ServiceStoreValues = {
  serviceTypeId: string | null
  environmentId: string | null
  avatarId: string | null
  characterIds: string[] | null
  characterName: string | null
  characterAge: string | null
  backstory: string | null
  hiddenBackstory: string | null
  voiceType: string | null
  languages: LanguageType[] | null
  personality: Personality | null
  title: string | null
  description: string | null
  timelimit: string | null
  customTimeLimit: string | null
  rubrics: File | null
  formQuestions: File | null
  currentStep: Step
  isSubmitting: boolean
  isPublishedOnce: boolean
  serviceHasForm: boolean
  isCreatingCharacter: boolean
  isTemplate: boolean
  templateId: string | null
}

type ServiceStore = ServiceStoreValues & {
  setServiceTypeId: (serviceTypeId: string) => void
  setEnvironmentId: (environmentId: string) => void
  setAvatarId: (avatarId: string) => void
  setCharacterIds: (characterIds: string[] | null) => void
  setCharacterName: (characterName: string) => void
  setCharacterAge: (characterAge: string) => void
  setBackstory: (backstory: string) => void
  setHiddenBackstory: (hiddenBackstory: string) => void
  setVoiceType: (voiceType: string) => void
  setLanguages: (languages: LanguageType[] | null) => void
  setPersonality: (personality: Personality) => void
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  setTimelimit: (timelimit: string) => void
  setCustomTimeLimit: (customTimeLimit: string) => void
  setRubrics: (rubrics: File | null) => void
  setFormQuestions: (formQuestions: File | null) => void
  setCurrentStep: (currentStep: Step) => void
  setIsSubmitting: (isSubmitting: boolean) => void
  setIsPublishedOnce: (isPublishedOnce: boolean) => void
  setServiceHasForm: (serviceHasForm: boolean) => void
  setIsCreatingCharacter: (isCreatingCharacter: boolean) => void
  setIsTemplate: (isTemplate: boolean) => void
  setTemplateId: (templateId: string | null) => void
  reset: () => void
  resetCharacterData: () => void
}

const initialState: ServiceStoreValues = {
  serviceTypeId: null,
  environmentId: null,
  avatarId: null,
  characterIds: [],
  characterName: null,
  characterAge: null,
  backstory: null,
  hiddenBackstory: null,
  voiceType: null,
  languages: null,
  personality: null,
  title: '',
  description: '',
  timelimit: '',
  customTimeLimit: '',
  rubrics: null,
  formQuestions: null,
  currentStep: 0,
  isSubmitting: false,
  isPublishedOnce: false,
  serviceHasForm: false,
  isCreatingCharacter: false,
  isTemplate: false,
  templateId: null
}

export const useServiceStore = create<ServiceStore>()((set) => ({
  ...initialState,
  setServiceTypeId: (serviceTypeId) => set({ serviceTypeId }),
  setEnvironmentId: (environmentId) => set({ environmentId }),
  setAvatarId: (avatarId) => set({ avatarId }),
  setCharacterIds: (characterIds) => set({ characterIds }),
  setCharacterName: (characterName) => set({ characterName }),
  setCharacterAge: (characterAge) => set({ characterAge }),
  setBackstory: (backstory) => set({ backstory }),
  setHiddenBackstory: (hiddenBackstory) => set({ hiddenBackstory }),
  setVoiceType: (voiceType) => set({ voiceType }),
  setLanguages: (languages) => set({ languages }),
  setPersonality: (personality) => set({ personality }),
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setTimelimit: (timelimit) => set({ timelimit }),
  setCustomTimeLimit: (customTimeLimit) => set({ customTimeLimit }),
  setRubrics: (rubrics) => set({ rubrics }),
  setFormQuestions: (formQuestions) => set({ formQuestions }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setIsPublishedOnce: (isPublishedOnce) => set({ isPublishedOnce }),
  setServiceHasForm: (serviceHasForm) => set({ serviceHasForm }),
  setIsCreatingCharacter: (isCreatingCharacter) => set({ isCreatingCharacter }),
  setIsTemplate: (isTemplate) => set({ isTemplate }),
  setTemplateId: (templateId) => set({ templateId }),
  reset: () => set(initialState),
  resetCharacterData: () =>
    set({
      avatarId: null,
      characterName: null,
      characterAge: null,
      backstory: null,
      hiddenBackstory: null,
      voiceType: null,
      languages: null,
      personality: null
    })
}))
