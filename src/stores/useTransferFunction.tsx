import { create } from 'zustand';

type F = {
  F1: number | string | null
  F2: number | string | null
  F3: number | string | null
  k: number | string | null
  D: number | string | null
};

type FActions = {
  updateF: (f1: number | string | null, f2: number | string | null, f3: number | string | null, k: number | string | null, D: number | string | null) => void;
};

export const useTransferFunction = create<F & FActions>()((set) => ({
  F1: '',
  F2: '',
  F3: '',
  k: '',
  D: '',

  updateF: (f1, f2, f3, k, d) => {
    set({ F1: f1, F2: f2, F3: f3, k, D: d });
  },
}));