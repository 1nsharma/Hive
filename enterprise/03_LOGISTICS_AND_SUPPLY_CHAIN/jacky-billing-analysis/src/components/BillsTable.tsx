import React from 'react';
import { BillRecord, formatCurrency } from '../data';

interface BillsTableProps {
  bills: BillRecord[];
}

export default function BillsTable({ bills }: BillsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-4 py-3 whitespace-nowrap">तारीख (Date)</th>
            <th scope="col" className="px-4 py-3 min-w-[200px]">गाड़ी नंबर / नाम (Vehicle)</th>
            <th scope="col" className="px-4 py-3 min-w-[300px]">विवरण (Particulars)</th>
            <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">राशि (Amount)</th>
            <th scope="col" className="px-4 py-3">स्थिति (Status)</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((row, index) => (
            <tr 
              key={index} 
              className={`border-b border-gray-200 last:border-0 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
            >
              <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                {row.date}
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">
                {row.vehicleName}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {row.particulars}
              </td>
              <td className="px-4 py-3 text-right font-mono">
                {formatCurrency(row.amount)}
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">
                {row.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
