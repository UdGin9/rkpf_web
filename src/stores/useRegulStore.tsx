import { create } from 'zustand';

type RegulatorType = 'P' | 'PI' | 'PID';

interface RegulatorParamsState {

  Kp: number | null;
  Ki: number | null;
  Kd: number | null;
  regulatorType: RegulatorType | null;

  setParams: (
    params: Partial<{
      Kp: number;
      Ki: number;
      Kd: number;
      regulatorType: RegulatorType;
    }>
  ) => void;

}

export const useRegulStore = create<RegulatorParamsState>((set) => ({
  Kp: null,
  Ki: null,
  Kd: null,
  regulatorType: null,

  setParams: (params) =>
    set({
      Kp: params.Kp ?? null,
      Ki: params.Ki ?? null,
      Kd: params.Kd ?? null,
      regulatorType: params.regulatorType ?? null,
    }),

  reset: () =>
    set({
      Kp: null,
      Ki: null,
      Kd: null,
      regulatorType: null,
    }),
}));