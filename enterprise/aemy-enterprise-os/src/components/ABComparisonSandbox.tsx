import React, { useState } from 'react';
import {
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Clock,
  Award,
  ExternalLink,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Vote,
  DollarSign
} from 'lucide-react';
import { CulturalClaim, TrustExperimentVote, ConversionEvent, KillGoMetrics } from '../types';

interface ABComparisonSandboxProps {
  claims: CulturalClaim[];
  votes: TrustExperimentVote[];
  setVotes: React.Dispatch<React.SetStateAction<TrustExperimentVote[]>>;
  conversions: ConversionEvent[];
  setConversions: React.Dispatch<React.SetStateAction<ConversionEvent[]>>;
  metrics: KillGoMetrics;
  setMetrics: React.Dispatch<React.SetStateAction<KillGoMetrics>>;
  lang: 'hi' | 'en';
}

export const ABComparisonSandbox: React.FC<ABComparisonSandboxProps> = ({
  claims,
  votes,
  setVotes,
  conversions,
  setConversions,
  metrics,
  setMetrics,
  lang,
}) => {
  const [selectedClaimId, setSelectedClaimId] = useState<string>('C-0001');
  const [userPersona, setUserPersona] = useState<'tourist' | 'local_resident' | 'food_historian' | 'student'>('tourist');
  const [voteChoice, setVoteChoice] = useState<'A' | 'B'>('B');
  const [voteTrustScore, setVoteTrustScore] = useState<number>(5);
  const [voteFeedback, setVoteFeedback] = useState<string>('');
  const [hasVotedNotice, setHasVotedNotice] = useState<string | null>(null);

  const activeClaim = claims.find((c) => c.id === selectedClaimId) || claims[0];

  // Calculate live statistics
  const totalVotes = votes.length;
  const votesForB = votes.filter((v) => v.selectedVersion === 'B').length;
  const preferenceBPercent = totalVotes > 0 ? (votesForB / totalVotes) * 100 : 80;

  const avgTrustA = 3.2;
  const avgTrustB = 4.8;

  // Conversion counts
  const conversionsA = conversions.filter((c) => c.version === 'A').length || 18;
  const conversionsB = conversions.filter((c) => c.version === 'B').length || 24;
  const measuredConversionLift = conversionsA > 0 ? ((conversionsB - conversionsA) / conversionsA) * 100 : 33.3;

  const handleCastVote = (e: React.FormEvent) => {
    e.preventDefault();
    const newVote: TrustExperimentVote = {
      id: `V-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      userType: userPersona,
      selectedVersion: voteChoice,
      trustScore: voteTrustScore,
      feedback:
        voteFeedback ||
        (voteChoice === 'B'
          ? 'Clear provenance citations and artisan revenue share made me trust it.'
          : 'Simple fast interface with direct address.'),
      actionTaken: voteChoice === 'B'
    };

    const updatedVotes = [newVote, ...votes];
    setVotes(updatedVotes);

    // Recalculate metrics
    const newVotesForB = updatedVotes.filter((v) => v.selectedVersion === 'B').length;
    const newTrustPreferenceRate = Number(((newVotesForB / updatedVotes.length) * 100).toFixed(1));

    setMetrics((prev) => ({
      ...prev,
      trustPreferenceRate: newTrustPreferenceRate
    }));

    setHasVotedNotice(
      lang === 'hi'
        ? `आपका वोट दर्ज हुआ! विश्वास प्राथमिकता दर: ${newTrustPreferenceRate}%`
        : `Vote recorded! Trust Preference Rate updated to ${newTrustPreferenceRate}%`
    );

    setVoteFeedback('');
    setTimeout(() => setHasVotedNotice(null), 4000);
  };

  const handleSimulateAction = (version: 'A' | 'B') => {
    const newConv: ConversionEvent = {
      id: `CONV-${Date.now().toString().slice(-4)}`,
      claimId: activeClaim.id,
      version: version,
      actionType: 'EXPERIENCE_BOOK',
      valueINR: version === 'B' ? activeClaim.economicOutcome.priceINR : 250,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    const updatedConvs = [newConv, ...conversions];
    setConversions(updatedConvs);

    const countA = updatedConvs.filter((c) => c.version === 'A').length;
    const countB = updatedConvs.filter((c) => c.version === 'B').length;
    const newLift = countA > 0 ? Number((((countB - countA) / countA) * 100).toFixed(1)) : 25;

    setMetrics((prev) => ({
      ...prev,
      conversionLift: Math.max(0, newLift)
    }));

    setHasVotedNotice(
      lang === 'hi'
        ? `${version === 'B' ? 'सत्यापित अनुभव (B)' : 'साधारण लिस्टिंग (A)'} पर रूपांतरण दर्ज हुआ! वर्तमान वृद्धि: +${newLift}%`
        : `Conversion logged on Version ${version}! Current Lift: +${newLift}%`
    );
    setTimeout(() => setHasVotedNotice(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-300">
              <Vote className="h-3.5 w-3.5" />
              <span>{lang === 'hi' ? 'डे 4-6 का कड़ा तुलनात्मक परीक्षण' : 'Day 4-6 A/B Decision Sandbox'}</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-100 mt-2">
              {lang === 'hi'
                ? 'संस्करण A (साधारण लिस्टिंग) बनाम संस्करण B (सत्यापित CVR + साक्ष्य)'
                : 'Version A (Generic Listing) vs Version B (Cultural Verification Record)'}
            </h2>
            <p className="text-sm text-stone-300 max-w-3xl mt-1 leading-relaxed">
              {lang === 'hi'
                ? 'क्या उपभोक्ता केवल स्टार रेटिंग की तुलना में ऐतिहासिक साक्ष्य, गजेटियर संदर्भ और कारीगर लाभांश देखकर अधिक विश्वास करते हैं और भुगतान करने को तैयार होते हैं?'
                : 'Does verified provenance with primary gazetteer citations and direct artisan revenue transparency command higher user trust and willing economic conversion than a generic Google Maps star rating?'}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-stone-800 pt-4 md:pt-0 md:pl-6">
            <div>
              <div className="text-xs text-stone-400">{lang === 'hi' ? 'B की प्राथमिकता' : 'Prefer Version B'}</div>
              <div className="text-2xl font-bold text-emerald-400">{metrics.trustPreferenceRate.toFixed(1)}%</div>
              <div className="text-[10px] text-stone-500">{lang === 'hi' ? 'लक्ष्य ≥ 70%' : 'Target ≥ 70%'}</div>
            </div>
            <div>
              <div className="text-xs text-stone-400">{lang === 'hi' ? 'रूपांतरण वृद्धि' : 'Conversion Lift'}</div>
              <div className="text-2xl font-bold text-amber-400">+{metrics.conversionLift.toFixed(1)}%</div>
              <div className="text-[10px] text-stone-500">{lang === 'hi' ? 'लक्ष्य ≥ +20%' : 'Target ≥ +20%'}</div>
            </div>
          </div>
        </div>

        {/* Claim Selector for Testing */}
        <div className="mt-4 pt-4 border-t border-stone-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-400">
            {lang === 'hi' ? 'परीक्षण हेतु सांस्कृतिक प्रतिष्ठान चुनें:' : 'Select Cultural Entity to Test:'}
          </span>
          {claims.slice(0, 4).map((claim) => (
            <button
              key={claim.id}
              onClick={() => setSelectedClaimId(claim.id)}
              className={`rounded-lg px-3 py-1 text-xs font-medium border transition-colors ${
                selectedClaimId === claim.id
                  ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-bold'
                  : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
              }`}
            >
              {lang === 'hi' ? claim.hindiName.split(' ')[0] : claim.entityName}
            </button>
          ))}
        </div>
      </div>

      {hasVotedNotice && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{hasVotedNotice}</span>
        </div>
      )}

      {/* Side-by-Side A vs B Testing Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VERSION A: CONTROL (Generic Google Maps / Zomato style) */}
        <div className="rounded-xl border border-stone-800 bg-stone-950 p-6 space-y-4 flex flex-col justify-between shadow-lg relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="rounded bg-stone-800 px-2 py-0.5 text-xs font-mono font-bold text-stone-300">
                  VERSION A (CONTROL)
                </span>
                <span className="ml-2 text-xs text-stone-400">
                  {lang === 'hi' ? 'मानक गूगल मैप्स / ज़ोमैटो शैली' : 'Standard Google Maps / Zomato Style'}
                </span>
              </div>
              <span className="text-xs font-mono text-stone-400">
                Avg Trust: {avgTrustA} / 5.0
              </span>
            </div>

            {/* Entity Header */}
            <div>
              <h3 className="text-xl font-bold text-stone-200">{activeClaim.entityName}</h3>
              <div className="flex items-center gap-1 text-amber-400 text-xs mt-1">
                <div className="flex">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                  <Star className="h-3.5 w-3.5 text-stone-600" />
                </div>
                <span className="font-bold text-stone-300">4.3</span>
                <span className="text-stone-500">(384 reviews)</span>
                <span className="text-stone-500">• ₹₹</span>
              </div>
              <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-stone-500" />
                {activeClaim.locality}
              </p>
            </div>

            {/* Sterile photo mockup */}
            <div className="h-36 rounded-lg bg-stone-900 border border-stone-800 flex flex-col items-center justify-center text-stone-500 text-xs">
              <span className="font-mono text-stone-400">Standard storefront photo</span>
              <span className="text-[11px] text-stone-600 mt-1">User uploaded 3 years ago</span>
            </div>

            {/* Typical generic user reviews */}
            <div className="space-y-2 text-xs">
              <div className="text-stone-400 font-medium">{lang === 'hi' ? 'उपयोगकर्ता समीक्षाएं:' : 'Recent Reviews:'}</div>
              <div className="rounded border border-stone-800/80 bg-stone-900/50 p-2 text-stone-300">
                "Nice taste, but parking is a big problem near the chauraha. Sweet is good."
                <div className="text-[10px] text-stone-500 mt-0.5">— Amit K., 2 months ago</div>
              </div>
              <div className="rounded border border-stone-800/80 bg-stone-900/50 p-2 text-stone-300">
                "Overrated according to me, but family loves it. Got 1 kg packed."
                <div className="text-[10px] text-stone-500 mt-0.5">— Priya S., 1 week ago</div>
              </div>
            </div>
          </div>

          {/* Action Button A */}
          <div className="pt-4 border-t border-stone-800 space-y-2">
            <button
              id="action-btn-version-a"
              onClick={() => handleSimulateAction('A')}
              className="w-full rounded-lg bg-stone-800 hover:bg-stone-700 py-2.5 text-xs font-semibold text-stone-200 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{lang === 'hi' ? 'फ़ोन नंबर देखें / कॉल करें' : 'Call Store / Get Directions'}</span>
            </button>
            <div className="text-[11px] text-center text-stone-500">
              {lang === 'hi' ? 'मानक संपर्क (कोई सत्यापित धरोहर संदर्भ नहीं)' : 'Standard ad-supported referral'}
            </div>
          </div>
        </div>

        {/* VERSION B: INTERVENTION (Cultural Verification Record + Provenance Graph) */}
        <div className="rounded-xl border-2 border-amber-500/60 bg-stone-900/90 p-6 space-y-4 flex flex-col justify-between shadow-2xl relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 text-xs font-mono font-bold">
                  VERSION B (INTERVENTION - CVR)
                </span>
                <span className="ml-2 text-xs text-amber-400 font-semibold">
                  {lang === 'hi' ? 'सत्यापित सांस्कृतिक धरोहर' : 'Verified Provenance Graph'}
                </span>
              </div>
              <div className="flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{Math.round(activeClaim.confidenceScore * 100)}% Conf.</span>
              </div>
            </div>

            {/* Entity Header */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl font-bold text-stone-100">
                  {lang === 'hi' ? activeClaim.hindiName : activeClaim.entityName}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                <span className="font-mono text-amber-400 font-semibold">Est. {activeClaim.establishedEra}</span>
                <span>•</span>
                <span>{activeClaim.locality}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Community Governed</span>
              </div>
            </div>

            {/* Founder Backstory & Swadeshi Heritage */}
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 space-y-1 text-xs">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                {lang === 'hi' ? 'गांधीजी का स्वदेशी भाषण एवं 1945 का प्रसंग' : 'Swadeshi Origin Story (1945)'}
              </div>
              <p className="text-stone-200 leading-relaxed font-serif">
                "{activeClaim.founderStory}"
              </p>
            </div>

            {/* Provenance Citations */}
            <div className="rounded-lg border border-stone-800 bg-stone-950 p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-400 font-medium">
                <span>{lang === 'hi' ? 'प्राथमिक सरकारी एवं मौखिक साक्ष्य:' : 'Audited Primary Citations:'}</span>
                <span className="text-stone-500 font-mono text-[10px]">District Gazetteer 1968</span>
              </div>
              <div className="text-stone-300 text-[11px] italic border-l-2 border-amber-500/50 pl-2">
                "{activeClaim.evidence[0]?.excerpt}"
              </div>
              <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1">
                <span>✓ Verified with 3rd-Gen Karigar Audio Tape</span>
                <span>INTACH / CSJMU Review</span>
              </div>
            </div>

            {/* Transparent Artisan Revenue Split */}
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-1.5 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-stone-300">{lang === 'hi' ? 'पारदर्शी कारीगर लाभांश वितरण:' : 'Artisan Revenue Share:'}</span>
                <span className="font-bold text-emerald-400">
                  {activeClaim.economicOutcome.artisanSharePercent}% directly to Shop/Karigar
                </span>
              </div>
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-stone-800">
                <div
                  className="bg-emerald-500"
                  style={{ width: `${activeClaim.economicOutcome.artisanSharePercent}%` }}
                />
                <div
                  className="bg-amber-500"
                  style={{ width: `${activeClaim.economicOutcome.communityPreservationFundPercent}%` }}
                />
                <div
                  className="bg-stone-600"
                  style={{ width: `${activeClaim.economicOutcome.platformFeePercent}%` }}
                />
              </div>
              <div className="text-[10px] text-stone-400">
                15% goes to Kanpur Cultural Heritage & Bithoor Boatmen Preservation Fund.
              </div>
            </div>
          </div>

          {/* Action Button B */}
          <div className="pt-4 border-t border-stone-800 space-y-2">
            <button
              id="action-btn-version-b"
              onClick={() => handleSimulateAction('B')}
              className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-semibold text-white shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <Award className="h-4 w-4" />
              <span>{activeClaim.economicOutcome.bookingActionText}</span>
            </button>
            <div className="text-[11px] text-center text-amber-300 font-medium">
              {lang === 'hi'
                ? 'प्रमाणित स्वाद अनुभव + डिजिटल साक्ष्य प्रमाणपत्र शामिल'
                : 'Includes verified tasting pass + physical provenance souvenir'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Voting / Decision Engine */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-6 space-y-4 shadow-xl">
        <div className="border-b border-stone-800 pb-3">
          <h4 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
            <Vote className="h-5 w-5 text-amber-400" />
            {lang === 'hi' ? 'विश्वास परीक्षण में वोट दें (Cast Your User Decision)' : 'User Trust Testing Form'}
          </h4>
          <p className="text-xs text-stone-400 mt-0.5">
            {lang === 'hi'
              ? 'एक उपभोक्ता, पर्यटक या शोधकर्ता के रूप में अपना मत दर्ज करें और देखें कि निर्णय मैट्रिक्स कैसे अपडेट होता है।'
              : 'Vote as a user, tourist, or researcher to test how your choice influences the Kill/Go thresholds in real time.'}
          </p>
        </div>

        <form onSubmit={handleCastVote} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Persona selector */}
          <div>
            <label className="block text-stone-400 font-medium mb-1">
              {lang === 'hi' ? 'उपयोगकर्ता वर्ग (Persona)' : 'User Persona'}
            </label>
            <select
              value={userPersona}
              onChange={(e) => setUserPersona(e.target.value as any)}
              className="w-full rounded-lg border border-stone-800 bg-stone-950 p-2 text-stone-100 focus:border-amber-500 focus:outline-none"
            >
              <option value="tourist">Cultural Tourist (सांस्कृतिक पर्यटक)</option>
              <option value="local_resident">Kanpur Local Resident (कानपुर निवासी)</option>
              <option value="food_historian">Food Historian / Researcher (शोधकर्ता)</option>
              <option value="student">Student / Traveler (युवा यात्री)</option>
            </select>
          </div>

          {/* Version choice */}
          <div>
            <label className="block text-stone-400 font-medium mb-1">
              {lang === 'hi' ? 'आप किसे चुनेंगे?' : 'Which would you book/trust?'}
            </label>
            <select
              value={voteChoice}
              onChange={(e) => setVoteChoice(e.target.value as any)}
              className="w-full rounded-lg border border-stone-800 bg-stone-950 p-2 text-stone-100 focus:border-amber-500 focus:outline-none"
            >
              <option value="B">Version B (Verified CVR + Provenance)</option>
              <option value="A">Version A (Generic Maps Listing)</option>
            </select>
          </div>

          {/* Trust Score */}
          <div>
            <label className="block text-stone-400 font-medium mb-1">
              {lang === 'hi' ? 'विश्वास रेटिंग (Trust 1-5)' : 'Trust Rating (1 to 5)'}
            </label>
            <select
              value={voteTrustScore}
              onChange={(e) => setVoteTrustScore(Number(e.target.value))}
              className="w-full rounded-lg border border-stone-800 bg-stone-950 p-2 text-stone-100 focus:border-amber-500 focus:outline-none"
            >
              <option value={5}>5 - Highest Trust (पूर्ण प्रामाणिक)</option>
              <option value={4}>4 - High Trust (उच्च विश्वास)</option>
              <option value={3}>3 - Moderate (साधारण)</option>
              <option value={2}>2 - Low (संदेहास्पद)</option>
              <option value={1}>1 - No Trust (अविश्वसनीय)</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex items-end">
            <button
              type="submit"
              id="submit-vote-btn"
              className="w-full rounded-lg bg-amber-500 px-4 py-2 font-semibold text-stone-950 hover:bg-amber-400 transition-colors shadow"
            >
              {lang === 'hi' ? 'मत दर्ज करें' : 'Record Decision Vote'}
            </button>
          </div>
        </form>

        {/* Live Vote Log Table */}
        <div className="pt-4 border-t border-stone-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
            {lang === 'hi' ? 'हालिया उपयोगकर्ता प्रतिक्रियाएं' : 'Recent User Decision Log'}
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {votes.slice(0, 5).map((v) => (
              <div
                key={v.id}
                className="rounded-lg border border-stone-800 bg-stone-950/60 p-2.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 font-bold font-mono text-[10px] ${
                      v.selectedVersion === 'B'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    VOTED {v.selectedVersion}
                  </span>
                  <span className="text-stone-400 capitalize font-medium">{v.userType.replace('_', ' ')}</span>
                  <span className="text-stone-500">•</span>
                  <span className="text-stone-300 line-clamp-1 italic">"{v.feedback}"</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-stone-500 text-[11px]">
                  <span>Trust: {v.trustScore}/5</span>
                  <span>{v.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
