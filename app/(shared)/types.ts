import { User } from './services/userService'
import { Personality } from '../[organization]/trainer/services/create/hooks/useServiceStore'
import { TranscriptType as LearnerTranscriptType } from './services/learner/transcriptService'

export type WithPagination<T> = {
  data: T
  total: number
  last_page: number
  next_page: string | null
  prev_page: string | null
  from: number
  to: number
  current_page: number
  limit: number
  has_next_page: boolean
}

export type MetricProps = {
  title: string
  className?: string
  value?: string | number
  percentageChange?: string
  changeDirection?: 'increased' | 'decreased' | 'unchanged'
}

export type ApiResponse<T> = {
  data: T
  message: string
}

export type TabType = 'organizations' | 'trainers' | 'learners'

export enum FormEnum {
  MCQIF = 'MCQIF',
  MCQ = 'MCQ',
  MCQO = 'MCQO',
  DATE = 'Date',
  IF_DATE = 'IFDate',
  TEXT = 'text',
  TEXT_6 = 'text:6',
  NOTES = 'Notes',
  DIGIT_TEXT_9 = '9 digit text',
  ALPHA_NUMERIC_9_DIGIT = '9 digit Alpha Numeric',
  FLOAT = 'Float',
  INTEGER = 'Integer',
  MCQIF_NOT_REQUIRED = 'MCQIF_NOT_REQUIRED',
  SECTION_QUESTION_NOT_REQUIRED = 'SECTION_QUESTION_NOT_REQUIRED',
  SECTION_NOT_REQUIRED = 'SECTION_NOT_REQUIRED'
}

export type Organization = {
  _id: string
  name: string
  slug: string
  logo?: string

  created_at: string
}
export type OrganizationDisplay = Organization & {
  member_count: number
  learner_count: number
  subscription: {
    subscription_plan: {
      max_learners: number
    }
    extra_learners: number
  }
  code?: string
}

export type Access = {
  access: string
  features_html: string[]
  price?: number
  currency?: string
}

export enum TierEnum {
  BASIC = 'basic',
  ENTERPRISE = 'enterprise'
}

export type CSVColumns = {
  [key: string]: string | number | null
}

export enum ServiceTypeEnum {
  BASIC = 'BASIC',
  MULTI_LEVEL = 'MULTI-LEVEL',
  SPECIAL = 'SPECIAL'
}

export type Service = {
  id: string // Assuming _id is a string
  title: string
  cover_image: string
  description: string
  is_published: boolean
  start_at: string
  end_at: string
  creator: {
    fullname: string
    organization: string
    user_type: 'Trainer' | 'Admin' // Assuming these are the only two user types
  }
  character: {
    avatar: string
  }
  environment: {
    image: string
  }
  last_paused_at: string // Assuming this is a string, adjust if it's a Date
  created_at: string // Assuming this is a string, adjust if it's a Date
  service_level: {
    title: string
    description: string
    is_published: boolean
    last_attempt: string // Assuming this is a string, adjust if it's a Date
  }
}

export type Plan = {
  _id: string
  features_html: string[]
  price: number
  currency: string
}

export type AnnotatedPlan = Plan & {
  type?: string
  is_current: boolean
}

export type Pagination = {
  from?: number
  to?: number
  total?: number
  prev?: string
  next?: string
  currentPage: number
}

export type Character = {
  _id: string
  avatar: Avatar
  audio: string
  name: string
  voice_type: string
  languages: string[]
  backstory: string
  hidden_backstory: string
  personality_id: string
  personality: Personality
  deleted_at: Date
}

export type Avatar = {
  _id: string
  image_path: string
  mesh_id: string
  gender: string
  deleted_at: string
}

export type Environment = {
  _id: string
  image: string
  location: string
  description: string
  environment_id: string
  available_characters: string[]
  maximum_characters: number
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

export type TranscriptLanguageType = {
  name: string
  code: string
}

export type FromToType = 'character' | 'user'

export type TranscriptType = {
  _id: string
  from: Pick<User, 'full_name'> | Pick<Character, 'name'> | null
  from_type: FromToType
  to?: Pick<User, 'full_name'> | Pick<Character, 'name'> | null
  to_type?: FromToType
  simulation_id: string
  dialogue_value: string
  comments: TranscriptComment[]
}

export type MessageType = {
  sender: LearnerTranscriptType['from']
  recipient: LearnerTranscriptType['to']
  from: string
  text: string
}

export enum ConvaiResponseEnum {
  CHARACTER = 'character',
  USER = 'user',
  AI = 'AI'
}

export type CharacterType = {
  avatar: Avatar
  name: string
  age: string
  voice_type: string
  languages: string[]
  backstory: string
  hidden_backstory: string

  personality_id: string
  personality: Personality
  organization: string
  creator: string
  deleted_at: Date
  birthday?: string
  gender: string
}

export type SimulationDisplayScores = {
  overall: {
    score: number
    percentage: number
    total: number
  }
  sections: {
    name: string
    score: number
    showAnswers: boolean
    showScore: boolean
    total: number
  }[]
}

export type SoftSkillsData = {
  summary: string
  ratings: {
    skill: string
    score: number
    total: number
    description: string
    importance: string
    assessment: string[]
  }[]
}

export type SimulationServiceDetails = {
  simulationId: string
  startedAt: string
  endedAt: string
  serviceType: string
  service: {
    _id: string
    cover_image: string
    title: string
    description: string
  }
  service_level: {
    _id: string
    title: string
    description: string
  }
  description: string
}

export type SimulationDates = {
  dates: {
    id: string
    date: string
    isSelected: boolean
  }[]
  previousAttempt?: {
    _id: string
    started_at: string
    ended_at: string
  }
  nextAttempt?: {
    _id: string
    started_at: string
    ended_at: string
  }
}

export type SimulationDetails = {
  hasFormQuestions: boolean
  learner: {
    _id: string
    fullname: string
    role: string[]
  }
  displayScores: SimulationDisplayScores
  totalCompletedTime: string
  characters: CharacterType[]
  environment: Environment
  isCompetent: boolean
  formQuestions: any[]
  formAnswers: any[]
  transcriptSummary: string
}

export type SoftSkillRating = {
  skill: string
  score: number
  total: number
  description: string
  importance: string
  assessment: string[]
}

export type TranscriptComment = {
  _id: string
  from_type: string
  from: Pick<User, '_id' | 'full_name' | 'email'> | null
  text: string

  created_at: string
  updated_at: string
}

export enum Role {
  ADMIN = 'admin',
  TRAINER = 'trainer',
  LEARNER = 'learner'
}
