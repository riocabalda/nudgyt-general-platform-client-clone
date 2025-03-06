import { create } from 'zustand'
import { FormEnum, TransformedSection } from '../types/simulationFormTypes'
import { FormAnswersObjectType } from '@/app/(shared)/services/learner/simulationService'

export type KeyQuestionType = {
  section: string
  key_questions: string[]
}

export type ScrollToViewType = {
  behavior: ScrollBehavior
  section: string
  questionNo: string
} | null

type QuestionsProgressType = { [key: string]: string }

type FormState = {
  formAnswers: Record<string, Record<string, string>>
  formattedFormData: TransformedSection[]
  isOpenSection: boolean
  disableBtn: boolean
  disabledSections: string[]
  scrollToView: ScrollToViewType
  currentSectionQuestion: { section: string; questionNo: string }[] | null
  questionsProgress: number
  setIsOpenSection: (value: boolean) => void
  setDisableBtn: (formData: any) => void
  checkDisabledSection: (formAnswers: FormAnswersObjectType) => void
  setScrollToView: (
    behavior: ScrollBehavior,
    section: string | null,
    questionNo: string | null
  ) => void
  setCurrentSectionQuestion: (section: string, questionNo: string) => void
  setQuestionsProgress: (data: QuestionsProgressType) => void
  setFormAnswers: (answers: Record<string, Record<string, string>>) => void
  setFormattedFormData: (formattedFormData: TransformedSection[]) => void
  clearScrollToView: () => void
  resetFormState: () => void
}

const initialState = {
  formAnswers: {},
  formattedFormData: [],
  isOpenSection: true,
  disabledSections: [],
  disableBtn: true,
  scrollToView: null,
  currentSectionQuestion: null,
  questionsProgress: 0
}

const useSimulationFormStore = create<FormState>((set) => ({
  ...initialState,
  // Sets the isOpenSection state to the given value
  setIsOpenSection: (value) => set({ isOpenSection: value }),
  // Checks and updates disabled sections based on form answers
  checkDisabledSection: (formAnswers: FormAnswersObjectType) => {
    const updatedSections: string[] = []
    Object.keys(formAnswers).forEach((sectionName) => {
      const sectionData = formAnswers[sectionName]
      const hasSectionNotRequired = Object.keys(sectionData)
        .filter((key) => key.toLowerCase() !== 'notes') // Exclude 'Notes' key
        .every(
          (key) => sectionData[key] === FormEnum.SECTION_QUESTION_NOT_REQUIRED
        )

      if (hasSectionNotRequired) {
        updatedSections.push(sectionName)
      }
    })

    set({ disabledSections: updatedSections })
  },
  // Sets the disableBtn state to the given value
  setDisableBtn: (value) => set({ disableBtn: value }),
  // Sets or resets the scrollToView state based on given parameters
  setScrollToView: (behavior, section, questionNo) => {
    if (behavior === null || section === null || questionNo === null) {
      set({ scrollToView: null })
    } else {
      set({ scrollToView: { behavior, section, questionNo } })
    }
  },
  // used to scroll to the last saved section question if visiting that section again.
  setCurrentSectionQuestion: (section, questionNo) =>
    set((state) => {
      if (state.currentSectionQuestion === null) {
        return {
          currentSectionQuestion: [{ section, questionNo }]
        }
      }

      const existingIndex = state.currentSectionQuestion.findIndex(
        (item) => item.section === section
      )

      if (existingIndex !== -1) {
        // Update questionNo for the existing section
        const updatedQuestions = [...state.currentSectionQuestion]
        updatedQuestions[existingIndex].questionNo = questionNo
        return { currentSectionQuestion: updatedQuestions }
      } else {
        // Append new section-question pair if it doesn't exist
        return {
          currentSectionQuestion: [
            ...state.currentSectionQuestion,
            { section, questionNo }
          ]
        }
      }
    }),
  // Calculates and updates questions progress based on given data
  setQuestionsProgress: (data) => {
    const keys = Object.keys(data).filter(
      (key) =>
        key !== 'Notes' && data[key] !== FormEnum.SECTION_QUESTION_NOT_REQUIRED
    )

    // Count the number of keys with non-empty values
    const nonEmptyCount = keys.filter((key) => data[key]?.trim() !== '')?.length

    // Calculate the percentage
    const percentage = (nonEmptyCount / keys.length) * 100

    set({ questionsProgress: Math.floor(percentage) })
  },
  // Updates the form answers state
  setFormAnswers: (answers) => set({ formAnswers: answers }),
  // Updates the formatted form data state
  setFormattedFormData: (formattedFormData) => set({ formattedFormData }),
  clearScrollToView: () => set({ scrollToView: null }),
  // Resets the form state to its initial state
  resetFormState: () => set(initialState)
}))

export default useSimulationFormStore
