import {
  ExtractedData,
  FormEnum,
  TransformedSection
} from '../types/simulationFormTypes'
import {
  FormAnswersObjectType,
  Simulation
} from '@/app/(shared)/services/learner/simulationService'
import { TransformedQuestion } from '../types/simulationFormTypes'
import { FormQuestions } from '@/app/(shared)/services/learner/serviceService'
import moment from 'moment-timezone'

export const getSectionLetterDescription = (section: string | undefined) => {
  const dotIndex = section?.indexOf('.') || 0
  if (section) {
    const letterBeforeDot = section && section[dotIndex - 1]
    const descriptionAfterDot = section && section.slice(dotIndex + 2)
    return {
      letter: letterBeforeDot,
      description: descriptionAfterDot
    }
  }

  return {
    letter: '',
    description: ''
  }
}

export function areFormAnswersDifferent(
  formAnswersFromDb: Record<string, any>,
  formAnswersFromState: Record<string, any>
): boolean {
  if (!formAnswersFromDb || !formAnswersFromState) return true

  // Function to sort keys and move "note" keys to the end
  const sortKeys = (
    obj: Record<string, any>
  ): [string[], Record<string, any>] => {
    const sortedKeys = Object.keys(obj).sort((a, b) => {
      // Move "note" keys to the end
      const aIsNote = a.toLowerCase().includes('note')
      const bIsNote = b.toLowerCase().includes('note')
      return aIsNote === bIsNote ? a.localeCompare(b) : aIsNote ? 1 : -1
    })

    const sortedObj: Record<string, any> = {}
    sortedKeys.forEach((key) => {
      sortedObj[key] = obj[key]
    })

    return [sortedKeys, sortedObj]
  }

  // Sort both objects
  const [sortedKeysDb, sortedDb] = sortKeys(formAnswersFromDb)
  const [sortedKeysState, sortedState] = sortKeys(formAnswersFromState)

  // Check if the sorted keys are the same length
  if (sortedKeysDb.length !== sortedKeysState.length) {
    return true // Different number of keys
  }

  // Compare keys and values
  for (const key of sortedKeysDb) {
    if (sortedState[key] === undefined || sortedDb[key] !== sortedState[key]) {
      return true // Keys or values are different
    }
  }

  return false // No unsaved data, objects are the same
}

export function defaultFormatDate(date: string) {
  return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
}

export function formattedDate(date: string) {
  return moment(date).format('DD/MM/YYYY')
}

export function splitCurrentDateString(input: string): {
  currentDate: string | null
  days: string | null
} {
  const regex = /^(\w+)(?:-(\d+))?$/
  const match = input.match(regex)

  if (match) {
    return {
      currentDate: match[1],
      days: match[2] || ''
    }
  } else {
    return {
      currentDate: null,
      days: null
    }
  }
}

export function checkDateValue(value: string) {
  const { currentDate, days } = splitCurrentDateString(value)

  if (!currentDate || currentDate !== 'CURRENT_DATE')
    return defaultFormatDate(value)
  if (!days) {
    return moment().format('YYYY-MM-DD')
  } else {
    return moment().subtract(days, 'days').format('YYYY-MM-DD')
  }
}

export function compareQuestionType(questionType: string, formEnum: string) {
  if (questionType.toLowerCase() === formEnum.toLowerCase()) return true
  return false
}

export const getPrefillValue = (question: TransformedQuestion) => {
  const prefillOptions = question.options.filter(
    (option) => option.pre_fill.toLowerCase() === 'yes'
  )
  const multipleChoice =
    question.question_type.toLowerCase() === FormEnum.MCQ ||
    question.question_type.toLowerCase() === FormEnum.MCQIF ||
    question.question_type.toLowerCase() === FormEnum.MCQO

  if (prefillOptions.length === 1 && multipleChoice)
    return prefillOptions[0].option
  if (prefillOptions.length > 1 && multipleChoice)
    return question.correct_answer
  if (prefillOptions.length === 1 && !multipleChoice)
    return question.correct_answer
  return ''
}

export const hasFormAnswers = (
  formAnswersData: FormAnswersObjectType
): boolean => {
  if (!formAnswersData || Object.keys(formAnswersData).length === 0)
    return false

  // Iterate through each section
  for (const section in formAnswersData) {
    if (formAnswersData.hasOwnProperty(section)) {
      // Iterate through each question_no in the section
      const questions = formAnswersData[section]
      for (const questionNo in questions) {
        if (
          questions.hasOwnProperty(questionNo) &&
          questions[questionNo] !== ''
        ) {
          return true
        }
      }
    }
  }

  return false
}

export function hasFloatIntegerLimitQuestionType(input: string): {
  floatIntegerQsType: string | null
  limit: number | null
} {
  // Define valid types
  const validTypes = ['integer', 'float']
  const toLowerCaseInput = input.toLocaleLowerCase()

  // Check if input contains a colon
  if (toLowerCaseInput.includes(':')) {
    // Split the input into type and number
    const [questionType, num] = toLowerCaseInput.split(':')

    // Check if the type is valid and the number is a valid number
    if (validTypes.includes(questionType) && !isNaN(parseFloat(num))) {
      return { floatIntegerQsType: questionType, limit: parseFloat(num) }
    } else {
      return { floatIntegerQsType: null, limit: null } // Invalid type
    }
  } else {
    // If no colon, check if the type is valid and return with number as null
    if (validTypes.includes(toLowerCaseInput)) {
      return { floatIntegerQsType: toLowerCaseInput, limit: null }
    } else {
      return { floatIntegerQsType: null, limit: null } // Invalid type
    }
  }
}

function extractTextAndNumber(input: string): ExtractedData {
  const textPart = input.replace(/\d+/g, '') // Remove all digits to get the text part
  const numberPart = input.match(/\d+/g) // Extract digits as an array

  return {
    text: textPart || '', // If no text found, return an empty string
    limit: numberPart ? parseInt(numberPart[0], 10) : null // get the first number and parse as a single number
  }
}

export function hasTextLimitQuestionType(questionType: string): number | null {
  const textType = ['digit text', 'text:', 'digit alpha numeric']

  const extractedQsType = extractTextAndNumber(questionType.toLowerCase())
  const hasNumberQsType = textType.includes(extractedQsType.text.trim())

  if (hasNumberQsType) return extractedQsType.limit

  return null
}

export const initialFormValues = (
  formData: TransformedSection | null,
  formAnswers: FormAnswersObjectType
): { [key: string]: string } | undefined =>
  formData?.questions.reduce(
    (acc, question) => {
      acc[question.question_no] =
        formAnswers && formAnswers[formData?.section]
          ? formAnswers[formData?.section][question?.question_no] || ''
          : ''

      return acc
    },
    {} as { [key: string]: string }
  )

export function limitText(input: string, limit: number) {
  if (!input) return ''
  return input.length > limit ? input.substring(0, limit) : input
}

export function calculateSectionPercentage(
  formAnswers: FormAnswersObjectType,
  sectionTitle?: string
) {
  if (!sectionTitle || Object.keys(formAnswers).length === 0) return null
  const data = formAnswers[sectionTitle]
  const keys = Object.keys(data).filter(
    (key) =>
      key !== 'Notes' &&
      data[key] !== FormEnum.SECTION_QUESTION_NOT_REQUIRED &&
      key.toLowerCase() !== 'not applicable'
  )
  if (Object.keys(keys).length === 0) return null

  // Count the number of keys with non-empty values
  const nonEmptyCount = keys.filter((key) => data[key]?.trim() !== '').length

  // Calculate the percentage
  const percentage = (nonEmptyCount / keys.length) * 100

  // Remove the decimal and return the result
  return Math.floor(percentage)
}

export function convertFormAnswersToObject(
  simulationData: Simulation
): FormAnswersObjectType {
  const formAnswersInObject =
    simulationData.form_answers.reduce<FormAnswersObjectType>((acc, answer) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { section, question_no, answer: response } = answer

      // Initialize the section if it doesn't exist in the accumulator
      if (!acc[section]) {
        acc[section] = {}
      }

      // Assign the answer to the respective question number within the section
      acc[section][question_no] = response

      return acc
    }, {})

  return formAnswersInObject
}

function compareQuestionNos(a: string, b: string): number {
  const regex = /^(\d+)([a-z]*)$/i

  const matchA = a.match(regex)
  const matchB = b.match(regex)

  if (matchA && matchB) {
    const [, numA, strA] = matchA
    const [, numB, strB] = matchB

    const numberComparison = parseInt(numA, 10) - parseInt(numB, 10)

    if (numberComparison !== 0) {
      return numberComparison
    }

    return strA.localeCompare(strB)
  }

  return a.localeCompare(b)
}

export const formatFormData = (
  formQuestions: FormQuestions[]
): TransformedSection[] => {
  const groupedData: { [key: string]: TransformedQuestion[] } =
    formQuestions.reduce(
      (acc, item) => {
        const section = item.section
        if (!acc[section]) {
          acc[section] = []
        }
        acc[section].push(item)
        return acc
      },
      {} as { [key: string]: TransformedQuestion[] }
    )

  Object.keys(groupedData).forEach((section) => {
    groupedData[section].sort((a, b) =>
      compareQuestionNos(a.question_no, b.question_no)
    )
  })

  const groupedArray: TransformedSection[] = Object.keys(groupedData).map(
    (section) => ({
      section: section,
      questions: groupedData[section]
    })
  )

  return groupedArray
}

export function initializeFormData(
  serviceData: TransformedSection[]
): FormAnswersObjectType {
  const initialFormAnswersData: FormAnswersObjectType = {}
  serviceData.forEach((section) => {
    const sectionTitle = section.section
    // Check if section already exists in existingData
    if (!initialFormAnswersData[sectionTitle]) {
      initialFormAnswersData[sectionTitle] = {} // Initialize section data if not exists

      section.questions.forEach((question) => {
        const questionNo = question.question_no

        //Handle pre-fill logic when pre_fill is 'Yes'
        if (
          question.options.some((item) => item.hasOwnProperty('pre_fill')) &&
          question.options.some(
            (field) => field.pre_fill.toLowerCase() === 'yes'
          )
        ) {
          const prefillValue = getPrefillValue(question as TransformedQuestion)
          initialFormAnswersData[sectionTitle][questionNo] = prefillValue
        } else {
          if (
            question.pre_fill &&
            question.pre_fill.toLocaleLowerCase() === 'yes'
          ) {
            initialFormAnswersData[sectionTitle][questionNo] =
              question.correct_answer
          } else {
            initialFormAnswersData[sectionTitle][questionNo] = ''
          }
        }
      })
    }
  })
  return initialFormAnswersData
}

export function hasUnsavedFormData(
  data1: Record<string, Record<string, string>>,
  data2: Record<string, Record<string, string>>
): boolean {
  // Check if both objects have the same sections
  const sections1 = Object.keys(data1)
  const sections2 = Object.keys(data2)

  // Compare sections
  if (sections1.length !== sections2.length) {
    return true
  }

  for (const section of sections1) {
    if (!data2.hasOwnProperty(section)) {
      return true
    }

    const fields1 = Object.keys(data1[section])
    const fields2 = Object.keys(data2[section])

    // Compare fields
    if (fields1.length !== fields2.length) {
      return true
    }

    for (const field of fields1) {
      // Check if field exists
      if (!data2[section].hasOwnProperty(field)) {
        return true
      }

      // Compare values (handle null, undefined, and empty strings consistently)
      const value1 = data1[section][field] ?? ''
      const value2 = data2[section][field] ?? ''

      if (value1.trim() !== value2.trim()) {
        return true
      }
    }
  }

  return false
}

export function isNonEmptyFormAnswer(formAnswers: FormAnswersObjectType) {
  return (
    typeof formAnswers === 'object' &&
    formAnswers !== null &&
    !Array.isArray(formAnswers) &&
    Object.keys(formAnswers).length > 0
  )
}
