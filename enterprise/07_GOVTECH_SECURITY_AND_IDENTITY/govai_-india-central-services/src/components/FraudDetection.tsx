import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, AlertCircle, Eye, ShieldCheck, TrendingUp, Info } from 'lucide-react';
import { govService } from '../services/govService';
import { FraudCase } from '../types';
import { cn } from '../lib/utils';

export const FraudDetection: React.FC = () => {
  const [cases, setCases] = useState<FraudCase[]>(govService.getMockFraudCases());
  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-gov-primary" size={20} />
            <h3 className="font-bold text-gov-primary">Sovereign AI Fraud Detection</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <TrendingUp size={12} />
              <span>Federated Learning Active</span>
            </div>
            <span className="text-[10px] bg-gov-danger/10 text-gov-danger px-2 py-1 rounded-full font-bold uppercase">
              {cases.filter(c => c.status === 'Flagged').length} Critical Alerts
            </span>
          </div>
        </div>

        <div className="overflow-hidden border border-slate-100 rounded-xl">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 font-bold">
              <tr>
                <th className="px-6 py-4">Case ID</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Risk Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{c.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{c.subject}</td>
                  <td className="px-6 py-4 text-slate-500">{c.type}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full w-16 overflow-hidden">
                        <div 
                          className={cn(
                            "h-full",
                            c.riskScore > 80 ? "bg-gov-danger" : "bg-gov-warning"
                          )} 
                          style={{ width: `${c.riskScore}%` }} 
                        />
                      </div>
                      <span className="text-[10px] font-bold">{c.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold",
                      c.status === 'Flagged' ? "bg-gov-danger/10 text-gov-danger" :
                      c.status === 'Under Investigation' ? "bg-gov-warning/10 text-gov-warning" :
                      "bg-gov-success/10 text-gov-success"
                    )}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedCase(c)}
                      className="p-2 hover:bg-gov-primary/10 text-gov-primary rounded-lg transition-all"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-card p-6 border-l-4 border-gov-primary"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Info className="text-gov-primary" size={18} />
                <h4 className="font-bold text-gov-primary uppercase text-xs tracking-wider">Explainable AI (XAI) Analysis</h4>
              </div>
              <button 
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gov-primary/5 rounded-xl border border-gov-primary/10">
                <div className="text-[10px] text-gov-primary font-bold uppercase mb-1">AI Reasoning (XAI)</div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{selectedCase.reasoning}"
                </p>
              </div>

              <div className="p-4 bg-gov-success/5 rounded-xl border border-gov-success/10">
                <div className="text-[10px] text-gov-success font-bold uppercase mb-1">Recommendation</div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedCase.recommendation}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-white border border-slate-100 rounded-lg">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Confidence</div>
                  <div className="text-lg font-bold text-gov-primary">98.2%</div>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-lg">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Data Sources</div>
                  <div className="text-lg font-bold text-gov-primary">{selectedCase.evidence.length} (IRS, GST, MCA)</div>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-lg">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Audit Trail</div>
                  <div className="text-lg font-bold text-gov-success">SECURE</div>
                </div>
              </div>

              {selectedCase.evidence.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Supporting Evidence</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCase.evidence.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] text-gov-primary hover:underline bg-gov-primary/5 px-2 py-1 rounded border border-gov-primary/10"
                      >
                        Source {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button className="gov-button flex-1">Initiate Official Inquiry</button>
                <button className="gov-button bg-white !text-gov-primary border border-slate-200 flex-1">Request More Data</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
