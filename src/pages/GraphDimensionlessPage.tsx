import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,TooltipProps } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { useTableStore } from '@/stores/useTableStore';
import { useEffect, useState } from 'react';
import { useGraphDimensionlessStore } from '@/stores/useGraphDimensionlessStore';

type ChartDataPoint = {
  time: number;
  approx: number;
  original: number;
};

export const GraphDimensionlessPage = () => {
  const { getTimeArraySeconds, getYArray } = useGraphDimensionlessStore();
  const { getColumnData } = useTableStore()

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  // Получаем актуальные данные
  const time = getTimeArraySeconds();
  const approx = getYArray();
  const original = getColumnData('sigma').map(Number);

  useEffect(() => {

    const minLength = Math.min(time.length, approx.length, original.length);
    
    const data: ChartDataPoint[] = [];
    for (let i = 0; i < minLength; i++) {
      data.push({
        time: time[i],
        approx: approx[i],
        original: original[i],
      });
    }

    setChartData(data);
  }, [time, approx, original]);
  

  return (
    <div className='flex flex-col gap-15 p-10 align-center justify-center text-center'>
      <div className='font-bold text-3xl'>Безразмерный вид</div>
      <Card className="w-full max-w-5xl mx-auto">
          <CardContent>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Время t, сек', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: 'Безразмерный вид', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
              <Tooltip content={<CustomTooltip />} />
               <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  fontSize: '14px',
                  paddingTop: '20px',
                }}
                iconType="circle"
                iconSize={10}
                />
                <Line 
                  type="monotone" 
                  dataKey="approx" 
                  name="Аппроксимирующая кривая" 
                  stroke="#1f77b4" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="original" 
                  name="Прямая исходных данных" 
                  stroke="#ff7f0e" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
      </Card>
    </div>
  
  );
};

const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow">
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(6)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };