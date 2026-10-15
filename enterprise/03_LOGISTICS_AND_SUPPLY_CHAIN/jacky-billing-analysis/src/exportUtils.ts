import { BillRecord, getVehicleSummary } from './data';

export function exportToCSV(bills: BillRecord[]) {
  const summary = getVehicleSummary(bills);
  
  let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
  
  // Sheet 1: Summary
  csvContent += "गाड़ियों का कुल खर्च (Total Spending per Vehicle)\n";
  csvContent += "गाड़ी नंबर / नाम,कुल खर्च (₹)\n";
  summary.forEach(row => {
    // Quote string to handle commas
    const name = `"${row.vehicleName.replace(/"/g, '""')}"`;
    csvContent += `${name},${row.totalAmount}\n`;
  });
  
  csvContent += "\n\n";
  
  // Sheet 2: All Bills
  csvContent += "सभी बिल (All Bills)\n";
  csvContent += "तारीख,गाड़ी नंबर / नाम,विवरण (Particulars),राशि (Amount),स्थिति / हस्ताक्षर\n";
  
  bills.forEach(row => {
    const date = `"${row.date}"`;
    const name = `"${row.vehicleName.replace(/"/g, '""')}"`;
    const particulars = `"${row.particulars.replace(/"/g, '""')}"`;
    const status = `"${row.status.replace(/"/g, '""')}"`;
    
    csvContent += `${date},${name},${particulars},${row.amount},${status}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Jacky_Billing_Analysis.csv");
  document.body.appendChild(link);
  
  link.click();
  document.body.removeChild(link);
}
