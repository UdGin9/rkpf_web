import { Button } from "@/components/ui/button";
import { TableData } from "@/components/InputDataPage/table/table";
import { Input } from "@/components/ui/input";
import { useCalculate } from "@/api/useCalculate";
import { useTableStore } from "@/stores/useTableStore";
import { useEffect } from "react";
import { useGraphDimensionlessStore } from "@/stores/useGraphDimensionlessStore";
import { useInputsStore } from "@/stores/useInputsStore";
import { useTransferFunction } from "@/stores/useTransferFunction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRegulStore } from "@/stores/useRegulStore";

export const InputDataPage = () => {
  const { inputs, setFieldValue } = useInputsStore()
  const { getColumnData, updateColumn } = useTableStore()
  const { updateTimeArraySeconds, updateYArray } = useGraphDimensionlessStore()
  const { updateF } = useTransferFunction()

  const response = useCalculate()
  const { regulator } = useRegulStore()

  const handleInputChange = (key: string, rawValue: string) => {
    const isValid = /^$|^[0-9]*\.?[0-9]*$/.test(rawValue);
    if (!isValid) return;

    const value: string | number = rawValue === '' ? '' : isNaN(Number(rawValue)) ? rawValue : Number(rawValue);
    setFieldValue(key, value);
  };

  const handleSubmit = () => {
    const data = getColumnData('data');
    const payload = inputs.reduce(
      (acc, item) => ({ ...acc, [item.key]: item.value, data }),
      {}
    );
    response.mutate(payload);
  };

  useEffect(() => {
    if (response.isSuccess && response.data) {
      const { array_2, array_3, array_4, array_5, array_6, y, time_array_seconds, F1, F2, F3, k, D } = response.data;

      if (F1 && F2 && F3 && k) {
        updateF(F1, F2, F3, k, D);
      }

      if (array_2 && array_3 && array_4 && array_5 && array_6) {
        updateColumn('sigma', array_2.map(String));
        updateColumn('oneMinusSigma', array_3.map(String));
        updateColumn('theta', array_4.map(String));
        updateColumn('oneMinusTheta', array_5.map(String));
        updateColumn('product', array_6.map(String));
      }

      if (y && time_array_seconds) {
        updateTimeArraySeconds(time_array_seconds);
        updateYArray(y);
      }
    }
  }, [response.isSuccess, response.data, updateColumn, updateTimeArraySeconds, updateYArray, updateF]);

  return (
    <div className="p-4 max-w-6xl mx-auto gap-4 flex flex-col">
      <h2 className="text-3xl font-bold text-center mb-6">Вводные данные</h2>

      <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
        <TableData />
      </div>

      {response.isError && (
        <div className="text-center text-lg text-red-500">
          {response.error?.message}
        </div>
      )}

      {inputs.map((input) => (
        <div key={input.key} className="flex flex-col gap-2">
          <label className="text-lg">{input.label}</label>
          <Input
            type="text"
            placeholder={input.label}
            value={input.value === '' ? '' : String(input.value)}
            onChange={(e) => handleInputChange(input.key, e.target.value)}
          />
        </div>
      ))}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            disabled={response.isPending}
          >
            {response.isPending ? "Отправка..." : "Рассчитать"}
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              У вас выбран {regulator}-регулятор. Вы уверены, что хотите рассчитать с ним?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={response.isPending}>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={response.isPending}
            >
              {response.isPending ? "Расчёт..." : "Рассчитать"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};