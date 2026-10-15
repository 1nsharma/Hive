import React, { useState, useEffect } from 'react';
import { X, Sparkles, QrCode, MapPin, Activity, FileText, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { guidedTour, ONBOARDING_TOUR_STEPS, TourStep } from '../lib/guidedTour';
import { audioService } from '../lib/audioService';

export const GuidedTourModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const unsub = guidedTour.subscribe((open, idx) => {
      setIsOpen(open);
      setStepIndex(idx);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const currentStep: TourStep = ONBOARDING_TOUR_STEPS[stepIndex] || ONBOARDING_TOUR_STEPS[0];
  const isLastStep = stepIndex === ONBOARDING_TOUR_STEPS.length - 1;

  const getStepIcon = (name?: string) => {
    switch (name) {
      case 'QrCode': return <QrCode className="w-6 h-6 text-amber-500" />;
      case 'MapPin': return <MapPin className="w-6 h-6 text-rose-500" />;
      case 'Activity': return <Activity className="w-6 h-6 text-emerald-500" />;
      case 'FileText': return <FileText className="w-6 h-6 text-blue-500" />;
      default: return <Sparkles className="w-6 h-6 text-amber-500" />;
    }
  };

  const handleNext = () => {
    audioService.playSuccess();
    guidedTour.nextStep();
  };

  const handlePrev = () => {
    guidedTour.prevStep();
  };

  const handleClose = () => {
    guidedTour.closeTour();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-700 rounded-xl cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
            {currentStep.badge}
          </span>
          <span className="text-xs font-bold text-stone-400">
            Step {stepIndex + 1} of {ONBOARDING_TOUR_STEPS.length}
          </span>
        </div>

        {/* Icon & Title */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="p-3 bg-stone-100 rounded-2xl shrink-0">
            {getStepIcon(currentStep.iconName)}
          </div>
          <div>
            <h3 className="text-lg font-black text-stone-900 tracking-tight leading-snug">
              {currentStep.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
          {currentStep.description}
        </p>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5 mb-6">
          {ONBOARDING_TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === stepIndex ? 'w-6 bg-[#175741]' : 'w-1.5 bg-stone-200'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={stepIndex === 0}
            className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors ${
              stepIndex === 0 ? 'text-stone-300 cursor-not-allowed' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-[#175741] hover:bg-[#134634] text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
          >
            {isLastStep ? (
              <>
                <span>Get Started</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Next Feature</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
