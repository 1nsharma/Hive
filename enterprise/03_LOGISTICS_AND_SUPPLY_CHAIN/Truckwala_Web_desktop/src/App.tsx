import React, { useState, useEffect } from 'react';
import { Language, WorkshopConfig } from './types';
import { Navbar } from './components/Navbar';
import { Truck3DHero } from './components/Truck3DHero';
import { StatsStrip } from './components/StatsStrip';
import { FastHighwayHelpDesk } from './components/FastHighwayHelpDesk';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { BrandEntitySection } from './components/BrandEntitySection';
import { ServiceAreaSection } from './components/ServiceAreaSection';
import { RatesTransparency } from './components/RatesTransparency';
import { GoogleBusinessSection } from './components/GoogleBusinessSection';
import { OwnerDashboardModal } from './components/OwnerDashboardModal';
import { SuccessModal } from './components/SuccessModal';
import { Footer } from './components/Footer';
import { MobileActionBar } from './components/MobileActionBar';
import { WORKSHOP_CONFIG } from './data/servicesData';
import { trackPageView, fetchRemoteLeads, fetchWorkshopConfig } from './utils/analytics';

export function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [leadsModalOpen, setLeadsModalOpen] = useState(false);
  const [successModalData, setSuccessModalData] = useState<{ leadId: string; formType: string } | null>(null);
  const [leadsCount, setLeadsCount] = useState(0);
  const [preFilledRepairService, setPreFilledRepairService] = useState<string | undefined>(undefined);
  const [workshopConfig, setWorkshopConfig] = useState<WorkshopConfig>(WORKSHOP_CONFIG);

  useEffect(() => {
    trackPageView();
    // Load remote leads count and server config
    fetchRemoteLeads().then(leads => {
      setLeadsCount(leads.length);
    });
    fetchWorkshopConfig().then(cfg => {
      if (cfg) setWorkshopConfig(cfg);
    });
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    document.documentElement.lang = newLang;
  };

  const handleLeadSuccess = (leadId: string, formType: string) => {
    setSuccessModalData({ leadId, formType });
    setLeadsCount(prev => prev + 1);
  };

  const handleSelectServiceForRepair = (serviceName: string) => {
    setPreFilledRepairService(serviceName);
    const elem = document.getElementById('sos-desk');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToEmergency = () => {
    const elem = document.getElementById('sos-desk');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-white flex flex-col antialiased selection:bg-[#FF5A1F] selection:text-white">
      
      {/* 1. Brand Fixed Navbar */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenLeadsModal={() => setLeadsModalOpen(true)}
        leadsCount={leadsCount}
        workshopConfig={workshopConfig}
      />

      {/* Main Content Sections */}
      <main className="flex-1 pb-16 md:pb-0">
        
        {/* 2. TruckWala 3D Hero Section (Night Highway + 3D Truck Illustration + Audio/Light controls) */}
        <Truck3DHero 
          language={language} 
          workshopConfig={workshopConfig}
        />

        {/* 6. Statistics Strip (500+ Vehicles, 24×7, 1000+ Customers, Kanpur + Coverage) */}
        <StatsStrip 
          workshopConfig={workshopConfig} 
        />

        {/* 3. Fast Highway Breakdown Desk (Zero-Friction 30-sec SOS Desk) */}
        <FastHighwayHelpDesk
          language={language}
          workshopConfig={workshopConfig}
          onSuccess={handleLeadSuccess}
        />

        {/* 5. 12 Commercial Vehicle Services Grid */}
        <ServicesSection 
          language={language} 
          onSelectServiceForRepair={handleSelectServiceForRepair} 
        />

        {/* 8. About TruckWala Section */}
        <AboutSection 
          language={language} 
        />

        {/* Brand Entity Consistency & Verification Footprint */}
        <BrandEntitySection
          language={language}
          workshopConfig={workshopConfig}
        />

        {/* 9. Service Area & Highway Corridor Coverage Map */}
        <ServiceAreaSection 
          language={language} 
          workshopConfig={workshopConfig} 
        />

        {/* Rate Transparency Benchmarks */}
        <RatesTransparency language={language} />

        {/* 10. Google Business & Verified Workshop Section */}
        <GoogleBusinessSection 
          language={language} 
          workshopConfig={workshopConfig}
        />
      </main>

      {/* 11. Footer with Complete Solution Tagline, Disclaimer & Services List */}
      <Footer
        language={language}
        onOpenLeadsModal={() => setLeadsModalOpen(true)}
        leadsCount={leadsCount}
        workshopConfig={workshopConfig}
      />

      {/* 12. Persistent Mobile Bottom Action Bar: [ CALL ] [ WHATSAPP ] [ REQUEST SERVICE ] */}
      <MobileActionBar
        workshopConfig={workshopConfig}
        onRequestService={scrollToEmergency}
      />

      {/* 7. TruckWala Operating System Hub (Vehicle OS, Active Tickets, AI Diagnostics, Telemetry) */}
      <OwnerDashboardModal
        isOpen={leadsModalOpen}
        onClose={() => setLeadsModalOpen(false)}
        language={language}
        currentConfig={workshopConfig}
        onConfigUpdated={(newCfg) => setWorkshopConfig(newCfg)}
      />

      {/* Confirmation Modal */}
      <SuccessModal
        leadId={successModalData?.leadId || null}
        formType={successModalData?.formType || null}
        onClose={() => setSuccessModalData(null)}
        language={language}
      />

    </div>
  );
}

export default App;
