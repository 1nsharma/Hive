import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  summary: { vehicleName: string; totalAmount: number }[];
}

export default function Chart({ summary }: ChartProps) {
  // Take top 10 for better visualization
  const data = summary.slice(0, 10);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">{label}</p>
          <p className="text-blue-600 font-mono">
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 70,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="vehicleName" 
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis 
            tickFormatter={(value) => `₹${value}`}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
          <Bar 
            dataKey="totalAmount" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
