import fs from 'fs';
let code = fs.readFileSync('src/components/SettingsTab.tsx', 'utf8');

const newCode = `
                {/* Contacts Import Modal */}
                {activeModal === "contacts" && (
                  <div className="space-y-4 pb-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                        <Users className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Import Potential Customers</h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Import contacts from your phone to easily add them to your customer list and share your business updates.
                      </p>
                      
                      <button
                        onClick={handleImportContacts}
                        disabled={loading}
                        className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-sm hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <DownloadCloud className="w-5 h-5 mr-2" />
                            Select Contacts
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {activeModal === "billing" && (`;

code = code.replace('                {activeModal === "billing" && (', newCode);
fs.writeFileSync('src/components/SettingsTab.tsx', code);
