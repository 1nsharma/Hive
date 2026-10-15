import React from 'react';
import { Language } from '../types';
import { BRAND_INFO } from '../data/researchData';

interface FooterProps {
  language: Language;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate }) => {
  const isHi = language === 'hi';

  return (
    <footer className="border-t border-stone-800 bg-stone-950 py-16 text-stone-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Identity & Epistemic Rule */}
          <div className="md:col-span-6 space-y-4">
            <div className="font-serif text-2xl font-light text-stone-100">
              Aemy AI Studio
              <span className="ml-2 font-serif italic text-stone-400 text-base">
                {isHi ? `द्वारा ${BRAND_INFO.founder}` : `by ${BRAND_INFO.founder}`}
              </span>
            </div>

            <p className="text-xs font-mono text-amber-500 uppercase tracking-wider">
              {isHi ? BRAND_INFO.positioningHi : BRAND_INFO.positioningEn}
            </p>

            <blockquote className="font-serif italic text-sm text-stone-300 leading-relaxed border-l border-stone-700 pl-3">
              "{isHi ? BRAND_INFO.publicLineHi : BRAND_INFO.publicLineEn}"
            </blockquote>

            <div className="text-xs text-stone-500 font-mono">
              Principle: Question → Evidence → Experiment → Result → Revision
            </div>
          </div>

          {/* Studio Wings Navigation */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-stone-300">
              {isHi ? 'स्टूडियो प्रभाग (Wings)' : 'Studio Wings'}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('pillars')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {isHi ? '01. Research (AI & Human)' : '01. Research (AI & Human)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('labs')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {isHi ? '02. Labs (Agent Sandboxes)' : '02. Labs (Agent Sandboxes)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {isHi ? '03. Products (AI Tools & SaaS)' : '03. Products (AI Tools & SaaS)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('funnel')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {isHi ? '04. Media (X, YouTube, LinkedIn)' : '04. Media (X, YouTube, LinkedIn)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('series')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {isHi ? '05. Publications (Whitepapers & Book)' : '05. Publications (Whitepapers & Book)'}
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional Publications */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-stone-300">
              {isHi ? 'प्रकाशन व आउटपुट' : 'Publications & Canon'}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('book')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {isHi ? 'द सर्च विदिन (12 अध्याय)' : 'The Search Within (12 Ch)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('playbook')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {isHi ? '8-चरणीय शोध प्लेबुक' : '8-Step Research Playbook'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('audit')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {isHi ? 'मानव संप्रभुता डायग्नोस्टिक' : 'Human Agency Diagnostic'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ecosystem')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {isHi ? '10-वर्षीय संस्थागत रोडमैप' : '10-Year Institution Roadmap'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet Bottom Strip */}
        <div className="border-t border-stone-800/80 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-stone-600">
          <div>
            © {new Date().getFullYear()} Aemy AI Studio · By Amit Sharma · All Rights Reserved
          </div>
          <div>
            Building, questioning, and researching the future of intelligence.
          </div>
        </div>
      </div>
    </footer>
  );
};
