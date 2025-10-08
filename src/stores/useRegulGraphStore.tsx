import { create } from 'zustand';

interface ChartDataState {
  timeArrayRegul: number[];
  dataArray: number[];
  setChartData: (time: number[], data: number[]) => void;
}

export const useRegulGraphStore = create<ChartDataState>((set) => ({
  timeArrayRegul: [],
  dataArray: [],

  setChartData: (time, data) =>
    set({
      timeArrayRegul: time,
      dataArray: data,
    }),

}));