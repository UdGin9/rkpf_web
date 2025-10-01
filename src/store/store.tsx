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


export type RowData = {
  id: number;
  rowData: string;
  sigma: string;
  oneMinusSigma: string;
  theta: string;
  oneMinusTheta: string;
  product: string;
};

type TableState = {
  rows: RowData[];
  updateCell: (id: number, field: keyof RowData, value: string) => void;
};

export const useTableStore = create<TableState>((set) => ({
  rows: Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    rowData: "",
    sigma: "",
    oneMinusSigma: "",
    theta: "",
    oneMinusTheta: "",
    product: "",
  })),

  updateCell: (id, field, value) => {
    set((state) => ({
      rows: state.rows.map((row) =>
        row.id === id
          ? { ...row, [field]: value }
          : row
      ),
    }));
  },
}));