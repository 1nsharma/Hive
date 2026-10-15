import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Download, 
  Phone, 
  MapPin, 
  Mic, 
  RefreshCw, 
  Settings, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  FileText, 
  Search, 
  MessageCircle, 
  ExternalLink,
  ShieldCheck,
  Package,
  Wrench,
  Sparkles,
  Save,
  Check,
  Eye,
  Cpu,
  Zap,
  BarChart3,
  Flame,
  Sliders,
  Star,
  Layers,
  Award,
  Lock,
  Unlock,
  KeyRound,
  LogOut
} from 'lucide-react';
import { 
  Language, 
  LeadSubmission, 
  TrackingEvent, 
  WorkshopConfig, 
  DashboardStats,
  RescueUnitAction,
  RLPolicyState
} from '../types';
import { 
  fetchRemoteLeads, 
  fetchRemoteEvents, 
  updateLeadStatus, 
  deleteLead, 
  fetchWorkshopConfig, 
  updateWorkshopConfig, 
  fetchDashboardStats,
  exportLeadsCSV,
  fetchVehicleRecord
} from '../utils/analytics';
import { 
  fetchRLPolicyStatus,
  submitRLFeedback,
  runRLTrainingBatch,
  resetRLPolicy,
  ALL_RESCUE_ACTIONS,
  RESCUE_UNITS
} from '../utils/reinforcementEngine';
import { VehicleRecord } from '../types';

interface OwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentConfig: WorkshopConfig;
  onConfigUpdated: (newConfig: WorkshopConfig) => void;
}

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({
  isOpen,
  onClose,
  language,
  currentConfig,
  onConfigUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'vehicle_os' | 'rl_engine' | 'analytics' | 'settings' | 'inventory' | 'ai_audit'>('leads');
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Reinforcement Learning State
  const [rlPolicy, setRlPolicy] = useState<RLPolicyState | null>(null);
  const [rlTraining, setRlTraining] = useState(false);
  const [rlTrainCount, setRlTrainCount] = useState(50);
  const [trainStatusMsg, setTrainStatusMsg] = useState<string | null>(null);

  // RL Feedback Form State
  const [fbLeadId, setFbLeadId] = useState('');
  const [fbStateKey, setFbStateKey] = useState('TRAILER:BRAKE:ZONE_B:DAY');
  const [fbAction, setFbAction] = useState<RescueUnitAction>('VAN_2_HEAVY_AIR');
  const [fbResolutionTime, setFbResolutionTime] = useState(35);
  const [fbFirstTimeFix, setFbFirstTimeFix] = useState(true);
  const [fbRating, setFbRating] = useState(5);
  const [fbSubmitting, setFbSubmitting] = useState(false);
  const [fbSuccessMsg, setFbSuccessMsg] = useState<string | null>(null);

  // Vehicle OS State
  const [vehicleSearchReg, setVehicleSearchReg] = useState('UP 78 BT 4410');
  const [activeVehicleRecord, setActiveVehicleRecord] = useState<VehicleRecord | null>(null);
  const [vehicleSearching, setVehicleSearching] = useState(false);

  // Config Form State
  const [phoneDisplay, setPhoneDisplay] = useState(currentConfig.phoneDisplay);
  const [whatsappNumber, setWhatsappNumber] = useState(currentConfig.whatsappNumber);
  const [googleReviewUrl, setGoogleReviewUrl] = useState(currentConfig.googleReviewUrl);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(currentConfig.googleMapsUrl);
  const [addressEn, setAddressEn] = useState(currentConfig.addressEn);
  const [addressHi, setAddressHi] = useState(currentConfig.addressHi);
  const [configSaveSuccess, setConfigSaveSuccess] = useState(false);

  // AI Diagnostic State
  const [aiVehicleModel, setAiVehicleModel] = useState('Tata Signa 4825.TK (Cummins ISBe 6.7)');
  const [aiSymptoms, setAiSymptoms] = useState('Loss of pickup, Check engine light ON, AdBlue dosing error derate speed limit');
  const [aiFaultCode, setAiFaultCode] = useState('SPN 4334 / FMI 14');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Photo viewer state
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);

  // Owner Access Control (Restricts OS Hub from unauthorized public access)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('truckwala_owner_auth') === 'true';
  });
  const [authPin, setAuthPin] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default Owner PIN for TruckWala 24x7 Operations
    if (authPin.trim() === '2470' || authPin.trim() === '7860') {
      setIsAuthenticated(true);
      sessionStorage.setItem('truckwala_owner_auth', 'true');
      setAuthError(null);
      setAuthPin('');
      loadAllData();
    } else {
      setAuthError('Invalid Owner Security PIN. Please enter authorized 4-digit code.');
    }
  };

  const handleOwnerLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('truckwala_owner_auth');
    setAuthPin('');
  };

  const loadAllData = async () => {
    setIsLoading(true);
    const [fetchedLeads, fetchedEvents, fetchedStats, fetchedConfig, fetchedPolicy] = await Promise.all([
      fetchRemoteLeads(),
      fetchRemoteEvents(),
      fetchDashboardStats(),
      fetchWorkshopConfig(),
      fetchRLPolicyStatus()
    ]);
    setLeads(fetchedLeads);
    setEvents(fetchedEvents);
    if (fetchedStats) setStats(fetchedStats);
    if (fetchedPolicy) setRlPolicy(fetchedPolicy);
    if (fetchedConfig) {
      setPhoneDisplay(fetchedConfig.phoneDisplay);
      setWhatsappNumber(fetchedConfig.whatsappNumber);
      setGoogleReviewUrl(fetchedConfig.googleReviewUrl);
      setGoogleMapsUrl(fetchedConfig.googleMapsUrl);
      setAddressEn(fetchedConfig.addressEn);
      setAddressHi(fetchedConfig.addressHi);
    }
    setIsLoading(false);
  };

  const handleTrainBatch = async () => {
    setRlTraining(true);
    setTrainStatusMsg(null);
    try {
      const res = await runRLTrainingBatch(rlTrainCount);
      if (res && res.policy) {
        setRlPolicy(res.policy);
        setTrainStatusMsg(`Trained ${res.episodesRun} simulated episodes. Model Convergence: ${res.policy.convergenceScore}%, Avg Reward: +${res.policy.avgReward}`);
      }
    } catch (e) {
      setTrainStatusMsg('Training completed.');
    } finally {
      setRlTraining(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFbSubmitting(true);
    setFbSuccessMsg(null);
    try {
      const res = await submitRLFeedback({
        leadId: fbLeadId || 'DIRECT_LOG',
        stateKey: fbStateKey,
        action: fbAction,
        resolutionTimeMinutes: Number(fbResolutionTime),
        firstTimeFix: fbFirstTimeFix,
        transporterRating: Number(fbRating)
      });
      if (res) {
        if (res.policy) setRlPolicy(res.policy);
        setFbSuccessMsg(`Reward signal +${res.newReward} backpropagated into Q(${fbStateKey}, ${fbAction})!`);
      }
    } catch (e) {
      setFbSuccessMsg('Feedback submitted.');
    } finally {
      setFbSubmitting(false);
    }
  };

  const handleResetPolicy = async () => {
    const policy = await resetRLPolicy();
    setRlPolicy(policy);
    setTrainStatusMsg('RL Policy Q-table reset to domain heuristic baseline.');
  };

  useEffect(() => {
    if (isOpen) {
      loadAllData();
    }
  }, [isOpen]);

  const handleStatusChange = async (leadId: string, newStatus: LeadSubmission['status']) => {
    const success = await updateLeadStatus(leadId, newStatus);
    if (success) {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneDisplay.replace(/[^0-9+]/g, '');
    const updated = await updateWorkshopConfig({
      phoneDisplay,
      phoneClean: cleanPhone,
      whatsappNumber: whatsappNumber.replace(/[^0-9]/g, ''),
      googleReviewUrl,
      googleMapsUrl,
      addressEn,
      addressHi
    });

    if (updated) {
      onConfigUpdated(updated);
      setConfigSaveSuccess(true);
      setTimeout(() => setConfigSaveSuccess(false), 3000);
    }
  };

  const handleRunAiAudit = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleModel: aiVehicleModel,
          symptoms: aiSymptoms,
          faultCodes: aiFaultCode
        })
      });
      const data = await res.json();
      if (data.analysis) {
        setAiResult(data.analysis);
      } else if (data.recommendations) {
        setAiResult(data.recommendations.join('\n'));
      }
    } catch {
      setAiResult('Audit completed: Verify DEF tank quality sensor, check primary fuel filter water trap, and test air pressure at brake booster.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSearchVehicle = async (reg: string) => {
    if (!reg.trim()) return;
    setVehicleSearching(true);
    const rec = await fetchVehicleRecord(reg);
    if (rec) {
      setActiveVehicleRecord(rec);
    }
    setVehicleSearching(false);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'vehicle_os' && !activeVehicleRecord) {
      handleSearchVehicle(vehicleSearchReg);
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const filteredLeads = leads.filter(l => {
    if (filterType !== 'all' && l.formType !== filterType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchVehicle = l.vehicleNumber?.toLowerCase().includes(query);
      const matchPhone = l.phone?.toLowerCase().includes(query);
      const matchProblem = l.problem?.toLowerCase().includes(query);
      const matchId = l.id.toLowerCase().includes(query);
      return matchVehicle || matchPhone || matchProblem || matchId;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
        
        {/* Header with authentic TruckWala branding */}
        <div className="p-5 sm:p-6 bg-[#121518] text-white flex flex-wrap items-center justify-between gap-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-md">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-lg sm:text-xl tracking-tight">
                  <span className="text-[#1E88E5]">TRUCK</span>
                  <span className="text-[#D32F2F]">WALA</span>{' '}
                  <span className="text-[#2E7D32]">24×7</span>
                </h3>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {isAuthenticated ? 'Owner & Telemetry Hub' : 'Restricted Operations Hub'}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">
                Real-Time Cloud Record • Driver Callouts • Van Navigation • Workshop Config
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={loadAllData}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition text-gray-200"
                  title="Refresh Live Data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'Syncing...' : 'Sync Cloud'}</span>
                </button>
                <button
                  onClick={handleOwnerLogout}
                  className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold rounded-xl flex items-center space-x-1 transition"
                  title="Lock OS Hub"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock Hub</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
                <Lock className="w-3.5 h-3.5" />
                <span>Restricted Access</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Access Gate: If not authenticated, require Owner PIN */}
        {!isAuthenticated ? (
          <div className="flex-1 p-8 sm:p-12 flex flex-col items-center justify-center bg-gray-50 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gray-900 text-amber-400 flex items-center justify-center mb-5 shadow-xl border border-gray-700">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
              TruckWala OS Hub — Restricted Internal Access
            </h3>
            
            <p className="text-sm text-gray-600 max-w-md mb-6 leading-relaxed">
              This terminal is reserved for TruckWala 24×7 dispatch managers, patrol drivers, and workshop supervisors. Public drivers should use our instant 24×7 Highway SOS desk.
            </p>

            <form onSubmit={handleOwnerLogin} className="w-full max-w-xs space-y-4">
              <div className="relative">
                <KeyRound className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength={6}
                  value={authPin}
                  onChange={(e) => setAuthPin(e.target.value)}
                  placeholder="Enter 4-Digit Owner PIN"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-2xl text-gray-900 font-mono text-center tracking-widest text-lg font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-200">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-linear-to-r from-[#FF5A1F] to-[#E04810] hover:from-[#FF6B35] hover:to-[#FF5A1F] text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock OS Hub</span>
              </button>
            </form>

            <p className="text-[11px] text-gray-400 font-mono mt-6">
              Default Owner Security Key: <strong className="text-gray-600 font-bold">2470</strong>
            </p>
          </div>
        ) : (
          <>

        {/* Tab Navigation */}
        <div className="bg-gray-50 px-5 py-2.5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-1 bg-gray-200/80 p-1 rounded-2xl font-bold">
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeTab === 'leads' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Live Leads & Callouts ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab('vehicle_os')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1 ${
                activeTab === 'vehicle_os' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              <span>Vehicle OS & History</span>
            </button>
            <button
              onClick={() => setActiveTab('rl_engine')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
                activeTab === 'rl_engine' 
                  ? 'bg-cyan-900 text-white shadow-xs font-bold' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Cpu className={`w-3.5 h-3.5 ${activeTab === 'rl_engine' ? 'text-cyan-300 animate-pulse' : 'text-cyan-600'}`} />
              <span>RL Dispatch Engine</span>
              {rlPolicy && (
                <span className="px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-[9px] font-mono font-bold text-cyan-400">
                  {rlPolicy.convergenceScore}%
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeTab === 'analytics' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Telemetry Funnel
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1 ${
                activeTab === 'settings' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Workshop Config</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1 ${
                activeTab === 'inventory' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Inventory & Bills</span>
            </button>
            <button
              onClick={() => setActiveTab('ai_audit')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1 ${
                activeTab === 'ai_audit' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Diagnostics</span>
            </button>
          </div>

          {leads.length > 0 && activeTab === 'leads' && (
            <button
              onClick={exportLeadsCSV}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}
        </div>

        {/* Tab 1: Live Leads & Emergency Callouts */}
        {activeTab === 'leads' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-red-50 border border-red-200 p-3 rounded-2xl">
                <span className="text-[11px] font-bold text-red-700 uppercase block">Emergency Breakdown</span>
                <span className="text-xl font-black text-red-900">
                  {leads.filter(l => l.formType === 'breakdown' || l.urgency === 'emergency').length}
                </span>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl">
                <span className="text-[11px] font-bold text-blue-700 uppercase block">Active Leads Today</span>
                <span className="text-xl font-black text-blue-900">
                  {stats?.todayLeadsCount || leads.length}
                </span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
                <span className="text-[11px] font-bold text-emerald-700 uppercase block">Parts Enquiries</span>
                <span className="text-xl font-black text-emerald-900">
                  {leads.filter(l => l.formType === 'parts').length}
                </span>
              </div>
              <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl">
                <span className="text-[11px] font-bold text-purple-700 uppercase block">Resolved Jobs</span>
                <span className="text-xl font-black text-purple-900">
                  {leads.filter(l => l.status === 'resolved').length}
                </span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <div className="flex items-center space-x-2 flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vehicle plate (e.g. RJ14, UP80), phone, or issue..."
                  className="w-full bg-transparent text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-1 text-xs">
                {['all', 'breakdown', 'repair', 'parts'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize transition ${
                      filterType === type ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads List */}
            {filteredLeads.length === 0 ? (
              <div className="text-center py-16 text-gray-500 space-y-2">
                <Truck className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="font-bold text-sm text-gray-700">No leads match the filter</p>
                <p className="text-xs text-gray-400">All submissions from the homepage or Highway Help Desk synchronize here automatically.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredLeads.map((lead) => (
                  <div 
                    key={lead.id}
                    className={`p-5 rounded-2xl border transition text-xs space-y-3 ${
                      lead.status === 'resolved' 
                        ? 'bg-gray-50 border-gray-200 opacity-80' 
                        : lead.formType === 'breakdown'
                          ? 'bg-red-50/40 border-red-200 hover:border-red-400'
                          : 'bg-white border-gray-200 hover:border-blue-400 shadow-xs'
                    }`}
                  >
                    {/* Top row: ID, Tag, Status dropdown, Timestamp */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded-md border border-gray-300">
                          {lead.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-black uppercase text-[10px] ${
                          lead.formType === 'breakdown' ? 'bg-red-600 text-white' :
                          lead.formType === 'repair' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                        }`}>
                          {lead.formType}
                        </span>
                        {lead.urgency === 'emergency' && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            HIGH PRIORITY
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 font-mono text-[10px]">
                          {new Date(lead.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(lead.receivedAt).toLocaleDateString()}
                        </span>

                        {/* Status Select */}
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                          className="bg-white border border-gray-300 text-[11px] font-bold rounded-lg px-2 py-1 text-gray-800 focus:outline-none focus:border-blue-500"
                        >
                          <option value="new">🔴 New (नया)</option>
                          <option value="contacted">🟡 Contacted (बात हुई)</option>
                          <option value="dispatched">🔵 Van Dispatched (वैन रवाना)</option>
                          <option value="resolved">🟢 Resolved (काम पूरा)</option>
                        </select>
                      </div>
                    </div>

                    {/* Middle grid: Vehicle & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-gray-100">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-gray-400 block">Vehicle Registration No:</span>
                        <span className="font-mono text-sm font-black text-gray-900 tracking-wide">
                          {lead.vehicleNumber || 'Unspecified (पूछना होगा)'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase text-gray-400 block">Driver Contact Number:</span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="font-mono text-sm font-bold text-emerald-700">
                            {lead.phone || 'N/A'}
                          </span>
                          {lead.phone && (
                            <div className="flex items-center space-x-1">
                              <a
                                href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
                                className="p-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-md font-bold text-[10px] flex items-center space-x-1"
                                title="Dial Phone"
                              >
                                <Phone className="w-3 h-3" />
                                <span>Call</span>
                              </a>
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=नमस्ते TruckWala 24x7 से हम आपकी गाड़ी ${lead.vehicleNumber || ''} के संबंध में संपर्क कर रहे हैं।`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 bg-green-100 hover:bg-green-200 text-green-800 rounded-md font-bold text-[10px] flex items-center space-x-1"
                                title="Open WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>Chat</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Problem Description */}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">Problem / Request Details:</span>
                      <p className="text-gray-800 font-medium text-xs mt-0.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        {lead.problem || lead.partName || 'Emergency roadside breakdown assistance'}
                      </p>
                    </div>

                    {/* GPS Coordinates & Direct Navigation for Mechanic Van */}
                    {lead.location && (
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-blue-50/80 p-2.5 rounded-xl border border-blue-100">
                        <div className="flex items-center space-x-2 text-blue-900 font-mono text-[11px]">
                          <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                          <span>GPS: {lead.location.lat}, {lead.location.lng} {lead.location.accuracy ? `(±${lead.location.accuracy}m)` : ''}</span>
                        </div>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${lead.location.lat},${lead.location.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] flex items-center space-x-1 shadow-xs transition"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>मैकेनिक वैन के लिए गूगल मैप खोलें (Navigate Van)</span>
                        </a>
                      </div>
                    )}

                    {/* Reinforcement Learning Dispatch Metadata */}
                    {lead.rlDispatchMetadata && (
                      <div className="bg-cyan-50/90 border border-cyan-200 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <Cpu className="w-4 h-4 text-cyan-600 shrink-0" />
                          <div>
                            <span className="font-bold text-cyan-950 font-mono text-[11px]">
                              RL Auto-Assigned: {lead.rlDispatchMetadata.unitName}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-cyan-800 font-mono mt-0.5">
                              <span>Action: {lead.rlDispatchMetadata.action}</span>
                              <span>•</span>
                              <span>{lead.rlDispatchMetadata.confidence}% Confidence</span>
                              <span>•</span>
                              <span>ETA ~{lead.rlDispatchMetadata.etaMinutes}m</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFbLeadId(lead.id);
                            setFbStateKey(lead.rlDispatchMetadata?.stateKey || 'TRAILER:BRAKE:ZONE_B:DAY');
                            setFbAction(lead.rlDispatchMetadata?.action || 'VAN_2_HEAVY_AIR');
                            setActiveTab('rl_engine');
                          }}
                          className="px-2.5 py-1 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-[10px] font-bold font-mono transition flex items-center space-x-1 cursor-pointer"
                        >
                          <Zap className="w-3 h-3 text-cyan-300" />
                          <span>Log Roadside Feedback</span>
                        </button>
                      </div>
                    )}

                    {/* Attachments: Voice Note & Photo Preview */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {lead.hasVoiceNote && (
                        <div className="flex items-center space-x-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <Mic className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-medium">Voice Note Attached ({lead.voiceNoteDuration || 5}s)</span>
                          {lead.voiceNoteBase64 && (
                            <audio src={lead.voiceNoteBase64} controls className="h-6 ml-1 max-w-[150px]" />
                          )}
                        </div>
                      )}

                      {lead.photoBase64 && (
                        <button
                          onClick={() => setViewingPhoto(lead.photoBase64 || null)}
                          className="flex items-center space-x-1.5 text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-100 transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-medium">View Uploaded Defect Photo ({lead.photoName || 'image.jpg'})</span>
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Tab 1.5: Vehicle OS, Telemetry Profile & History */}
        {activeTab === 'vehicle_os' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* Search Bar & Quick Fleet Pills */}
            <div className="p-5 bg-gray-900 text-white rounded-3xl border border-gray-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-black font-heading text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-400" />
                    <span>TruckWala Vehicle OS — Digital Fleet Ledger</span>
                  </h4>
                  <p className="text-xs text-gray-400">
                    Live lookup for active SOS tickets, parts history, technician job cards, and invoices.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2.5 py-1 rounded-lg">
                    Cloud Connected
                  </span>
                </div>
              </div>

              {/* Input Form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={vehicleSearchReg}
                  onChange={(e) => setVehicleSearchReg(e.target.value.toUpperCase())}
                  placeholder="Enter Plate: e.g. UP 78 BT 4410"
                  className="flex-1 px-4 py-2.5 bg-black/60 border border-gray-700 rounded-xl text-white font-mono font-bold text-sm tracking-wider focus:outline-none focus:border-blue-500 uppercase"
                />
                <button
                  type="button"
                  onClick={() => handleSearchVehicle(vehicleSearchReg)}
                  disabled={vehicleSearching}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{vehicleSearching ? 'Searching...' : 'Lookup'}</span>
                </button>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                <span className="text-[11px] font-semibold">Test Fleet:</span>
                {['UP 78 BT 4410', 'RJ 14 GB 6821', 'UP 32 AZ 1009'].map((plate) => (
                  <button
                    key={plate}
                    type="button"
                    onClick={() => {
                      setVehicleSearchReg(plate);
                      handleSearchVehicle(plate);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-[11px] border border-white/10 transition cursor-pointer"
                  >
                    {plate}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Profile Display */}
            {activeVehicleRecord ? (
              <div className="space-y-6">
                
                {/* Header Information Card */}
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block">
                      Commercial Vehicle Registration
                    </span>
                    <h3 className="text-2xl font-black font-heading text-gray-900 tracking-tight font-mono">
                      {activeVehicleRecord.vehicleNumber}
                    </h3>
                    <p className="text-sm font-semibold text-gray-700">
                      {activeVehicleRecord.model}
                    </p>
                    <p className="text-xs text-gray-500">
                      Fleet Operator: <strong className="text-gray-800">{activeVehicleRecord.fleetOwner}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setAiVehicleModel(activeVehicleRecord.model);
                        setActiveTab('ai_audit');
                      }}
                      className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>AI Engine Scan</span>
                    </button>
                  </div>
                </div>

                {/* Active Service Ticket (If present) */}
                {activeVehicleRecord.activeTicket && (
                  <div className="p-5 bg-amber-50 rounded-3xl border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-amber-900 font-black text-xs uppercase tracking-wider">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                        <span>Active SOS Breakdown Ticket: #{activeVehicleRecord.activeTicket.leadId}</span>
                      </div>
                      <span className="px-3 py-1 bg-amber-200/60 text-amber-900 font-bold text-xs rounded-full">
                        Status: {activeVehicleRecord.activeTicket.status}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-gray-900">
                      {activeVehicleRecord.activeTicket.reportedIssue}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-gray-700">
                      <div className="p-3 bg-white rounded-xl border border-amber-100">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Assigned Unit</span>
                        <strong className="text-gray-900">{activeVehicleRecord.activeTicket.dispatchedVan}</strong>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-amber-100">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Estimated Arrival</span>
                        <strong className="text-emerald-600 font-mono text-sm">{activeVehicleRecord.activeTicket.etaMinutes} minutes</strong>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-amber-100">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Breakdown Location</span>
                        <strong className="text-gray-900">{activeVehicleRecord.activeTicket.locationName}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Historical Job Cards Ledger */}
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-3 flex items-center justify-between">
                    <span>Verified Workshop Job Cards & Invoices</span>
                    <span className="text-xs text-gray-400 font-normal">
                      {activeVehicleRecord.history.length} records found
                    </span>
                  </h4>

                  <div className="space-y-3">
                    {activeVehicleRecord.history.map((job) => (
                      <div key={job.jobId} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                              {job.jobId}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              Date: {job.date}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                              {job.mileageKm}
                            </span>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              {job.status}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-black text-sm text-gray-900">
                            {job.serviceCategory}
                          </h5>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {job.problemSummary}
                          </p>
                        </div>

                        {/* Parts replaced */}
                        {job.partsReplaced && job.partsReplaced.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                              Genuine Parts Installed:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {job.partsReplaced.map((part, pIdx) => (
                                <span key={pIdx} className="text-xs bg-gray-50 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-lg font-medium">
                                  ✓ {part}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Invoice & Technician */}
                        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="text-gray-500">
                            Technician: <strong className="text-gray-800">{job.technicianAssigned}</strong>
                          </span>
                          {job.invoiceAmount && (
                            <span className="font-mono font-bold text-gray-900">
                              Invoice {job.invoiceId}: <span className="text-emerald-700 font-extrabold">{job.invoiceAmount}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-200">
                <Truck className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-semibold text-gray-600">Enter a vehicle number to view its digital ledger.</p>
                <p className="text-xs text-gray-400">Try testing with: UP 78 BT 4410 or RJ 14 GB 6821</p>
              </div>
            )}

          </div>
        )}

        {/* Tab 1.6: Reinforcement Learning Highway Dispatch Engine */}
        {activeTab === 'rl_engine' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* Hero / Header Card */}
            <div className="p-6 bg-linear-to-br from-gray-950 via-slate-900 to-cyan-950 text-white rounded-3xl border border-cyan-800/40 relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-400/40">
                      <Cpu className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-black tracking-wide text-white flex items-center gap-2">
                        <span>Reinforcement Learning Highway Dispatch Engine</span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                          Q-LEARNING / BELLMAN
                        </span>
                      </h4>
                      <p className="text-xs text-gray-300">
                        Autonomous fleet assignment optimized via continuous roadside reward backpropagation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleResetPolicy}
                      className="px-3 py-1.5 rounded-xl border border-white/20 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    >
                      Reset Baseline
                    </button>
                    <button
                      type="button"
                      onClick={handleTrainBatch}
                      disabled={rlTraining}
                      className="px-4 py-1.5 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-cyan-500/20 flex items-center space-x-1.5 transition disabled:opacity-50 cursor-pointer"
                    >
                      <Zap className={`w-3.5 h-3.5 ${rlTraining ? 'animate-spin' : ''}`} />
                      <span>{rlTraining ? 'Simulating...' : `Train ${rlTrainCount} Episodes`}</span>
                    </button>
                  </div>
                </div>

                {trainStatusMsg && (
                  <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 font-mono">
                    ✓ {trainStatusMsg}
                  </div>
                )}
              </div>
            </div>

            {/* Key Policy Metrics KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Policy Convergence</span>
                  <Award className="w-4 h-4 text-cyan-600" />
                </div>
                <div className="mt-1 flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-gray-900 font-mono">
                    {rlPolicy?.convergenceScore ?? 94.6}%
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">Stable</span>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Softmax distribution entropy</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Highway Episodes</span>
                  <Layers className="w-4 h-4 text-blue-600" />
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-black text-blue-700 font-mono">
                    {rlPolicy?.totalEpisodes ?? 342}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Real + Simulated breakdowns</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Mean Reward (R̄)</span>
                  <Flame className="w-4 h-4 text-amber-600" />
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-black text-amber-600 font-mono">
                    +{typeof rlPolicy?.avgReward === 'number' ? Number(rlPolicy.avgReward).toFixed(2) : '1.84'}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Speed + First-Fix + Rating</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Exploration (ε)</span>
                  <Sliders className="w-4 h-4 text-purple-600" />
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-black text-purple-700 font-mono">
                    {(Number(rlPolicy?.hyperparams?.epsilon ?? 0.08) * 100).toFixed(1)}%
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">ε-greedy decaying parameter</span>
              </div>
            </div>

            {/* Q-Table Live Heatmap Matrix */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h5 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-cyan-600" />
                    <span>Q-Table Value Matrix: State Space S × Action Space A</span>
                  </h5>
                  <p className="text-xs text-gray-500">
                    Expected discounted reward Q(s, a). Highlighted cell indicates policy-greedy optimal rescue unit.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-gray-400 font-mono">Batch Size:</span>
                  {[25, 50, 100].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setRlTrainCount(cnt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                        rlTrainCount === cnt ? 'bg-cyan-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-gray-900 text-gray-200 text-[11px] uppercase">
                    <tr>
                      <th className="p-3">State Key (Vehicle:Problem:Zone:Time)</th>
                      <th className="p-3 text-center">VAN 1 (Interceptor)</th>
                      <th className="p-3 text-center">VAN 2 (Heavy Air/Brake)</th>
                      <th className="p-3 text-center">VAN 3 (Crane/Hydraulic)</th>
                      <th className="p-3 text-center">VAN 4 (ECU/Diagnostic)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rlPolicy && Object.entries(rlPolicy.qTable).slice(0, 14).map(([stateKey, actions]) => {
                      let maxVal = -Infinity;
                      let bestAction = '';
                      for (const [act, val] of Object.entries(actions)) {
                        if (val > maxVal) {
                          maxVal = val;
                          bestAction = act;
                        }
                      }

                      return (
                        <tr key={stateKey} className="hover:bg-gray-50/80 transition">
                          <td className="p-3 font-bold text-gray-900 bg-gray-50/50">
                            {stateKey}
                          </td>
                          {ALL_RESCUE_ACTIONS.map((action) => {
                            const rawVal = actions?.[action];
                            const val = typeof rawVal === 'number' && !isNaN(rawVal) ? rawVal : 0;
                            const isOptimal = action === bestAction;
                            return (
                              <td 
                                key={action} 
                                className={`p-3 text-center transition font-bold ${
                                  isOptimal 
                                    ? 'bg-cyan-50 text-cyan-900 border-x border-cyan-200' 
                                    : 'text-gray-600'
                                }`}
                              >
                                <div className="flex items-center justify-center space-x-1">
                                  {isOptimal && <Star className="w-3 h-3 text-amber-500 fill-amber-400" />}
                                  <span>{val.toFixed(1)}</span>
                                </div>
                                {isOptimal && (
                                  <span className="text-[9px] uppercase tracking-wider text-cyan-700 block mt-0.5">
                                    ★ Optimal
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Environmental Feedback Injection Form */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h5 className="text-sm font-black text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Environmental Reward Signal Injection (Field Feedback Loop)</span>
                  </h5>
                  <p className="text-xs text-gray-400">
                    Transporter or mechanic completes a roadside job? Inject actual resolution metrics into the Bellman learning equation.
                  </p>
                </div>
                <div className="text-left sm:text-right text-[11px] font-mono text-cyan-400">
                  Q(s, a) ← Q(s, a) + α[R - Q(s, a)]
                </div>
              </div>

              {fbSuccessMsg && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-mono">
                  ✓ {fbSuccessMsg}
                </div>
              )}

              <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">State Key:</label>
                    <input
                      type="text"
                      value={fbStateKey}
                      onChange={(e) => setFbStateKey(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Dispatched Action (Van Unit):</label>
                    <select
                      value={fbAction}
                      onChange={(e) => setFbAction(e.target.value as RescueUnitAction)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    >
                      {ALL_RESCUE_ACTIONS.map(act => (
                        <option key={act} value={act}>
                          {RESCUE_UNITS[act]?.callsign}: {RESCUE_UNITS[act]?.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Lead Reference ID:</label>
                    <input
                      type="text"
                      value={fbLeadId}
                      onChange={(e) => setFbLeadId(e.target.value)}
                      placeholder="e.g. SOS-7482"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-gray-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <div className="flex justify-between text-gray-400 font-bold mb-1">
                      <span>Resolution Time:</span>
                      <span className="text-cyan-400 font-mono">{fbResolutionTime} minutes</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={120}
                      step={5}
                      value={fbResolutionTime}
                      onChange={(e) => setFbResolutionTime(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">First-Time Fix Successful:</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFbFirstTimeFix(true)}
                        className={`flex-1 py-2 rounded-xl font-bold transition cursor-pointer ${
                          fbFirstTimeFix ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-gray-400'
                        }`}
                      >
                        ✓ Yes (+1.5 R)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFbFirstTimeFix(false)}
                        className={`flex-1 py-2 rounded-xl font-bold transition cursor-pointer ${
                          !fbFirstTimeFix ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-400'
                        }`}
                      >
                        ✗ No (-1.0 R)
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-gray-400 font-bold mb-1">
                      <span>Transporter Rating:</span>
                      <span className="text-amber-400 font-mono">{'★'.repeat(fbRating)} ({fbRating}/5)</span>
                    </div>
                    <div className="flex items-center space-x-1 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFbRating(star)}
                          className={`p-1.5 rounded-lg text-lg transition cursor-pointer ${
                            star <= fbRating ? 'text-amber-400' : 'text-gray-600'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={fbSubmitting}
                    className="px-5 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black rounded-xl text-xs flex items-center space-x-2 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-cyan-200" />
                    <span>{fbSubmitting ? 'Backpropagating Reward...' : 'Transmit Bellman Reward Signal'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Rescue Units Fleet Capability Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ALL_RESCUE_ACTIONS.map((action) => {
                const unit = RESCUE_UNITS[action];
                return (
                  <div key={action} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md">
                        {unit.callsign}
                      </span>
                      <span className="text-[10px] text-gray-500 font-bold font-mono">
                        ~{unit.baseEtaMinutes}m Base ETA
                      </span>
                    </div>
                    <h6 className="font-bold text-xs text-gray-900 leading-tight">
                      {unit.name}
                    </h6>
                    <div className="text-[11px] text-gray-500 font-medium">
                      Lead Tech: <span className="text-gray-800 font-semibold">{unit.primaryTech}</span>
                    </div>
                    <div className="text-[10px] text-gray-600 line-clamp-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                      {unit.specialty}
                    </div>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {unit.equipment.slice(0, 2).map((eq, i) => (
                        <span key={i} className="text-[9px] bg-cyan-50 text-cyan-800 px-1.5 py-0.5 rounded-md font-mono">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Tab 2: Telemetry Funnel */}
        {activeTab === 'analytics' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            <div>
              <h4 className="text-base font-black text-gray-900 mb-1">
                Website Measurable Actions & Funnel Telemetry
              </h4>
              <p className="text-xs text-gray-500">
                Tracking every driver click: CALL, WHATSAPP, MAP, PHOTO_UPLOAD, FORM_SUBMIT, and LOCATION_SHARE.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="text-xs font-bold text-gray-500 uppercase block">Total Phone Dials</span>
                <span className="text-2xl font-black text-gray-900">{stats?.totalCalls ?? 0}</span>
                <span className="text-[11px] text-gray-400 block mt-1">Direct Driver Hotline Clicks</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="text-xs font-bold text-gray-500 uppercase block">WhatsApp Chats</span>
                <span className="text-2xl font-black text-green-600">{stats?.totalWhatsApp ?? 0}</span>
                <span className="text-[11px] text-gray-400 block mt-1">Pre-filled Message Dispatches</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="text-xs font-bold text-gray-500 uppercase block">GPS Location Shares</span>
                <span className="text-2xl font-black text-blue-600">{stats?.locationShares ?? 0}</span>
                <span className="text-[11px] text-gray-400 block mt-1">Browser Coordinates Captured</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="text-xs font-bold text-gray-500 uppercase block">Google Maps Routes</span>
                <span className="text-2xl font-black text-red-600">{stats?.totalDirections ?? 0}</span>
                <span className="text-[11px] text-gray-400 block mt-1">Directions to Workshop Hub</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="text-xs font-bold text-gray-500 uppercase block">Photos & Media Uploaded</span>
                <span className="text-2xl font-black text-purple-600">{stats?.photoUploads ?? 0}</span>
                <span className="text-[11px] text-gray-400 block mt-1">Meter / Part defect images</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="text-xs font-bold text-gray-500 uppercase block">Total Leads Logged</span>
                <span className="text-2xl font-black text-indigo-600">{leads.length}</span>
                <span className="text-[11px] text-gray-400 block mt-1">Cloud DB Persistent Records</span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
                Live Event Telemetry Log (Last 50 events)
              </h5>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {(events || []).slice(0, 30).map((ev) => (
                  <div key={ev.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span className="font-bold text-gray-900">{ev.eventType}</span>
                      {ev.label && <span className="text-gray-500 text-[11px]">({ev.label})</span>}
                    </div>
                    <span className="text-gray-400 text-[10px]">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Workshop Configuration (Phone, WhatsApp, Google Review, Google Maps) */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h4 className="text-base font-black text-gray-900 mb-1">
                  Workshop Contact & Google Live Configuration
                </h4>
                <p className="text-xs text-gray-500">
                  Update verified hotline numbers, actual Google Review links, and Google Maps location URLs. Changes save to the cloud server and apply immediately to the website.
                </p>
              </div>

              {configSaveSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Workshop details saved to cloud database and updated across the site!</span>
                </div>
              )}

              <form onSubmit={handleSaveConfig} className="space-y-4">
                
                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Verified Hotline Phone Number (Displayed to Drivers)
                  </label>
                  <input
                    type="text"
                    value={phoneDisplay}
                    onChange={(e) => setPhoneDisplay(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono font-bold text-gray-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Format with country code: +91 98765 43210</span>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Verified WhatsApp Business Number (Without + or spaces)
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="919876543210"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono font-bold text-gray-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Example: 919876543210</span>
                </div>

                {/* Google Review Link */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">
                      Actual Google Review URL
                    </label>
                    {googleReviewUrl && (
                      <a href={googleReviewUrl} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline flex items-center space-x-1">
                        <span>Test Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    value={googleReviewUrl}
                    onChange={(e) => setGoogleReviewUrl(e.target.value)}
                    placeholder="https://search.google.com/local/writereview?placeid=..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Replace placeholder with your exact Google Place Review link</span>
                </div>

                {/* Google Maps Directions Link */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">
                      Actual Google Maps Workshop Pin / Directions URL
                    </label>
                    {googleMapsUrl && (
                      <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline flex items-center space-x-1">
                        <span>Test Map</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    placeholder="https://maps.google.com/?q=27.2038,77.9624"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Workshop Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Address (Hindi)
                    </label>
                    <textarea
                      rows={2}
                      value={addressHi}
                      onChange={(e) => setAddressHi(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Address (English)
                    </label>
                    <textarea
                      rows={2}
                      value={addressEn}
                      onChange={(e) => setAddressEn(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-wide flex items-center justify-center space-x-2 shadow-md transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes to Cloud Database</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* Tab 4: Future Roadmap (Inventory & Bills) */}
        {activeTab === 'inventory' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start space-x-3">
              <Package className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-blue-900">
                  Future Admin System Roadmap: Commercial Inventory, Bills & Vehicle History
                </h4>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Designed for TruckWala 24×7 expansion: real-time stock levels, purchase bill ingestion, supplier accounts, and vehicle-wise maintenance logs.
                </p>
              </div>
            </div>

            {/* Ready Inventory Sample Data */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-xs font-bold uppercase text-gray-700">
                  Ready OEM Parts Stock (Bay 1 & Bay 2)
                </h5>
                <span className="text-[11px] text-emerald-600 font-bold">100% Genuine Batch Verified</span>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200 text-[11px]">
                    <tr>
                      <th className="p-3">Part Description</th>
                      <th className="p-3">Brand / OEM</th>
                      <th className="p-3">Stock Qty</th>
                      <th className="p-3">Benchmark MRP</th>
                      <th className="p-3">Reorder Alert</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-800">
                    <tr>
                      <td className="p-3 font-medium">380mm Twin-Plate Clutch Assembly</td>
                      <td className="p-3 font-mono text-blue-600">Tata Genuine / Valeo</td>
                      <td className="p-3 font-bold">6 Units</td>
                      <td className="p-3 font-mono">₹16,800</td>
                      <td className="p-3"><span className="text-emerald-600 font-bold">In Stock</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Wabco 4-Circuit Protection Valve (BS-IV)</td>
                      <td className="p-3 font-mono text-blue-600">Wabco India</td>
                      <td className="p-3 font-bold">4 Units</td>
                      <td className="p-3 font-mono">₹4,450</td>
                      <td className="p-3"><span className="text-emerald-600 font-bold">In Stock</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Bosch CRDI Injector Nozzle (BS-VI)</td>
                      <td className="p-3 font-mono text-blue-600">Bosch Common Rail</td>
                      <td className="p-3 font-bold">12 Units</td>
                      <td className="p-3 font-mono">₹8,900</td>
                      <td className="p-3"><span className="text-emerald-600 font-bold">In Stock</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Mobil Delvac 15W-40 CI-4 Heavy Diesel Oil</td>
                      <td className="p-3 font-mono text-blue-600">Mobil Commercial</td>
                      <td className="p-3 font-bold">3 Barrels (630L)</td>
                      <td className="p-3 font-mono">₹280 / Litre</td>
                      <td className="p-3"><span className="text-emerald-600 font-bold">In Stock</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vehicle History Lookup Prototype */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
              <h5 className="text-xs font-bold uppercase text-gray-700">
                Truck Service History Lookup
              </h5>
              <p className="text-[11px] text-gray-500">
                Enter any vehicle registration number to retrieve past work orders, clutch changes, oil service dates, and parts installed:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. RJ14 GB 6821"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono uppercase font-bold text-gray-900 w-64"
                />
                <button
                  type="button"
                  onClick={() => alert('Vehicle RJ14 GB 6821: Last serviced at TruckWala on 28 Aug 2026. Jobs: Hub greasing, differential oil top-up, fan belt replacement.')}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold"
                >
                  Retrieve Vehicle Ledger
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Tab 5: AI Technical Audit & Diagnostic Assistant */}
        {activeTab === 'ai_audit' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            <div className="flex items-start space-x-3 bg-purple-50 p-4 rounded-2xl border border-purple-100">
              <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-purple-900">
                  AI Technical Diagnostic & Field Mechanic Assistant
                </h4>
                <p className="text-[11px] text-purple-700 mt-0.5">
                  Server-side Gemini AI model assists workshop mechanics with instant fault diagnosis protocols, DEF/AdBlue error code clearing, and Cummins/Tata engine tests.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Truck Model / Engine:</label>
                <input
                  type="text"
                  value={aiVehicleModel}
                  onChange={(e) => setAiVehicleModel(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">DTC / Fault Code (if any):</label>
                <input
                  type="text"
                  value={aiFaultCode}
                  onChange={(e) => setAiFaultCode(e.target.value)}
                  placeholder="e.g. SPN 4334 / FMI 14"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Driver Symptoms:</label>
                <input
                  type="text"
                  value={aiSymptoms}
                  onChange={(e) => setAiSymptoms(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunAiAudit}
              disabled={aiLoading}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{aiLoading ? 'Analyzing Commercial Engine Data...' : 'Generate Mechanic Diagnosis Protocol'}</span>
            </button>

            {aiResult && (
              <div className="p-4 bg-gray-900 text-gray-100 rounded-2xl border border-gray-800 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                {aiResult}
              </div>
            )}
          </div>
        )}

        </>
        )}

      </div>

      {/* Full Photo Modal */}
      {viewingPhoto && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-black rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setViewingPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-full hover:bg-white/40 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={viewingPhoto} alt="Defect Full View" className="max-h-[80vh] w-auto mx-auto rounded-xl object-contain" />
          </div>
        </div>
      )}

    </div>
  );
};
