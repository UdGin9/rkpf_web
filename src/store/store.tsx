import { create } from 'zustand';

type StateRoute = {
  currentRoute: string;
};

type ActionRoute = {
  updateCurrentRoute: (currentTitle: StateRoute['currentRoute']) => void;
};

export type RowData = {
  id: number;
  data: string;
  sigma: string;
  oneMinusSigma: string;
  theta: string;
  oneMinusTheta: string;
  product: string;
};

type StringFields = Exclude<keyof RowData, 'id'>;

type TableState = {
  rows: RowData[]
  updateCell: (id: number, field: keyof RowData, value: string) => void
  getColumnData: (field: StringFields) => string[]
  updateColumn: (field: keyof RowData, values: string[]) => void
};

export const useNavigationStore = create<StateRoute & ActionRoute>((set) => ({
  currentRoute: 'Главная',
  updateCurrentRoute: (currentRoute) => set({ currentRoute }),
}));

export const useTableStore = create<TableState>()((set, get) => ({
  rows: Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    data: '',
    sigma: '',
    oneMinusSigma: '',
    theta: '',
    oneMinusTheta: '',
    product: '',
  })),

  updateCell: (id, field, value) => {
    set((state) => ({
      rows: state.rows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      ),
    }));
  },

  getColumnData: (field) => {
    return get().rows.map((row) => row[field]);
  },

  updateColumn: (field, values) => {
    set((state) => ({
      rows: state.rows.map((row, index) => ({
        ...row,
        [field]: values[index] ?? row[field],
      })),
    }));
  },
}));


