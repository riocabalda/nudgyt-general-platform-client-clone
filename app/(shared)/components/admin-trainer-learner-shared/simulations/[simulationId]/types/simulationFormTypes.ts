export enum FormEnum {
  MCQIF = 'mcqif',
  MCQ = 'mcq',
  MCQO = 'mcqo',
  DATE = 'date',
  IF_DATE = 'ifdate',
  DATEIF = 'dateif',
  TEXT = 'text',
  NOTES = 'notes',
  FLOAT = 'float',
  INTEGER = 'integer',
  MCQIF_NOT_REQUIRED = 'MCQIF_NOT_REQUIRED',
  SECTION_QUESTION_NOT_REQUIRED = 'SECTION_QUESTION_NOT_REQUIRED',
  SECTION_NOT_REQUIRED = 'SECTION_NOT_REQUIRED',
  ENABLEIF = 'ENABLEIF',
  DISABLEIF = 'DISABLEIF'
}

export type Option = {
  _id: string
  option: string
  option_description: string
  pre_fill: string
}

export type TransformedQuestion = {
  _id: string
  section: string
  question_no: string
  question_type: string
  question_title: string
  question_description?: string
  correct_answer: string
  options: Option[]
  pre_fill: string
}

export type TransformedSection = {
  section: string
  questions: TransformedQuestion[]
}

export type ExtractedData = {
  text: string
  limit: number | null
}

export enum Role {
  ADMIN = 'admin',
  TRAINER = 'trainer',
  LEARNER = 'learner'
}
