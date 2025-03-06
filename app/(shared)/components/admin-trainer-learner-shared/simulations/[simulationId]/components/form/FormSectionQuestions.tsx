'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { Input } from '@/app/(shared)/components/ui/input'
import useSimulationFormStore, {
  ScrollToViewType
} from '../../hooks/useSimulationFormStore'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/(shared)/components/ui/select'
import { Textarea } from '@/app/(shared)/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { useParams } from 'next/navigation'
import { FormAnswersObjectType } from '@/app/(shared)/services/learner/simulationService'
import {
  FormEnum,
  TransformedQuestion,
  TransformedSection
} from '../../types/simulationFormTypes'
import {
  areFormAnswersDifferent,
  checkDateValue,
  compareQuestionType,
  formattedDate,
  getPrefillValue,
  hasFloatIntegerLimitQuestionType,
  hasTextLimitQuestionType,
  initialFormValues,
  limitText
} from '../../utils/formUtils'
import * as z from 'zod'
import CustomSelect from './CustomSelect'
import QuestionItem from './QuestionItem'
import '../../style.css'

// Function to generate a Zod schema for a given form questions
const formSchema = (questions: TransformedQuestion[] | undefined) => {
  const schemaShape: { [key: string]: z.ZodString } = {}

  questions?.forEach((question) => {
    schemaShape[question.question_no] = z.string()
  })

  return z.object(schemaShape)
}

function FormSectionQuestions({
  formData,
  useUpdateFormAnswers
}: {
  formData: TransformedSection
  useUpdateFormAnswers: (simulationId: string) => {
    setFormAnswersWithDelay: (formAnswers: FormAnswersObjectType) => void
  }
}) {
  // Dynamically generate the schema for the selected section
  const schema = formSchema(formData.questions)
  const [debouncedKeyQuestion, setKeyQuestion] =
    useDebounceValue<ScrollToViewType | null>(null, 500)
  const [targetView, setTargetView] = useState<string | null>(null)
  const targetAutoScrollRef = useRef<HTMLDivElement>(null)
  const lastChangeQuestion = useRef<FormType | null>(null)

  // Infer the type from the schema
  type FormType = z.infer<typeof schema>

  const { simulationId } = useParams()

  const {
    formAnswers,
    scrollToView,
    currentSectionQuestion,
    setQuestionsProgress,
    setCurrentSectionQuestion,
    clearScrollToView,
    setFormAnswers
  } = useSimulationFormStore()

  const { setFormAnswersWithDelay } = useUpdateFormAnswers(String(simulationId))

  const { control, watch, setValue, getValues } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: initialFormValues(formData, formAnswers)
  })

  const formSectionAnswer = watch()
  const sectionsTitle = formData.section

  // Check if there are any unsaved data in the form answers.
  const hasUnsavedData = areFormAnswersDifferent(
    formAnswers[sectionsTitle],
    formSectionAnswer
  )

  // This useEffect handles the scrolling behavior within the form questions.
  useEffect(() => {
    const lastSectionQuestion = currentSectionQuestion?.find(
      (data) => data.section === sectionsTitle
    )
    if (scrollToView && scrollToView.section === sectionsTitle) {
      handleTargetView(
        scrollToView.questionNo,
        scrollToView.behavior || 'smooth'
      )
      setCurrentSectionQuestion(scrollToView.section, scrollToView.questionNo)
      setKeyQuestion(scrollToView)
    }
    if (debouncedKeyQuestion) {
      clearScrollToView()
    }
    if (lastSectionQuestion && !scrollToView)
      handleTargetView(lastSectionQuestion.questionNo)
  }, [targetView, debouncedKeyQuestion, scrollToView])

  useEffect(() => {
    setQuestionsProgress(formSectionAnswer)

    // Clear scrollToView if section does not match current section title
    if (scrollToView?.section !== sectionsTitle) clearScrollToView()
  }, [formAnswers, formData])

  useEffect(() => {
    const updatedFormAnswers = {
      ...formAnswers,
      [formData.section]: formSectionAnswer
    }

    // Update local storage and database whenever the form data changes
    // setDataToLocalStorage(formKey, updatedData)

    // Update form answers in the database
    if (hasUnsavedData) {
      syncFormAnswers(updatedFormAnswers, sectionsTitle)
      // Note: setFormAnswersWithDelay(updatedFormAnswers) will take 2 seconds before it starts to save to the database.
      // Therefore, setFormAnswers(updatedFormAnswers) is called initially to reflect the changes immediately.
      setFormAnswers(updatedFormAnswers)
      setFormAnswersWithDelay(updatedFormAnswers)
    }

    const changes = Object.keys(formSectionAnswer).find(
      (key) =>
        lastChangeQuestion.current &&
        formSectionAnswer[key] !== lastChangeQuestion.current[key]
    )
    // Get the question that was last changed
    if (changes) setCurrentSectionQuestion(sectionsTitle, changes)
    lastChangeQuestion.current = formSectionAnswer
  }, [formSectionAnswer])

  // This function sets the target view to a specific question number and scrolls to it.
  const handleTargetView = (
    targetQuestionNo: string,
    behavior?: ScrollBehavior
  ) => {
    setTargetView(targetQuestionNo)
    if (targetAutoScrollRef.current) {
      targetAutoScrollRef.current.scrollIntoView({
        behavior: behavior || 'instant',
        block: 'center'
      })
    }
  }

  // This function synchronizes form answers with useForm state
  const syncFormAnswers = (
    formAnswers: FormAnswersObjectType,
    sectionsTitle: string
  ) => {
    Object.entries(formAnswers[sectionsTitle]).forEach(([key, value]) =>
      setValue(key, value)
    )
  }

  // This function handles the logic for dependent questions based on the input type date.
  // It checks if the current question is an MCQ or MCQO and the next question is an MCQIF, IF_DATE, or DATEIF.
  // If the condition is met, it sets the value of the dependent question based on the current question's value.
  const handleDependentFromDateInput = (
    questionType: string,
    val: string,
    index: number
  ): void => {
    const dependentQuestion = formData?.questions[index + 1]
    const dependentQuestionType = dependentQuestion?.question_type || ''

    // Check if the current question is an MCQ or MCQO and the next question is an MCQIF, IF_DATE, or DATEIF.
    const isDependentQuestion = [
      FormEnum.MCQIF,
      FormEnum.DATEIF,
      FormEnum.IF_DATE
    ].some(
      (type) =>
        compareQuestionType(dependentQuestionType, type) &&
        (compareQuestionType(questionType, FormEnum.MCQO) ||
          compareQuestionType(questionType, FormEnum.MCQ))
    )

    if (dependentQuestion && isDependentQuestion) {
      setValue(
        dependentQuestion.question_no,
        val !== '1'
          ? FormEnum.SECTION_QUESTION_NOT_REQUIRED
          : getPrefillValue(dependentQuestion as TransformedQuestion)
      )
    }
  }

  // This function handles the value change for MCQIF questions.
  // It sets the value of the dependent question based on the current question's value.
  const handleMCQIFValueChange = (
    question: TransformedQuestion,
    val: string,
    index: number
  ): void => {
    const dependentQuestion = formData?.questions[index + 1]

    // Check if the current question is an MCQ and the next question is an MCQIF.
    if (
      dependentQuestion &&
      compareQuestionType(question.question_type, FormEnum.MCQ) &&
      compareQuestionType(dependentQuestion?.question_type, FormEnum.MCQIF)
    ) {
      setValue(
        dependentQuestion.question_no,
        val !== '1'
          ? FormEnum.SECTION_QUESTION_NOT_REQUIRED
          : getPrefillValue(dependentQuestion as TransformedQuestion)
      )
    }
  }

  // This function checks if a question should be disabled based on its type and the value of the previous question.
  // It returns true if the question should be disabled, false otherwise.
  const shouldDisableAnswer = (questionNo: string): boolean => {
    if (!formData?.questions) return false

    const questionIndex = formData.questions.findIndex((question) => {
      // Check if the question is an MCQIF, IF_DATE, or DATEIF.
      const isDependentQuestion = [
        FormEnum.MCQIF,
        FormEnum.IF_DATE,
        FormEnum.DATEIF
      ].some((type) => compareQuestionType(question.question_type, type))

      return isDependentQuestion && question.question_no === questionNo
    })

    if (questionIndex === -1 || questionIndex === 0) return false
    const previousQuestion = formData.questions[questionIndex - 1]
    const questionIsDisabled = watch(previousQuestion.question_no) !== '1'

    // Clear current question answer if it is disabled.
    if (
      (questionIsDisabled &&
        watch(questionNo) !== '' &&
        formData.questions[questionIndex].question_type === FormEnum.DATEIF) ||
      formData.questions[questionIndex].question_type === FormEnum.IF_DATE
    )
      setValue(questionNo, '')

    return questionIsDisabled
  }

  const handleFloatChange = (
    onChange: (value: string) => void,
    value: string
  ) => {
    // Change value to 0 if starts with decimal
    if (/^\d*\.?\d*$/.test(value)) {
      onChange(value)
      if (value.startsWith('.')) {
        onChange('0' + value)
      }
    }
  }

  const handleSetProgress = () => {
    setQuestionsProgress(getValues())
  }

  return (
    <form id='formData' className='flex flex-col gap-10 py-6 px-4 pl-6'>
      {formData?.questions.map((question, index) => {
        // Question type of '9 digit text', 'text:number', '9 digit alpha numeric'
        const textLimitQuestionType: number | null = hasTextLimitQuestionType(
          question.question_type
        )

        // Question type of 'Integer', 'Integer:number', 'Float' and 'Float:number'
        const { floatIntegerQsType, limit: floatIntegerLimit } =
          hasFloatIntegerLimitQuestionType(question.question_type)

        return (
          <div
            key={index}
            ref={
              targetView === question.question_no ? targetAutoScrollRef : null
            }
          >
            {/* Question Details */}
            <QuestionItem question={question} />

            {/* Question answer Input/Select */}
            <div className='mt-4 pl-5'>
              {compareQuestionType(question.question_type, FormEnum.TEXT) &&
                question.question_no.toLowerCase() !== FormEnum.NOTES && (
                  <Controller
                    name={question.question_no}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        value={value}
                        onChange={(e) => {
                          onChange(e)
                          handleSetProgress()
                        }}
                        className='pl-4 !text-sm h-fit p-3 lg:text-base w-full rounded-sm focus:!ring-transparent'
                        placeholder='Enter your answer...'
                      />
                    )}
                  />
                )}
              {compareQuestionType(question.question_type, FormEnum.TEXT) &&
                compareQuestionType(question.question_no, FormEnum.NOTES) && (
                  <Controller
                    name={question.question_no}
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        className='pl-4 min-h-16 resize-none !text-sm p-3 lg:text-base w-full rounded-sm focus:!ring-transparent'
                        placeholder='Enter your answer...'
                      />
                    )}
                  />
                )}
              {compareQuestionType(question.question_type, FormEnum.DATE) && (
                <Controller
                  name={question.question_no}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      type='date'
                      value={value ? checkDateValue(value) : ''}
                      onChange={(e) => {
                        const newVal = e.target.value
                        onChange(formattedDate(newVal))
                        handleSetProgress()
                      }}
                      className='pl-4 !text-sm h-fit p-3 lg:text-base w-full rounded-sm focus:!ring-transparent'
                    />
                  )}
                />
              )}

              {/* Question type with a text limit. */}
              {textLimitQuestionType && (
                <Controller
                  name={question.question_no}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      maxLength={textLimitQuestionType}
                      value={limitText(value, textLimitQuestionType)}
                      onChange={(e) => {
                        onChange(e)
                        handleSetProgress()
                      }}
                      className='pl-4 !text-sm h-fit p-3 lg:text-base w-full rounded-sm focus:!ring-transparent'
                      placeholder='Enter your answer... '
                    />
                  )}
                />
              )}

              {/* Float and Float:number */}
              {floatIntegerQsType &&
                compareQuestionType(floatIntegerQsType, FormEnum.FLOAT) && (
                  <Controller
                    name={question.question_no}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        maxLength={
                          floatIntegerLimit ? floatIntegerLimit : undefined
                        }
                        value={value}
                        className='!text-sm h-fit p-3 lg:text-base w-full rounded-sm focus:!ring-transparent'
                        placeholder='Enter a number... '
                        onChange={(e) => {
                          handleFloatChange(onChange, e.target.value)
                          handleSetProgress()
                        }}
                      />
                    )}
                  />
                )}

              {/* Integer and Integer:number */}
              {floatIntegerQsType &&
                compareQuestionType(floatIntegerQsType, FormEnum.INTEGER) && (
                  <Controller
                    name={question.question_no}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        type='number'
                        value={value}
                        className='!text-sm h-fit p-3 lg:text-base w-full rounded-sm focus:!ring-transparent'
                        placeholder='Enter a number...'
                        onChange={(e) => {
                          // maxLength is not working on type='number'
                          if (
                            !floatIntegerLimit ||
                            e.target.value.length <= floatIntegerLimit
                          ) {
                            onChange(e)
                          }
                          handleSetProgress()
                        }}
                      />
                    )}
                  />
                )}

              {compareQuestionType(question.question_type, FormEnum.MCQO) && (
                <Controller
                  name={question.question_no}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      value={value}
                      question={question}
                      index={index}
                      onChange={onChange}
                      handleSetProgress={handleSetProgress}
                      handleDependentFromDateInput={
                        handleDependentFromDateInput
                      }
                    />
                  )}
                />
              )}
              {compareQuestionType(question.question_type, FormEnum.MCQ) && (
                <Controller
                  name={question.question_no}
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      value={value}
                      disabled={shouldDisableAnswer(name)}
                      onValueChange={(val) => {
                        onChange(val)
                        handleMCQIFValueChange(question, val, index)
                        handleDependentFromDateInput(
                          question.question_type,
                          val,
                          index
                        )
                        handleSetProgress()
                      }}
                    >
                      <SelectTrigger className='pl-4 w-full text-sm text-left'>
                        <SelectValue
                          className='text-sm placeholder:!text-xs'
                          placeholder='Select answer'
                        />
                      </SelectTrigger>
                      <SelectContent className='absolute w-auto min-w-full max-h-40 lg:max-h-fit overflow-y-auto'>
                        <SelectGroup>
                          {question.options?.map((item, index) => (
                            <SelectItem
                              className='px-3 py-2 whitespace-normal break-words'
                              key={index}
                              value={String(item.option)}
                            >
                              {item.option} - {item.option_description}
                            </SelectItem>
                          ))}
                          <SelectItem
                            className='hidden px-3 py-2 whitespace-normal break-words'
                            value={FormEnum.SECTION_QUESTION_NOT_REQUIRED}
                          ></SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              )}

              {question.question_type.toLowerCase() === FormEnum.MCQIF && (
                <>
                  {question.options.some(
                    (option) => option.option.toLowerCase() === FormEnum.DATE
                  ) ? (
                    <Controller
                      name={question.question_no}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          type='date'
                          className='!text-sm h-fit p-3 lg:text-base w-full rounded-sm focus:!ring-transparent'
                          value={value ? checkDateValue(value) : ''}
                          disabled={shouldDisableAnswer(question.question_no)}
                          onChange={(e) => {
                            onChange(formattedDate(e.target.value))
                            handleSetProgress()
                          }}
                        />
                      )}
                    />
                  ) : (
                    <Controller
                      name={question.question_no}
                      control={control}
                      render={({ field: { onChange, value, name } }) => (
                        <Select
                          value={value}
                          disabled={shouldDisableAnswer(name)}
                          onValueChange={(val) => {
                            onChange(val)
                            handleSetProgress()
                          }}
                        >
                          <SelectTrigger className='pl-4 w-full text-sm text-left'>
                            <SelectValue
                              className='text-sm placeholder:!text-xs'
                              placeholder='Select answer'
                            />
                          </SelectTrigger>
                          <SelectContent className='absolute w-auto min-w-full max-h-40 lg:max-h-fit overflow-y-auto'>
                            <SelectGroup>
                              {question.options?.map((item, index) => (
                                <SelectItem
                                  className='px-3 py-2 whitespace-normal break-words'
                                  key={index}
                                  value={String(item.option)}
                                >
                                  {item.option} - {item.option_description}
                                </SelectItem>
                              ))}
                              <SelectItem
                                className='hidden px-3 py-2 whitespace-normal break-words'
                                value={FormEnum.SECTION_QUESTION_NOT_REQUIRED}
                              ></SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
                </>
              )}

              {[FormEnum.IF_DATE, FormEnum.DATEIF].includes(
                question.question_type.toLowerCase() as FormEnum
              ) && (
                <Controller
                  name={question.question_no}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      type='date'
                      className='!text-sm h-fit p-3 lg:text-base w-full rounded-sm focus:!ring-transparent'
                      value={value ? checkDateValue(value) : ''}
                      disabled={shouldDisableAnswer(question.question_no)}
                      onChange={(e) => {
                        onChange(formattedDate(e.target.value))
                        handleSetProgress()
                      }}
                    />
                  )}
                />
              )}
            </div>
          </div>
        )
      })}
    </form>
  )
}

export default FormSectionQuestions
