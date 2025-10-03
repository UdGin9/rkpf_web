import { create } from 'zustand';

type GraphDimensionlessState = {
  time_array_seconds: number[];
  y: number[];
};

type GraphDimensionlessActions = {
  updateTimeArraySeconds: (data: number[]) => void;
  updateYArray: (data: number[]) => void;
  getTimeArraySeconds: () => number[];
  getYArray: () => number[];
};


export const useGraphDimensionlessStore = create<GraphDimensionlessState & GraphDimensionlessActions >()((set, get) => ({

  time_array_seconds: [],
  y: [],

  updateTimeArraySeconds: (data) => {
    set({ time_array_seconds: data });
  },

  updateYArray: (data) => {
    set({ y: data });
  },

  getTimeArraySeconds: () => {
    return get().time_array_seconds;
  },

  getYArray: () => {
    return get().y;
  },
}));