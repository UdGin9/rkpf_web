import { create } from 'zustand';

type RegulatorType = 'P' | 'PI' | 'PID';

interface RegulatorState {
  regulator: RegulatorType;
  setRegulator: (type: RegulatorType) => void;
}

export const useRegulStore = create<RegulatorState>((set) => ({
  regulator: 'PI',
  setRegulator: (type) => set({ regulator: type }),
}));