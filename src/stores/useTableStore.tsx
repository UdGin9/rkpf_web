import { create } from 'zustand';

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
  rows: RowData[];
  updateCell: (id: number, field: keyof RowData, value: string) => void;
  getColumnData: (field: StringFields) => string[];
  updateColumn: (field: keyof RowData, values: string[]) => void;
};


export const useTableStore = create<TableState>((set, get) => ({
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
