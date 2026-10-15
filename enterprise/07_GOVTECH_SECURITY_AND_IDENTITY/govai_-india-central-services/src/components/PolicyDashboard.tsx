import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { govService } from '../services/govService';

export const PolicyDashboard: React.FC = () => {
  const data = govService.getMockPolicyData();

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gov-primary">Policy Implementation Tracking</h3>
        <span className="text-xs text-slate-400 uppercase tracking-wider">Real-Time Data</span>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={120} 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="current" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.current > 80 ? '#28a745' : '#ff9933'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {data.map((item, idx) => (
          <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-[10px] text-slate-400 uppercase font-bold">{item.name}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gov-primary">{item.current}</span>
              <span className="text-[10px] text-slate-500">{item.unit}</span>
            </div>
            <div className="w-full h-1 bg-slate-200 mt-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gov-accent" 
                style={{ width: `${(item.current / item.target) * 100}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
