import { create } from 'zustand';

interface InputField {
  key: string;
  value: string | number
  label: string;
}

interface InputsState {
  inputs: InputField[];
}

interface InputsActions {
  setFieldValue: (key: string, value: string | number) => void;
  resetFields: () => void;
}

type InputsStore = InputsState & InputsActions;

const initialInputs: InputField[] = [
  { key: 'time_step_seconds', value: '', label: 'Шаг времени снятия показаний' },
  { key: 'x_in', value: '', label: 'Входное воздействие при t = 0' },
  { key: 'x_in_infinity', value: '', label: 'Входное воздействие при t = ∞' },
  { key: 'delay', value: '', label: 'Время запаздывания' },
];

export const useInputsStore = create<InputsStore>()(
  (set): InputsStore => ({
    inputs: initialInputs,

    setFieldValue: (key, value) =>
      set((state) => ({
        inputs: state.inputs.map((input) =>
          input.key === key ? { ...input, value } : input
        ),
      })),

    resetFields: () =>
      set(() => ({
        inputs: initialInputs.map((input) => ({ ...input, value: '' })),
      })),
  })
);