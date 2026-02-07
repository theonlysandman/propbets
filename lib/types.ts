export interface Participant {
  id?: string
  name: string
  emoji?: string
  abbreviation?: string
  has_submitted?: boolean
}
export type QuestionType = 'yesno' | 'multiple_choice' | 'over_under'

export interface Question {
  id: string
  categoryId?: string
  // alternate field names used in plan/code
  category_id?: string
  type?: QuestionType
  // alternate question type field used in plan components
  question_type?: 'YES_NO' | 'MULTIPLE_CHOICE' | 'OVER_UNDER'
  prompt?: string
  question_text?: string
  question_number?: number
  choices?: string[]
  choices_list?: string[]
  threshold?: number
  options?: any
  // overUnder helper
  overUnder?: { value: number; label: string }
  correct_answer?: any
  display_order?: number
  created_at?: string
}

export interface Category {
  id: string
  title: string
  // alternate name fields
  name?: string
  emoji?: string
  description?: string
  display_order?: number
}

export interface Response {
  id: string
  participantName: string
  questionId: string
  answer: any
  createdAt: string
}

export interface Submission {
  id: string
  participantName: string
  totalScore?: number
  createdAt: string
}

export interface Database {
  participants: Participant[]
  categories: Category[]
  questions: Question[]
  responses: Response[]
  submissions: Submission[]
}
