import React from 'react';
import { formatCurrency } from '../data';

interface AnalysisTableProps {
  summary: { vehicleName: string; totalAmount: number }[];
}

export default function AnalysisTable({ summary }: AnalysisTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-white uppercase bg-blue-600">
          <tr>
            <th scope="col" className="px-6 py-4">
              गाड़ी नंबर / नाम (Vehicle Number / Name)
            </th>
            <th scope="col" className="px-6 py-4 text-right">
              कुल खर्च (Total Spending)
            </th>
          </tr>
        </thead>
        <tbody>
          {summary.map((row, index) => (
            <tr 
              key={index} 
              className={`border-b border-gray-200 last:border-0 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {row.vehicleName}
              </td>
              <td className="px-6 py-4 text-right font-mono">
                {formatCurrency(row.totalAmount)}
              </td>
            </tr>
          ))}
          <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
            <td className="px-6 py-4 text-gray-900 text-right">
              Grand Total:
            </td>
            <td className="px-6 py-4 text-right font-mono text-blue-700">
              {formatCurrency(summary.reduce((sum, item) => sum + item.totalAmount, 0))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
