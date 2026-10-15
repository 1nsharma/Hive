import React, { useState, useEffect } from 'react';
import { X, Database, Download, Phone, MapPin, Mic, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { Language, LeadSubmission, TrackingEvent } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { getLocalLeads, getLocalEvents, exportLeadsCSV } from '../utils/analytics';

interface LeadsActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const LeadsActivityModal: React.FC<LeadsActivityModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'events'>('leads');

  const refreshData = () => {
    setLeads(getLocalLeads());
    setEvents(getLocalEvents());
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gray-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg flex items-center space-x-2">
                <span>{t.leadsEngineTitle}</span>
                <span className="bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Data Engine
                </span>
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                {t.leadsSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={refreshData}
              className="p-2 text-gray-400 hover:text-white rounded-lg transition"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action bar with Tab switcher and CSV download */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 bg-gray-200 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'leads' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
              }`}
            >
              Captured Leads ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'events' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
              }`}
            >
              Telemetry Events ({events.length})
            </button>
          </div>

          {leads.length > 0 && (
            <button
              onClick={exportLeadsCSV}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.downloadLeadsCSV}</span>
            </button>
          )}
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'leads' ? (
            leads.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                <Database className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p>{t.noLeadsYet}</p>
                <p className="text-xs text-gray-400 mt-1">Submit the Highway Breakdown, Repair or Parts form to see live data acquisition.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leads.map((lead) => (
                  <div key={lead.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:border-blue-400 transition text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded-md border border-gray-300">
                          {lead.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          lead.formType === 'breakdown' ? 'bg-red-100 text-red-700' :
                          lead.formType === 'repair' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {lead.formType}
                        </span>
                      </div>
                      <span className="text-gray-400 font-mono text-[10px]">
                        {new Date(lead.receivedAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 text-gray-700">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Vehicle Number:</span>
                        <span className="font-mono font-bold text-gray-900">{lead.vehicleNumber || 'Unspecified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Contact Phone:</span>
                        <span className="font-mono font-bold text-emerald-700">{lead.phone || 'N/A'}</span>
                      </div>
                    </div>

                    {(lead.problem || lead.partName) && (
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Requirement / Problem:</span>
                        <p className="text-gray-800 font-medium">{lead.problem || lead.partName}</p>
                      </div>
                    )}

                    {lead.location && (
                      <div className="flex items-center space-x-1.5 text-blue-700 bg-blue-50 p-2 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                        <span className="font-mono">{lead.location.addressText || `${lead.location.lat}, ${lead.location.lng}`}</span>
                      </div>
                    )}

                    {lead.hasVoiceNote && (
                      <div className="flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md w-fit">
                        <Mic className="w-3 h-3 text-emerald-600" />
                        <span>Voice Note Attached ({lead.voiceNoteDuration}s)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Events view */
            events.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                No tracking events registered yet.
              </div>
            ) : (
              <div className="space-y-2">
                {events.map((ev) => (
                  <div key={ev.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span className="font-mono font-bold text-gray-800">{ev.eventType}</span>
                      {ev.label && <span className="text-gray-500 text-[11px]">({ev.label})</span>}
                    </div>
                    <span className="text-gray-400 font-mono text-[10px]">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
};
