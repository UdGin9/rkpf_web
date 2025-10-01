import { create } from 'zustand'

type StateRoute = {
    currentRoute: string,
}

type ActionRoute = {
    updateCurrentRoute: (currentTitle: StateRoute['currentRoute']) => void
}

export const useNavigationStore = create<StateRoute & ActionRoute>((set) => ({
    currentRoute: 'Главная',
    updateCurrentRoute: (currentRoute) => set(() => ({ currentRoute: currentRoute })),
}))
