import { create } from 'zustand';

type conturType =
  | 'Давление'
  | 'Расход'
  | 'Уровень'
  | 'Качественные показатели'
  | 'Температура';

type LevelSubtype =
  | 'Промежуточная емкость'
  | 'Емкость хранения'
  | 'Сепаратор'
  | 'Испаритель'
  | 'Конденсатор'
  | 'Колонна';

interface RegulStoreState {

  conturType: conturType | null

  levelSubtype: LevelSubtype | null

  setConturType: (type: conturType) => void

  setLevelSubtype: (subtype: LevelSubtype) => void

  getFullConturName: () => string | null

  resetLevelSubtype: () => void
}

export const useConturStore = create<RegulStoreState>((set, get) => ({
  conturType: null,
  levelSubtype: null,

  setConturType: (type) =>
    set({
      conturType: type,
      levelSubtype: type === 'Уровень' ? get().levelSubtype : null,
    }),

  setLevelSubtype: (subtype) =>
    set({ levelSubtype: subtype }),

  getFullConturName: () => {
    const { conturType, levelSubtype } = get();
    if (conturType === 'Уровень') {
      return levelSubtype;
    }
    return conturType;
  },
  resetLevelSubtype: () => set({ levelSubtype: null }),
}));