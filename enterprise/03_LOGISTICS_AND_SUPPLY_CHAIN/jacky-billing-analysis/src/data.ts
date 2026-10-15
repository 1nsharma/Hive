export interface BillRecord {
  date: string;
  vehicleName: string;
  particulars: string;
  amount: number;
  status: string;
}

export const initialBillingData: BillRecord[] = [
  {
    date: "Jun 22 2026",
    vehicleName: "UP78 GT 2887",
    particulars: "4 Pic dashboard functional Switch ON Light (400), ON High (380), Rejonration on switch (620), Rejonration off switch (450), Meter update & Kilometer setting (2000), 6 Pic dashboard made / Switch Cuppler (1800), 1 Pocket Tyebelt (350), Meter plate कपलर मेन गुलाबी (1500), Green (1500)",
    amount: 8900,
    status: "(Not available) But manage"
  },
  {
    date: "Jun 23 2026",
    vehicleName: "UP78 JT 1744 (राकेश - नितिन)",
    particulars: "1. पट्टा मेन ट्रेलर (1300), 2. राकेश पट्टा (1300) [उधार पिछला], 3. जगदीश कीलवर एक कमानी की (400), 4. पानी पीतल की (700)",
    amount: 3700,
    status: "उधार: 200 नितिन"
  },
  {
    date: "Jun 23 2026",
    vehicleName: "UP78 GT 2887",
    particulars: "Full parking repair & headlight & foglight repairing labour",
    amount: 1200,
    status: "1000 paid (Anil)"
  },
  {
    date: "Jun 23 2026",
    vehicleName: "1849",
    particulars: "1. Laptop Diagnostics charge (500), 2. Dosing valve and Nox sensor o-ring Fitting (500), 3. Crankcase line clean (300), Labour (1300)",
    amount: 1300,
    status: "-"
  },
  {
    date: "Jun 23 2026",
    vehicleName: "UP78 GT 2887",
    particulars: "1. Break down from chinhot tiraha charge (2000), 2. Main dashboard wiring repair Full (12000), 3. Dashboard opening fitting (3000)",
    amount: 17000,
    status: "-"
  },
  {
    date: "Jun 23 2026",
    vehicleName: "MH-04 KF-0818",
    particulars: "1. Nox Sensor change Calibration by Laptop (5500), 2. Clutch setting (200), Ankit setting (150), Nox sensor (4500)",
    amount: 5700,
    status: "5500 Paid in A/c"
  },
  {
    date: "Jun 26 2026",
    vehicleName: "UP78 GT 2887 (इंजन मिस्त्री)",
    particulars: "1. Steering rod full काम की कपलर (1000), 2. स्टीयरिंग ऑयल line साफ करके oil charge Filter charge full (300)",
    amount: 1300,
    status: "अमित को हिसाब Final"
  },
  {
    date: "Jun 27 2026",
    vehicleName: "1356",
    particulars: "1 Water Filter (700) Labour charge (200)",
    amount: 900,
    status: "Nitin"
  },
  {
    date: "Jun 27 2026",
    vehicleName: "जगदीश कमानी वाले 9435",
    particulars: "1. Main old - 1 (1500), 2. Second old - 1 (1500), 3. 4 No (900), 4. 3 No (500), 5. 4 No - 1 (400)",
    amount: 4800,
    status: "-"
  },
  {
    date: "Jun 27 2026",
    vehicleName: "UP 13 BT 5888 (Rajkumar)",
    particulars: "1. Laptop (500), 2. Common rail coupler (300), 3. Fuel filter (3300), 4. Accelerator Pedal (2300), 5. Solenoid Switch Pump (1500), 6. 4 Tyre Belt (40), 7. Labour charge (2000)",
    amount: 9940,
    status: "Paid 9000"
  },
  {
    date: "Jun 28 2026",
    vehicleName: "8692",
    particulars: "1. सेन्टर बोल्ट 8\" (80), 2. क्लिप बोल्ट (30), कमानी सुधार बधाई (400), मुखी टाई राड (200), जोडा टाट लगाई (100)",
    amount: 810,
    status: "जगदीश खेलता है"
  },
  {
    date: "Jun 28 2026",
    vehicleName: "UP78 GT 2887",
    particulars: "Roll wire 4mm (600), BO Top 30pc (300), Silicon Tap (100), Cotton tap (140), Comb wire 6mm (300), Wiring pipe 4mm (100), Pc fues sock (140), Pic relay 24v 20 Amp (300), Pic fuse (100), 1 roll wire parking (300), 6 No Jointer (30), steering filter (300), 1.5 Ltr steering oil (1050)",
    amount: 1050,
    status: "-"
  },
  {
    date: "Jun 28 2026",
    vehicleName: "UP 79 AT 5663",
    particulars: "1. DEF Filter set (6800) Repairing charge (500)",
    amount: 7300,
    status: "-"
  },
  {
    date: "Jun 29 2026",
    vehicleName: "8691",
    particulars: "1. Main Pata 25x15 (1500) Center Belt (120)",
    amount: 1620,
    status: "Aamir / Nitin"
  },
  {
    date: "Jul 03 2026",
    vehicleName: "Aarif chacha",
    particulars: "1. Engaotor labour (2000) Laptop charge (500)",
    amount: 2500,
    status: "Ashish / Aamir"
  },
  {
    date: "Jul 03 2026",
    vehicleName: "Aarif chacha",
    particulars: "1. Engaotor labour (2000) Laptop charge (500)",
    amount: 2500,
    status: "Aamir"
  },
  {
    date: "Jul 03 2026",
    vehicleName: "UP77 AT 2054 (Ashraf Bhai)",
    particulars: "1. Laptop (500), 2. Fuse 2 - 60 Amp (480), 3. Main fuse 500 Amp (400), 4. Tyre Belt (100), 5. Labour (1000), 6. Clip small (50), 7. Clip (60), 8. Battery cutout (750)",
    amount: 3340,
    status: "Nitin 2900 / A/C 8762"
  },
  {
    date: "Jul 03 2026",
    vehicleName: "जगदीश कमानी",
    particulars: "2 पुराना पटा (850 600)",
    amount: 1450,
    status: "Paid"
  },
  {
    date: "Jul 03 2026",
    vehicleName: "NL-01 AD 3142",
    particulars: "1. Lifter Bolt with nut",
    amount: 250,
    status: "Paid Aamir"
  },
  {
    date: "Jul 03 2026",
    vehicleName: "UP41-AT-1806",
    particulars: "2 Head light Bulb (200) Breather filter (2780) Laptop charge (500)",
    amount: 3480,
    status: "Paid 3400"
  },
  {
    date: "Jul 04 2026",
    vehicleName: "UP78 AT 5057",
    particulars: "1. Laptop charge (500), 2. Kilometer Sensor (550), 3. Kilometer sensor wiring + Pump coupler + Common Rail Coupler repairing charge (1000)",
    amount: 2050,
    status: "-"
  },
  {
    date: "Jul 07 2026",
    vehicleName: "UP78 GT 5559 (Dr. Shalu)",
    particulars: "1. Urea filter, 2. Doser motor, 3. Doser leak repair",
    amount: 0,
    status: "Ashish"
  },
  {
    date: "Jul 07 2026",
    vehicleName: "UP77 AN 4793 (Asharaf Bhai)",
    particulars: "1. Laptop (500) 2. Parameter Setting (500)",
    amount: 1000,
    status: "Paid Nitin"
  },
  {
    date: "Jul 07 2026",
    vehicleName: "DM Auto Spares",
    particulars: "1. 20 Tyre Belt (700)",
    amount: 900,
    status: "Balance 200"
  },
  {
    date: "Jul 10 2026",
    vehicleName: "UP-32 ZN 4979",
    particulars: "1. Pull Pull Switch (60) 2. Wiper grillen (120) 3. Labour charge (300)",
    amount: 470,
    status: "400 Paid (Aamir)"
  },
  {
    date: "Jul 13 2026",
    vehicleName: "-",
    particulars: "1. Break down (1100)",
    amount: 1100,
    status: "Amount paid: 500 600 (उधार 400) Ashish"
  },
  {
    date: "Jul 13 2026",
    vehicleName: "-",
    particulars: "1. Laptop (500), 2. Labour (500), 3. Battery box (60), 4. Tyre Belt (100), 5. Tape (10)",
    amount: 1170,
    status: "Nitin / 500 paid"
  },
  {
    date: "Jul 13 2026",
    vehicleName: "-",
    particulars: "1. Break down (1100)",
    amount: 1100,
    status: "Aamir paid 500 उधार 600"
  },
  {
    date: "-",
    vehicleName: "-",
    particulars: "1. Choti dashboard (70), 2. Break booster oil callar labour (2000), 3. Main fuse 1 pc (320)",
    amount: 2390,
    status: "Ok Paid"
  },
  {
    date: "-",
    vehicleName: "RE-0818 / UP78 GT 2887",
    particulars: "1 Pic Headlight relay (260), 2 Pic fender light side indicator (200), 4 Pic बल्ब (40), 1 Pic Headlight switch (80), 2 Pic पार्किंग लाइट (160), 2 Pic Relay - fuse (300), 1 Pic यूरिया टैंक पाइप लाइन (400)",
    amount: 0,
    status: "-"
  },
  {
    date: "-",
    vehicleName: "UP78 GT 5559 (Dr. Shalu)",
    particulars: "1. Urea filter, 2. Doser motor, 3. Doser leak repair",
    amount: 0,
    status: "-"
  }
];

export function getVehicleSummary(bills: BillRecord[]) {
  const summary: Record<string, number> = {};
  
  bills.forEach(bill => {
    if (bill.amount > 0) {
      summary[bill.vehicleName] = (summary[bill.vehicleName] || 0) + bill.amount;
    }
  });

  return Object.entries(summary)
    .map(([vehicleName, totalAmount]) => ({ vehicleName, totalAmount }))
    .sort((a, b) => b.totalAmount - a.totalAmount);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
