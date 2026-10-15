import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Volume2,
  BookOpen,
  Image as ImageIcon,
  Users,
  ShieldAlert,
  Award,
  Plus,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { CulturalClaim, ClaimCategory, VerificationStatus, EvidenceItem, CommunityReview } from '../types';

interface ClaimInspectorProps {
  claims: CulturalClaim[];
  setClaims: React.Dispatch<React.SetStateAction<CulturalClaim[]>>;
  lang: 'hi' | 'en';
  onBookExperience?: (claim: CulturalClaim) => void;
}

export const ClaimInspector: React.FC<ClaimInspectorProps> = ({
  claims,
  setClaims,
  lang,
  onBookExperience
}) => {
  const [selectedClaimId, setSelectedClaimId] = useState<string>(claims[0]?.id || 'C-0001');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState<boolean>(false);
  const [showAddReviewModal, setShowAddReviewModal] = useState<boolean>(false);

  // New Evidence Form State
  const [newEvTitle, setNewEvTitle] = useState('');
  const [newEvSource, setNewEvSource] = useState('');
  const [newEvYear, setNewEvYear] = useState('2026');
  const [newEvType, setNewEvType] = useState<EvidenceItem['type']>('gazetteer');
  const [newEvExcerpt, setNewEvExcerpt] = useState('');

  // New Community Review Form State
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newReviewerRole, setNewReviewerRole] = useState('');
  const [newReviewNotes, setNewReviewNotes] = useState('');
  const [newReviewAction, setNewReviewAction] = useState<'CONFIRMED' | 'CORRECTED' | 'DISPUTED'>('CONFIRMED');

  const selectedClaim = claims.find((c) => c.id === selectedClaimId) || claims[0];

  const filteredClaims = claims.filter((c) => {
    const matchesSearch =
      c.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.statement.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvTitle || !newEvSource || !selectedClaim) return;

    const newEvidence: EvidenceItem = {
      id: `E-${Date.now().toString().slice(-4)}`,
      type: newEvType,
      title: newEvTitle,
      source: newEvSource,
      year: newEvYear,
      excerpt: newEvExcerpt || 'Field-verified cultural citation.',
      confidence: 0.92
    };

    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === selectedClaim.id) {
          const updatedEvidence = [...c.evidence, newEvidence];
          // Slightly boost confidence if new primary evidence is appended
          const updatedScore = Math.min(0.99, Number((c.confidenceScore + 0.02).toFixed(2)));
          return {
            ...c,
            evidence: updatedEvidence,
            confidenceScore: updatedScore
          };
        }
        return c;
      })
    );

    setNewEvTitle('');
    setNewEvSource('');
    setNewEvExcerpt('');
    setShowAddEvidenceModal(false);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName || !selectedClaim) return;

    const newReview: CommunityReview = {
      id: `CR-${Date.now().toString().slice(-4)}`,
      name: newReviewerName,
      designation: newReviewerRole || 'Community Elder & Resident',
      locality: selectedClaim.locality,
      action: newReviewAction,
      notes: newReviewNotes || 'Verified based on local oral consensus.',
      timestamp: new Date().toISOString().slice(0, 10)
    };

    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === selectedClaim.id) {
          return {
            ...c,
            communityReviews: [...c.communityReviews, newReview]
          };
        }
        return c;
      })
    );

    setNewReviewerName('');
    setNewReviewerRole('');
    setNewReviewNotes('');
    setShowAddReviewModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/30">
              {lang === 'hi' ? 'सांस्कृतिक सत्यापन रिकॉर्ड (CVR)' : 'Cultural Verification Records (CVR)'}
            </span>
            <span className="text-xs text-stone-400">
              {claims.length} {lang === 'hi' ? 'पायलट रिकॉर्ड्स' : 'Pilot Claims'}
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-100 mt-1">
            {lang === 'hi' ? 'साक्ष्य ग्राफ़ एवं प्रामाणिकता अभिलेखागार' : 'Evidence Graph & Provenance Ledger'}
          </h2>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              id="claim-search-input"
              type="text"
              placeholder={lang === 'hi' ? 'दावे खोजें (लड्डू, चमड़ा, घाट)...' : 'Search claims (Laddu, Leather, Ghat)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-stone-800 bg-stone-900 pl-9 pr-4 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-none w-56 sm:w-64"
            />
          </div>

          <select
            id="category-filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-200 focus:border-amber-500 focus:outline-none"
          >
            <option value="ALL">{lang === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}</option>
            <option value="food">{lang === 'hi' ? 'मिष्ठान व खानपान (Food)' : 'Food Heritage'}</option>
            <option value="craft">{lang === 'hi' ? 'शिल्प व कारीगरी (Craft)' : 'Artisan Craft'}</option>
            <option value="oral_history">{lang === 'hi' ? 'मौखिक गाथाएं (Oral History)' : 'Oral Traditions'}</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Left List + Right Inspection Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Claims */}
        <div className="lg:col-span-4 space-y-2 max-h-[750px] overflow-y-auto pr-1">
          {filteredClaims.map((claim) => {
            const isSelected = claim.id === selectedClaim.id;
            return (
              <button
                key={claim.id}
                id={`claim-card-${claim.id}`}
                onClick={() => setSelectedClaimId(claim.id)}
                className={`w-full text-left rounded-xl p-3.5 border transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-stone-900 shadow-md ring-1 ring-amber-500/30'
                    : 'border-stone-800 bg-stone-950/60 hover:bg-stone-900/60 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-semibold text-amber-400">{claim.id}</span>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        claim.status === 'VERIFIED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {claim.status === 'VERIFIED' ? (lang === 'hi' ? 'सत्यापित' : 'VERIFIED') : (lang === 'hi' ? 'आंशिक' : 'PARTIAL')}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-300">
                      {Math.round(claim.confidenceScore * 100)}%
                    </span>
                  </div>
                </div>

                <div className="mt-1 font-semibold text-sm text-stone-100 line-clamp-1">
                  {lang === 'hi' ? claim.hindiName : claim.entityName}
                </div>
                <div className="text-xs text-stone-400 mt-0.5 line-clamp-1">{claim.locality}</div>

                <div className="mt-2.5 flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-800/60">
                  <span>{claim.evidence.length} {lang === 'hi' ? 'साक्ष्य स्रोत' : 'Sources'}</span>
                  <span>{claim.communityReviews.length} {lang === 'hi' ? 'गवाही समीक्षा' : 'Reviews'}</span>
                  <span className="text-stone-400 font-medium">₹{claim.economicOutcome.priceINR}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Detail Inspection: The Full Cultural Verification Record (CVR) */}
        <div className="lg:col-span-8">
          {selectedClaim && (
            <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-6 space-y-6 shadow-xl">
              {/* CVR Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-stone-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-amber-400 font-bold">{selectedClaim.id}</span>
                    <span className="text-xs text-stone-400">•</span>
                    <span className="text-xs text-stone-400 font-medium">{selectedClaim.locality}</span>
                    <span className="text-xs text-stone-400">•</span>
                    <span className="text-xs text-stone-300">Est. {selectedClaim.establishedEra}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-stone-100 mt-1">
                    {lang === 'hi' ? selectedClaim.hindiName : selectedClaim.entityName}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {lang === 'hi' ? selectedClaim.entityName : selectedClaim.hindiName}
                  </p>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400 font-medium">
                      {lang === 'hi' ? 'विश्वास स्कोर' : 'Confidence'}:
                    </span>
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 font-mono text-lg font-bold text-emerald-400">
                      {(selectedClaim.confidenceScore * 100).toFixed(0)}%
                    </div>
                  </div>
                  <span className="text-xs text-stone-500">
                    {lang === 'hi' ? 'अंतिम समीक्षा: ' : 'Audited: '}
                    {selectedClaim.lastReviewed}
                  </span>
                </div>
              </div>

              {/* Verified Cultural Statement */}
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" />
                    {lang === 'hi' ? 'सत्यापित सांस्कृतिक दावा (Audited Claim Statement)' : 'Audited Claim Statement'}
                  </span>
                  <span className="rounded bg-stone-900 border border-stone-800 px-2 py-0.5 text-xs text-stone-400 font-mono">
                    RULE: {selectedClaim.consent}
                  </span>
                </div>
                <p className="text-sm text-stone-200 leading-relaxed font-serif">
                  "{lang === 'hi' ? selectedClaim.statementHindi : selectedClaim.statement}"
                </p>
                {lang !== 'hi' && (
                  <p className="text-xs text-stone-400 italic pt-1 border-t border-amber-500/10">
                    Hindi: "{selectedClaim.statementHindi}"
                  </p>
                )}
              </div>

              {/* Evidence Chain / Graph */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-amber-400" />
                    {lang === 'hi' ? 'प्राथमिक साक्ष्य शृंखला (Primary Evidence Graph)' : 'Primary Evidence Chain'}
                    <span className="rounded-full bg-stone-800 px-2 py-0.5 text-xs text-stone-300">
                      {selectedClaim.evidence.length}
                    </span>
                  </h4>
                  <button
                    id="add-evidence-btn"
                    onClick={() => setShowAddEvidenceModal(true)}
                    className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{lang === 'hi' ? 'साक्ष्य जोड़ें' : 'Add Citation'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedClaim.evidence.map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded-lg border border-stone-800 bg-stone-950/60 p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-amber-400 font-bold">{ev.id}</span>
                        <span className="rounded bg-stone-800 px-2 py-0.5 text-stone-300 text-[10px] uppercase font-semibold">
                          {ev.type}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-stone-100">{ev.title}</div>
                      <div className="text-[11px] text-stone-400 line-clamp-2 italic">
                        "{ev.excerpt}"
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-800/80">
                        <span className="truncate max-w-[150px]">{ev.source}</span>
                        <span>{ev.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community & Practitioner Review Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-amber-400" />
                    {lang === 'hi' ? 'सामुदायिक गवाही व हलवाई समीक्षा' : 'Community & Practitioner Attestations'}
                    <span className="rounded-full bg-stone-800 px-2 py-0.5 text-xs text-stone-300">
                      {selectedClaim.communityReviews.length}
                    </span>
                  </h4>
                  <button
                    id="add-review-btn"
                    onClick={() => setShowAddReviewModal(true)}
                    className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{lang === 'hi' ? 'गवाही दर्ज करें' : 'Add Attestation'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedClaim.communityReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-lg border border-stone-800 bg-stone-950/40 p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-200">{rev.name}</span>
                          <span className="text-stone-500">• {rev.designation}</span>
                        </div>
                        <p className="text-stone-300 italic">"{rev.notes}"</p>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-1">
                        <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          {rev.action}
                        </span>
                        <span className="text-[10px] text-stone-500">{rev.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Economic Activation & Revenue Split */}
              <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    {lang === 'hi' ? 'आर्थिक चक्र एवं कारीगर लाभांश वितरण' : 'Economic Loop & Verified Experience'}
                  </div>
                  <div className="font-serif text-lg font-bold text-stone-100">
                    ₹{selectedClaim.economicOutcome.priceINR}
                  </div>
                </div>

                <div className="text-sm font-semibold text-stone-200">
                  {selectedClaim.economicOutcome.experienceTitle}
                </div>

                {/* Revenue Share Visualization Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>
                      {lang === 'hi' ? 'कारीगर/दुकानदार हिस्सा' : 'Direct Artisan/Merchant'}:{' '}
                      <strong className="text-emerald-400 font-bold">
                        {selectedClaim.economicOutcome.artisanSharePercent}%
                      </strong>
                    </span>
                    <span>
                      {lang === 'hi' ? 'धरोहर कोष' : 'Preservation Fund'}:{' '}
                      <strong className="text-amber-400 font-bold">
                        {selectedClaim.economicOutcome.communityPreservationFundPercent}%
                      </strong>
                    </span>
                    <span>
                      {lang === 'hi' ? 'मंच शुल्क' : 'Platform'}:{' '}
                      <strong className="text-stone-300">
                        {selectedClaim.economicOutcome.platformFeePercent}%
                      </strong>
                    </span>
                  </div>

                  <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-stone-800">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${selectedClaim.economicOutcome.artisanSharePercent}%` }}
                      title={`Artisan Share: ${selectedClaim.economicOutcome.artisanSharePercent}%`}
                    />
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${selectedClaim.economicOutcome.communityPreservationFundPercent}%` }}
                      title={`Preservation Fund: ${selectedClaim.economicOutcome.communityPreservationFundPercent}%`}
                    />
                    <div
                      className="bg-stone-600 h-full"
                      style={{ width: `${selectedClaim.economicOutcome.platformFeePercent}%` }}
                      title={`Platform Fee: ${selectedClaim.economicOutcome.platformFeePercent}%`}
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    id="book-experience-direct-btn"
                    onClick={() => {
                      if (onBookExperience) {
                        onBookExperience(selectedClaim);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow transition-colors"
                  >
                    <span>{selectedClaim.economicOutcome.bookingActionText}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Evidence Citation */}
      {showAddEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-stone-800 bg-stone-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h4 className="font-serif text-lg font-bold text-stone-100">
                {lang === 'hi' ? 'नया प्राथमिक साक्ष्य संदर्भ जोड़ें' : 'Add Primary Evidence Citation'}
              </h4>
              <button
                onClick={() => setShowAddEvidenceModal(false)}
                className="text-stone-400 hover:text-stone-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvidence} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  {lang === 'hi' ? 'साक्ष्य का शीर्षक (Title)' : 'Evidence Title'}
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g., UP District Gazetteer 1968, Vol. IV"
                  value={newEvTitle}
                  onChange={(e) => setNewEvTitle(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 p-2 text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    {lang === 'hi' ? 'साक्ष्य प्रकार (Type)' : 'Source Type'}
                  </label>
                  <select
                    value={newEvType}
                    onChange={(e) => setNewEvType(e.target.value as any)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 p-2 text-stone-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="gazetteer">District Gazetteer / Govt Record</option>
                    <option value="oral_audio">Oral Audio Recording / Tape</option>
                    <option value="archival_photo">Archival Photograph</option>
                    <option value="academic">Academic Monograph / Journal</option>
                    <option value="newspaper">Historical Newspaper Clipping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    {lang === 'hi' ? 'वर्ष (Year)' : 'Year'}
                  </label>
                  <input
                    type="text"
                    value={newEvYear}
                    onChange={(e) => setNewEvYear(e.target.value)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 p-2 text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  {lang === 'hi' ? 'स्रोत / अभिलेखागार (Source Authority)' : 'Source / Institution'}
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g., National Archives of India, CSJMU History Dept"
                  value={newEvSource}
                  onChange={(e) => setNewEvSource(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 p-2 text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  {lang === 'hi' ? 'उद्धरण / मुख्य अंश (Excerpt)' : 'Citation Excerpt'}
                </label>
                <textarea
                  rows={2}
                  placeholder="Quote or specific reference text from the document..."
                  value={newEvExcerpt}
                  onChange={(e) => setNewEvExcerpt(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 p-2 text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEvidenceModal(false)}
                  className="rounded-lg border border-stone-800 px-3 py-1.5 text-stone-400 hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-1.5 font-semibold text-stone-950 hover:bg-amber-400"
                >
                  {lang === 'hi' ? 'साक्ष्य संलग्न करें' : 'Attach Citation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Community Attestation */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-stone-800 bg-stone-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h4 className="font-serif text-lg font-bold text-stone-100">
                {lang === 'hi' ? 'सामुदायिक गवाही अथवा शुद्धिपत्र दर्ज करें' : 'Add Community Attestation'}
              </h4>
              <button
                onClick={() => setShowAddReviewModal(false)}
                className="text-stone-400 hover:text-stone-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  {lang === 'hi' ? 'गवाह / समीक्षक का नाम' : 'Reviewer Name'}
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Haji Mohammad, Karigar Guild Secretary"
                  value={newReviewerName}
                  onChange={(e) => setNewReviewerName(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 p-2 text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    {lang === 'hi' ? 'पद / पहचान' : 'Role / Relationship'}
                  </label>
                  <input
                    type="text"
                    placeholder="Senior Artisan / 3rd Generation Patron"
                    value={newReviewerRole}
                    onChange={(e) => setNewReviewerRole(e.target.value)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 p-2 text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    {lang === 'hi' ? 'समीक्षा निर्णय' : 'Verdict'}
                  </label>
                  <select
                    value={newReviewAction}
                    onChange={(e) => setNewReviewAction(e.target.value as any)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 p-2 text-stone-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="CONFIRMED">CONFIRMED (पुष्ट किया गया)</option>
                    <option value="CORRECTED">CORRECTED (शुद्धि दर्ज की गई)</option>
                    <option value="DISPUTED">DISPUTED (दावा विवादित है)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  {lang === 'hi' ? 'मौखिक गवाही टिप्पणी' : 'Testimony Notes'}
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Details of the family tradition or memory..."
                  value={newReviewNotes}
                  onChange={(e) => setNewReviewNotes(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 p-2 text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="rounded-lg border border-stone-800 px-3 py-1.5 text-stone-400 hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-1.5 font-semibold text-stone-950 hover:bg-amber-400"
                >
                  {lang === 'hi' ? 'गवाही दर्ज करें' : 'Record Attestation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
