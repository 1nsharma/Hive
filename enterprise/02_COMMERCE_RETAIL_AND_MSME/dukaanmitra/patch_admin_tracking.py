import re

with open("src/components/AdminConsole.tsx", "r") as f:
    content = f.read()

# Add state for tracking
if "const [trackingLogs, setTrackingLogs] = useState<any[]>([]);" not in content:
    content = content.replace("const [aiLogs, setAiLogs] = useState<any[]>([]);", 
    "const [aiLogs, setAiLogs] = useState<any[]>([]);\n  const [trackingLogs, setTrackingLogs] = useState<any[]>([]);")

# Add fetch logic for tracking logs inside fetchAdminData
if "const tRes = await fetchWithAuth('/api/admin/tracking');" not in content:
    content = content.replace("const aiRes = await fetchWithAuth('/api/admin/ai-logs');",
    """const aiRes = await fetchWithAuth('/api/admin/ai-logs');
      const tRes = await fetchWithAuth('/api/admin/tracking');
      if (tRes.ok) {
        const data = await tRes.json();
        setTrackingLogs(data);
      }""")

# Add sidebar button
if 'onClick={() => setActiveTab("tracking")}' not in content:
    tracking_btn = """<button
            onClick={() => setActiveTab("tracking")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
              activeTab === "tracking" 
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                : "text-slate-600 hover:bg-slate-50 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3"><Activity className="w-4 h-4" /> Agent Tracking</div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>"""
    content = content.replace('<button\n            onClick={() => setActiveTab("logs")}', tracking_btn + '\n          <button\n            onClick={() => setActiveTab("logs")}')

# Add tracking view
tracking_view = """{activeTab === "tracking" && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Agent & User Tracking</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <th className="p-3 font-semibold rounded-tl-lg">User Hash</th>
                        <th className="p-3 font-semibold">Customer Hash</th>
                        <th className="p-3 font-semibold">Action</th>
                        <th className="p-3 font-semibold">Metadata</th>
                        <th className="p-3 font-semibold rounded-tr-lg">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {trackingLogs.map((log: any) => (
                        <tr key={log.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                          <td className="p-3">
                             <div className="font-mono text-xs bg-slate-100 px-2 py-1 rounded w-32 truncate" title={log.userHash}>{log.userHash || 'N/A'}</div>
                          </td>
                          <td className="p-3">
                             <div className="font-mono text-xs bg-slate-100 px-2 py-1 rounded w-32 truncate" title={log.customerHash}>{log.customerHash || 'N/A'}</div>
                          </td>
                          <td className="p-3 text-slate-700 font-medium">
                            {log.actionType}
                          </td>
                          <td className="p-3">
                             <div className="text-xs text-slate-500 max-w-[200px] truncate" title={log.metadata}>{log.metadata}</div>
                          </td>
                          <td className="p-3 text-slate-500">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      {trackingLogs.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500 italic">No tracking data found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}"""

if 'activeTab === "tracking"' not in content:
    content = content.replace('{activeTab === "logs" && (', tracking_view + '\n\n            {activeTab === "logs" && (')

with open("src/components/AdminConsole.tsx", "w") as f:
    f.write(content)
