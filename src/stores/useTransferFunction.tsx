import { create } from 'zustand';

type F = {
  F1: number | string;
  F2: number | string;
  F3: number | string;
  k: number | string;
  D: number | string;
};

type FActions = {
  updateF: (f1: number | string, f2: number | string, f3: number | string, k: number | string, D: number | string) => void;
  getF: () => F;
};

export const useTransferFunction = create<F & FActions>()((set, get) => ({

  F1: '',
  F2: '',
  F3: '',
  k: '',
  D: '',

  updateF: ( f1, f2, f3, k, d ) => {
    set({ F1: f1, F2: f2, F3: f3, k:k, D: d });
  },

  getF: () => {
    return get();
  },
}));