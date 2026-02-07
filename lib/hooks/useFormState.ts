import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FormState {
  participantName: string
  answers: Record<string, string>
  currentCategoryIndex: number
  setParticipantName: (name: string) => void
  setAnswer: (questionId: string, answer: string) => void
  setCurrentCategoryIndex: (index: number) => void
  reset: () => void
  getAnswersForCategory: (questionIds: string[]) => Record<string, string>
  getCategoryProgress: (questionIds: string[]) => { answered: number; total: number }
}

export const useFormState = create<FormState>()(
  persist(
    (set, get) => ({
      participantName: '',
      answers: {},
      currentCategoryIndex: 0,

      setParticipantName: (name) => set({ participantName: name }),

      setAnswer: (questionId, answer) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer },
        })),

      setCurrentCategoryIndex: (index) => set({ currentCategoryIndex: index }),

      reset: () => set({ participantName: '', answers: {}, currentCategoryIndex: 0 }),

      getAnswersForCategory: (questionIds) => {
        const state = get()
        return questionIds.reduce((acc, id) => {
          if (state.answers[id]) {
            acc[id] = state.answers[id]
          }
          return acc
        }, {} as Record<string, string>)
      },

      getCategoryProgress: (questionIds) => {
        const state = get()
        const answered = questionIds.filter((id) => state.answers[id]).length
        return { answered, total: questionIds.length }
      },
    }),
    {
      name: 'propbets-form-storage',
    }
  )
)
