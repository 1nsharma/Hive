import React, { useState } from "react";
import { SAMPLE_DEALS } from "../data/sampleDeals";
import { calculateDealFinancials } from "../utils/realEstateMath";
import { DealInput } from "../types";
import {
  Target,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Building,
  DollarSign,
  Users,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Layers,
} from "lucide-react";
import confetti from "canvas-confetti";

interface FirstMissionViewProps {
  onOpenModelerWithDeal: (deal: DealInput) => void;
  onAdvanceToCurriculum: () => void;
}

export const FirstMissionView: React.FC<FirstMissionViewProps> = ({
  onOpenModelerWithDeal,
  onAdvanceToCurriculum,
}) => {
  const [selectedDeal, setSelectedDeal] = useState<DealInput>(SAMPLE_DEALS[0]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const [missionUnlocked, setMissionUnlocked] = useState<boolean>(false);

  const financials = calculateDealFinancials(selectedDeal);

  const handleStepClick = (step: number) => {
    setActiveStep(step);
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const handleFinishMission = () => {
    setMissionUnlocked(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Target className="w-3.5 h-3.5" />
            <span>Developer Milestone: The First Mission</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Learn to Look at One Real Property Like a Developer
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Don't start by trying to build a ₹100-crore project. Start by answering the 6 foundational questions for a single parcel:
            <span className="text-amber-300 font-medium italic block mt-1">
              "What is it worth? What can be built? What will it cost? Who will fund it? Who will buy it? And where is my profit?"
            </span>
          </p>
        </div>

        {/* Preset Property Selector */}
        <div className="mt-6 pt-6 border-t border-slate-700/60 flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-slate-400">Select Test Property:</span>
          {SAMPLE_DEALS.map((deal) => (
            <button
              key={deal.id}
              onClick={() => setSelectedDeal(deal)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedDeal.id === deal.id
                  ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20"
                  : "bg-slate-800/90 text-slate-300 hover:bg-slate-700/80 border border-slate-700"
              }`}
            >
              {deal.name}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Step Progress Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { num: 1, title: "1. Worth", sub: "Land Valuation" },
          { num: 2, title: "2. Build", sub: "FAR & Zoning" },
          { num: 3, title: "3. Cost", sub: "Cost Stack" },
          { num: 4, title: "4. Fund", sub: "Capital Stack" },
          { num: 5, title: "5. Buy", sub: "Sales Velocity" },
          { num: 6, title: "6. Profit", sub: "Return & Margin" },
        ].map((s) => {
          const isCurrent = activeStep === s.num;
          const isDone = completedSteps.includes(s.num);
          return (
            <button
              key={s.num}
              onClick={() => handleStepClick(s.num)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                isCurrent
                  ? "bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10"
                  : isDone
                  ? "bg-slate-850/80 border-slate-700 text-slate-300 hover:border-slate-600"
                  : "bg-slate-900/60 border-slate-800 text-slate-500 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-bold ${isCurrent ? "text-amber-400" : "text-slate-400"}`}>
                  Step 0{s.num}
                </span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <div className="mt-1 font-display font-semibold text-sm truncate">{s.title}</div>
              <div className="text-[11px] text-slate-400 truncate">{s.sub}</div>
            </button>
          );
        })}
      </div>

      {/* Active Step Content */}
      <div className="bg-slate-850 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* Step 1 */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-amber-400">
              <Building className="w-6 h-6" />
              <h2 className="text-xl font-display font-bold text-white">
                Question 1: What is this opportunity actually worth?
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Never accept the seller's asking price blindly. A developer values land based on <strong className="text-white">Residual Land Value</strong> (what the land is worth after deducting all construction, approvals, financing, and minimum 25% developer profit from total anticipated sales).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Plot Dimensions & Area</span>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {selectedDeal.plotAreaSqFt.toLocaleString()} sq.ft
                </div>
                <span className="text-[11px] text-slate-500">
                  ≈ {(selectedDeal.plotAreaSqFt / 43560).toFixed(2)} Acres
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Circle Rate (Govt Floor)</span>
                <div className="text-lg font-bold font-mono text-amber-300 mt-1">
                  ₹{selectedDeal.circleRatePerSqFt.toLocaleString()} / sq.ft
                </div>
                <span className="text-[11px] text-slate-500">
                  Dutiable Base: ₹{((selectedDeal.plotAreaSqFt * selectedDeal.circleRatePerSqFt) / 10000000).toFixed(2)} Cr
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Market Asking Price</span>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                  ₹{selectedDeal.marketAskPriceTotal} Cr
                </div>
                <span className="text-[11px] text-slate-500">
                  Effective: ₹{Math.round((selectedDeal.marketAskPriceTotal * 10000000) / selectedDeal.plotAreaSqFt)} / sq.ft
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
              <strong className="font-semibold block mb-1">💡 The Developer Valuation Rule:</strong>
              If Market Rate is significantly above Circle Rate, you must evaluate if the permissible FAR allows sufficient saleable area to clear a 25%+ developer margin. If not, you negotiate a JDA or reduce the purchase offer.
            </div>
          </div>
        )}

        {/* Step 2 */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-amber-400">
              <Layers className="w-6 h-6" />
              <h2 className="text-xl font-display font-bold text-white">
                Question 2: What can be built here?
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Zoning, road width, and municipal bylaws determine your <strong className="text-white">Floor Area Ratio (FAR)</strong> and maximum built-up envelope. You don't sell land; you sell permissible square footage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Total Effective FAR</span>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {financials.totalFar}x
                </div>
                <span className="text-[11px] text-slate-500">Base {selectedDeal.baseFar} + Purchasable {selectedDeal.purchasableFar}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Permissible Built-Up Area</span>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {financials.totalBuiltUpAreaSqFt.toLocaleString()} sq.ft
                </div>
                <span className="text-[11px] text-slate-500">Gross Floor Area</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Efficiency / Loading</span>
                <div className="text-lg font-bold font-mono text-amber-300 mt-1">
                  {selectedDeal.superBuiltUpEfficiencyPercent}%
                </div>
                <span className="text-[11px] text-slate-500">Common area multiplier</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Total Saleable Area</span>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                  {financials.totalSaleableAreaSqFt.toLocaleString()} sq.ft
                </div>
                <span className="text-[11px] text-slate-500">Revenue-generating area</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
              <strong className="font-semibold text-white block mb-1">🏗️ Physical Envelope Breakdown:</strong>
              With a {selectedDeal.groundCoveragePercent}% ground coverage, the building footprint is{" "}
              <span className="text-amber-400 font-mono font-semibold">
                {Math.round(selectedDeal.plotAreaSqFt * (selectedDeal.groundCoveragePercent / 100)).toLocaleString()} sq.ft
              </span>
              , leaving the remaining{" "}
              <span className="text-slate-400 font-mono">
                {Math.round(selectedDeal.plotAreaSqFt * (1 - selectedDeal.groundCoveragePercent / 100)).toLocaleString()} sq.ft
              </span>{" "}
              for mandatory fire driveways, setbacks, guest parking, and landscaped greens.
            </div>
          </div>
        )}

        {/* Step 3 */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-amber-400">
              <DollarSign className="w-6 h-6" />
              <h2 className="text-xl font-display font-bold text-white">
                Question 3: What will it cost?
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Amateurs only count civil construction. Professional developers model the complete cost stack: Land, Stamp Duty, Sanctions & Approvals, Civil Structure, MEP, Contingency, Marketing, and Interest During Construction (IDC).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Land & Registration</span>
                <div className="text-base font-bold font-mono text-white mt-1">
                  ₹{(financials.actualLandCost + financials.stampDutyCost).toFixed(2)} Cr
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Approvals & Liaisoning</span>
                <div className="text-base font-bold font-mono text-white mt-1">
                  ₹{financials.approvalCost.toFixed(2)} Cr
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Civil + MEP Construction</span>
                <div className="text-base font-bold font-mono text-white mt-1">
                  ₹{(financials.hardConstructionCost + financials.mepCost).toFixed(2)} Cr
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Finance, Mktg & Buffer</span>
                <div className="text-base font-bold font-mono text-white mt-1">
                  ₹{(financials.contingencyCost + financials.marketingCost + financials.financeCostEst).toFixed(2)} Cr
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Development Cost (TDC)</span>
                <div className="text-2xl font-bold font-mono text-amber-400">₹{financials.totalProjectCost} Crores</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">All-In Cost per Saleable Sq.Ft</span>
                <div className="text-lg font-bold font-mono text-white">₹{financials.costPerSqFtSaleable.toLocaleString()} / sq.ft</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-amber-400">
              <TrendingUp className="w-6 h-6" />
              <h2 className="text-xl font-display font-bold text-white">
                Question 4: Who will fund it?
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              You do not fund real estate development with 100% of your own cash. You assemble the <strong className="text-white">Capital Stack</strong>: Developer Equity, Landowner Contribution (via JDA), Bank/NBFC Construction Finance, and Milestone-based Customer Pre-Sales.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Developer Equity (35%)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">First Loss</span>
                </div>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-2">
                  ₹{financials.equityAmount.toFixed(2)} Cr
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Seed capital for token advance, approvals, and early site mobilization.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Senior Debt / CF (65%)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">11.0% p.a.</span>
                </div>
                <div className="text-lg font-bold font-mono text-blue-400 mt-2">
                  ₹{financials.debtAmount.toFixed(2)} Cr
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Drawn down gradually on certified construction milestone certificates.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Customer Pre-Sales</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">RERA 70:30</span>
                </div>
                <div className="text-lg font-bold font-mono text-amber-300 mt-2">
                  Zero Interest
                </div>
                <p className="text-[11px] text-slate-400 mt-1">70% deposited in escrow to pay off construction debt and fund remaining slabs.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 5 */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-amber-400">
              <Users className="w-6 h-6" />
              <h2 className="text-xl font-display font-bold text-white">
                Question 5: Who will buy it?
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              A project that doesn't sell is a frozen balance sheet. You must define target customer psychology, product unit configuration (e.g. 2BHK vs 3BHK vs Commercial Floor), and pricing curve escalation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Anticipated Base Sale Price</span>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                  ₹{selectedDeal.expectedSalePricePerSqFt.toLocaleString()} / sq.ft
                </div>
                <span className="text-[11px] text-slate-500">Benchmark in local micro-market</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Breakeven Sale Price</span>
                <div className="text-lg font-bold font-mono text-amber-300 mt-1">
                  ₹{financials.breakevenSalePricePerSqFt.toLocaleString()} / sq.ft
                </div>
                <span className="text-[11px] text-slate-500">Safety margin: ₹{(selectedDeal.expectedSalePricePerSqFt - financials.breakevenSalePricePerSqFt).toLocaleString()}/sq.ft</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Breakeven Absorption %</span>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {financials.breakevenSalePercent}% of Inventory
                </div>
                <span className="text-[11px] text-slate-500">Once reached, rest is 100% profit</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6 */}
        {activeStep === 6 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-amber-400">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-xl font-display font-bold text-white">
                Question 6: Where is my profit?
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              You do not simply look at ₹{financials.expectedGrossRevenue} Cr sales minus ₹{financials.totalProjectCost} Cr cost. You evaluate Developer Margin %, Equity Multiple (MOIC), and Annualized IRR across the {selectedDeal.projectDurationMonths}-month project lifecycle.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Gross Sales Value (GDV)</span>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  ₹{financials.expectedGrossRevenue} Cr
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Net Developer Profit</span>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                  ₹{financials.netDeveloperProfit} Cr
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Developer Margin</span>
                <div className="text-lg font-bold font-mono text-amber-300 mt-1">
                  {financials.developerMarginPercent}%
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Annualized Equity IRR</span>
                <div className="text-lg font-bold font-mono text-emerald-300 mt-1">
                  {financials.annualizedIrrPercent}%
                </div>
              </div>
            </div>

            {/* Mission Completion Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border border-amber-400/40 mt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-400" />
                    <h3 className="font-display font-bold text-white text-base">
                      First Mission Ready for Submission
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    You have successfully answered all 6 developer questions for{" "}
                    <span className="text-amber-300 font-semibold">{selectedDeal.name}</span>.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onOpenModelerWithDeal(selectedDeal)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                  >
                    <span>Full Pro-Forma</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleFinishMission}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 transition-all"
                  >
                    <span>Unlock Developer Badge</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {missionUnlocked && (
                <div className="mt-4 pt-4 border-t border-amber-400/20 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Badge Unlocked: Certified Deal Analyst (Level 1 Track Open)</span>
                  </div>
                  <button
                    onClick={onAdvanceToCurriculum}
                    className="text-xs text-amber-300 hover:text-amber-200 font-medium underline flex items-center space-x-1"
                  >
                    <span>Explore Full Curriculum</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/60">
          <button
            disabled={activeStep === 1}
            onClick={() => handleStepClick(activeStep - 1)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none text-xs font-medium"
          >
            ← Previous Question
          </button>

          <span className="text-xs text-slate-400 font-mono">
            Question {activeStep} of 6
          </span>

          <button
            disabled={activeStep === 6}
            onClick={() => handleStepClick(activeStep + 1)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:opacity-40 disabled:pointer-events-none text-xs flex items-center space-x-1.5"
          >
            <span>Next Question</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
