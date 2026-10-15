import re

with open("src/components/AdminConsole.tsx", "r") as f:
    content = f.read()

# Add a new tab
if '"ailogs"' not in content:
    content = content.replace(
        '<button onClick={() => setActiveTab("whatsapp")} className={`px-4 py-2 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === "whatsapp" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>\n              WhatsApp API\n            </button>',
        '<button onClick={() => setActiveTab("whatsapp")} className={`px-4 py-2 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === "whatsapp" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>\n              WhatsApp API\n            </button>\n            <button onClick={() => setActiveTab("ailogs")} className={`px-4 py-2 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === "ailogs" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>\n              AI Logchain\n            </button>'
    )

# Add fetch and state for AI Logs
if "aiLogs" not in content:
    content = content.replace("const [envVars, setEnvVars]", "const [aiLogs, setAiLogs] = useState<any[]>([]);\n  const [envVars, setEnvVars]")
    
    fetch_code = """
  useEffect(() => {
    if (activeTab === "ailogs") {
      const token = localStorage.getItem("dukaanmitra_auth");
      if (token) {
        const authData = JSON.parse(token);
        fetchWithAuth("/api/admin/ai-logs")
          .then(res => res.json())
          .then(data => {
             if (data.logs) setAiLogs(data.logs);
          })
          .catch(err => console.error("Failed to fetch AI logs", err));
      }
    }
  }, [activeTab]);
    """
    content = content.replace("useEffect(() => {\n    // Load env vars", fetch_code + "\n  useEffect(() => {\n    // Load env vars")

    # Add AI Logs UI
    ai_logs_ui = """
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
                                <span className={`px-1.5 py-0.5 rounded text-[10px] ${metadata.status === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>{metadata.status}</span>
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
    """
    
    content = content.replace("{activeTab === \"whatsapp\" && (", ai_logs_ui + "\n            {activeTab === \"whatsapp\" && (")

    # Add fetchWithAuth to imports
    content = content.replace('import { ShieldCheck, Database, Key, Server, Settings, Users, LogOut, ArrowLeft } from "lucide-react";', 'import { ShieldCheck, Database, Key, Server, Settings, Users, LogOut, ArrowLeft } from "lucide-react";\nimport { fetchWithAuth } from "../utils";')


with open("src/components/AdminConsole.tsx", "w") as f:
    f.write(content)
