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

export const RegulPageGraph = () => {
  const { timeArrayRegul, dataArray } = useRegulGraphStore()
  const { regulatorType, Kp, Ki, Kd } = useRegulStore()

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
    </div>
  );
};