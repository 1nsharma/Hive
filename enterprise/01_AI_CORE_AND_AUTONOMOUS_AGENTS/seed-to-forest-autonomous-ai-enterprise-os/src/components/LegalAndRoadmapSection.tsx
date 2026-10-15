import React, { useState } from 'react';
import { CheckCircle2, Calendar, Scale, Shield, Building2, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { DAY_1_90_ROADMAP } from '../data/blueprintData';
import { SupportedLanguage, TRANSLATIONS } from '../data/i18n';

interface LegalAndRoadmapSectionProps {
  language: SupportedLanguage;
}

export const LegalAndRoadmapSection: React.FC<LegalAndRoadmapSectionProps> = ({ language }) => {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    't-0-0': true,
    't-0-1': true,
    't-0-2': true,
    't-1-0': true,
    't-1-1': true
  });

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Hero Header */}
      <div className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold text-[#141414] uppercase tracking-wider mb-2 border border-[#141414] bg-white px-2.5 py-0.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? '90-दिवसीय कार्यान्वयन रोडमैप' : 'The 90-Day Execution Roadmap'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] leading-tight">
              {language === 'hi'
                ? 'बीज से जंगल: Day 1 से Day 90 का चरणबद्ध ब्लूप्रिंट'
                : 'Seed to Forest: Day 1 to Day 90 Structured Milestones'}
            </h1>
            <p className="text-[#575653] text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed font-sans">
              {language === 'hi'
                ? 'संविधान और कानूनी ढांचे से शुरू करके, पहले 3 माइक्रो-SaaS प्रयोगों को लाइव करने और स्वायत्त रीइन्वेस्टमेंट फ्लाईव्हील तक का स्पष्ट इंजीनियरिंग रोडमैप।'
                : 'Actionable timeline transitioning from initial legal shell to multi-agent sandbox execution, first monetization trials, and cashflow recycling.'}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Phases Timeline */}
      <div className="space-y-4">
        {DAY_1_90_ROADMAP.map((phase, pIdx) => (
          <div key={pIdx} className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#141414] gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold text-[#575653] uppercase">{phase.phase}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-white border border-[#141414] text-[#141414]">
                    [{phase.status || 'PROPOSED'}]
                  </span>
                </div>
                <h3 className="text-base font-serif font-bold text-[#141414] mt-0.5">{phase.title}</h3>
              </div>
              <div className="bg-white px-3 py-1 border border-[#141414] text-xs font-mono text-[#141414] shadow-xs">
                🎯 {phase.milestone}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {phase.tasks.map((task, tIdx) => {
                const taskId = `t-${pIdx}-${tIdx}`;
                const isDone = !!completedTasks[taskId];
                return (
                  <div
                    key={taskId}
                    onClick={() => toggleTask(taskId)}
                    className={`cursor-pointer p-3 border transition flex items-start space-x-2.5 text-xs ${
                      isDone
                        ? 'bg-white border-[#141414] text-[#141414]'
                        : 'bg-[#F4F3F0] border-[#141414]/40 text-[#575653] hover:border-[#141414]'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDone ? 'text-[#10b981]' : 'text-[#a8a6a1]'}`} />
                    <span className={isDone ? 'font-medium text-[#141414]' : ''}>{task}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legal & Ownership Reality Check */}
      <div className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 space-y-5 shadow-xs">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold text-[#141414] uppercase tracking-wider border border-[#141414] bg-white px-2.5 py-0.5">
          <Scale className="w-3.5 h-3.5" />
          <span>⚖️ Legal & Ownership Reality Check (Day 1)</span>
        </div>

        <h2 className="text-lg font-serif font-bold text-[#141414]">
          {language === 'hi'
            ? 'AI को कानूनी व्यक्ति मत मानो: कॉर्पोरेट कार्ड और कानूनी सुरक्षा'
            : 'AI is Not a Legal Person: Corporate Sub-Account & Indian Law Compliance'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 border border-[#141414] space-y-2">
            <div className="flex items-center space-x-2 text-[#141414] font-mono font-bold text-xs">
              <Building2 className="w-4 h-4 text-[#141414]" />
              <span>1. Legal Entity & Bank</span>
            </div>
            <p className="text-[#575653] leading-relaxed font-sans">
              एक साधारण <strong>Private Limited या LLP</strong> (जिसके 100% संस्थापक आप हैं)। बैंक खाता और GST नंबर कंपनी के नाम पर पंजीकृत होगा।
            </p>
          </div>

          <div className="bg-white p-4 border border-[#141414] space-y-2">
            <div className="flex items-center space-x-2 text-[#141414] font-mono font-bold text-xs">
              <Shield className="w-4 h-4 text-[#141414]" />
              <span>2. AI का वास्तविक दर्जा</span>
            </div>
            <p className="text-[#575653] leading-relaxed font-sans">
              AI एक "अत्यधिक उन्नत, स्वायत्त कर्मचारी" है जिसके पास कॉर्पोरेट कार्ड की <strong>₹20,000 की वर्चुअल सब-लिमिट</strong> है। कोई कानूनी भ्रम नहीं।
            </p>
          </div>

          <div className="bg-white p-4 border border-[#141414] space-y-2">
            <div className="flex items-center space-x-2 text-[#141414] font-mono font-bold text-xs">
              <TrendingUp className="w-4 h-4 text-[#141414]" />
              <span>3. भविष्य: DAO / Trust</span>
            </div>
            <p className="text-[#575653] leading-relaxed font-sans">
              जब सिस्टम <strong>₹10 Cr/year</strong> कमाने लगे, तब इसे स्वायत्त DAO या Trust संरचना में स्थानांतरित किया जा सकता है। Day 1 पर सादगी ही सबसे बड़ी सुरक्षा है।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
