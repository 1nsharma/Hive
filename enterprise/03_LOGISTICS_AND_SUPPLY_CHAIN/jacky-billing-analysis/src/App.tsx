/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { Download, LayoutDashboard, Table as TableIcon, FileText, Truck, CircleDollarSign, RotateCcw, Users } from 'lucide-react';
import { getVehicleSummary, initialBillingData, formatCurrency, BillRecord } from './data';
import { exportToCSV } from './exportUtils';
import AnalysisTable from './components/AnalysisTable';
import BillsTable from './components/BillsTable';
import Chart from './components/Chart';
import UploadBill from './components/UploadBill';
import CrmTab from './components/CrmTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'bills' | 'crm'>('analysis');
  const [bills, setBills] = useState<BillRecord[]>(initialBillingData);

  
  const summary = getVehicleSummary(bills);
  const totalAmount = summary.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalVehicles = summary.length;
  const totalBills = bills.length;

  const handleUploadComplete = (newBills: BillRecord[]) => {
    setBills(prev => [...newBills, ...prev]);
  };

  const handleRefresh = () => {
    // Allows reverting to initial data to "refresh"
    if(window.confirm('Reset data to initial state? This will remove uploaded bills.')) {
      setBills(initialBillingData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900">
                Jacky Billing Analysis
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <UploadBill onUploadComplete={handleUploadComplete} />
              
              <button
                onClick={() => exportToCSV(bills)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>

              <button
                onClick={handleRefresh}
                title="Reset to initial data"
                className="p-2 border border-gray-200 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CircleDollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">कुल खर्च (Total Spending)</p>
              <p className="text-2xl font-semibold text-gray-900 font-mono">
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">कुल गाड़ियाँ (Total Vehicles)</p>
              <p className="text-2xl font-semibold text-gray-900 font-mono">
                {totalVehicles}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">कुल बिल (Total Bills)</p>
              <p className="text-2xl font-semibold text-gray-900 font-mono">
                {totalBills}
              </p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
            <LayoutDashboard className="h-5 w-5 mr-2 text-gray-500" />
            Top Spending Vehicles (Top 10)
          </h2>
          <Chart summary={summary} />
        </div>

        {/* Tabs and Data Tables */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors flex items-center ${
                  activeTab === 'analysis'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                विश्लेषण (Analysis)
              </button>
              <button
                onClick={() => setActiveTab('bills')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors flex items-center ${
                  activeTab === 'bills'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TableIcon className="h-4 w-4 mr-2" />
                सभी बिल (All Bills)
              </button>
              <button
                onClick={() => setActiveTab('crm')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors flex items-center ${
                  activeTab === 'crm'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                CRM (Customers)
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'analysis' && <AnalysisTable summary={summary} />}
            {activeTab === 'bills' && <BillsTable bills={bills} />}
            {activeTab === 'crm' && <CrmTab />}
          </div>
        </div>
      </main>
    </div>
  );
}
