import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Email } from '@/types/email'

interface EmailState {
  emails: Email[]
  selectedEmailId: string | null
  activeCategory: string
  activeAccountId: string | null
  isLoading: boolean

  setEmails: (emails: Email[]) => void
  appendEmails: (emails: Email[]) => void
  addEmail: (email: Email) => void
  updateEmail: (id: string, updates: Partial<Email>) => void
  selectEmail: (id: string | null) => void
  setCategory: (category: string) => void
  setAccountFilter: (accountId: string | null) => void
  setLoading: (loading: boolean) => void
}

export const useEmailStore = create<EmailState>()(
  devtools(
    (set) => ({
      emails: [],
      selectedEmailId: null,
      activeCategory: 'all',
      activeAccountId: null,
      isLoading: false,

      setEmails: (emails) => set({ emails }),
      appendEmails: (newEmails) => set((state) => {
        const existingIds = new Set(state.emails.map((e) => e.id))
        const unique = newEmails.filter((e) => !existingIds.has(e.id))
        return { emails: [...state.emails, ...unique] }
      }),
      addEmail: (email) => set((state) => {
        if (state.emails.some((e) => e.id === email.id)) return state
        return { emails: [email, ...state.emails] }
      }),
      updateEmail: (id, updates) => set((state) => ({
        emails: state.emails.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        ),
      })),
      selectEmail: (id) => set({ selectedEmailId: id }),
      setCategory: (category) => set({ activeCategory: category }),
      setAccountFilter: (accountId) => set({ activeAccountId: accountId }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    { name: 'email-store' }
  )
)
