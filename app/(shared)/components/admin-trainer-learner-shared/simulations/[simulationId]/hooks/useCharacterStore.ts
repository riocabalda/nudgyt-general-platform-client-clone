import { create } from 'zustand'

type CharacterState = {
  isCharacterInitialized: boolean
  selectedPersonalityId: string | null
  isSelectionEnabled: boolean
  charactersCount: number
}

type CharacterAction = {
  setCharacterInitialized: (state: boolean) => void
  setCharactersCount: (count: number) => void
  setSelectedPersonalityId: (id: string | null) => void
  enableSelection: () => void
  disableSelection: () => void
  reset: () => void
}

const defaultState: CharacterState = {
  isCharacterInitialized: false,
  selectedPersonalityId: null,
  isSelectionEnabled: true,
  charactersCount: 0
}

const useCharacterStore = create<CharacterState & CharacterAction>((set) => ({
  ...defaultState,
  setCharacterInitialized: (state: boolean) =>
    set(() => ({ isCharacterInitialized: state })),
  setCharactersCount: (count: number) =>
    set(() => ({ charactersCount: count })),
  setSelectedPersonalityId: (id) => set({ selectedPersonalityId: id }),
  enableSelection: () => set({ isSelectionEnabled: true }),
  disableSelection: () => set({ isSelectionEnabled: false }),
  reset: () => set(() => defaultState)
}))

export default useCharacterStore
