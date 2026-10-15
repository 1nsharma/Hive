import React, { useState } from 'react';
import { Star, Sparkles, Copy, Check, ExternalLink, MessageSquare, ArrowRight, RefreshCw, ThumbsUp } from 'lucide-react';
import { WorkshopConfig } from '../types';

interface AiReviewAssistantProps {
  workshopConfig: WorkshopConfig;
}

export const AiReviewAssistant: React.FC<AiReviewAssistantProps> = ({ workshopConfig }) => {
  const [words, setWords] = useState('');
  const [language, setLanguage] = useState<'hinglish' | 'en' | 'hi'>('hinglish');
  const [loading, setLoading] = useState(false);
  const [generatedReview, setGeneratedReview] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);

  const quickChips = [
    { label: '⚡ Midnight Breakdown (2 AM)', text: 'midnight emergency breakdown, arrived in 25 mins' },
    { label: '🛠️ Air Brake & Wabco Valve', text: 'air brake pressure leak, genuine valve replacement' },
    { label: '💰 Honest Rate & No Hidden Cost', text: 'very fair labor charges, genuine transparent bill' },
    { label: '🚚 Heavy Recovery Crane', text: 'heavy under-lift crane towing, quick highway recovery' },
    { label: '⚙️ Tata / Leyland Genuine Parts', text: 'OEM filters, clutch booster, skilled commercial mechanic' },
    { label: '📍 Gadan Khera Bypass Unnao', text: 'quick response near Gadan Khera flyover toll' }
  ];

  const handleSelectChip = (chipText: string) => {
    if (!words.trim()) {
      setWords(chipText);
    } else if (!words.toLowerCase().includes(chipText.toLowerCase())) {
      setWords((prev) => `${prev.trim()}, ${chipText}`);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers / iframes
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      return true;
    } catch (e) {
      console.error('Clipboard copy failed:', e);
      return false;
    }
  };

  const openGoogleReviewUrl = () => {
    const url = workshopConfig.googleReviewUrl || 'https://maps.app.goo.gl/QcYsfEK4xaUVxngF7?g_st=ac';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleGenerateAndPost = async () => {
    setLoading(true);
    setCopied(false);
    setAutoOpened(false);

    try {
      const res = await fetch('/api/ai/write-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          words: words.trim(),
          language,
          serviceType: 'Commercial Truck Breakdown & Repair'
        })
      });

      const data = await res.json();
      const reviewText = data.review || 'TruckWala 24×7 at Gadan Khera Bypass Flyover, Unnao provided fast and honest service. Highly skilled mechanics, quick arrival, and genuine pricing. 5 stars!';

      setGeneratedReview(reviewText);

      // 1. Copy to clipboard automatically
      await copyToClipboard(reviewText);

      // 2. Open Google Maps direct review link automatically
      setTimeout(() => {
        openGoogleReviewUrl();
        setAutoOpened(true);
      }, 400);

    } catch (err) {
      console.error('AI Review generation failed:', err);
      const fallbackText = 'TruckWala 24×7 provided excellent emergency breakdown assistance at Gadan Khera Bypass Flyover. Prompt arrival, skilled mechanics, and very fair pricing. Best 5-star commercial workshop on Kanpur-Lucknow highway!';
      setGeneratedReview(fallbackText);
      await copyToClipboard(fallbackText);
      openGoogleReviewUrl();
      setAutoOpened(true);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCopyAndOpen = async () => {
    if (generatedReview) {
      await copyToClipboard(generatedReview);
      openGoogleReviewUrl();
    }
  };

  return (
    <div id="ai-review-booster" className="mt-12 glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 relative overflow-hidden shadow-2xl bg-linear-to-b from-[#111624] via-[#0E121B] to-[#080A0F]">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF5A1F]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        
        {/* Header with Google Reviews Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-xs font-black text-amber-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI 1-Tap 5★ Google Review Writer</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white flex items-center gap-2">
              <span>Give a Few Words — AI Writes & Auto-Posts</span>
              <span className="hidden sm:inline-flex text-amber-400">★★★★★</span>
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-300">
              Type 2–3 words or tap quick tags below. AI automatically drafts an authentic 5-star review, copies it to your clipboard, and launches Google Maps to paste!
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl shrink-0 self-start sm:self-center">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase">Direct Google Link</div>
              <div className="text-xs font-black text-white font-mono truncate max-w-[140px]">maps.app.goo.gl</div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="mt-6 space-y-5">
          
          {/* 1. Quick Keyword Chips */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Step 1: Tap Quick Tags or Type Your Words
            </label>
            <div className="flex flex-wrap gap-2">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectChip(chip.text)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 active:bg-amber-500/20 border border-white/10 hover:border-amber-400/40 rounded-xl text-xs font-medium text-gray-200 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Custom Words Input Area */}
          <div>
            <div className="relative">
              <textarea
                value={words}
                onChange={(e) => setWords(e.target.value)}
                placeholder="Give some words here... (e.g., air brake lock near flyover, mechanic Raju arrived in 20 min, reasonable rate, genuine parts)"
                rows={2}
                className="w-full px-4 py-3 bg-[#080A0F] border border-white/15 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/70 transition resize-none"
              />
              {words && (
                <button
                  type="button"
                  onClick={() => setWords('')}
                  className="absolute right-3 top-3 text-[11px] text-gray-400 hover:text-white bg-white/10 px-2 py-0.5 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* 3. Language & Style Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-400">Review Language:</span>
              <div className="inline-flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setLanguage('hinglish')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    language === 'hinglish' ? 'bg-[#FF5A1F] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Hinglish (Driver)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    language === 'en' ? 'bg-[#FF5A1F] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    language === 'hi' ? 'bg-[#FF5A1F] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            </div>

            {/* Step Explanation Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 text-xs text-gray-400">
              <span>Auto-copies to clipboard</span>
              <span>→</span>
              <span className="text-amber-400 font-bold">Opens Google Maps Review</span>
            </div>
          </div>

          {/* 4. Action Button: Generate & Auto-Post */}
          <div>
            <button
              type="button"
              onClick={handleGenerateAndPost}
              disabled={loading}
              className="w-full py-4 px-6 bg-linear-to-r from-amber-500 via-[#FF5A1F] to-orange-600 hover:from-amber-400 hover:via-orange-500 hover:to-orange-500 text-white font-black text-sm sm:text-base rounded-2xl flex items-center justify-center space-x-3 shadow-xl shadow-amber-500/25 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>AI Writing 5-Star Review & Preparing Clipboard...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
                  <span>AI Write 5★ Review → Copy to Clipboard & Post on Google</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* 5. Generated Review Output & Direct Actions Card */}
          {generatedReview && (
            <div className="mt-6 p-5 sm:p-6 bg-black/40 border border-amber-500/30 rounded-2xl space-y-4 animate-in fade-in duration-300">
              
              {/* Status Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-emerald-400">
                    {copied ? '✓ Review Copied to Clipboard!' : 'Review Generated!'}
                  </span>
                  {autoOpened && (
                    <span className="text-[11px] text-gray-400 hidden sm:inline">
                      (Google Maps tab opened)
                    </span>
                  )}
                </div>

                <div className="flex items-center text-amber-400 text-sm">
                  ★★★★★
                </div>
              </div>

              {/* Editable Review Preview Box */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                  Generated 5-Star Review (You can edit before posting):
                </label>
                <textarea
                  value={generatedReview}
                  onChange={(e) => setGeneratedReview(e.target.value)}
                  rows={3}
                  className="w-full p-3.5 bg-[#0C1019] border border-white/15 rounded-xl text-sm text-gray-100 font-sans focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              {/* 3 Steps Visual Guide */}
              <div className="grid grid-cols-3 gap-2 py-1 text-center text-[11px] text-gray-400">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  <span className="block font-bold text-emerald-400">1. Copied</span>
                  <span>Text on clipboard</span>
                </div>
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  <span className="block font-bold text-amber-400">2. Google Maps</span>
                  <span>Review page opens</span>
                </div>
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  <span className="block font-bold text-blue-400">3. Paste & Post</span>
                  <span>Tap 5 Stars & Paste</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleManualCopyAndOpen}
                  className="flex-1 py-3 px-4 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-2 shadow-md transition cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied! Open Google Review' : 'Copy Text & Open Google Review'}</span>
                </button>

                <button
                  type="button"
                  onClick={openGoogleReviewUrl}
                  className="sm:w-auto py-3 px-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  <span>Direct Review Link</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
