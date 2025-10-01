import { Button } from "@/components/ui/button";
import { TableData } from "@/components/InputDataPage/table/table";
import { Input } from "@/components/ui/input";

export const InputDataPage = () => {
  return (
    <div className="p-4 max-w-6xl mx-auto gap-4 flex flex-col">
      <h2 className="text-2xl font-bold text-center mb-6">Вводные данные</h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
          <TableData/>
      </div>
      <Input type='text' placeholder="Шаг времени снятия показаний"></Input>
      <Input type='text' placeholder="Входное воздействие"></Input>
      <Input type='text' placeholder="Входное воздействие при t = 0"></Input>
      <Input type='text' placeholder="Входное воздействие при t = ∞"></Input>
      <Input type='text' placeholder="Время запаздывания"></Input>
      <Button variant='outline'>Рассчитать</Button>
    </div>
  );
};