import { create } from 'zustand'

type StoreValues = {
  mode: 'idle' | 'selecting'
  selectedTranscriptId: string | null
  commentText: string
}
type TranscriptCommentStore = StoreValues & {
  reset: () => void
  setMode: (mode: StoreValues['mode']) => void
  setSelectedTranscriptId: (
    selectedTranscriptId: StoreValues['selectedTranscriptId']
  ) => void
  setCommentText: (commentText: StoreValues['commentText']) => void
}

const initialState: StoreValues = {
  mode: 'idle',
  selectedTranscriptId: null,
  commentText: ''
}
export const useTranscriptCommentStore = create<TranscriptCommentStore>()(
  (set) => ({
    ...initialState,
    reset: () => set(initialState),
    setMode: (mode) => set({ ...initialState, mode }),
    setSelectedTranscriptId: (selectedTranscriptId) =>
      set({ selectedTranscriptId, commentText: '' }),
    setCommentText: (commentText) => set({ commentText })
  })
)

type TranscriptWithUpdatedCommentsStore = {
  id: string | null
  setId: (id: string | null) => void
}
export const useTranscriptWithUpdatedCommentsStore =
  create<TranscriptWithUpdatedCommentsStore>()((set) => ({
    id: null,
    setId: (id) => set({ id })
  }))

type OpenTranscriptCommentsStore = {
  id: string | null
  setId: (id: string | null) => void
}
export const useOpenTranscriptCommentsStore =
  create<OpenTranscriptCommentsStore>()((set) => ({
    id: null,
    setId: (id) => set({ id })
  }))
