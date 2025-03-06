import React from 'react'
import { FormEnum, TransformedQuestion } from '../../types/simulationFormTypes'

function QuestionItem({ question }: { question: TransformedQuestion }) {
  return (
    <>
      <h3 className='flex text-base text-foreground-800 font-medium'>
        {question.question_no.toLowerCase() !== FormEnum.NOTES && (
          <span className='mr-1'>{question.question_no}.</span>
        )}
        <span>{question.question_title}</span>
      </h3>
      {question?.question_description && (
        <p className='text-sm italic text-muted-foreground mt-2 ml-5'>
          {question?.question_description}
        </p>
      )}
    </>
  )
}

export default QuestionItem
