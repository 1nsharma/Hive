import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Bug, Lightbulb, Search, CheckCircle, Clock, Send, Sparkles } from 'lucide-react';

interface FeedbackViewProps {
  onShowToast: (msg: string) => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ onShowToast }) => {
  const [feedbackType, setFeedbackType] = useState<'feature' | 'bug' | 'general'>('feature');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Search FAQ state
  const [searchQuery, setSearchQuery] = useState('');

  // Feature board votes state
  const [featureVotes, setFeatureVotes] = useState<Record<string, number>>({
    'feat-1': 142,
    'feat-2': 98,
    'feat-3': 76,
    'feat-4': 61,
  });
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  const handleToggleVote = (id: string) => {
    const isVoted = votedMap[id];
    setVotedMap((prev) => ({ ...prev, [id]: !isVoted }));
    setFeatureVotes((prev) => ({
      ...prev,
      [id]: prev[id] + (isVoted ? -1 : 1),
    }));
    onShowToast(isVoted ? 'Vote removed' : '✅ Thank you! Your vote has been recorded.');
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackTitle.trim() || !feedbackMessage.trim()) {
      onShowToast('Please fill in both the title and message details');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackTitle('');
      setFeedbackMessage('');
      onShowToast('✅ Feedback submitted! Our engineering team will review it within 24 hours.');
    }, 1000);
  };

  const FAQS = [
    {
      q: 'How does the PetJanu QR tag work when my dog is lost?',
      a: 'Anyone with a smartphone scans the QR code on your pet collar. They instantly view your pet profile and click "Call Owner" or "Send WhatsApp". You receive an instant location notification.'
    },
    {
      q: 'Do finders need to download the PetJanu app to scan the tag?',
      a: 'No! The QR code opens instantly in any standard phone browser (Chrome, Safari, Camera app) without needing app downloads.'
    },
    {
      q: 'Is my personal phone number displayed publicly on the tag?',
      a: 'No. We use encrypted proxy calling and WhatsApp links to shield your real phone number from unauthorized scrapers.'
    },
    {
      q: 'Can I update my pet details after buying the tag?',
      a: 'Yes! You can update phone numbers, medical notes, and photos in your PetJanu dashboard anytime, and changes reflect on the tag instantly.'
    }
  ];

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-16 text-[#1C2B23]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <MessageSquare className="w-4 h-4 text-amber-800" /> COMMUNITY &amp; TRANSPARENT FEEDBACK
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#1C2B23]">
          Help Us Build <span className="text-[#175741]">PetJanu</span>
        </h1>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed font-medium">
          Vote on upcoming features, report bugs directly to product architects, and check our 24-hour SLA commitment.
        </p>
      </div>

      {/* SLA Commitment Banner */}
      <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-[#175741] text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F0A21E] text-amber-950 font-bold flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg">Our 24-Hour Guaranteed SLA Commitment</h3>
            <p className="text-xs text-stone-200 mt-0.5">Every bug report and community suggestion is reviewed by our engineering team within 24 hours.</p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-mono text-xs font-bold shrink-0 border border-white/20">
          AVG SLA: 1.4 Hours
        </div>
      </div>

      {/* Grid: Feedback Form & Feature Voting Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        {/* Feedback Submission Form */}
        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-6">
          <div className="space-y-1 border-b pb-4" style={{ borderColor: '#F0EBE1' }}>
            <h2 className="font-serif text-xl font-bold text-[#1C2B23]">Submit Direct Feedback</h2>
            <p className="text-xs text-stone-500">Report an issue or suggest an improvement</p>
          </div>

          <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
            {/* Type selector */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFeedbackType('feature')}
                className={`flex-1 py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  feedbackType === 'feature' ? 'bg-[#175741] text-white border-[#175741]' : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-[#F0A21E]" /> Idea
              </button>

              <button
                type="button"
                onClick={() => setFeedbackType('bug')}
                className={`flex-1 py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  feedbackType === 'bug' ? 'bg-[#175741] text-white border-[#175741]' : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                <Bug className="w-3.5 h-3.5 text-amber-500" /> Bug Report
              </button>

              <button
                type="button"
                onClick={() => setFeedbackType('general')}
                className={`flex-1 py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  feedbackType === 'general' ? 'bg-[#175741] text-white border-[#175741]' : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> General
              </button>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">Subject Title</label>
              <input
                type="text"
                placeholder="e.g., Add Hindi language toggle for tag scan page"
                value={feedbackTitle}
                onChange={(e) => setFeedbackTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD3] bg-stone-50 font-medium focus:outline-none focus:ring-2 focus:ring-[#175741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">Detailed Description</label>
              <textarea
                rows={4}
                placeholder="Describe your suggestion or step-by-step bug behavior..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD3] bg-stone-50 font-medium focus:outline-none focus:ring-2 focus:ring-[#175741]"
              />
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="w-full py-3 rounded-2xl bg-[#175741] text-white font-bold text-xs hover:bg-[#124533] cursor-pointer flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              {submitted ? 'Submitting Report...' : <><Send className="w-4 h-4 text-[#F0A21E]" /> Send to Product Team</>}
            </button>
          </form>
        </div>

        {/* Feature Request Voting Board */}
        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-6">
          <div className="space-y-1 border-b pb-4" style={{ borderColor: '#F0EBE1' }}>
            <h2 className="font-serif text-xl font-bold text-[#1C2B23]">Public Roadmap &amp; Feature Board</h2>
            <p className="text-xs text-stone-500">Vote on features you want built next</p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-stone-900 text-xs">NFC Tap Backup for Collar Tags</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Combine QR codes with instant tap NFC chips in all smart tags.</p>
                <span className="inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">STATUS: IN DEVELOPMENT</span>
              </div>
              <button
                onClick={() => handleToggleVote('feat-1')}
                className={`px-3 py-2 rounded-xl border font-bold text-xs cursor-pointer flex flex-col items-center shrink-0 ${
                  votedMap['feat-1'] ? 'bg-[#175741] text-white border-[#175741]' : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-100'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{featureVotes['feat-1']}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-stone-900 text-xs">WhatsApp Bot Symptom Checker</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Ask pet symptom advice directly via WhatsApp audio messages.</p>
                <span className="inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">STATUS: PLANNING</span>
              </div>
              <button
                onClick={() => handleToggleVote('feat-2')}
                className={`px-3 py-2 rounded-xl border font-bold text-xs cursor-pointer flex flex-col items-center shrink-0 ${
                  votedMap['feat-2'] ? 'bg-[#175741] text-white border-[#175741]' : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-100'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{featureVotes['feat-2']}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-stone-900 text-xs">Multi-Pet Identity Dashboard</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Easily manage up to 5 pets under one primary parent phone number.</p>
                <span className="inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">STATUS: REVIEWING</span>
              </div>
              <button
                onClick={() => handleToggleVote('feat-3')}
                className={`px-3 py-2 rounded-xl border font-bold text-xs cursor-pointer flex flex-col items-center shrink-0 ${
                  votedMap['feat-3'] ? 'bg-[#175741] text-white border-[#175741]' : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-100'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{featureVotes['feat-3']}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Public Changelog Section */}
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: '#F0EBE1' }}>
          <Sparkles className="w-6 h-6 text-[#175741]" />
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1C2B23]">Public Changelog (What's New)</h2>
            <p className="text-xs text-stone-500">PetJanu Release Version 1.2.0 (August 2026)</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-stone-700 font-medium">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 text-sm">v1.2.0 — Production Security &amp; Tele-Vet Integration</span>
              <span className="text-[10px] text-stone-400 font-mono">12 Aug 2026</span>
            </div>
            <ul className="list-disc pl-5 text-[11px] space-y-1 text-stone-600">
              <li>Added bank-grade TLS 1.3 and AES-256 data security headers with PII scrubbing.</li>
              <li>Integrated instant SMS OTP authentication via Google Firebase Auth.</li>
              <li>Enabled Razorpay UPI &amp; Cards checkout modal with PCI DSS compliance.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Searchable Help Center FAQs */}
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-6">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-[#1C2B23]">Help Center &amp; Searchable FAQs</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search help topics (e.g. lost pet, qr scan, phone masking)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E5DFD3] bg-stone-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#175741]"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1 text-xs">
              <h4 className="font-bold text-stone-900 text-sm">{faq.q}</h4>
              <p className="text-stone-600 leading-relaxed font-medium text-[11px]">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
