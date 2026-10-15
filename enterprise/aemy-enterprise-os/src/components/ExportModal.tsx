import React, { useState } from 'react';
import { BrandName, Language } from '../types';
import { X, Copy, Check, Download, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandName;
  lang: Language;
  selectedOptionId: '1' | '2' | '3';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  brand,
  lang,
  selectedOptionId,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const optionTitles = {
    '1': 'ब्रांड पहचान और UI/UX डिज़ाइन (Brand Identity & UI/UX Design)',
    '2': 'तकनीकी आर्किटेक्चर और MVP विकास (Technical Architecture & MVP Development)',
    '3': 'व्यापार योजना और मार्केटिंग रणनीति (Business Plan & Marketing Strategy)',
  };

  const markdownContent = `# ${brand} — The Invisible Force Behind Your Growth
## संपूर्ण क्रियान्वयन योजना एवं तकनीकी ब्लूप्रिंट (Comprehensive Execution Blueprint)

---

### 1. चयनित क्रियान्वयन पथ (Selected Execution Trajectory)
- **प्राथमिकता:** विकल्प ${selectedOptionId}: ${optionTitles[selectedOptionId]}
- **स्थिति:** सक्रिय (Active Implementation)

---

### 2. तीन चरणों में व्यवस्थित विकास रोडमैप (3-Phase Systematic Roadmap)

#### चरण 1: ब्रांड पहचान और कोर फीचर्स (Brand Identity & Core Features)
- **शून्य-कॉन्फ़िगरेशन ऑनबोर्डिंग (Zero-Configuration Onboarding):** प्राकृतिक भाषा द्वारा टूल डिस्कवरी व स्वतः स्कीमा मैपिंग।
- **यूनिफाइड डेटा इंटरफ़ेस (Unified Data Interface):** GraphQL/REST द्वारा सभी कनेक्टर्स को एक मानकीकृत API में जोड़ना।
- **AI Voice Dialer और एजेंट (AI Voice Dialer & Agent):** Twilio + LLM द्वारा स्वायत्त वॉइस कॉल्स और CRM कैलेंडर बुकिंग।
- **प्रेडिक्टिव एक्शन इंजन (Predictive Action Engine):** डेटा ट्रेंड्स का विश्लेषण कर स्वचालित पूर्व-सक्रिय कदम उठाना।
- **सेल्फ-हीलिंग वर्कफ़्लो (Self-Healing Workflows):** API एरर या डाउनटाइम होने पर Redis बफर व सर्किट ब्रेकर द्वारा स्वतः पुनर्प्राप्ति।
- **यूनिवर्सल कॉन्टेक्स्ट मेमोरी (Universal Context Memory):** वेक्टर डेटाबेस (Pinecone/pgvector) के साथ पूर्ण व्यावसायिक संदर्भ।

#### चरण 2: तकनीकी आर्किटेक्चर और MVP विकास (Technical Architecture & MVP)
- **प्लग-एंड-प्ले कनेक्टर फ्रेमवर्क (Plug-and-Play Connector Framework):** मानकीकृत IConnectorAdapter इंटरफेस।
- **कनेक्ट गेटवे (Connect Gateway):** Docker/K8s आधारित सुरक्षित ऑन-प्रिमाइसेस व प्राइवेट क्लाउड ब्रिज।
- **OAuth 2.0 और जीरो-ट्रस्ट सिक्योरिटी (Zero-Trust Security):** एंड-टू-एंड एन्क्रिप्शन (AES-256) और टोकन रोटेशन।
- **शीर्ष 25 MVP कनेक्टर्स:**
  1. PostgreSQL, 2. MySQL, 3. SQL Server, 4. Snowflake, 5. Amazon S3, 6. Google Sheets, 7. Salesforce, 8. Slack, 9. Shopify, 10. GitHub, 11. Jira, 12. Google BigQuery, 13. Microsoft Excel, 14. Stripe, 15. Twilio, 16. Mailchimp, 17. HubSpot, 18. Zapier, 19. Airtable, 20. AWS Lambda, 21. Firebase, 22. Microsoft Teams, 23. Zoom, 24. Microsoft Dynamics 365, 25. QuickBooks.

#### चरण 3: बाज़ार लॉन्च और स्केलिंग (Market Launch & Scaling to $1M+ ARR)
- **बीटा लॉन्च (Days 1 - 30):** 100-200 अर्ली अडॉप्टर्स, बग फिक्सिंग, केस स्टडीज।
- **आधिकारिक लॉन्च (Days 31 - 90):** 1,000+ ग्राहक, सेल्फ-सर्विस ऑनबोर्डिंग, $80k+ MRR।
- **ग्लोबल स्केलिंग (Months 4 - 12):** 10,000+ ग्राहक, $1,000,000+ ARR, क्लाउड मार्केटप्लेस इंटीग्रेशन।

---

### 3. राजस्व मॉडल (Revenue Model & Unit Economics)
- **Freemium (₹):** मुफ़्त प्लान (सीमित वॉल्यूम) + $29/माह स्टार्टर प्लान। प्रवेश बाधा: शून्य।
- **Subscription ($):** $79/माह - $299/माह प्रो सब्सक्रिप्शन। स्थिर आवर्ती राजस्व (ARR)।
- **Enterprise + Pay-As-You-Go (∞):** कस्टम SLA, ऑन-प्रिमाइसेस कनेक्ट गेटवे, समर्पित सपोर्ट। उच्च LTV।
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([markdownContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${brand}-Execution-Plan.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d0d1a] border border-[#7c5cff]/40 p-6 sm:p-7 shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#22d3ee]" />
            <h3 className="font-display font-bold text-xl text-white">
              {lang === 'hi' ? 'क्रियान्वयन ब्लूप्रिंट एक्सपोर्ट' : 'Export Execution Blueprint'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9a9ab0] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto rounded-xl bg-[#07070d] border border-white/10 p-4 font-mono text-xs text-[#a5f3fc] mb-4 scrollbar-none">
          <pre className="whitespace-pre-wrap font-mono leading-relaxed">
            {markdownContent}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#9a9ab0]">
            Format: Markdown (.md)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (lang === 'hi' ? 'कॉपी हो गया!' : 'Copied!') : (lang === 'hi' ? 'कॉपी करें' : 'Copy')}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] hover:opacity-90 flex items-center gap-1.5 cursor-pointer transition-opacity shadow-[0_4px_16px_rgba(124,92,255,0.3)]"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'hi' ? 'डाउनलोड करें (.md)' : 'Download .md'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
