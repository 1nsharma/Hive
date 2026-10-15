import React, { useState } from 'react';
import { Users, Phone, Truck, Plus, Check, X } from 'lucide-react';
import { CustomerRecord, initialCustomers } from '../crmData';

export default function CrmTab() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(initialCustomers);
  const [isAdding, setIsAdding] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<CustomerRecord>>({
    status: 'Active'
  });

  const handleAdd = () => {
    if (!newCustomer.name) return;
    
    const customer: CustomerRecord = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCustomer.name || '',
      phone: newCustomer.phone || '',
      vehicles: newCustomer.vehicles || '',
      status: newCustomer.status as 'Active' | 'Pending Payment' | 'Inactive' || 'Active',
      notes: newCustomer.notes || ''
    };

    setCustomers([customer, ...customers]);
    setIsAdding(false);
    setNewCustomer({ status: 'Active' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          Customer Relationship Management (CRM)
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
        >
          {isAdding ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
          {isAdding ? 'Cancel' : 'Add Customer'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Customer Name</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Rahul Singh"
              value={newCustomer.name || ''}
              onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="+91-..."
              value={newCustomer.phone || ''}
              onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Vehicle Numbers</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. UP78 AB 1234"
              value={newCustomer.vehicles || ''}
              onChange={e => setNewCustomer({...newCustomer, vehicles: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              value={newCustomer.status || 'Active'}
              onChange={e => setNewCustomer({...newCustomer, status: e.target.value as any})}
            >
              <option value="Active">Active</option>
              <option value="Pending Payment">Pending Payment</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional information..."
              value={newCustomer.notes || ''}
              onChange={e => setNewCustomer({...newCustomer, notes: e.target.value})}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end">
            <button 
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-sm"
            >
              <Check className="h-4 w-4 mr-2" />
              Save Customer
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-4 py-3">Customer Name</th>
              <th scope="col" className="px-4 py-3">Contact Details</th>
              <th scope="col" className="px-4 py-3">Associated Vehicles</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr 
                key={customer.id} 
                className={`border-b border-gray-200 last:border-0 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
              >
                <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {customer.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-1 text-gray-400" />
                    {customer.phone || 'N/A'}
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-600">
                  <div className="flex items-center">
                    <Truck className="h-3 w-3 mr-1 text-gray-400" />
                    {customer.vehicles || 'N/A'}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                    customer.status === 'Pending Payment' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-500 text-xs max-w-[200px] truncate" title={customer.notes}>
                  {customer.notes || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
