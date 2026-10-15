import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Fingerprint, Key, RefreshCw, CheckCircle2 } from 'lucide-react';
import { securityService } from '../services/securityService';
import { IdentityCredential, ZKPProof } from '../types';
import { cn } from '../lib/utils';

export const IdentityWallet: React.FC = () => {
  const [credentials, setCredentials] = useState<IdentityCredential[]>(securityService.getMockCredentials());
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [recentProofs, setRecentProofs] = useState<ZKPProof[]>([]);

  const handleVerify = async (id: string) => {
    setVerifyingId(id);
    await securityService.verifyCredential(id);
    setVerifyingId(null);
    setCredentials(prev => prev.map(c => c.id === id ? { ...c, status: 'Verified' } : c));
    
    // Generate a new ZKP proof record
    const newProof: ZKPProof = {
      id: `ZKP-${Math.random().toString(36).substr(2, 6)}`,
      credentialId: id,
      timestamp: new Date().toISOString(),
      proofHash: `0x${Math.random().toString(16).substr(2, 40)}`,
      verified: true
    };
    setRecentProofs(prev => [newProof, ...prev].slice(0, 3));
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Fingerprint className="text-gov-primary" size={20} />
          <h3 className="font-bold text-gov-primary">Self-Sovereign Identity Wallet</h3>
        </div>
        <span className="text-[10px] bg-gov-success/10 text-gov-success px-2 py-1 rounded-full font-bold uppercase">
          Zero-Knowledge Proofs Active
        </span>
      </div>

      <div className="space-y-4">
        {credentials.map((cred) => (
          <div key={cred.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-xs font-bold text-slate-900">{cred.credential_type}</div>
                <div className="text-[10px] text-slate-400">ID: {cred.id}</div>
              </div>
              <div className={cn(
                "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                cred.status === 'Verified' ? "bg-gov-success text-white" : "bg-gov-warning text-white"
              )}>
                {cred.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-bold">Issuer</div>
                <div className="text-[11px] text-slate-700">{cred.issuer}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-bold">Issued At</div>
                <div className="text-[11px] text-slate-700">{cred.issuedAt}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key size={12} className="text-slate-400" />
                <code className="text-[9px] text-slate-500 font-mono">{cred.proof}</code>
              </div>
              <button 
                onClick={() => handleVerify(cred.id)}
                disabled={verifyingId === cred.id}
                className="text-[10px] font-bold text-gov-primary hover:underline flex items-center gap-1"
              >
                {verifyingId === cred.id ? (
                  <RefreshCw size={10} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={10} />
                )}
                {verifyingId === cred.id ? 'Verifying...' : 'Re-Verify'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:border-gov-primary hover:text-gov-primary transition-all flex items-center justify-center gap-2">
        <ShieldCheck size={14} />
        Add New Sovereign Credential
      </button>

      {recentProofs.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase font-bold mb-3">Recent ZKP Proofs Generated</div>
          <div className="space-y-2">
            {recentProofs.map(proof => (
              <div key={proof.id} className="p-2 bg-gov-primary/5 rounded-lg border border-gov-primary/10 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gov-primary">{proof.id}</span>
                  <span className="text-[8px] text-slate-400 truncate w-32 font-mono">{proof.proofHash}</span>
                </div>
                <div className="text-[8px] text-gov-success font-bold">VERIFIED</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
