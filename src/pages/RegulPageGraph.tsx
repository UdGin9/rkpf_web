import { useRegulGraphStore } from '@/stores/useRegulGraphStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card'
import { useRegulStore } from '@/stores/useRegulStore'
import { renderToString } from 'katex'
import { Input } from '@/components/ui/input';
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
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useTableStore } from '@/stores/useTableStore';
import { useReCalculate } from '@/api/useReCalculate';
import { useTransferFunction } from '@/stores/useTransferFunction';
import { useInputsStore } from '@/stores/useInputsStore';

export const RegulPageGraph = () => {
  const { timeArrayRegul, dataArray } = useRegulGraphStore()
  const { getColumnData } = useTableStore()
  const { regulatorType, Kp, Ki, Kd, setParams } = useRegulStore()
  const [ stateP, setStateP ] = useState<number | null | string>(Kp)
  const [ stateI, setStateI ] = useState<number | null | string>(Ki)
  const [ stateD, setStateD ] = useState<number | null | string>(Kd)
  const [ time, setTime ] = useState<number | null | string>()
  const { setChartData } = useRegulGraphStore()
  const delay = useInputsStore(state => {
  const field = state.inputs.find(input => input.key === 'delay');
  return field ? Number(field.value) : null; });
  const { F1, F2, k, } = useTransferFunction()
 
  const onChangeP = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setStateP(value);
    }
  };

  const onChangeI = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setStateI(value);
    }
  };

  const onChangeD = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setStateD(value);
    }
  }

  const onChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setTime(value);
    }
  }

  const response = useReCalculate()

  const chartData =
    timeArrayRegul.length > 0 && dataArray.length > 0
      ? timeArrayRegul.map((t, index) => ({
          time: Number(t.toFixed(2)),
          value: Number(dataArray[index]?.toFixed(4)) || 0,
        }))
      : [];

    let formula = '';
    


    if (regulatorType === 'P') {
        formula = `W(s) = K_p = ${Kp}`;
    } else if (regulatorType === 'PI') {
        formula = `W(s) = K_p + \\frac{K_i}{s} = ${Kp} + \\frac{${Ki}}{s}`;
    } else if (regulatorType === 'PID') {
        formula = `W(s) = K_p + \\frac{K_i}{s} + K_d s = ${Kp} + \\frac{${Ki}}{s} + ${Kd}s`;
    }
  
  const handleSubmit = () => {
    const data = getColumnData('data')
        const payload = {
          data,
          F1,
          F2,
          time: Number(time),
          delay,
          k,
          Kp: stateP,
          Ki: stateI,
          Kd: stateD,
          regulatorType,
        };
    response.mutate(payload)
    setParams({Kp:stateP, Ki: stateI, Kd: stateD})
  };
    useEffect(() => {
        if (response.isSuccess && response.data) {
          const {
            time_array_regul,
            data_array,
          } = response.data;
          
      if (time_array_regul && data_array) {
        setChartData(time_array_regul, data_array);
      }
        }
      }, [
        response.isSuccess,
        response.data,
      ]);

  return (
    <div className="p-10 flex flex-col gap-10 text-center">
      <div className="text-3xl font-bold text-center">Регулятор</div>
      <Card>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Нет данных. Выполните расчёт.
            </div>
          ) : (
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    label={{
                      value: 'Время, с',
                      position: 'insideBottomRight',
                      offset: -5,
                    }}
                    tickFormatter={(value) => value.toFixed(1)}
                    interval={50}
                  />
                  <YAxis
                    label={{
                      value: 'Выход',
                      angle: -90,
                      position: 'insideLeft',
                    }}
                    tickCount={10}
                  />
                  <Tooltip
                    formatter={(value: number) => [value.toFixed(4), 'Значение']}
                    labelFormatter={(label) => `Время: ${label} с`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Переходная характеристика"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="text-3xl font-bold text-center">Численные настройки регулятора</div>
          <div
          className="text-xl"
          dangerouslySetInnerHTML={{
          __html: renderToString(formula, { throwOnError: false, displayMode: true }),
          }}
        />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">
            Ручная поднастройка регулятора
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
                Вы хотите вручную настроить регулятор
            </AlertDialogTitle>
            <AlertDialogDescription> 
              {regulatorType == 'PID' ? 
              <div className='flex flex-col gap-5 pt-5'>
                  <Input value={stateP || ''} placeholder='Введите пропорциональный коэффициент - Kp' onChange={onChangeP}></Input>
                  <Input value={stateI || ''} placeholder='Введите интегральный коэффициент - Ki' onChange={onChangeI}></Input>
                  <Input value={stateD || ''} placeholder='Введите диффиренциирущий коэффициент - Kd' onChange={onChangeD}></Input>
                  <Input value={time || ''} placeholder='Введите время наблюдения' onChange={onChangeTime}></Input>
              </div> :
              <>
              </> 
              }
              {regulatorType == 'PI' ? 
              <div className='flex flex-col gap-5 pt-5'>
                  <Input value={stateP || ''} placeholder='Введите пропорциональный коэффициент - Kp' onChange={onChangeP}></Input>
                  <Input value={stateI || ''} placeholder='Введите интегральный коэффициент - Ki' onChange={onChangeI}></Input>
                  <Input value={time || ''} placeholder='Введите время наблюдения' onChange={onChangeTime}></Input>
              </div> :
              <>
              </> 
              }
              {regulatorType == 'P' ? 
              <div className='flex flex-col gap-5 pt-5'>
                  <Input value={stateP || ''} placeholder='Введите пропорциональный коэффициент - Kp' onChange={onChangeP}></Input>
                  <Input value={time || ''} placeholder='Введите время наблюдения' onChange={onChangeTime}></Input>
              </div> :
              <>
              </> 
              }
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Отмена
            </AlertDialogCancel>

            <AlertDialogAction onClick={handleSubmit}>
              Рассчитать
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};