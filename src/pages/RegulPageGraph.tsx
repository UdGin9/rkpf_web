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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const RegulPageGraph = () => {
  const { timeArrayRegul, dataArray } = useRegulGraphStore();

  const chartData =
    timeArrayRegul.length > 0 && dataArray.length > 0
      ? timeArrayRegul.map((t, index) => ({
          time: Number(t.toFixed(2)),
          value: Number(dataArray[index]?.toFixed(4)) || 0,
        }))
      : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>График работы регулятора</CardTitle>
      </CardHeader>
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
                />
                <YAxis
                  label={{
                    value: 'Выход',
                    angle: -90,
                    position: 'insideLeft',
                  }}
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
  );
};