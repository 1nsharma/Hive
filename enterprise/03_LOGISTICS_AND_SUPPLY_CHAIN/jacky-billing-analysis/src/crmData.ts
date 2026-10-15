export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  vehicles: string;
  status: 'Active' | 'Pending Payment' | 'Inactive';
  notes: string;
}

export const initialCustomers: CustomerRecord[] = [
  {
    id: '1',
    name: 'Nitin / राकेश',
    phone: '+91-9876543210',
    vehicles: 'UP78 JT 1744, 1356',
    status: 'Pending Payment',
    notes: 'Frequently has udhaar (credit) for kamani work.'
  },
  {
    id: '2',
    name: 'Anil',
    phone: '+91-9876543211',
    vehicles: 'UP78 GT 2887',
    status: 'Active',
    notes: 'Paid 1000 recently for dashboard work.'
  },
  {
    id: '3',
    name: 'Ashish',
    phone: '+91-9876543212',
    vehicles: 'UP78 GT 5559',
    status: 'Active',
    notes: 'Manages Dr. Shalu vehicles.'
  },
  {
    id: '4',
    name: 'Aamir',
    phone: '+91-9876543213',
    vehicles: '8691, UP-32 ZN 4979',
    status: 'Active',
    notes: 'Regular payments clear.'
  },
  {
    id: '5',
    name: 'जगदीश कमानी (Jagdish)',
    phone: '+91-9876543214',
    vehicles: '9435',
    status: 'Active',
    notes: 'Kamani specialist vendor/customer.'
  }
];
