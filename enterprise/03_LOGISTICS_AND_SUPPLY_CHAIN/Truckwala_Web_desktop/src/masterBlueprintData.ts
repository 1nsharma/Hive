import {
  HandwrittenBillRecord,
  DatabaseModule,
  ApiEndpointSpec,
} from "./types";

export const INITIAL_HANDWRITTEN_BILLS: HandwrittenBillRecord[] = [
  {
    id: "BILL-PARCHI-001",
    billNumber: "SBP-882",
    billDate: "2024-05-18",
    supplierName: "श्री बालाजी स्पेयर पार्ट्स (Shree Balaji Spares)",
    supplierLocation: "ट्रांसपोर्ट नगर, हाथरस रोड (दुकान नं. 14)",
    supplierPhone: "+91 98370 11234",
    vehicleRef: "UPXX1234 (Ashok Leyland 2820)",
    paperType: "KACHI_PARCHI",
    paperCondition: "हाथ से लिखी कच्ची पर्ची, तेल व ग्रीस के हल्के निशान, नीली बॉल पेन लिखावट",
    rawTextHindiHinglish: `श्री बालाजी स्पेयर पार्ट्स - ट्रांसपोर्ट नगर
दिनांक 18/5/24  गाड़ी न. UPXX1234
1. टाटा / लेलैंड क्लच प्लेट हैवी ड्यूटी - 1 नग = 8,500
2. क्लच रिलीज बेयरिंग कोयो - 1 नग = 2,200
3. क्लच फिंगर किट सेट - 1 सेट = 1,500
4. गियर बॉक्स आयल सील 48x70 - 2 नग @ 180 = 360
कुल = 12,560 (नकद प्राप्त 5,000 / बाकी 7,560)`,
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80",
    subtotalCalculated: 12560,
    subtotalStated: 12560,
    discrepancyAmount: 0,
    gstOrTax: 0,
    grandTotal: 12560,
    verificationStatus: "PENDING_VERIFICATION",
    sha256Hash: "9f8e7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f772819038291028374659102",
    auditTrailId: "AUDIT-PARCHI-882-VERIF",
    items: [
      {
        id: "ITEM-882-1",
        rawHandwrittenSnippet: "टाटा / लेलैंड क्लच प्लेट हैवी ड्यूटी 1 नग 8500",
        hindiPartName: "क्लच प्लेट हैवी ड्यूटी",
        englishStandardName: "Heavy Duty Clutch Friction Plate 380mm",
        oemNumberMatch: "AL-F82910-HD",
        category: "TRANSMISSION",
        qty: 1,
        unitRate: 8500,
        lineTotal: 8500,
        statedTotal: 8500,
        mathDiscrepancy: false,
        ocrConfidence: 97,
        boundingBox: { x: 5, y: 32, width: 90, height: 12 },
        inventoryMatch: {
          matchedId: "PRT-CLUTCH-380",
          suggestedBin: "RACK-B2-SHELF-1",
          currentStock: 1,
          costVariancePct: 0,
        },
      },
      {
        id: "ITEM-882-2",
        rawHandwrittenSnippet: "क्लच रिलीज बेयरिंग कोयो 1 नग 2200",
        hindiPartName: "क्लच रिलीज बेयरिंग",
        englishStandardName: "Clutch Release Bearing Assembly",
        oemNumberMatch: "CRB-KOYO-7014",
        category: "TRANSMISSION",
        qty: 1,
        unitRate: 2200,
        lineTotal: 2200,
        statedTotal: 2200,
        mathDiscrepancy: false,
        ocrConfidence: 94,
        boundingBox: { x: 5, y: 46, width: 90, height: 11 },
        inventoryMatch: {
          matchedId: "PRT-BEARING-REL",
          suggestedBin: "RACK-B2-SHELF-3",
          currentStock: 3,
          costVariancePct: -2.2,
        },
      },
      {
        id: "ITEM-882-3",
        rawHandwrittenSnippet: "क्लच फिंगर किट सेट 1 सेट 1500",
        hindiPartName: "क्लच फिंगर किट सेट",
        englishStandardName: "Clutch Pressure Plate Release Finger Kit",
        oemNumberMatch: "CFK-HD-4PC",
        category: "TRANSMISSION",
        qty: 1,
        unitRate: 1500,
        lineTotal: 1500,
        statedTotal: 1500,
        mathDiscrepancy: false,
        ocrConfidence: 91,
        boundingBox: { x: 5, y: 59, width: 90, height: 11 },
        inventoryMatch: {
          matchedId: "PRT-FINGER-KIT",
          suggestedBin: "RACK-C1-SHELF-2",
          currentStock: 0,
          costVariancePct: 0,
        },
      },
      {
        id: "ITEM-882-4",
        rawHandwrittenSnippet: "गियर बॉक्स आयल सील 48x70 2 नग @ 180 = 360",
        hindiPartName: "गियर बॉक्स आयल सील (48x70)",
        englishStandardName: "Gearbox Input Shaft Oil Seal 48x70x10",
        oemNumberMatch: "OS-487010-VIT",
        category: "TRANSMISSION",
        qty: 2,
        unitRate: 180,
        lineTotal: 360,
        statedTotal: 360,
        mathDiscrepancy: false,
        ocrConfidence: 89,
        boundingBox: { x: 5, y: 72, width: 90, height: 11 },
        inventoryMatch: {
          matchedId: "PRT-SEAL-GBX",
          suggestedBin: "DRAWER-SEALS-4",
          currentStock: 8,
          costVariancePct: +5.0,
        },
      },
    ],
  },
  {
    id: "BILL-PARCHI-002",
    billNumber: "KA-4109",
    billDate: "2024-05-19",
    supplierName: "किसान ऑटो एजेंसी (Kisan Auto Agency)",
    supplierLocation: "मथुरा बाईपास रोड, ऑपोजिट इंडियन आयल पेट्रोल पंप",
    supplierPhone: "+91 94122 88765",
    vehicleRef: "RJ11-GB-5544 (Tata 3518)",
    paperType: "CARBON_COPY",
    paperCondition: "कार्बन कॉपी लीफ, हल्का मोड़ा हुआ कोना, हाथ का गणित विचलन (Math Discrepancy Flag)",
    rawTextHindiHinglish: `किसान ऑटो एजेंसी - मथुरा बाईपास
गाड़ी: RJ11-GB-5544  दिनांक: 19/05
1. कमानी पत्ता 3 नं - 2 नग @ 1800 = 3600
2. सेंटर बोल्ट 12x14 हैवी - 2 नग @ 125 = 250
3. कमानी बुश सेट पीतल - 1 सेट = 450
4. यू बोल्ट नट सहित - 4 नग @ 350 = 1500 (गलती: 4x350 = 1400 होना चाहिए)
जोड़ लिखा: 5,800  (वास्तविक जोड़: 5,700)`,
    imageUrl: "https://images.unsplash.com/photo-1554415707-9e4466710c3d?auto=format&fit=crop&w=800&q=80",
    subtotalCalculated: 5700,
    subtotalStated: 5800,
    discrepancyAmount: 100,
    gstOrTax: 0,
    grandTotal: 5800,
    verificationStatus: "FLAGGED_DISCREPANCY",
    sha256Hash: "3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c",
    auditTrailId: "AUDIT-PARCHI-4109-DISCREP",
    items: [
      {
        id: "ITEM-4109-1",
        rawHandwrittenSnippet: "कमानी पत्ता 3 नं 2 नग @ 1800 = 3600",
        hindiPartName: "कमानी पत्ता 3 नंबर",
        englishStandardName: "Rear Suspension Leaf Spring #3 Leaf",
        oemNumberMatch: "TATA-LS-3518-03",
        category: "SUSPENSION",
        qty: 2,
        unitRate: 1800,
        lineTotal: 3600,
        statedTotal: 3600,
        mathDiscrepancy: false,
        ocrConfidence: 96,
        boundingBox: { x: 6, y: 30, width: 88, height: 12 },
        inventoryMatch: {
          matchedId: "PRT-LEAF-03",
          suggestedBin: "RACK-BAY-SUSP-1",
          currentStock: 4,
          costVariancePct: 0,
        },
      },
      {
        id: "ITEM-4109-2",
        rawHandwrittenSnippet: "सेंटर बोल्ट 12x14 हैवी 2 नग @ 125 = 250",
        hindiPartName: "सेंटर बोल्ट 12x14",
        englishStandardName: "Center Bolt High Tensile 12x14 inch",
        oemNumberMatch: "CB-1214-HT",
        category: "SUSPENSION",
        qty: 2,
        unitRate: 125,
        lineTotal: 250,
        statedTotal: 250,
        mathDiscrepancy: false,
        ocrConfidence: 92,
        boundingBox: { x: 6, y: 44, width: 88, height: 11 },
        inventoryMatch: {
          matchedId: "PRT-CB-1214",
          suggestedBin: "BIN-BOLTS-CENTER",
          currentStock: 12,
          costVariancePct: 0,
        },
      },
      {
        id: "ITEM-4109-3",
        rawHandwrittenSnippet: "कमानी बुश सेट पीतल 1 सेट = 450",
        hindiPartName: "कमानी बुश सेट पीतल",
        englishStandardName: "Phosphor Bronze Spring Bushing Set",
        oemNumberMatch: "BUSH-BRZ-TATA",
        category: "SUSPENSION",
        qty: 1,
        unitRate: 450,
        lineTotal: 450,
        statedTotal: 450,
        mathDiscrepancy: false,
        ocrConfidence: 93,
        boundingBox: { x: 6, y: 57, width: 88, height: 11 },
        inventoryMatch: {
          matchedId: "PRT-BUSH-BRZ",
          suggestedBin: "BIN-BUSHES-02",
          currentStock: 6,
          costVariancePct: 0,
        },
      },
      {
        id: "ITEM-4109-4",
        rawHandwrittenSnippet: "यू बोल्ट नट सहित 4 नग @ 350 = 1500 (लिखा 1500, गणना 1400)",
        hindiPartName: "यू बोल्ट नट सहित",
        englishStandardName: "Rear Axle Heavy U-Bolt with Hardened Nuts",
        oemNumberMatch: "UB-REAR-3518",
        category: "SUSPENSION",
        qty: 4,
        unitRate: 350,
        lineTotal: 1400,
        statedTotal: 1500,
        mathDiscrepancy: true, // 4 * 350 = 1400 != 1500
        ocrConfidence: 91,
        boundingBox: { x: 6, y: 70, width: 88, height: 12 },
        inventoryMatch: {
          matchedId: "PRT-UBOLT-HD",
          suggestedBin: "RACK-BAY-SUSP-3",
          currentStock: 8,
          costVariancePct: 0,
        },
      },
    ],
  },
  {
    id: "BILL-PARCHI-003",
    billNumber: "NDS-104",
    billDate: "2024-05-20",
    supplierName: "नेशनल डीजल सर्विस (National Diesel Service)",
    supplierLocation: "आगरा-दिल्ली बाईपास रोड, नियर फ्लाईवे ढाबा",
    supplierPhone: "+91 97580 44321",
    vehicleRef: "NL01-K-9002 (BharatBenz 2823)",
    paperType: "PRINTED_STAMPED_BILL",
    paperCondition: "कैलिब्रेशन रिपोर्ट रसीद, लाल रबर स्टैम्प, डीजल व ब्लैक कार्बन फिंगरप्रिंट",
    rawTextHindiHinglish: `नेशनल डीजल सर्विस - पंप व इंजेक्टर स्पेशल
गाड़ी: NL01-K-9002  दिनांक: 20/05
1. बॉश इंजेक्टर नोजल टिप DLLA148P - 6 नग @ 1400 = 8,400
2. डिलीवरी वाल्व किट - 6 नग @ 250 = 1,500
3. सीआरडीआई पंप टेस्टिंग व कैलिब्रेशन लेबर = 3,200
कुल रकम = 13,100 (स्टाम्प लगा: पास व डिलीवरी दी)`,
    imageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80",
    subtotalCalculated: 13100,
    subtotalStated: 13100,
    discrepancyAmount: 0,
    gstOrTax: 0,
    grandTotal: 13100,
    verificationStatus: "VERIFIED_COMMITTED",
    verifiedBy: "सुरेश मेहरा (Head Engineer)",
    verifiedTimestamp: "2024-05-20 14:15 IST",
    sha256Hash: "7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b",
    auditTrailId: "AUDIT-PARCHI-104-COMMITTED",
    items: [
      {
        id: "ITEM-104-1",
        rawHandwrittenSnippet: "बॉश इंजेक्टर नोजल टिप DLLA148P 6 नग @ 1400 = 8400",
        hindiPartName: "बॉश इंजेक्टर नोजल टिप (6 नग)",
        englishStandardName: "Bosch CRDI Injector Nozzle DLLA148P",
        oemNumberMatch: "BOSCH-DLLA148P",
        category: "ENGINE",
        qty: 6,
        unitRate: 1400,
        lineTotal: 8400,
        statedTotal: 8400,
        mathDiscrepancy: false,
        ocrConfidence: 98,
        boundingBox: { x: 5, y: 32, width: 90, height: 12 },
        inventoryMatch: {
          matchedId: "PRT-BOSCH-NOZZLE",
          suggestedBin: "SAFE-LOCKER-FUEL",
          currentStock: 12,
          costVariancePct: 0,
        },
      },
      {
        id: "ITEM-104-2",
        rawHandwrittenSnippet: "डिलीवरी वाल्व किट 6 नग @ 250 = 1500",
        hindiPartName: "डिलीवरी वाल्व किट",
        englishStandardName: "High Pressure Delivery Valve Kit",
        oemNumberMatch: "DV-BOSCH-HP",
        category: "ENGINE",
        qty: 6,
        unitRate: 250,
        lineTotal: 1500,
        statedTotal: 1500,
        mathDiscrepancy: false,
        ocrConfidence: 93,
        boundingBox: { x: 5, y: 46, width: 90, height: 11 },
        inventoryMatch: {
          matchedId: "PRT-DV-KIT",
          suggestedBin: "DRAWER-FUEL-01",
          currentStock: 6,
          costVariancePct: 0,
        },
      },
      {
        id: "ITEM-104-3",
        rawHandwrittenSnippet: "सीआरडीआई पंप टेस्टिंग व कैलिब्रेशन लेबर = 3200",
        hindiPartName: "सीआरडीआई पंप कैलिब्रेशन लेबर",
        englishStandardName: "Common Rail Pump Bench Test & Calibration Labour",
        category: "ENGINE",
        qty: 1,
        unitRate: 3200,
        lineTotal: 3200,
        statedTotal: 3200,
        mathDiscrepancy: false,
        ocrConfidence: 95,
        boundingBox: { x: 5, y: 60, width: 90, height: 12 },
        inventoryMatch: {
          suggestedBin: "SERVICE_LABOUR",
          currentStock: 0,
        },
      },
    ],
  },
  {
    id: "BILL-PARCHI-004",
    billNumber: "MBL-229",
    billDate: "2024-05-21",
    supplierName: "महावीर ब्रेक लाइनर स्टोर्स (Mahaveer Brake Stores)",
    supplierLocation: "ट्रांसपोर्ट नगर गेट नं 2",
    supplierPhone: "+91 98371 99001",
    vehicleRef: "HR55-T-6677 (Tata Prima 4028)",
    paperType: "KACHI_PARCHI",
    paperCondition: "मजबूत ब्राउन पेपर रसीद, पेंसिल व नीली स्याही मिक्स, रबर स्टैम्प",
    rawTextHindiHinglish: `महावीर ब्रेक लाइनर स्टोर्स
गाड़ी HR55-T-6677  21/05/2024
1. ब्रेक लाइनर रियर TVS रबर कोटेड - 4 सेट @ 1650 = 6,600
2. ग्रीस एपी-3 गल्फ 3 किलो - 1 डब्बा = 1,200
3. व्हील हब सील रियर - 4 नग @ 150 = 600
कुल नकद देय = 8,400`,
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80",
    subtotalCalculated: 8400,
    subtotalStated: 8400,
    discrepancyAmount: 0,
    gstOrTax: 0,
    grandTotal: 8400,
    verificationStatus: "PENDING_VERIFICATION",
    sha256Hash: "1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e2d",
    auditTrailId: "AUDIT-PARCHI-229-VERIF",
    items: [
      {
        id: "ITEM-229-1",
        rawHandwrittenSnippet: "ब्रेक लाइनर रियर TVS रबर कोटेड 4 सेट @ 1650 = 6600",
        hindiPartName: "ब्रेक लाइनर रियर TVS (4 सेट)",
        englishStandardName: "TVS Heavy Commercial Rear Brake Lining Set",
        oemNumberMatch: "TVS-BL-RR-410",
        category: "BRAKES",
        qty: 4,
        unitRate: 1650,
        lineTotal: 6600,
        statedTotal: 6600,
        mathDiscrepancy: false,
        ocrConfidence: 96,
        boundingBox: { x: 5, y: 32, width: 90, height: 12 },
        inventoryMatch: {
          matchedId: "PRT-BL-TVS-RR",
          suggestedBin: "RACK-BRAKES-01",
          currentStock: 8,
          costVariancePct: 0,
        },
      },
      {
        id: "ITEM-229-2",
        rawHandwrittenSnippet: "ग्रीस एपी-3 गल्फ 3 किलो 1 डब्बा = 1200",
        hindiPartName: "ग्रीस एपी-3 गल्फ 3 किलो",
        englishStandardName: "Gulf AP-3 High Temperature Bearing Grease 3kg Tub",
        oemNumberMatch: "GULF-AP3-3KG",
        category: "CONSUMABLES",
        qty: 1,
        unitRate: 1200,
        lineTotal: 1200,
        statedTotal: 1200,
        mathDiscrepancy: false,
        ocrConfidence: 94,
        boundingBox: { x: 5, y: 48, width: 90, height: 11 },
        inventoryMatch: {
          matchedId: "PRT-GREASE-AP3",
          suggestedBin: "BAY-OIL-STORAGE",
          currentStock: 5,
          costVariancePct: 0,
        },
      },
      {
        id: "ITEM-229-3",
        rawHandwrittenSnippet: "व्हील हब सील रियर 4 नग @ 150 = 600",
        hindiPartName: "व्हील हब सील रियर",
        englishStandardName: "Rear Axle Wheel Hub Oil Seal HD",
        oemNumberMatch: "SEAL-HUB-RR",
        category: "BRAKES",
        qty: 4,
        unitRate: 150,
        lineTotal: 600,
        statedTotal: 600,
        mathDiscrepancy: false,
        ocrConfidence: 92,
        boundingBox: { x: 5, y: 62, width: 90, height: 11 },
        inventoryMatch: {
          matchedId: "PRT-HUB-SEAL",
          suggestedBin: "DRAWER-SEALS-1",
          currentStock: 16,
          costVariancePct: 0,
        },
      },
    ],
  },
  {
    id: "BILL-PARCHI-005",
    billNumber: "EMG-991",
    billDate: "2024-05-22",
    supplierName: "हाईवे इमरजेंसी पर्ची (Jewar Express Mechanic)",
    supplierLocation: "यमुना एक्सप्रेसवे किमी 64, जेवर टोल सर्विस लेन",
    supplierPhone: "+91 99976 11200",
    vehicleRef: "UP14-BT-1234 (Tata 1618)",
    paperType: "DIARY_NOTE",
    paperCondition: "डायरी का फटा हुआ पन्ना, लाल पेन, रात 2:30 बजे की इमरजेंसी रिपेयर पर्ची",
    rawTextHindiHinglish: `हाईवे नाइट इमरजेंसी रिपेयर पर्ची
गाड़ी UP14-BT-1234 (हीटिंग ब्रेकडाउन)
1. रेडिएटर होस पाइप अपर व लोअर सिलिकॉन - 1 सेट = 850
2. कूलेंट रेडीमिक्स ग्रीन 5 लीटर कैनी - 1 कैनी = 1,200
3. इमरजेंसी नाइट विजिट चार्ज + ट्यूब ब्रेजिंग = 1,500
कुल नगद देय = 3,550`,
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    subtotalCalculated: 3550,
    subtotalStated: 3550,
    discrepancyAmount: 0,
    gstOrTax: 0,
    grandTotal: 3550,
    verificationStatus: "VERIFIED_COMMITTED",
    verifiedBy: "अमित शर्मा (Owner)",
    verifiedTimestamp: "2024-05-22 08:30 IST",
    sha256Hash: "4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e",
    auditTrailId: "AUDIT-PARCHI-991-COMMITTED",
    items: [
      {
        id: "ITEM-991-1",
        rawHandwrittenSnippet: "रेडिएटर होस पाइप अपर व लोअर 1 सेट = 850",
        hindiPartName: "रेडिएटर होस पाइप सेट",
        englishStandardName: "Heavy Duty Silicone Radiator Hose Set (Upper + Lower)",
        oemNumberMatch: "TATA-HOSE-RAD-1618",
        category: "ENGINE",
        qty: 1,
        unitRate: 850,
        lineTotal: 850,
        statedTotal: 850,
        mathDiscrepancy: false,
        ocrConfidence: 93,
        boundingBox: { x: 5, y: 30, width: 90, height: 12 },
        inventoryMatch: {
          matchedId: "PRT-RAD-HOSE",
          suggestedBin: "RACK-COOLING-01",
          currentStock: 2,
          costVariancePct: 0,
        },
      },
      {
        id: "ITEM-991-2",
        rawHandwrittenSnippet: "कूलेंट रेडीमिक्स 5 लीटर = 1200",
        hindiPartName: "कूलेंट रेडीमिक्स 5 लीटर",
        englishStandardName: "Premixed Glycol Heavy Duty Coolant 5 Litre Can",
        oemNumberMatch: "COOL-HD-5L",
        category: "CONSUMABLES",
        qty: 1,
        unitRate: 1200,
        lineTotal: 1200,
        statedTotal: 1200,
        mathDiscrepancy: false,
        ocrConfidence: 95,
        boundingBox: { x: 5, y: 46, width: 90, height: 11 },
        inventoryMatch: {
          matchedId: "PRT-COOLANT-5L",
          suggestedBin: "BAY-OIL-STORAGE",
          currentStock: 8,
          costVariancePct: 0,
        },
      },
      {
        id: "ITEM-991-3",
        rawHandwrittenSnippet: "इमरजेंसी नाइट विजिट चार्ज + ब्रेजिंग = 1500",
        hindiPartName: "इमरजेंसी नाइट विजिट व ब्रेजिंग लेबर",
        englishStandardName: "Night Expressway Emergency Dispatch & Radiator Brazing Labour",
        category: "ENGINE",
        qty: 1,
        unitRate: 1500,
        lineTotal: 1500,
        statedTotal: 1500,
        mathDiscrepancy: false,
        ocrConfidence: 92,
        boundingBox: { x: 5, y: 62, width: 90, height: 12 },
        inventoryMatch: {
          suggestedBin: "EMERGENCY_LABOUR",
          currentStock: 0,
        },
      },
    ],
  },
];

export const DATABASE_MODULES_SPEC: DatabaseModule[] = [
  {
    id: "MOD-1-CUSTOMERS",
    name: "Customer & Fleet Master",
    hindiName: "ग्राहक एवं ट्रांसपोर्टर मास्टर",
    iconName: "Users",
    description: "Multi-tenant fleet customer isolation, credit terms, GSTIN validation, and contact credentials.",
    tables: [
      {
        tableName: "customers",
        module: "MOD-1-CUSTOMERS",
        description: "Stores fleet owners, transporters, individual truck owners with credit limits and tenant security IDs.",
        columns: [
          { name: "id", type: "UUID PRIMARY KEY", nullable: false, isPrimary: true, description: "Unique customer UUID", example: "c4b12345-e678-4a9b-8c1d-112233445566" },
          { name: "business_name", type: "VARCHAR(255)", nullable: false, description: "Transport firm or individual legal name", example: "हरप्रीत रोडलाइन्स (Harpreet Roadlines)" },
          { name: "contact_person", type: "VARCHAR(150)", nullable: false, description: "Primary operational contact / owner", example: "हरप्रीत सिंह" },
          { name: "phone_primary", type: "VARCHAR(20)", nullable: false, description: "Verified WhatsApp phone number for approvals", example: "+919810012345" },
          { name: "gstin", type: "VARCHAR(15)", nullable: true, description: "15-digit GSTIN (Indian Goods & Service Tax)", example: "09AAACH7409R1ZZ" },
          { name: "credit_limit", type: "NUMERIC(12,2)", nullable: false, description: "Maximum approved outstanding ledger limit", example: "150000.00" },
          { name: "current_balance", type: "NUMERIC(12,2)", nullable: false, description: "Current outstanding dues (negative = advance)", example: "24500.00" },
          { name: "payment_terms_days", type: "INTEGER", nullable: false, description: "Agreed credit cycle in days (e.g. 15/30 days)", example: "15" },
          { name: "tenant_id", type: "VARCHAR(64)", nullable: false, description: "Zero-leakage isolation ID ensuring cross-customer privacy", example: "TNT-TRUCKWALA-MAIN" },
          { name: "created_at", type: "TIMESTAMPTZ", nullable: false, description: "Creation audit timestamp", example: "2024-01-15 10:00:00+05:30" },
        ],
        indexes: [
          "CREATE UNIQUE INDEX idx_customers_phone ON customers(phone_primary);",
          "CREATE INDEX idx_customers_tenant ON customers(tenant_id);",
        ],
        constraints: [
          "CONSTRAINT chk_credit_limit CHECK (credit_limit >= 0)",
        ],
        sampleSqlDDL: `CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(150) NOT NULL,
  phone_primary VARCHAR(20) NOT NULL UNIQUE,
  gstin VARCHAR(15),
  credit_limit NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  current_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  payment_terms_days INTEGER NOT NULL DEFAULT 15,
  tenant_id VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
      },
    ],
  },
  {
    id: "MOD-2-VEHICLES",
    name: "Vehicle & Fleet Asset Registry",
    hindiName: "वाहन एवं चेसिस रजिस्ट्री",
    iconName: "Truck",
    description: "Every commercial vehicle registered with chassis, engine, tonnage, OBD health, and primary customer link.",
    tables: [
      {
        tableName: "vehicles",
        module: "MOD-2-VEHICLES",
        description: "Official vehicle records matching transport authority and fastag specs.",
        columns: [
          { name: "id", type: "UUID PRIMARY KEY", nullable: false, isPrimary: true, description: "Vehicle unique UUID", example: "v1a98765-b432-4c2a-9e1f-665544332211" },
          { name: "vehicle_number", type: "VARCHAR(20)", nullable: false, description: "State registration number", example: "UP14-BT-1234" },
          { name: "customer_id", type: "UUID", nullable: false, isForeignKey: true, references: "customers(id)", description: "Owner customer reference", example: "c4b12345-..." },
          { name: "make", type: "VARCHAR(50)", nullable: false, description: "Manufacturer (Tata, Ashok Leyland, BharatBenz, Eicher)", example: "Tata Motors" },
          { name: "model", type: "VARCHAR(50)", nullable: false, description: "Model code and tonnage", example: "1618 LPT" },
          { name: "chassis_number", type: "VARCHAR(30)", nullable: true, description: "17-character VIN / Chassis stamp", example: "MAT624021K8C12345" },
          { name: "engine_number", type: "VARCHAR(30)", nullable: true, description: "Engine stamped serial", example: "497TCIC65K123456" },
          { name: "fuel_type", type: "VARCHAR(20)", nullable: false, description: "Diesel, CNG, LNG", example: "DIESEL" },
          { name: "current_odometer_km", type: "INTEGER", nullable: false, description: "Last recorded odometer reading", example: "348500" },
          { name: "status", type: "VARCHAR(30)", nullable: false, description: "ACTIVE, IN_WORKSHOP, BREAKDOWN, RELEASED", example: "IN_WORKSHOP" },
        ],
        indexes: [
          "CREATE UNIQUE INDEX idx_vehicles_number ON vehicles(vehicle_number);",
          "CREATE INDEX idx_vehicles_customer ON vehicles(customer_id);",
        ],
        constraints: [
          "FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT",
        ],
        sampleSqlDDL: `CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_number VARCHAR(20) NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  chassis_number VARCHAR(30),
  engine_number VARCHAR(30),
  fuel_type VARCHAR(20) NOT NULL DEFAULT 'DIESEL',
  current_odometer_km INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
      },
    ],
  },
  {
    id: "MOD-3-DRIVERS",
    name: "Driver & Field Operator Ledger",
    hindiName: "ड्राइवर एवं ऑपरेटर लेजर",
    iconName: "UserCheck",
    description: "Driver identity, WhatsApp phone for roadside issue reporting, valid commercial DL, and vehicle assignment.",
    tables: [
      {
        tableName: "drivers",
        module: "MOD-3-DRIVERS",
        description: "Commercial driver contacts for WhatsApp voice note and photo ingestion.",
        columns: [
          { name: "id", type: "UUID PRIMARY KEY", nullable: false, isPrimary: true, description: "Driver unique UUID", example: "d9e8d7c6-b5a4-4f3e-2d1c-0b9a8f7e6d5c" },
          { name: "full_name", type: "VARCHAR(150)", nullable: false, description: "Driver name", example: "श्यामल सिंह (Shyamal Singh)" },
          { name: "whatsapp_phone", type: "VARCHAR(20)", nullable: false, description: "WhatsApp number used to send voice notes/photos", example: "+919876543210" },
          { name: "license_number", type: "VARCHAR(30)", nullable: true, description: "Heavy transport driving license", example: "UP14-20150087654" },
          { name: "assigned_vehicle_id", type: "UUID", nullable: true, isForeignKey: true, references: "vehicles(id)", description: "Current assigned truck", example: "v1a98765-..." },
          { name: "is_active", type: "BOOLEAN", nullable: false, description: "Active or inactive status", example: "true" },
        ],
        indexes: [
          "CREATE UNIQUE INDEX idx_drivers_phone ON drivers(whatsapp_phone);",
        ],
        constraints: [
          "FOREIGN KEY (assigned_vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL",
        ],
        sampleSqlDDL: `CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(150) NOT NULL,
  whatsapp_phone VARCHAR(20) NOT NULL UNIQUE,
  license_number VARCHAR(30),
  assigned_vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
      },
    ],
  },
  {
    id: "MOD-4-TECHNICAL_JOBS",
    name: "Technical Job & 8-Stage Lifecycle Engine",
    hindiName: "तकनीकी जॉब कार्ड एवं 8-स्टेज लाइफसाइकिल",
    iconName: "Wrench",
    description: "Core state machine tracking every repair through Issue, Inspection, Estimate, Approval, Parts, Work, Test, and Final.",
    tables: [
      {
        tableName: "technical_jobs",
        module: "MOD-4-TECHNICAL_JOBS",
        description: "Central job card entity with strict state transitions and evidence hashes.",
        columns: [
          { name: "id", type: "UUID PRIMARY KEY", nullable: false, isPrimary: true, description: "Job UUID", example: "j7a1b2c3-d4e5-4f6a-7b8c-9d0e1f2a3b4c" },
          { name: "job_number", type: "VARCHAR(30)", nullable: false, description: "Formatted unique job code", example: "JOB-2024-001" },
          { name: "vehicle_id", type: "UUID", nullable: false, isForeignKey: true, references: "vehicles(id)", description: "Vehicle undergoing repair", example: "v1a98765-..." },
          { name: "current_stage", type: "VARCHAR(30)", nullable: false, description: "ISSUE, INSPECTION, ESTIMATE, APPROVAL, PARTS, MECHANIC_WORK, TEST, FINAL", example: "FINAL" },
          { name: "is_emergency_roadside", type: "BOOLEAN", nullable: false, description: "True if 24x7 highway breakdown call", example: "true" },
          { name: "breakdown_location", type: "VARCHAR(255)", nullable: true, description: "Highway KM / landmark / GPS coords", example: "यमुना एक्सप्रेसवे किमी 64" },
          { name: "assigned_mechanic", type: "VARCHAR(100)", nullable: true, description: "Lead technician executing bay work", example: "रमेश उस्ताद (Ramesh Ustad)" },
          { name: "total_estimate_amount", type: "NUMERIC(12,2)", nullable: false, description: "Approved quotation figure", example: "24000.00" },
          { name: "total_actual_amount", type: "NUMERIC(12,2)", nullable: false, description: "Final closed ledger figure", example: "23950.00" },
          { name: "cost_variance", type: "NUMERIC(12,2)", nullable: false, description: "Actual minus estimate", example: "-50.00" },
          { name: "owner_approval_hash", type: "VARCHAR(64)", nullable: true, description: "Cryptographic SHA-256 of WhatsApp approval evidence", example: "7e8f9a0b1c2d3e4f..." },
          { name: "closed_at", type: "TIMESTAMPTZ", nullable: true, description: "Job completion and final audit commit time", example: "2024-05-18 16:30:00+05:30" },
        ],
        indexes: [
          "CREATE UNIQUE INDEX idx_jobs_number ON technical_jobs(job_number);",
          "CREATE INDEX idx_jobs_vehicle ON technical_jobs(vehicle_id);",
          "CREATE INDEX idx_jobs_stage ON technical_jobs(current_stage);",
        ],
        constraints: [
          "FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT",
          "CONSTRAINT chk_job_stage CHECK (current_stage IN ('ISSUE','INSPECTION','ESTIMATE','APPROVAL','PARTS','MECHANIC_WORK','TEST','FINAL'))",
        ],
        sampleSqlDDL: `CREATE TABLE technical_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number VARCHAR(30) NOT NULL UNIQUE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  current_stage VARCHAR(30) NOT NULL DEFAULT 'ISSUE',
  is_emergency_roadside BOOLEAN NOT NULL DEFAULT FALSE,
  breakdown_location VARCHAR(255),
  assigned_mechanic VARCHAR(100),
  total_estimate_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  total_actual_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  cost_variance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  owner_approval_hash VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);`,
      },
    ],
  },
  {
    id: "MOD-5-PARTS_INVENTORY",
    name: "Parts Inventory & Shelf Bin Registry",
    hindiName: "स्पेयर पार्ट्स इन्वेंट्री एवं शेल्फ बिन मास्टर",
    iconName: "Package",
    description: "Physical stock tracking, OEM cross-reference, shelf/rack bin location, buying price vs workshop selling price.",
    tables: [
      {
        tableName: "parts_inventory",
        module: "MOD-5-PARTS_INVENTORY",
        description: "Master catalogue of spare parts with barcode, shelf bin location, and safety stock thresholds.",
        columns: [
          { name: "id", type: "UUID PRIMARY KEY", nullable: false, isPrimary: true, description: "Part UUID", example: "p5b98765-4321-4a9b-8c7d-e6f5a4b3c2d1" },
          { name: "part_number", type: "VARCHAR(50)", nullable: false, description: "Manufacturer or workshop SKU", example: "TR-RAD-1618" },
          { name: "name_english", type: "VARCHAR(150)", nullable: false, description: "Standard commercial English name", example: "Radiator Assembly Heavy Duty Copper-Brass" },
          { name: "name_hindi", type: "VARCHAR(150)", nullable: false, description: "Common shop / mistri vernacular name", example: "रेडिएटर असेंबली (टाटा 1618)" },
          { name: "category", type: "VARCHAR(50)", nullable: false, description: "ENGINE, TRANSMISSION, SUSPENSION, BRAKES, ELECTRICAL, CONSUMABLES", example: "ENGINE" },
          { name: "oem_cross_reference", type: "VARCHAR(100)", nullable: true, description: "OEM genuine part number", example: "2786-5000-0114" },
          { name: "rack_shelf_bin", type: "VARCHAR(50)", nullable: false, description: "Exact physical bay warehouse position", example: "RACK-A1-SHELF-2" },
          { name: "current_stock_qty", type: "NUMERIC(10,2)", nullable: false, description: "Physical on-hand quantity", example: "2.00" },
          { name: "min_reorder_level", type: "NUMERIC(10,2)", nullable: false, description: "Threshold triggering auto-PO recommendation", example: "1.00" },
          { name: "purchase_cost_price", type: "NUMERIC(12,2)", nullable: false, description: "Wholesale acquisition cost from supplier", example: "18000.00" },
          { name: "selling_price", type: "NUMERIC(12,2)", nullable: false, description: "Price billed on job card / estimate", example: "19500.00" },
          { name: "gst_slab_pct", type: "NUMERIC(4,2)", nullable: false, description: "GST rate (18% or 28% for auto spares)", example: "18.00" },
        ],
        indexes: [
          "CREATE UNIQUE INDEX idx_parts_sku ON parts_inventory(part_number);",
          "CREATE INDEX idx_parts_category ON parts_inventory(category);",
          "CREATE INDEX idx_parts_bin ON parts_inventory(rack_shelf_bin);",
        ],
        constraints: [
          "CONSTRAINT chk_stock_qty CHECK (current_stock_qty >= 0)",
          "CONSTRAINT chk_price_margin CHECK (selling_price >= purchase_cost_price)",
        ],
        sampleSqlDDL: `CREATE TABLE parts_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number VARCHAR(50) NOT NULL UNIQUE,
  name_english VARCHAR(150) NOT NULL,
  name_hindi VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  oem_cross_reference VARCHAR(100),
  rack_shelf_bin VARCHAR(50) NOT NULL,
  current_stock_qty NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  min_reorder_level NUMERIC(10,2) NOT NULL DEFAULT 1.00,
  purchase_cost_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  selling_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  gst_slab_pct NUMERIC(4,2) NOT NULL DEFAULT 18.00,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
      },
    ],
  },
  {
    id: "MOD-6-DEALERS",
    name: "Supplier & Wholesale Dealer Directory",
    hindiName: "सप्लायर एवं थोक डीलर खाता",
    iconName: "Building2",
    description: "Wholesale parts dealers, credit period, verified bank/UPI, delivery rating, and invoice reconciliation ledger.",
    tables: [
      {
        tableName: "dealers_suppliers",
        module: "MOD-6-DEALERS",
        description: "Registered spare part distributors and machine shops.",
        columns: [
          { name: "id", type: "UUID PRIMARY KEY", nullable: false, isPrimary: true, description: "Supplier UUID", example: "s8e7d6c5-4321-4f5e-6d7c-8b9a0f1e2d3c" },
          { name: "firm_name", type: "VARCHAR(255)", nullable: false, description: "Wholesale agency name", example: "शर्मा ऑटो एजेंसी (Sharma Auto Agency)" },
          { name: "contact_name", type: "VARCHAR(150)", nullable: false, description: "Dealer proprietor name", example: "राकेश शर्मा" },
          { name: "phone_whatsapp", type: "VARCHAR(20)", nullable: false, description: "WhatsApp line for sending PO and receipt slips", example: "+919412211990" },
          { name: "gstin", type: "VARCHAR(15)", nullable: true, description: "Wholesale GST number", example: "09AABCS1234F1Z5" },
          { name: "city_location", type: "VARCHAR(100)", nullable: false, description: "City / Market location", example: "हाथरस / ट्रांसपोर्ट नगर" },
          { name: "credit_days_allowed", type: "INTEGER", nullable: false, description: "Payment window permitted", example: "30" },
          { name: "outstanding_payable", type: "NUMERIC(12,2)", nullable: false, description: "Dues payable to this supplier", example: "50600.00" },
          { name: "rating_delivery", type: "NUMERIC(3,1)", nullable: false, description: "Reliability score (1.0 to 5.0)", example: "4.8" },
        ],
        indexes: [
          "CREATE UNIQUE INDEX idx_dealers_phone ON dealers_suppliers(phone_whatsapp);",
        ],
        constraints: [],
        sampleSqlDDL: `CREATE TABLE dealers_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(150) NOT NULL,
  phone_whatsapp VARCHAR(20) NOT NULL UNIQUE,
  gstin VARCHAR(15),
  city_location VARCHAR(100) NOT NULL,
  credit_days_allowed INTEGER NOT NULL DEFAULT 30,
  outstanding_payable NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  rating_delivery NUMERIC(3,1) NOT NULL DEFAULT 5.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
      },
    ],
  },
  {
    id: "MOD-7-FINANCIAL",
    name: "Financial Ledger & Double-Entry Accounting",
    hindiName: "वित्तीय बही-खाता एवं लेजर ट्रांजेक्शन",
    iconName: "Receipt",
    description: "Two-phase human commit financial entries, invoice generation, supplier payouts, and customer receipts.",
    tables: [
      {
        tableName: "financial_ledger",
        module: "MOD-7-FINANCIAL",
        description: "Immutable transaction records. AI cannot commit here directly without human sign-off.",
        columns: [
          { name: "id", type: "UUID PRIMARY KEY", nullable: false, isPrimary: true, description: "Transaction UUID", example: "tx1a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c" },
          { name: "transaction_type", type: "VARCHAR(30)", nullable: false, description: "JOB_INVOICE, SUPPLIER_PAYMENT, CUSTOMER_RECEIPT, EXPENSE", example: "JOB_INVOICE" },
          { name: "reference_id", type: "VARCHAR(64)", nullable: false, description: "Job Number, PO Number, or Voucher Code", example: "JOB-2024-001" },
          { name: "customer_id", type: "UUID", nullable: true, isForeignKey: true, references: "customers(id)", description: "Customer account", example: "c4b12345-..." },
          { name: "dealer_id", type: "UUID", nullable: true, isForeignKey: true, references: "dealers_suppliers(id)", description: "Supplier account", example: "s8e7d6c5-..." },
          { name: "debit_amount", type: "NUMERIC(12,2)", nullable: false, description: "Debit in INR", example: "23950.00" },
          { name: "credit_amount", type: "NUMERIC(12,2)", nullable: false, description: "Credit in INR", example: "0.00" },
          { name: "payment_mode", type: "VARCHAR(30)", nullable: false, description: "CASH, UPI, NEFT, CREDIT_LEDGER, CHEQUE", example: "CREDIT_LEDGER" },
          { name: "signed_off_by_user", type: "VARCHAR(100)", nullable: false, description: "Owner or authorized accountant who confirmed entry", example: "अमित शर्मा (Owner)" },
          { name: "evidence_hash", type: "VARCHAR(64)", nullable: false, description: "SHA-256 linking to bill photo or WhatsApp sign-off", example: "9f8e7a6b5c4d3e2f..." },
          { name: "created_at", type: "TIMESTAMPTZ", nullable: false, description: "Committed timestamp", example: "2024-05-18 16:30:00+05:30" },
        ],
        indexes: [
          "CREATE INDEX idx_ledger_ref ON financial_ledger(reference_id);",
          "CREATE INDEX idx_ledger_customer ON financial_ledger(customer_id);",
          "CREATE INDEX idx_ledger_type ON financial_ledger(transaction_type);",
        ],
        constraints: [
          "CONSTRAINT chk_ledger_positive CHECK (debit_amount >= 0 AND credit_amount >= 0)",
        ],
        sampleSqlDDL: `CREATE TABLE financial_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type VARCHAR(30) NOT NULL,
  reference_id VARCHAR(64) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  dealer_id UUID REFERENCES dealers_suppliers(id),
  debit_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  credit_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  payment_mode VARCHAR(30) NOT NULL,
  signed_off_by_user VARCHAR(100) NOT NULL,
  evidence_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
      },
    ],
  },
  {
    id: "MOD-8-EVIDENCE_VAULT",
    name: "Immutable Evidence Vault & WORM Audit Trail",
    hindiName: "अपरिवर्तनीय एविडेंस वॉल्ट एवं ऑडिट ट्रेल",
    iconName: "ShieldCheck",
    description: "Write-Once-Read-Many (WORM) storage. Original bills, WhatsApp audio notes, bay photos, and SHA-256 signatures are never overwritten.",
    tables: [
      {
        tableName: "evidence_vault",
        module: "MOD-8-EVIDENCE_VAULT",
        description: "Cryptographically verified digital evidence items attached to jobs, parts, or bills.",
        columns: [
          { name: "id", type: "UUID PRIMARY KEY", nullable: false, isPrimary: true, description: "Evidence UUID", example: "ev123456-789a-bcde-f012-3456789abcde" },
          { name: "sha256_hash", type: "VARCHAR(64)", nullable: false, description: "Cryptographic SHA-256 digest of original binary file", example: "4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e" },
          { name: "media_type", type: "VARCHAR(30)", nullable: false, description: "PHOTO, VIDEO, AUDIO_NOTE, WHATSAPP_RAW, BILL_PDF, OCR_RAW", example: "PHOTO" },
          { name: "storage_uri", type: "VARCHAR(512)", nullable: false, description: "S3 or GCS encrypted immutable object path", example: "s3://truckwala-evidence-vault/2024/05/radiator_cracked_up14.jpg" },
          { name: "file_size_bytes", type: "BIGINT", nullable: false, description: "Binary file size in bytes", example: "2481900" },
          { name: "captured_by_phone", type: "VARCHAR(20)", nullable: false, description: "Sender WhatsApp or device phone", example: "+919876543210" },
          { name: "related_job_id", type: "UUID", nullable: true, isForeignKey: true, references: "technical_jobs(id)", description: "Linked technical job card", example: "j7a1b2c3-..." },
          { name: "created_at", type: "TIMESTAMPTZ", nullable: false, description: "Raw arrival timestamp", example: "2024-05-18 10:14:02+05:30" },
        ],
        indexes: [
          "CREATE UNIQUE INDEX idx_evidence_hash ON evidence_vault(sha256_hash);",
          "CREATE INDEX idx_evidence_job ON evidence_vault(related_job_id);",
        ],
        constraints: [],
        sampleSqlDDL: `CREATE TABLE evidence_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sha256_hash VARCHAR(64) NOT NULL UNIQUE,
  media_type VARCHAR(30) NOT NULL,
  storage_uri VARCHAR(512) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  captured_by_phone VARCHAR(20) NOT NULL,
  related_job_id UUID REFERENCES technical_jobs(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
      },
      {
        tableName: "audit_trail_worm",
        module: "MOD-8-EVIDENCE_VAULT",
        description: "Immutable append-only system audit log answering 'Who did What, When, and with what Evidence?'.",
        columns: [
          { name: "id", type: "BIGSERIAL PRIMARY KEY", nullable: false, isPrimary: true, description: "Monotonically increasing sequence ID", example: "10482" },
          { name: "entity_type", type: "VARCHAR(50)", nullable: false, description: "JOB, INVENTORY, BILL, LEDGER, RBAC", example: "JOB" },
          { name: "entity_id", type: "VARCHAR(64)", nullable: false, description: "Primary key of modified record", example: "JOB-2024-001" },
          { name: "action_type", type: "VARCHAR(50)", nullable: false, description: "STAGE_CHANGE, APPROVAL_SIGN, INVENTORY_DECREMENT, LEDGER_COMMIT", example: "STAGE_CHANGE" },
          { name: "old_state_json", type: "JSONB", nullable: true, description: "Snapshot of data before transition", example: '{"stage": "ESTIMATE", "status": "PENDING"}' },
          { name: "new_state_json", type: "JSONB", nullable: false, description: "Snapshot of data after transition", example: '{"stage": "APPROVAL", "approvedBy": "Harpreet"}' },
          { name: "actor_identity", type: "VARCHAR(150)", nullable: false, description: "Authenticated user, mechanic phone, or owner", example: "हरप्रीत सिंह (Fleet Owner via WhatsApp)" },
          { name: "evidence_ref_hash", type: "VARCHAR(64)", nullable: true, description: "SHA-256 hash of proving document/message", example: "7e8f9a0b1c2d3e4f..." },
          { name: "client_ip_or_device", type: "VARCHAR(64)", nullable: true, description: "IP address or WhatsApp Webhook ID", example: "WHATSAPP-WEBHOOK-EVENT-9981" },
          { name: "created_at", type: "TIMESTAMPTZ", nullable: false, description: "Immutable time of event", example: "2024-05-18 11:32:00+05:30" },
        ],
        indexes: [
          "CREATE INDEX idx_audit_entity ON audit_trail_worm(entity_type, entity_id);",
          "CREATE INDEX idx_audit_time ON audit_trail_worm(created_at);",
        ],
        constraints: [],
        sampleSqlDDL: `CREATE TABLE audit_trail_worm (
  id BIGSERIAL PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(64) NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  old_state_json JSONB,
  new_state_json JSONB NOT NULL,
  actor_identity VARCHAR(150) NOT NULL,
  evidence_ref_hash VARCHAR(64),
  client_ip_or_device VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
      },
    ],
  },
];

export const API_ENDPOINTS_SPEC: ApiEndpointSpec[] = [
  {
    method: "POST",
    path: "/api/v1/whatsapp/webhook",
    summary: "WhatsApp Cloud API Webhook — Ingests inbound media, voice notes, and chats into Layer 1 Raw Vault with SHA-256 hashing.",
    authRequired: true,
    layer: "LAYER_1_RAW",
    requestPayloadExample: `{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "919876543210",
          "id": "wamid.HBgLMTE5ODc2...",
          "timestamp": "1716024842",
          "type": "audio",
          "audio": { "id": "media_992104" }
        }]
      }
    }]
  }]
}`,
    responseExample: `{
  "status": "ACCEPTED",
  "sha256": "4f5e6d7c8b9a0f1e...",
  "storageUri": "s3://truckwala-evidence-vault/raw/media_992104.ogg",
  "auditId": "AUDIT-WHATSAPP-INBOUND-881"
}`,
  },
  {
    method: "POST",
    path: "/api/v1/ai/extract-bill",
    summary: "AI Document Intelligence — Processes handwritten bills & parchi photos, extracts line items, validates math, matches OEM catalogue.",
    authRequired: true,
    layer: "LAYER_2_AI",
    requestPayloadExample: `{
  "evidenceHash": "9f8e7a6b5c4d3e2f1a0b...",
  "imageUrl": "s3://truckwala-evidence-vault/bills/parchi_882.jpg",
  "dealerContext": "श्री बालाजी स्पेयर पार्ट्स",
  "vehicleHint": "UPXX1234"
}`,
    responseExample: `{
  "extractedBillNumber": "SBP-882",
  "items": [
    { "hindiName": "क्लच प्लेट हैवी ड्यूटी", "qty": 1, "unitRate": 8500, "lineTotal": 8500, "confidence": 97, "oemMatch": "AL-F82910-HD" },
    { "hindiName": "क्लच रिलीज बेयरिंग", "qty": 1, "unitRate": 2200, "lineTotal": 2200, "confidence": 94, "oemMatch": "CRB-KOYO-7014" }
  ],
  "subtotalCalculated": 12560,
  "statedTotal": 12560,
  "mathDiscrepancy": false,
  "status": "NEEDS_HUMAN_VERIFICATION"
}`,
  },
  {
    method: "POST",
    path: "/api/v1/jobs/transition-stage",
    summary: "Job State Machine Transition — Advances repair stage (e.g. ESTIMATE -> APPROVAL -> PARTS) requiring actor proof and evidence link.",
    authRequired: true,
    layer: "LAYER_3_MASTER",
    requestPayloadExample: `{
  "jobId": "JOB-2024-001",
  "targetStage": "APPROVAL",
  "actor": "हरप्रीत सिंह (Fleet Owner)",
  "evidenceHash": "7e8f9a0b1c2d3e4f...",
  "approvalText": "Approved. Radiator original Tata ka hi dalna."
}`,
    responseExample: `{
  "success": true,
  "jobId": "JOB-2024-001",
  "previousStage": "ESTIMATE",
  "currentStage": "APPROVAL",
  "auditSequenceId": 10483,
  "committedAt": "2024-05-18T11:32:00+05:30"
}`,
  },
  {
    method: "POST",
    path: "/api/v1/inventory/commit-part",
    summary: "Inventory Issuance / Inward Commit — Human-validated stock deduction or addition linked to specific vehicle job and shelf bin.",
    authRequired: true,
    layer: "LAYER_3_MASTER",
    requestPayloadExample: `{
  "partSku": "TR-RAD-1618",
  "qty": 1,
  "action": "DEDUCT_FOR_JOB",
  "jobId": "JOB-2024-001",
  "vehicleNumber": "UP14-BT-1234",
  "signedBy": "सुरेश मेहरा (Head Engineer)",
  "serialNumberScanned": "TR-0098271"
}`,
    responseExample: `{
  "committed": true,
  "partSku": "TR-RAD-1618",
  "newStockOnHand": 1,
  "shelfBin": "RACK-A1-SHELF-2",
  "serialAssigned": "TR-0098271",
  "ledgerDebitRef": "TX-INV-88219"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/audit/provenance/:jobId",
    summary: "Provenance Audit Engine — Returns unbroken 8-step causal chain with timestamps, actors, and SHA-256 evidence links.",
    authRequired: true,
    layer: "LAYER_3_MASTER",
    responseExample: `{
  "jobId": "JOB-2024-001",
  "vehicle": "UP14-BT-1234",
  "chainLength": 8,
  "isTamperFree": true,
  "chain": [
    { "stage": "ISSUE", "who": "Shyamal Singh", "time": "10:14 IST", "sha256": "4f5e6d..." },
    { "stage": "INSPECTION", "who": "Suresh Mehra", "time": "10:45 IST", "sha256": "8a7b6c..." },
    { "stage": "ESTIMATE", "who": "Suresh Mehra", "time": "11:15 IST", "sha256": "1a2b3c..." },
    { "stage": "APPROVAL", "who": "Harpreet Singh", "time": "11:32 IST", "sha256": "7e8f9a..." },
    { "stage": "FINAL", "who": "Amit Sharma (Owner)", "time": "16:30 IST", "sha256": "3c4b5a..." }
  ]
}`,
  },
];

export const PHASE_1_ROADMAP_SPEC = [
  {
    sprint: "Week 1",
    title: "Foundation & Ingestion Pipeline (WhatsApp & WORM Vault)",
    hindiTitle: "व्हाट्सएप-फर्स्ट इनजेशन एवं सुरक्षित वॉल्ट",
    status: "READY_FOR_DEPLOYMENT",
    deliverables: [
      "Official WhatsApp Business Cloud API webhook integration for incoming audio, photos, and messages.",
      "SHA-256 cryptographic hashing pipeline for all raw media before storage.",
      "S3 / GCS WORM storage bucket configuration with 7-year retention policy.",
      "PostgreSQL 16 master instance setup with initial schema migrations for all 8 core tables.",
    ],
    acceptanceCriteria: "Every WhatsApp voice note, photo, or text is safely hashed, stored, and queryable within 500ms without touching master financial ledger.",
  },
  {
    sprint: "Week 2",
    title: "Handwritten Bill AI OCR & Technical Line-Item Parser",
    hindiTitle: "हाथ की पर्ची OCR एवं लाइन-आइटम पार्सर",
    status: "PROTOTYPED_&_TESTED",
    deliverables: [
      "Gemini 2.5 Flash / Claude Document Intelligence extraction pipeline tuned for Hindi/Hinglish workshop slips.",
      "Math Discrepancy Engine: detects line-item arithmetic errors (e.g. 4 × 350 = 1400 vs stated 1500).",
      "OEM Catalogue Auto-Matcher: maps vernacular names (e.g. 'कमानी पत्ता 3 नं') to formal OEM SKUs and shelf bins.",
      "Two-Phase Human Verification UI for Owner/Accountant sign-off.",
    ],
    acceptanceCriteria: "Over 94% OCR precision on handwritten parchi photos; 100% detection of arithmetic discrepancies before ledger entry.",
  },
  {
    sprint: "Week 3",
    title: "8-Stage Job State Machine & Parts Inventory Engine",
    hindiTitle: "8-स्टेज जॉब मशीन एवं इन्वेंट्री डिडक्शन",
    status: "PROTOTYPED_&_TESTED",
    deliverables: [
      "State transition engine: ISSUE ➔ INSPECTION ➔ ESTIMATE ➔ APPROVAL ➔ PARTS ➔ MECHANIC_WORK ➔ TEST ➔ FINAL.",
      "WhatsApp interactive approval buttons for fleet owners (Quotation link, Quick Approve / Reject).",
      "Shelf-bin barcode scanner and serial-number capture on part dispatch.",
      "Strict prohibition of unsolicited AI deductions; inventory moves only upon human authorization.",
    ],
    acceptanceCriteria: "Zero inventory deduction or job closing without recorded human actor signature and verified evidence reference.",
  },
  {
    sprint: "Week 4",
    title: "Owner Operations Portal, Double-Entry Ledger & Pilot Go-Live",
    hindiTitle: "ओनर पोर्टल, डबल-एंट्री लेजर एवं पायलट गो-लाइव",
    status: "PILOT_READY",
    deliverables: [
      "Single-screen Owner Dashboard: pending audits, daily workshop revenue, parts shortage alerts, emergency tracker.",
      "Self-Auditing Provenance Explorer ('यह Part इस Truck में कैसे गया?') for customer disputes.",
      "Double-entry financial ledger with PDF invoice and WhatsApp receipt generation.",
      "Pilot deployment at Truck Wala 24x7 Hathras Road facility with 10 real commercial trucks.",
    ],
    acceptanceCriteria: "10 live repairs tracked end-to-end; 100% audit trail compliance; zero data leakage across fleet owners.",
  },
];

export const FULL_POSTGRES_SCHEMA_SQL = `-- =========================================================================
-- TRUCK WALA 24x7 — PRODUCTION MASTER DATABASE SCHEMA (POSTGRESQL 16+)
-- ARCHITECTURE: Strict Three-Layer Boundary (Raw Vault, AI Ephemeral, Master DB)
-- ZERO DATA LEAKAGE ENFORCED VIA TENANT ISOLATION & CRYPTOGRAPHIC AUDIT TRAILS
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------------------
-- 1. CUSTOMERS & FLEET TRANSPORTERS
-- -------------------------------------------------------------------------
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(150) NOT NULL,
  phone_primary VARCHAR(20) NOT NULL UNIQUE,
  gstin VARCHAR(15),
  credit_limit NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (credit_limit >= 0),
  current_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  payment_terms_days INTEGER NOT NULL DEFAULT 15,
  tenant_id VARCHAR(64) NOT NULL DEFAULT 'TNT-TRUCKWALA-MAIN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_customers_tenant ON customers(tenant_id);

-- -------------------------------------------------------------------------
-- 2. VEHICLE & FLEET ASSET REGISTRY
-- -------------------------------------------------------------------------
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_number VARCHAR(20) NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  chassis_number VARCHAR(30),
  engine_number VARCHAR(30),
  fuel_type VARCHAR(20) NOT NULL DEFAULT 'DIESEL',
  current_odometer_km INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_vehicles_customer ON vehicles(customer_id);

-- -------------------------------------------------------------------------
-- 3. DRIVER & ROADSIDE OPERATORS
-- -------------------------------------------------------------------------
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(150) NOT NULL,
  whatsapp_phone VARCHAR(20) NOT NULL UNIQUE,
  license_number VARCHAR(30),
  assigned_vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 4. SPARE PARTS INVENTORY & SHELF-BIN LOCATIONS
-- -------------------------------------------------------------------------
CREATE TABLE parts_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number VARCHAR(50) NOT NULL UNIQUE,
  name_english VARCHAR(150) NOT NULL,
  name_hindi VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  oem_cross_reference VARCHAR(100),
  rack_shelf_bin VARCHAR(50) NOT NULL,
  current_stock_qty NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (current_stock_qty >= 0),
  min_reorder_level NUMERIC(10,2) NOT NULL DEFAULT 1.00,
  purchase_cost_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  selling_price NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (selling_price >= purchase_cost_price),
  gst_slab_pct NUMERIC(4,2) NOT NULL DEFAULT 18.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_parts_category ON parts_inventory(category);
CREATE INDEX idx_parts_bin ON parts_inventory(rack_shelf_bin);

-- -------------------------------------------------------------------------
-- 5. WHOLESALE DEALERS & SUPPLIERS
-- -------------------------------------------------------------------------
CREATE TABLE dealers_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(150) NOT NULL,
  phone_whatsapp VARCHAR(20) NOT NULL UNIQUE,
  gstin VARCHAR(15),
  city_location VARCHAR(100) NOT NULL,
  credit_days_allowed INTEGER NOT NULL DEFAULT 30,
  outstanding_payable NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  rating_delivery NUMERIC(3,1) NOT NULL DEFAULT 5.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 6. TECHNICAL JOBS & 8-STAGE WORKFLOW
-- -------------------------------------------------------------------------
CREATE TYPE job_stage_enum AS ENUM (
  'ISSUE',
  'INSPECTION',
  'ESTIMATE',
  'APPROVAL',
  'PARTS',
  'MECHANIC_WORK',
  'TEST',
  'FINAL'
);

CREATE TABLE technical_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number VARCHAR(30) NOT NULL UNIQUE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  current_stage job_stage_enum NOT NULL DEFAULT 'ISSUE',
  is_emergency_roadside BOOLEAN NOT NULL DEFAULT FALSE,
  breakdown_location VARCHAR(255),
  assigned_mechanic VARCHAR(100),
  total_estimate_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  total_actual_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  cost_variance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  owner_approval_hash VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);
CREATE INDEX idx_jobs_vehicle ON technical_jobs(vehicle_id);
CREATE INDEX idx_jobs_stage ON technical_jobs(current_stage);

-- -------------------------------------------------------------------------
-- 7. IMMUTABLE EVIDENCE VAULT (WORM STORAGE)
-- -------------------------------------------------------------------------
CREATE TABLE evidence_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sha256_hash VARCHAR(64) NOT NULL UNIQUE,
  media_type VARCHAR(30) NOT NULL,
  storage_uri VARCHAR(512) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  captured_by_phone VARCHAR(20) NOT NULL,
  related_job_id UUID REFERENCES technical_jobs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_evidence_job ON evidence_vault(related_job_id);

-- -------------------------------------------------------------------------
-- 8. FINANCIAL LEDGER (DOUBLE ENTRY ACCOUNTING)
-- -------------------------------------------------------------------------
CREATE TABLE financial_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type VARCHAR(30) NOT NULL,
  reference_id VARCHAR(64) NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
  dealer_id UUID REFERENCES dealers_suppliers(id) ON DELETE RESTRICT,
  debit_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (debit_amount >= 0),
  credit_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (credit_amount >= 0),
  payment_mode VARCHAR(30) NOT NULL,
  signed_off_by_user VARCHAR(100) NOT NULL,
  evidence_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ledger_ref ON financial_ledger(reference_id);
CREATE INDEX idx_ledger_customer ON financial_ledger(customer_id);

-- -------------------------------------------------------------------------
-- 9. IMMUTABLE SYSTEM AUDIT TRAIL (APPEND-ONLY WORM)
-- -------------------------------------------------------------------------
CREATE TABLE audit_trail_worm (
  id BIGSERIAL PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(64) NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  old_state_json JSONB,
  new_state_json JSONB NOT NULL,
  actor_identity VARCHAR(150) NOT NULL,
  evidence_ref_hash VARCHAR(64),
  client_ip_or_device VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_entity ON audit_trail_worm(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_trail_worm(created_at);

-- -------------------------------------------------------------------------
-- AUDIT TRIGGER FUNCTION (ENFORCING PROVENANCE ACROSS ALL TRANSITIONS)
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_record_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_trail_worm (
    entity_type,
    entity_id,
    action_type,
    old_state_json,
    new_state_json,
    actor_identity,
    created_at
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    TG_OP,
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    to_jsonb(NEW),
    CURRENT_USER,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_technical_jobs
AFTER INSERT OR UPDATE ON technical_jobs
FOR EACH ROW EXECUTE FUNCTION fn_record_audit_log();

CREATE TRIGGER trg_audit_financial_ledger
AFTER INSERT ON financial_ledger
FOR EACH ROW EXECUTE FUNCTION fn_record_audit_log();
`;
