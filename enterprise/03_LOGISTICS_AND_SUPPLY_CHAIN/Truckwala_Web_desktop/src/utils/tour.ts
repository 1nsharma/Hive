import { driver } from 'driver.js';
import { Language } from '../types';
import { trackEvent } from './analytics';

export function startTruckWalaTour(lang: Language = 'hi') {
  trackEvent('tour_start', lang);

  const isHi = lang === 'hi';

  const driverObj = driver({
    showProgress: true,
    animate: true,
    popoverClass: 'driverjs-theme',
    nextBtnText: isHi ? 'अगला →' : 'Next →',
    prevBtnText: isHi ? '← पिछला' : '← Back',
    doneBtnText: isHi ? 'संपन्न (Done)' : 'Done',
    steps: [
      {
        element: '#hero-brand',
        popover: {
          title: isHi ? 'TruckWala 24×7 में आपका स्वागत है' : 'Welcome to TruckWala 24×7',
          description: isHi 
            ? 'हाईवे पर फंसी गाड़ियों और वर्कशॉप रिपेयर के लिए 24 घंटे विश्वसनीय कमर्शियल समाधान। यहाँ से आप सीधे कॉल या व्हाट्सएप कर सकते हैं।'
            : 'Complete commercial vehicle support. Quick direct phone, WhatsApp, and emergency response available 24 hours a day.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#emergency',
        popover: {
          title: isHi ? '1. इमरजेंसी रोडसाइड असिस्टेंस' : '1. Emergency Highway Assistance',
          description: isHi
            ? 'हाईवे पर ब्रेकडाउन होने पर लाल बटन दबाकर तुरंत मोबाइल मैकेनिक वैन बुलाई जा सकती है।'
            : 'Immediate breakdown support. Click to get instant emergency rescue within 50 km radius on the highway.',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: '#services',
        popover: {
          title: isHi ? '2. प्राथमिकता अनुसार 8 मुख्य सेवाएं' : '2. All 8 Commercial Services',
          description: isHi
            ? 'इमरजेंसी, मैकेनिकल इंजन, लैपटॉप डायग्नोस्टिक्स, स्पेयर पार्ट्स, रीबिल्ड, इलेक्ट्रिकल और टायर सर्विस की पूरी जानकारी।'
            : 'Explore prioritized commercial services: Emergency, Mechanical, Laptop Diagnostics, Spare Parts, Rebuild, and Electrical.',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: '#parts-form',
        popover: {
          title: isHi ? '3. ओरिजिनल स्पेयर पार्ट्स डेस्क' : '3. Genuine Spare Parts Desk',
          description: isHi
            ? 'टाटा, कमिंस, बॉश, वाबको के असली पार्ट्स का स्टॉक पता करें और व्हाट्सएप पर सीधा कोटेशन पाएं।'
            : 'Enquire for 100% genuine OEM parts with verified batch numbers and instant WhatsApp inventory check.',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: '#work-proof-section',
        popover: {
          title: isHi ? '4. वास्तविक वर्कशॉप और फील्ड प्रमाण' : '4. Real Workshop & Field Proof',
          description: isHi
            ? 'स्टॉक फोटो की जगह हमारे असली वर्कशॉप में काम कर रहे मैकेनिक और गाड़ियों का वास्तविक वीडियो व फोटो देखें।'
            : 'Authentic proof of heavy vehicle repairs, BS-6 laptop scanning, and engine overhauls in action.',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: '#breakdown-form',
        popover: {
          title: isHi ? '5. त्वरित सहायता फॉर्म व लोकेशन शेयर' : '5. Quick Lead Form & GPS Share',
          description: isHi
            ? 'ड्राइवर्स के लिए बिना लॉगिन का सरल फॉर्म — एक क्लिक में जीपीएस लोकेशन और वॉइस मैसेज भेजने की सुविधा!'
            : 'Simple friction-free form for drivers — share live GPS coordinates and record voice notes directly without any login.',
          side: 'top',
          align: 'center'
        }
      }
    ]
  });

  driverObj.drive();
}
