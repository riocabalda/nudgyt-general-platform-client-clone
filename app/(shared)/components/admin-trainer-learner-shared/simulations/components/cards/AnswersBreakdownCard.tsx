'use client'

import { Card } from '@/app/(shared)/components/ui/card'
import {
  checkIfQuestionHasOptions,
  cn,
  hasStringData,
  naturalSort
} from '@/app/(shared)/utils'
import { Check, X } from 'lucide-react'
import { Fragment, useMemo } from 'react'
import { FormEnum } from '@/app/(shared)/types'
import OptionRenderer from '../answer-breakdown/OptionRender'
import useGetSimulationResults, {
  HARD_CODED_DATA
} from '../../hooks/useGetSimulationResults'

function useSectionQuestions(sectionName: string) {
  const { details } = useGetSimulationResults()

  const allQuestions = details?.formQuestions
  const allAnswers = details?.formAnswers

  const { sectionQuestions, questionSetStartIndices } = useMemo(() => {
    const questions = allQuestions ?? []
    const answers = allAnswers ?? []

    let sectionQuestions = questions.filter(
      (question: any) => question.section === sectionName // temporary type any
    )
    const sectionAnswers = answers.filter(
      (answer: any) => answer.section === sectionName // temporary type any
    )
    if (sectionQuestions.length > sectionAnswers.length) {
      console.warn('More questions than available answers')
    }
    if (sectionQuestions.length < sectionAnswers.length) {
      console.warn('More answers than available questions')

      /** Find answers that do not have a corresponding question */
      for (const answer of sectionAnswers) {
        const question = sectionQuestions.find(
          (question: any) => question.question_no === answer.question_no // temporary type any
        )
        if (question !== undefined) continue

        // TODO Improve this logic...
        /**
         * For answers to questions with question number of format e.g. `1da`,
         * find the first question that has the same first and last "number", e.g. `1aa`,
         * and duplicate that.
         */
        if (answer.question_no.length === 3) {
          const questionFirstNum = answer.question_no.at(0) ?? ''
          const questionLastNum = answer.question_no.at(-1) ?? ''

          const questionToDuplicate = sectionQuestions.find(
            (question: any) =>
              question.question_no.at(0) === questionFirstNum &&
              question.question_no.at(-1) === questionLastNum
          )
          if (questionToDuplicate === undefined) {
            console.warn('Question to duplicate not found...?')
            continue
          }

          const duplicate = {
            ...questionToDuplicate,
            _id: [
              questionToDuplicate._id,
              questionToDuplicate.question_no,
              answer.question_no
            ].join('-'),
            question_no: answer.question_no,
            correct_answer: answer.answer
          }
          sectionQuestions.push(duplicate)
        }
      }
    }

    sectionQuestions = sectionQuestions.sort(
      (
        qA: any, // temporary type any
        qB: any // temporary type any
      ) => naturalSort(qA.question_no, qB.question_no)
    )

    const sectionTitles = new Set<string>()
    const questionSetStartIndices = new Set<number>()
    sectionQuestions.forEach((question: any, idx: number) => {
      // temporary type any
      if (!('main_title' in question)) return
      question satisfies any // temporary type any

      if (question.main_title === '') return
      if (sectionTitles.has(question.main_title)) return

      sectionTitles.add(question.main_title)
      questionSetStartIndices.add(idx)
    })

    return { sectionQuestions, questionSetStartIndices }
  }, [allQuestions, allAnswers])

  return { sectionQuestions, questionSetStartIndices }
}

function useQuestionAnswer(sectionName: string, questionNo: string) {
  const { details } = useGetSimulationResults()

  const formAnswers = details?.formAnswers ?? []

  const formAnswer = formAnswers.find(
    (answer) =>
      answer.section === sectionName && answer.question_no === questionNo
  )
  return formAnswer
}

function AnswerFeedbackMessage({
  correctAnswer,
  hasAnswer,
  selectedOption,
  questionType
}: {
  correctAnswer: string
  hasAnswer: boolean
  selectedOption: string
  questionType: string
}) {
  const isQuestionHasOptions = checkIfQuestionHasOptions(questionType)
  const isCorrect = isQuestionHasOptions
    ? correctAnswer === selectedOption
    : hasAnswer && correctAnswer === selectedOption

  if (isCorrect) {
    return (
      <div className='flex items-center gap-2'>
        <Check className='size-6 text-success shrink-0' />
        <p className='rounded-[8px] py-3 lg:py-4 text-sm lg:text-base text-success'>
          Correct
        </p>
      </div>
    )
  }

  const message = !hasAnswer
    ? 'No answer provided. The correct answer is'
    : 'The correct answer is'

  return (
    <div className='flex items-center gap-2'>
      <X className='size-6 text-destructive shrink-0' />
      <p className='rounded-[8px] py-3 lg:py-4 text-sm lg:text-base text-destructive'>
        Incorrect - {message}{' '}
        <span className='font-semibold'>{correctAnswer}</span>.
      </p>
    </div>
  )
}

function QuestionSection(props: {
  question: any // temporary type any
  isSectionDisabled?: boolean
}) {
  const { question, isSectionDisabled = false } = props
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { section, options, question_no, correct_answer, question_type } =
    question

  const formAnswer = useQuestionAnswer(section, question_no)

  let questionTitle = ''
  let questionDescription = ''
  if ('question_title' in question) {
    questionTitle = question.question_title
    questionDescription = question?.question_description ?? ''
  }
  if ('sub_title' in question) {
    questionTitle = question.sub_title
    questionDescription = question.sub_title_description
  }

  const hasQuestionDescription = hasStringData(questionDescription)

  const answer = formAnswer?.answer
  const hasAnswer = hasStringData(answer)
  const isQuestionDisabled = answer === FormEnum.SECTION_QUESTION_NOT_REQUIRED
  const isAnswerAdditional = formAnswer?.is_additional ?? false
  const isSectionOrQuestionDisabled =
    isSectionDisabled || isQuestionDisabled || isAnswerAdditional

  return (
    <section
      className={cn(
        'grid gap-4',
        isSectionOrQuestionDisabled && 'bg-gray-200 p-4 rounded-[8px]'
      )}
    >
      <header className='grid gap-3'>
        <h3 className='flex gap-2 font-medium'>
          <span className='inline-block min-w-4 text-end'>{question_no}.</span>
          <span>{questionTitle}</span>
        </h3>

        {hasQuestionDescription && (
          <p className='italic text-neutral-gray-600'>{questionDescription}</p>
        )}
      </header>

      <div>
        <AnswerFeedbackMessage
          correctAnswer={correct_answer}
          hasAnswer={hasAnswer}
          selectedOption={answer}
          questionType={question_type}
        />

        <ol className='grid gap-4'>
          {options.map(
            (
              { option, option_description }: any // temporary type any
            ) => (
              <OptionRenderer
                key={option}
                option={option}
                optionDescription={option_description}
                selectedOption={answer}
                correctOption={correct_answer}
                isOptionsDisabled={isSectionOrQuestionDisabled}
                questionType={question_type}
              />
            )
          )}
        </ol>
      </div>

      <footer className='lg:hidden'>
        <p className='text-xs tracking-[0.02rem] text-neutral-gray-600'>
          {HARD_CODED_DATA.question_option_display.disclaimer}
        </p>
      </footer>
    </section>
  )
}

function NotesSection(props: {
  question: any // temporary type any
  isSectionDisabled?: boolean
}) {
  const { question, isSectionDisabled = false } = props
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { section, question_no } = question
  const formAnswer = useQuestionAnswer(section, question_no)

  const notes = formAnswer?.answer
  const hasNotes = hasStringData(notes)

  return (
    <section
      className={cn(
        'rounded-[8px] p-3 grid gap-1 bg-neutral-gray-50',
        isSectionDisabled && 'bg-gray-200'
      )}
    >
      <h3 className='font-semibold text-sm'>Notes:</h3>
      <p className='text-sm leading-[21.7px] text-neutral-gray-600'>
        {hasNotes ? notes : <span className='italic'>No notes taken</span>}
      </p>
    </section>
  )
}

function HeaderSection(props: {
  question: any // temporary type any
}) {
  const { question } = props

  if (!('main_title' in question)) return null
  question satisfies any // temporary type any

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { main_title, main_description, question_no } = question

  /** Automatically disregards non-numeric characters */
  const sectionNumber = Number.parseInt(question_no)

  return (
    <section>
      <h3 className='flex gap-2 font-semibold text-lg'>
        <span className='inline-block min-w-4 text-end'>{sectionNumber}.</span>
        <span>{main_title}</span>
      </h3>

      <p className='italic text-neutral-gray-600'>{main_description}</p>
    </section>
  )
}

function AnswerBreakdownCard(props: { sectionIdx: number }) {
  const { details } = useGetSimulationResults()
  const { sectionIdx } = props

  const displaySection = details?.displayScores.sections[sectionIdx]

  const { sectionQuestions, questionSetStartIndices } = useSectionQuestions(
    displaySection?.name ?? ''
  )

  if (!displaySection) return null
  if (sectionQuestions.length === 0) return null

  const isSectionDisabled = !displaySection.showAnswers

  return (
    <Card
      className={cn(
        'shadow-sm rounded-none lg:rounded-[8px] p-4 lg:p-6 pb-10 border border-y-neutral-gray-300 lg:border-none'
      )}
    >
      {sectionQuestions.map(
        (
          question: any, // temporary type any
          idx: number
        ) => (
          <Fragment key={question._id}>
            {idx !== 0 && (
              <hr className='border-neutral-gray-400 my-6 lg:my-8' />
            )}

            {question.question_no === 'Notes' ? (
              <NotesSection
                question={question}
                isSectionDisabled={isSectionDisabled}
              />
            ) : (
              <>
                {questionSetStartIndices.has(idx) && (
                  <div className='mb-6 lg:mb-8'>
                    <HeaderSection question={question} />
                  </div>
                )}
                <QuestionSection
                  question={question}
                  isSectionDisabled={isSectionDisabled}
                />
              </>
            )}
          </Fragment>
        )
      )}
    </Card>
  )
}

export default AnswerBreakdownCard
