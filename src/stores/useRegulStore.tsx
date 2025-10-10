import { create } from 'zustand';

type RegulatorType = 'P' | 'PI' | 'PID';

interface RegulatorParamsState {

  Kp: number | null | string,
  Ki: number | null | string,
  Kd: number | null | string,
  regulatorType: RegulatorType | null;

  setParams: (
    params: Partial<{
      Kp: number | null | string,
      Ki: number | null | string,
      Kd: number | null | string,
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
    set((state) => ({
      Kp: params.Kp ?? state.Kp,
      Ki: params.Ki ?? state.Ki,
      Kd: params.Kd ?? state.Kd,
      regulatorType: params.regulatorType ?? state.regulatorType,
    })),

  reset: () =>
    set({
      Kp: null,
      Ki: null,
      Kd: null,
      regulatorType: null,
    }),
}));