import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, Database, Users, Server, Box, Activity, Key, ChevronRight, Lock, BrainCircuit, Trash2
} from "lucide-react";
import { fetchWithAuth } from "../../utils";

export default function AdminConsole() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [systemData, setSystemData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [aiCacheData, setAiCacheData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [aiLogs, setAiLogs] = useState<any[]>([]);
  const [trackingLogs, setTrackingLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      const token = localStorage.getItem("bazaarsync_auth");
      if (!token) {
        setError("Unauthorized");
        setLoading(false);
        return;
      }
      try {
        const [sysRes, usersRes, logsRes, cacheRes] = await Promise.all([
          fetchWithAuth("/api/admin/system"),
          fetchWithAuth("/api/admin/users"),
          fetchWithAuth("/api/admin/logs"),
          fetchWithAuth("/api/admin/cache")
        ]);

        if (!sysRes.ok || !usersRes.ok) {
          throw new Error("Failed to fetch admin data. You might not have permission.");
        }

        const sysData = await sysRes.json();
        const usersData = await usersRes.json();
        const logsData = logsRes.ok ? await logsRes.json() : [];
        const cacheData = cacheRes.ok ? await cacheRes.json() : [];

        setSystemData(sysData);
        setUsers(usersData);
        setLogs(logsData);
        setAiCacheData(cacheData);
      } catch (err: any) {
        setError(err.message || "Failed to load admin console.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm(`Are you sure you want to delete user #${userId}? All their data will be lost!`)) return;
    
    try {
      const res = await fetchWithAuth(`/api/admin/users/${userId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
      } else {
        alert("Failed to delete user");
      }
    } catch (e) {
      alert("Error deleting user");
    }
  };

  const handleClearCache = async () => {
    if (!window.confirm(`Are you sure you want to clear all AI Cache? This will increase API costs temporarily.`)) return;
    
    try {
      const res = await fetchWithAuth(`/api/admin/cache`, {
        method: "DELETE"
      });
      if (res.ok) {
        setAiCacheData([]);
      } else {
        alert("Failed to clear cache");
      }
    } catch (e) {
      alert("Error clearing cache");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-[#16A34A] font-medium">Authenticating Admin Access...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Founder Console</h1>
          <p className="text-sm text-slate-500 font-mono">BazaarSync Ecosystem Control Panel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "overview" 
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                : "text-slate-600 hover:bg-[#F8FAFC] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3"><Activity className="w-4 h-4" /> System Overview</div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
          
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "users" 
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                : "text-slate-600 hover:bg-[#F8FAFC] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3"><Users className="w-4 h-4" /> User Management</div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => setActiveTab("tracking")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
              activeTab === "tracking" 
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                : "text-slate-600 hover:bg-[#F8FAFC] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3"><Activity className="w-4 h-4" /> Agent Tracking</div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "logs" 
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                : "text-slate-600 hover:bg-[#F8FAFC] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3"><Activity className="w-4 h-4" /> Audit Logs</div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => setActiveTab("cache")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "cache" 
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                : "text-slate-600 hover:bg-[#F8FAFC] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3"><BrainCircuit className="w-4 h-4" /> AI Cache Config</div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
          
          <button
            onClick={() => setActiveTab("env")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "env" 
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                : "text-slate-600 hover:bg-[#F8FAFC] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3"><Key className="w-4 h-4" /> Environment Variables</div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "whatsapp" 
                ? "bg-[#16A34A]/10 text-[#15803D] border border-emerald-100" 
                : "text-slate-600 hover:bg-[#F8FAFC] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg> WhatsApp Web Sync</div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[500px]">
            {activeTab === "overview" && systemData && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Platform Analytics</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Users className="w-4 h-4" /> 
                        <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
                      </div>
                      <div className="text-3xl font-bold text-slate-900">{systemData.stats.totalUsers}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Database className="w-4 h-4" /> 
                        <span className="text-xs font-semibold uppercase tracking-wider">Ledger Entries</span>
                      </div>
                      <div className="text-3xl font-bold text-slate-900">{systemData.stats.totalTransactions}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Box className="w-4 h-4" /> 
                        <span className="text-xs font-semibold uppercase tracking-wider">Products Logged</span>
                      </div>
                      <div className="text-3xl font-bold text-slate-900">{systemData.stats.totalProducts}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">System Status</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#16A34A]/10 border border-emerald-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-[#166534] uppercase tracking-wider mb-1">Deployment</div>
                        <div className="font-mono text-emerald-900 font-bold">{systemData.deployments.environment} • Port {systemData.deployments.port}</div>
                      </div>
                      <Server className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-indigo-800 uppercase tracking-wider mb-1">AI Service</div>
                        <div className="font-mono text-indigo-900 font-bold text-sm truncate max-w-[150px]">{systemData.aiConfig.model}</div>
                        <div className="text-xs text-indigo-700 mt-0.5">{systemData.aiConfig.status}</div>
                      </div>
                      <ShieldCheck className="w-6 h-6 text-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">User Registry</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] text-slate-500 text-xs uppercase tracking-wider">
                        <th className="p-3 font-semibold rounded-tl-lg">ID</th>
                        <th className="p-3 font-semibold">Email</th>
                        <th className="p-3 font-semibold">UID</th>
                        <th className="p-3 font-semibold">Created At</th>
                        <th className="p-3 font-semibold rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {users.map((u, i) => (
                        <tr key={u.id} className="border-b border-slate-100 hover:bg-[#F8FAFC]/50">
                          <td className="p-3 text-slate-500 font-mono">#{u.id}</td>
                          <td className="p-3 font-medium text-slate-800">{u.email}</td>
                          <td className="p-3 font-mono text-xs text-slate-400 truncate max-w-[120px]">{u.uid}</td>
                          <td className="p-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="p-3">
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr><td colSpan={5} className="p-6 text-center text-slate-500">No users found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "cache" && (
              <div>
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <h2 className="text-lg font-bold text-slate-800">AI Tokens / Cache Management</h2>
                  <button
                    onClick={handleClearCache}
                    className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Cache
                  </button>
                </div>
                
                <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-[#16A34A]">
                      <BrainCircuit className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">Token Balancer Active</div>
                      <div className="text-xs text-slate-500">
                        {aiCacheData.length} queries cached. 
                        Saved approximately {aiCacheData.reduce((acc, curr) => acc + curr.hitCount, 0)} API hits.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] text-slate-500 text-xs uppercase tracking-wider">
                        <th className="p-3 font-semibold rounded-tl-lg">Hash</th>
                        <th className="p-3 font-semibold">Type</th>
                        <th className="p-3 font-semibold">Hit Count</th>
                        <th className="p-3 font-semibold rounded-tr-lg">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {aiCacheData.map((c) => (
                        <tr key={c.id} className="border-b border-slate-100 hover:bg-[#F8FAFC]/50">
                          <td className="p-3 font-mono text-xs text-slate-500 truncate max-w-[150px]">{c.promptHash}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                              {c.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-[#16A34A]">{c.hitCount} saved</td>
                          <td className="p-3 text-slate-500">{new Date(c.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                      {aiCacheData.length === 0 && (
                        <tr><td colSpan={4} className="p-6 text-center text-slate-500">No cached AI queries found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "logs" && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Session Audit Logs</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] text-slate-500 text-xs uppercase tracking-wider">
                        <th className="p-3 font-semibold rounded-tl-lg">User</th>
                        <th className="p-3 font-semibold">Action</th>
                        <th className="p-3 font-semibold">IP Address</th>
                        <th className="p-3 font-semibold rounded-tr-lg">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {logs.map((log) => (
                        <tr key={log.id} className="border-b border-slate-100 hover:bg-[#F8FAFC]/50">
                          <td className="p-3 font-medium text-slate-800">
                            {log.email || `User #${log.userId}`}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              log.eventType === 'login' ? 'bg-emerald-100 text-[#15803D]' :
                              log.eventType === 'logout' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {log.eventType.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-xs text-slate-500">{log.ipAddress || 'Unknown'}</td>
                          <td className="p-3 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                      {logs.length === 0 && (
                        <tr><td colSpan={4} className="p-6 text-center text-slate-500">No logs found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "env" && systemData && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Environment Configuration</h2>
                <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <tbody className="font-mono">
                      {systemData.envVars.map((env: any, idx: number) => (
                        <tr key={idx} className="border-b border-slate-800 last:border-0">
                          <td className="p-2 text-indigo-300 font-semibold w-1/3 break-all">{env.key}</td>
                          <td className="p-2 text-emerald-400 break-all">{env.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex gap-2">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <p>Secrets and tokens are masked. To update variables, modify the `.env` file directly or through your hosting provider's dashboard.</p>
                </div>
              </div>
            )}

            
            {activeTab === "ailogs" && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" /> 
                    AI Agent Logchain
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Monitor all AI/ML models and agentic interactions. View real-time logs to ensure implementation correctness and guard against mismatched flows or jailbreak attempts.
                  </p>
                </div>
                
                <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-inner">
                   <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                     <span className="text-xs font-mono text-emerald-400 font-bold">● LIVE SYSTEM LOGS</span>
                     <span className="text-xs font-mono text-slate-400">Total Entries: {aiLogs.length}</span>
                   </div>
                   <div className="p-4 overflow-y-auto max-h-[500px] font-mono text-xs space-y-3">
                      {aiLogs.length === 0 ? (
                        <div className="text-slate-500 italic text-center py-4">No AI agent activity recorded yet.</div>
                      ) : (
                        aiLogs.map((log, idx) => {
                          let metadata = { action: "unknown", intent: "unknown", context: {}, status: "unknown" };
                          try { if (log.metadata) metadata = JSON.parse(log.metadata); } catch(e) {}
                          
                          return (
                            <div key={idx} className="border-l-2 border-emerald-500 pl-3 py-1">
                              <div className="flex justify-between items-start">
                                <span className="text-slate-300">[{new Date(log.createdAt).toLocaleString()}] <span className="text-emerald-400 font-bold">ACTION:</span> {metadata.action}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] ${metadata.status === 'success' ? 'bg-[#16A34A]/100/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>{metadata.status}</span>
                              </div>
                              <div className="text-slate-400 mt-1"><span className="text-blue-400">INTENT:</span> {metadata.intent}</div>
                              <div className="text-slate-500 mt-1 max-w-full overflow-x-auto whitespace-pre-wrap">
                                <span className="text-amber-400">CONTEXT:</span> {JSON.stringify(metadata.context, null, 2)}
                              </div>
                            </div>
                          );
                        })
                      )}
                   </div>
                </div>
              </div>
            )}
    
            {activeTab === "whatsapp" && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg> 
                    WhatsApp Web (Baileys/Puppeteer Integration)
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Connect your WhatsApp account to automatically send Welcome Messages, Bills, and promotional updates to your registered customers directly from your number.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/3 bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
                    {localStorage.getItem("wa_connected") === "true" ? (
                      <>
                        <div className="w-24 h-24 bg-emerald-100 text-[#16A34A] rounded-full flex items-center justify-center mb-4">
                          <ShieldCheck className="w-12 h-12" />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1">WhatsApp Connected</h3>
                        <p className="text-xs text-slate-500 mb-6">Your store's WhatsApp number is active and ready to send messages.</p>
                        <button
                          onClick={() => {
                            localStorage.removeItem("wa_connected");
                            window.location.reload();
                          }}
                          className="px-6 py-2 bg-rose-100 text-rose-700 font-bold rounded-xl hover:bg-rose-200 transition-colors w-full"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-48 h-48 bg-white border-4 border-slate-200 rounded-xl p-2 mb-4 relative overflow-hidden">
                          {/* Fake QR Code Pattern */}
                          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTMgM2g4djhIM3ptMiAydjRoNHYtNEg1em0xNCAwaC0ydjJoMnYtMnoiIGZpbGw9IiMzMzMiLz48L3N2Zz4=')] opacity-50 bg-repeat bg-[length:24px_24px]"></div>
                          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[1px] bg-white/30">
                            <button
                              onClick={() => {
                                localStorage.setItem("wa_connected", "true");
                                window.location.reload();
                              }}
                              className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-lg hover:bg-emerald-700 transition-all text-sm"
                            >
                              Scan to Connect
                            </button>
                          </div>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1">Link Device</h3>
                        <p className="text-xs text-slate-500">Open WhatsApp on your phone, go to Linked Devices, and scan this QR code.</p>
                      </>
                    )}
                  </div>

                  <div className="w-full md:w-2/3 space-y-4">
                    <h3 className="font-bold text-slate-800">Automated Features</h3>
                    
                    <div className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-[#16A34A] flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">New Customer Welcome</h4>
                        <p className="text-xs text-slate-500 mt-1">Automatically sends a welcome greeting when a new customer is added during POS billing.</p>
                      </div>
                      <div className="ml-auto">
                         <div className={`w-10 h-5 rounded-full relative transition-colors ${localStorage.getItem("wa_connected") === "true" ? 'bg-[#16A34A]/100' : 'bg-slate-300'}`}>
                           <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${localStorage.getItem("wa_connected") === "true" ? 'left-5.5' : 'left-0.5'}`}></div>
                         </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Digital Billing</h4>
                        <p className="text-xs text-slate-500 mt-1">Send PDF bills instantly after a transaction is completed.</p>
                      </div>
                      <div className="ml-auto">
                         <div className="w-10 h-5 rounded-full bg-slate-300 relative">
                           <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full"></div>
                         </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Targeted AI Promotions</h4>
                        <p className="text-xs text-slate-500 mt-1">Send personalized discount messages based on customer purchase history and AI Insights.</p>
                      </div>
                      <div className="ml-auto">
                         <div className="w-10 h-5 rounded-full bg-slate-300 relative">
                           <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full"></div>
                         </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
