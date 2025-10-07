import { Button } from "@/components/ui/button";
import { TableData } from "@/components/InputDataPage/table/table";
import { Input } from "@/components/ui/input";
import { useCalculate } from "@/api/useCalculate";
import { useTableStore } from "@/stores/useTableStore";
import { useEffect } from "react";
import { useGraphDimensionlessStore } from "@/stores/useGraphDimensionlessStore";
import { useInputsStore } from "@/stores/useInputsStore";
import { useTransferFunction } from "@/stores/useTransferFunction";

export const InputDataPage = () => {

  const { inputs, setFieldValue } = useInputsStore()

  const { getColumnData, updateColumn } = useTableStore()
  const { updateTimeArraySeconds, updateYArray } = useGraphDimensionlessStore()
  const { updateF } = useTransferFunction()


  const handleInputChange = (key: string, rawValue: string) => {

    const isValid = /^$|^[0-9]*\.?[0-9]*$/.test(rawValue);
    if (!isValid) return;

    const value: string | number = rawValue === '' ? '' : isNaN(Number(rawValue)) ? rawValue : Number(rawValue);

    setFieldValue(key, value);
  }

  const response = useCalculate()

  const handleSubmit = () => {
    const data = getColumnData('data')
    const payload = inputs.reduce(
      (acc, item) => ({ ...acc, [item.key]: item.value, data}),
      {}
    );
    response.mutate(payload);
  };

  useEffect(() => {
    if (response.isSuccess && response.data) {
      const { array_2, array_3, array_4, array_5, array_6, y, time_array_seconds, F1, F2, F3, k } = response.data;

      if (F1 && F2 && F3 && k ) {
        updateF(F1,F2,F3,k)
      }

      if (array_2 && array_3 && array_4 && array_5 && array_6) {
        updateColumn('sigma', array_2.map(String));
        updateColumn('oneMinusSigma', array_3.map(String));
        updateColumn('theta', array_4.map(String));
        updateColumn('oneMinusTheta', array_5.map(String));
        updateColumn('product', array_6.map(String));
      }
      if (y && time_array_seconds) {
        updateTimeArraySeconds(time_array_seconds)
        updateYArray(y)
      }
    
    }
  }, [response.isSuccess, response.data, updateColumn])

  return (
    <div className="p-4 max-w-6xl mx-auto gap-4 flex flex-col">
      <h2 className="text-3xl font-bold text-center mb-6">Вводные данные</h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
          <TableData/>
      </div>
      {response.isError ? <div className="flex text-center font-normal text-lg text-red-500">{response.error?.message}</div> : <></>}
      {inputs.map((input) => (
        <>
        <div className="text-lg">{input.label}</div>
        <Input
          key={input.key}
          type="text"
          placeholder={input.label}
          value={input.value}
          onChange={(e) => handleInputChange(input.key, e.target.value)}
        />
        </>
      ))}
      <Button
        variant="outline"
        onClick={handleSubmit}
        disabled={response.isPending}
      >
        {response.isPending ? "Отправка..." : "Рассчитать"}
      </Button>
    </div>
  );
};