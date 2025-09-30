import { create } from 'zustand'

type State = {
    currentRoute: string,
}

type Action = {
    updateCurrentRoute: (currentTitle: State['currentRoute']) => void
}

export const useNavigationStore = create<State & Action>((set) => ({
    currentRoute: 'Главная',
    updateCurrentRoute: (currentRoute) => set(() => ({ currentRoute: currentRoute })),
}))