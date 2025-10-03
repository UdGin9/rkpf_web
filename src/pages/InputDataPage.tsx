import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TableData } from "@/components/InputDataPage/table/table";
import { Input } from "@/components/ui/input";
import { useCalculate } from "@/api/useCalculate";
import { useTableStore } from "@/store/store";
import { useEffect } from "react";

export const InputDataPage = () => {

  const [inputs, setInputs] = useState([
    { key: 'time_step_seconds', value: '', label: 'Шаг времени снятия показаний' },
    { key: 'x_in', value: '', label: 'Входное воздействие' },
    { key: 'x_in_infinity', value: '', label: 'Входное воздействие при t = 0' },
    { key: 'x_out_infinity', value: '', label: 'Входное воздействие при t = ∞' },
    { key: 'delay', value: '', label: 'Время запаздывания' },
  ]);

  const { getColumnData, updateColumn } = useTableStore()
 
  const handleChange = (index: number, value: string) => {
    const newInputs = [...inputs]
    const isValidInput = /^$|^[0-9]*\.?[0-9]*$/.test(value)
    if (!isValidInput) return
    newInputs[index].value = value
    setInputs(newInputs)
  };

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
      const { array_2, array_3, array_4, array_5, array_6 } = response.data;

      // Проверим, что данные пришли
      if (array_2 && array_3 && array_4 && array_5 && array_6) {
        updateColumn('sigma', array_2.map(String));
        updateColumn('oneMinusSigma', array_3.map(String));
        updateColumn('theta', array_4.map(String));
        updateColumn('oneMinusTheta', array_5.map(String));
        updateColumn('product', array_6.map(String));
      }
    }
  }, [response.isSuccess, response.data, updateColumn]);

  return (
    <div className="p-4 max-w-6xl mx-auto gap-4 flex flex-col">
      <h2 className="text-2xl font-bold text-center mb-6">Вводные данные</h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
          <TableData/>
      </div>
      {inputs.map((input, index) => (
        <>
        <div className="text-lg">{input.label}</div>
        <Input
          key={input.key}
          type="text"
          placeholder={input.label}
          value={input.value}
          onChange={(e) => handleChange(index, e.target.value)}
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