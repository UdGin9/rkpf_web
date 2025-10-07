import { create } from 'zustand';

type F = {
  F1: number | string;
  F2: number | string;
  F3: number | string;
  k: number | string;
};

type FActions = {
  updateF: (f1: number | string, f2: number | string, f3: number | string, k: number | string) => void;
  getF: () => F;
};

export const useTransferFunction = create<F & FActions>()((set, get) => ({

  F1: '',
  F2: '',
  F3: '',
  k: '',

  updateF: (f1, f2, f3, k) => {
    set({ F1: f1, F2: f2, F3: f3, k:k });
  },

  getF: () => {
    return get();
  },
}));