import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Check, Loader2, Rocket } from "lucide-react";

interface OnboardingWizardProps {
  onComplete: (config: any) => void;
  shopName: string;
  phone: string;
}

export default function OnboardingWizard({ onComplete, shopName, phone }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState(shopName);
  const [phoneNumber, setPhoneNumber] = useState(phone);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  
  // New fields
  const [gstNumber, setGstNumber] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [munimStyle, setMunimStyle] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!description || !businessName) return;
    setLoading(true);
    
    try {
      const response = await fetch("/api/onboarding/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          businessName, 
          description, 
          phoneNumber,
          address,
          gstNumber,
          mapsLink,
          munimStyle
        })
      });
      const data = await response.json();
      setGeneratedConfig(data);
      setStep(4); // AI Setup step is now 4
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please try again.");
      setStep(2); // Go back to step 2 on failure
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    onComplete({ 
      businessName, 
      description,
      phone: phoneNumber,
      address,
      gstNumber,
      mapsLink,
      munimStyle,
      ...generatedConfig 
    });
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col font-sans relative overflow-y-auto">
      
      {/* Header */}
      <div className="px-4 py-4 flex items-center border-b border-gray-100">
        <button className="p-2 -ml-2 text-gray-900 rounded-full hover:bg-gray-50 cursor-pointer">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 ml-2">
          {step >= 3 ? "AI is setting up your shop" : "Business Setup"}
        </h1>
      </div>

      {step < 3 && (
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
            <span className="text-[10px] font-bold text-[#16A34A]">Business</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-100 mx-2 mt-[-16px]"></div>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
            <span className={`text-[10px] font-bold ${step >= 2 ? 'text-[#16A34A]' : 'text-gray-400'}`}>Details</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-100 mx-2 mt-[-16px]"></div>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
            <span className="text-[10px] font-bold text-gray-400">AI Setup</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-100 mx-2 mt-[-16px]"></div>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 4 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>4</div>
            <span className="text-[10px] font-bold text-gray-400">Finish</span>
          </div>
        </div>
      )}

      <div className="flex-1 px-6 pb-24">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 mt-4">
            <h2 className="text-xl font-bold text-gray-900">Tell us about your business</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-[#16A34A] transition-shadow"
                  placeholder="e.g. Sharma Medical Store"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-[#16A34A] transition-shadow"
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Shop Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-[#16A34A] transition-shadow resize-none"
                  placeholder="Complete shop address"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Describe your business</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-[#16A34A] transition-shadow resize-none"
                  placeholder="We sell medicines, OTC products, baby products and provide home delivery."
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 mt-4">
            <h2 className="text-xl font-bold text-gray-900">Additional Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">GST Number (Optional)</label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-[#16A34A] transition-shadow"
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Google Business Profile (Map Link)</label>
                <input
                  type="url"
                  value={mapsLink}
                  onChange={(e) => setMapsLink(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-[#16A34A] transition-shadow"
                  placeholder="https://maps.app.goo.gl/..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">AI Munim Style / Personality</label>
                <textarea
                  value={munimStyle}
                  onChange={(e) => setMunimStyle(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-[#16A34A] transition-shadow resize-none"
                  placeholder="How should the AI behave? e.g. Polite, strict about credit, talks in local language, knows about specific products."
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#16A34A] animate-spin" />
            <h2 className="text-xl font-bold text-gray-900">AI is analyzing...</h2>
            <p className="text-sm text-gray-500 max-w-[250px]">Building the optimal setup for {businessName}</p>
          </motion.div>
        )}

        {step === 4 && generatedConfig && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center mt-8 space-y-8">
            <div className="w-32 h-32 bg-[#16A34A]/10 rounded-full flex items-center justify-center relative">
              <span className="text-5xl">🤖</span>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-4 left-0 w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
            
            <div className="w-full space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-[#16A34A]" />
                <span className="font-medium">Detecting business type</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-[#16A34A]" />
                <span className="font-medium">Creating dashboard</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-[#16A34A]" />
                <span className="font-medium">Setting up inventory</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-[#16A34A]" />
                <span className="font-medium">Configuring WhatsApp flows</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-[#16A34A]" />
                <span className="font-medium">Enabling AI agents</span>
              </div>
            </div>

            <div className="text-center font-bold text-lg text-gray-900 mt-8 flex items-center gap-2">
              Almost done... <Rocket className="w-5 h-5 text-[#16A34A]" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-white border-t border-gray-50 pb-safe">
        {step === 1 && (
          <button
            onClick={() => {
              setStep(2);
            }}
            disabled={!description || !businessName}
            className="w-full py-4 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Continue
          </button>
        )}
        {step === 2 && (
          <button
            onClick={() => {
              setStep(3);
              handleAnalyze();
            }}
            disabled={!munimStyle}
            className="w-full py-4 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Analyze & Setup
          </button>
        )}
        {step === 4 && (
          <button
            onClick={handleFinish}
            className="w-full py-4 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition-all shadow-md cursor-pointer"
          >
            Start Operating Business
          </button>
        )}
      </div>

    </div>
  );
}
