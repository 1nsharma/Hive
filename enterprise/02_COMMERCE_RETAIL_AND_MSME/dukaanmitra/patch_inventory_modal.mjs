import fs from 'fs';
let code = fs.readFileSync('src/components/InventoryTab.tsx', 'utf8');

const newCode = `
      {/* Modal: AI Catalog Suggestion */}
      <AnimatePresence>
        {showAICatalogModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowAICatalogModal(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold font-brand-title text-indigo-700 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5" /> AI Inventory Catalog
              </h3>
              
              {!aiCatalogData && !generatingCatalog && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-slate-600 mb-6">
                    Our AI will analyze your shop's category and suggest a list of 10-15 common items you should keep in stock, along with personalized inventory strategies.
                  </p>
                  <button
                    onClick={handleGenerateCatalog}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-colors"
                  >
                    Generate Catalog Suggestions
                  </button>
                </div>
              )}
              
              {generatingCatalog && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-indigo-600 font-bold animate-pulse">Analyzing your business & generating catalog...</p>
                </div>
              )}
              
              {aiCatalogData && !generatingCatalog && (
                <div className="mt-4">
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6">
                    <h4 className="font-bold text-indigo-900 mb-1 flex items-center gap-1 text-sm"><Sparkles className="w-4 h-4"/> AI Strategy</h4>
                    <p className="text-indigo-800 text-sm">{aiCatalogData.strategy}</p>
                  </div>
                  
                  <h4 className="font-bold text-slate-800 mb-3 text-sm flex items-center justify-between">
                    Suggested Items
                    <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{aiCatalogData.catalog?.length || 0} items</span>
                  </h4>
                  
                  <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                    {aiCatalogData.catalog?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                          <p className="text-xs text-slate-500">Unit: {item.unit} | Suggested Price: ₹{item.suggestedPrice}</p>
                        </div>
                        <button
                          onClick={() => handleApplyAICatalogItem(item)}
                          className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-600 hover:text-white transition-colors"
                        >
                          Add to Inventory
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleGenerateCatalog}
                      className="text-indigo-600 text-sm font-bold hover:underline"
                    >
                      Regenerate Suggestions
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 1. Modal: Add Product */}`;

code = code.replace('{/* 1. Modal: Add Product */}', newCode);
fs.writeFileSync('src/components/InventoryTab.tsx', code);
