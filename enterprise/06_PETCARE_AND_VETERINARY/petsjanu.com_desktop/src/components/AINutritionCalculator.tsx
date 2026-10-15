import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Utensils, 
  Droplet, 
  AlertTriangle, 
  Flame, 
  Scale, 
  Heart, 
  CheckCircle2, 
  ChevronRight, 
  BookmarkCheck,
  Calendar,
  Stethoscope
} from 'lucide-react';
import { 
  Species, 
  ActivityLevel, 
  DietType, 
  NutritionProfile, 
  calculatePetNutrition, 
  POPULAR_INDIAN_BREEDS,
  TOXIC_INDIAN_FOODS 
} from '../lib/nutritionCalculator';
import { audioService } from '../lib/audioService';

interface AINutritionCalculatorProps {
  initialPetName?: string;
  initialSpecies?: Species;
  initialBreed?: string;
  initialWeight?: number;
  onNavigateTab?: (tab: string) => void;
  setToast?: (msg: string) => void;
}

export const AINutritionCalculator: React.FC<AINutritionCalculatorProps> = ({
  initialPetName = 'Bruno',
  initialSpecies = 'Dog',
  initialBreed = 'Indian Pariah / Desi Dog',
  initialWeight = 18,
  onNavigateTab,
  setToast
}) => {
  const [species, setSpecies] = useState<Species>(initialSpecies);
  const [breed, setBreed] = useState<string>(initialBreed);
  const [ageYears, setAgeYears] = useState<number>(3);
  const [weightKg, setWeightKg] = useState<number>(initialWeight);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('Moderate');
  const [isNeutered, setIsNeutered] = useState<boolean>(true);
  const [dietType, setDietType] = useState<DietType>('hybrid');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const profile: NutritionProfile = useMemo(() => ({
    species,
    breed,
    ageYears,
    weightKg,
    lifeStage: ageYears < 1 ? 'Puppy / Kitten' : ageYears >= 8 ? 'Senior' : 'Adult',
    activityLevel,
    isNeutered,
    dietType
  }), [species, breed, ageYears, weightKg, activityLevel, isNeutered, dietType]);

  const results = useMemo(() => calculatePetNutrition(profile), [profile]);

  const handleSpeciesChange = (newSpecies: Species) => {
    audioService.playSuccess();
    setSpecies(newSpecies);
    setBreed(POPULAR_INDIAN_BREEDS[newSpecies][0].name);
  };

  const handleSavePlan = () => {
    audioService.playSuccess();
    setIsSaved(true);
    setToast?.(`🥗 Nutrition & Calorie Plan saved to ${initialPetName}'s medical vault!`);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full card-premium p-6 sm:p-10 border border-stone-200 shadow-xl space-y-8 bg-gradient-to-b from-stone-50/50 to-white">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-[#175741] text-xs font-mono font-bold rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#175741]" /> AI VETERINARY NUTRITION LAB
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-black text-stone-900 tracking-tight">
            Scientific Calorie &amp; <span className="text-[#175741]">Diet Planner</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
            Veterinary Kleiber RER/MER equations customized for Indian breeds, home-cooked food, and climate.
          </p>
        </div>

        <button
          onClick={handleSavePlan}
          className="px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm text-white cursor-pointer shadow-md hover:opacity-95 transition-all flex items-center gap-2 shrink-0"
          style={{ background: isSaved ? '#10B981' : '#175741' }}
        >
          <BookmarkCheck className="w-4 h-4 text-amber-400" />
          {isSaved ? 'Plan Saved! ✓' : 'Save to Health Vault'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Input Configuration Form */}
        <div className="lg:col-span-5 space-y-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
          <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#175741]" /> {initialPetName}'s Biometric Profile
          </h3>

          {/* Species Selector */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Species</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Dog', 'Cat'] as Species[]).map((sp) => (
                <button
                  key={sp}
                  onClick={() => handleSpeciesChange(sp)}
                  className={`py-2.5 px-3 rounded-2xl font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${
                    species === sp
                      ? 'bg-[#175741] text-white shadow-xs ring-2 ring-emerald-500/40'
                      : 'border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{sp === 'Dog' ? '🐶' : '🐱'}</span>
                  <span>{sp}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Breed Picker */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Breed</label>
            <select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-300 text-xs font-bold text-stone-800 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              {POPULAR_INDIAN_BREEDS[species].map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name} (Ideal: {b.minWeight}-{b.maxWeight} kg)
                </option>
              ))}
            </select>
          </div>

          {/* Weight & Age Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Current Weight: <span className="text-[#175741] font-black">{weightKg} kg</span>
              </label>
              <input
                type="range"
                min={1}
                max={60}
                step={0.5}
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                className="w-full accent-[#175741] cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Age: <span className="text-[#175741] font-black">{ageYears} yrs</span>
              </label>
              <input
                type="range"
                min={0.2}
                max={18}
                step={0.5}
                value={ageYears}
                onChange={(e) => setAgeYears(parseFloat(e.target.value))}
                className="w-full accent-[#175741] cursor-pointer"
              />
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Lifestyle Activity</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Sedentary / Low', 'Moderate', 'High / Working', 'Weight Loss'] as ActivityLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setActivityLevel(lvl)}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all text-center ${
                    activityLevel === lvl
                      ? 'bg-amber-100 text-amber-950 border border-amber-300 ring-2 ring-amber-400/30'
                      : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Diet Format Selector */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Diet Style</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'home_cooked', label: 'Home Food', icon: '🍲' },
                { id: 'kibble', label: 'Dry Kibble', icon: '🥣' },
                { id: 'hybrid', label: '50/50 Mix', icon: '⚡' },
              ].map((dt) => (
                <button
                  key={dt.id}
                  onClick={() => setDietType(dt.id as DietType)}
                  className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex flex-col items-center ${
                    dietType === dt.id
                      ? 'bg-[#175741] text-white shadow-xs'
                      : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>{dt.icon}</span>
                  <span className="text-[10px] mt-0.5">{dt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Neuter Checkbox */}
          <label className="flex items-center gap-2 pt-1 text-xs text-stone-700 font-bold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isNeutered}
              onChange={(e) => setIsNeutered(e.target.checked)}
              className="rounded text-[#175741] focus:ring-emerald-500 cursor-pointer w-4 h-4"
            />
            <span>Spayed / Neutered</span>
          </label>
        </div>

        {/* RIGHT COLUMN: Results Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          {/* Calorie Target Banner */}
          <div
            className="p-6 rounded-3xl text-white shadow-lg space-y-3"
            style={{ background: 'linear-gradient(135deg, #071410, #175741)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                DAILY ENERGY REQUIREMENT (MER)
              </span>
              <span className="text-xs font-mono text-emerald-300">
                RER: {results.rer} kcal
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-white">{results.dailyCalories}</span>
              <span className="text-lg font-bold text-amber-300">kcal / day</span>
            </div>

            <p className="text-xs text-emerald-100 font-medium leading-relaxed">
              Ideal weight for {breed}: <strong>{results.idealWeightRange.min} – {results.idealWeightRange.max} kg</strong>.
              {weightKg > results.idealWeightRange.max && (
                <span className="text-amber-300 block mt-1">
                  ⚠️ Currently above ideal range. Calorie target tuned for gentle, safe weight stabilization.
                </span>
              )}
            </p>
          </div>

          {/* Daily Schedule & Meal Portions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
              <div className="text-[10px] font-bold uppercase text-amber-900 flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5" /> Morning Meal
              </div>
              <div className="text-2xl font-black text-amber-950">{results.mealSchedule.breakfastGrams}g</div>
              <p className="text-[10px] text-amber-800">Serve around 8:00 AM</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="text-[10px] font-bold uppercase text-emerald-900 flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5" /> Evening Meal
              </div>
              <div className="text-2xl font-black text-emerald-950">{results.mealSchedule.dinnerGrams}g</div>
              <p className="text-[10px] text-emerald-800">Serve around 7:30 PM</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
              <div className="text-[10px] font-bold uppercase text-blue-900 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-blue-600" /> Hydration Goal
              </div>
              <div className="text-2xl font-black text-blue-950">{results.mealSchedule.waterMl} ml</div>
              <p className="text-[10px] text-blue-800">Fresh water daily</p>
            </div>
          </div>

          {/* Macro Nutrient Breakdown */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <h4 className="font-serif font-bold text-sm text-stone-900">Estimated Daily Macronutrient Grams</h4>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-stone-400 text-[10px] font-bold uppercase">Protein</div>
                <div className="text-sm font-black text-stone-900 mt-0.5">{results.mealSchedule.breakdown.proteinGrams}g</div>
              </div>
              <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-stone-400 text-[10px] font-bold uppercase">Carbs</div>
                <div className="text-sm font-black text-stone-900 mt-0.5">{results.mealSchedule.breakdown.carbsGrams}g</div>
              </div>
              <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-stone-400 text-[10px] font-bold uppercase">Fiber</div>
                <div className="text-sm font-black text-stone-900 mt-0.5">{results.mealSchedule.breakdown.fiberGrams}g</div>
              </div>
              <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-stone-400 text-[10px] font-bold uppercase">Healthy Fats</div>
                <div className="text-sm font-black text-stone-900 mt-0.5">{results.mealSchedule.breakdown.fatsGrams}g</div>
              </div>
            </div>
          </div>

          {/* Diet Recommendations */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <h4 className="font-serif font-bold text-xs text-stone-900 uppercase tracking-wider">
              Vet Recommendations for {profile.dietType === 'home_cooked' ? 'Home Food' : profile.dietType === 'kibble' ? 'Commercial Kibble' : 'Mixed Diet'}
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-600">
              {results.dietRecommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Toxic Indian Foods Warning Accordion Box */}
          <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-2">
            <div className="flex items-center gap-2 text-red-900 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>CRITICAL: Common Indian Foods That Are Toxic to Dogs &amp; Cats</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              {results.toxicFoods.slice(0, 4).map((tf) => (
                <div key={tf.name} className="p-2 rounded-xl bg-white border border-red-100 space-y-0.5">
                  <div className="font-bold text-stone-900 flex items-center justify-between">
                    <span>{tf.name}</span>
                    <span className="text-[9px] font-black text-red-700 bg-red-100 px-1.5 py-0.5 rounded">{tf.danger}</span>
                  </div>
                  <p className="text-stone-500 leading-snug">{tf.why}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
