import {
  checkIfQuestionHasOptions,
  cn,
  hasStringData
} from '@/app/(shared)/utils'
import moment from 'moment-timezone'
import { PropsWithChildren } from 'react'

// TODO Confirm formats of dates to be received!
function formatDateAnswer(
  answer: string | null | undefined,
  format = 'DD/MM/YYYY'
) {
  if (!hasStringData(answer)) return null

  if (answer === 'CURRENT_DATE') {
    return moment.utc().format(format)
  }
  if (answer === 'CURRENT_DATE-3') {
    return moment.utc().add(-3, 'days').format(format)
  }

  return moment.utc(answer, format).format(format)
}

function OptionListItem(
  props: PropsWithChildren<{
    isSelected?: boolean
    isCorrect?: boolean
    isOptionsDisabled?: boolean
  }>
) {
  const { children } = props
  const { isSelected = false, isCorrect = false } = props
  const { isOptionsDisabled = false } = props

  return (
    <li
      className={cn(
        'rounded-[8px] px-6 py-3 lg:py-4 text-sm lg:text-base text-neutral-gray-600 min-h-[60px]',
        'border border-neutral-gray-400',
        !isOptionsDisabled && isSelected && 'border-2 border-destructive',
        !isOptionsDisabled && isCorrect && 'border-2 border-success bg-green-50' // Background shade in Figma is 100 but Tailwind's 50 is closer
      )}
    >
      {children}
    </li>
  )
}

/**
 * Render selected and correct answer together
 *
 * To not render one of them, set the corresponding prop as `null`
 */
function SelectedAndCorrectOptionListItems(props: {
  answer: string | null
  correctAnswer: string | null
  isOptionsDisabled?: boolean
  isSelected?: boolean
}) {
  const { answer, correctAnswer } = props
  const { isOptionsDisabled = false } = props

  return (
    <>
      {correctAnswer !== null && (
        <OptionListItem
          isCorrect={correctAnswer === answer}
          {...{ isOptionsDisabled }}
        >
          {answer && <p>{answer}</p>}
        </OptionListItem>
      )}
    </>
  )
}

function OptionRenderer(props: {
  option: string
  optionDescription: string
  selectedOption?: string
  correctOption: string
  isOptionsDisabled?: boolean
  questionType: string
}) {
  const {
    option,
    optionDescription,
    selectedOption,
    correctOption,
    questionType
  } = props
  const { isOptionsDisabled = false } = props

  let shouldRenderSelectedAndCorrectAnswers = false
  let answer: string | null = selectedOption ?? null
  let correctAnswer: string | null = correctOption

  const optionLowercase = option.toLowerCase()
  const isQuestionHasOptions = checkIfQuestionHasOptions(questionType)

  if (!isQuestionHasOptions) {
    shouldRenderSelectedAndCorrectAnswers = true
  }

  if (optionLowercase === 'date') {
    answer = formatDateAnswer(selectedOption) ?? null
    correctAnswer = formatDateAnswer(correctOption) ?? null
  }

  if (shouldRenderSelectedAndCorrectAnswers) {
    if (isOptionsDisabled) answer = null

    if (!hasStringData(correctAnswer)) correctAnswer = 'N/A'

    const isSelected = hasStringData(answer)

    return (
      <SelectedAndCorrectOptionListItems
        {...{
          answer,
          correctAnswer,
          isOptionsDisabled,
          isSelected
        }}
      />
    )
  }

  let optionNum = option
  let description = optionDescription
  let isSelected = option === selectedOption
  let isCorrect = option === correctOption

  // TODO Is this still required?
  if (optionLowercase.includes('other')) {
    const otherOptionSep = ' '
    const [otherOptionNum, ...otherDescriptionParts] =
      option.split(otherOptionSep)

    const otherDescription = otherDescriptionParts
      .join(otherOptionSep)
      .replace(/:/g, '')
    const answer = isSelected ? selectedOption : null

    optionNum = otherOptionNum
    description = `${otherDescription}: ${answer}`
  }

  if (!hasStringData(correctOption)) {
    isSelected = false
    isCorrect = false
  }

  return (
    <OptionListItem {...{ isSelected, isCorrect, isOptionsDisabled }}>
      <p className='flex gap-2'>
        <span className='inline-block min-w-4 font-semibold'>{optionNum}</span>
        <span>{description}</span>
      </p>
    </OptionListItem>
  )
}

export default OptionRenderer
