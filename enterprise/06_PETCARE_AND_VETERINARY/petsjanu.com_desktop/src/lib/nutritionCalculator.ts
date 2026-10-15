/**
 * PetJanu AI Nutrition & Calorie Intelligence Engine
 * Scientific RER/MER veterinary energy equations with Indian breed & diet adaptations.
 */

export type Species = 'Dog' | 'Cat';
export type LifeStage = 'Puppy / Kitten' | 'Adult' | 'Senior';
export type ActivityLevel = 'Sedentary / Low' | 'Moderate' | 'High / Working' | 'Weight Loss';
export type DietType = 'home_cooked' | 'kibble' | 'hybrid';

export interface NutritionProfile {
  species: Species;
  breed: string;
  ageYears: number;
  weightKg: number;
  targetWeightKg?: number;
  lifeStage: LifeStage;
  activityLevel: ActivityLevel;
  isNeutered: boolean;
  dietType: DietType;
}

export interface MealSchedule {
  breakfastGrams: number;
  dinnerGrams: number;
  waterMl: number;
  breakdown: {
    proteinGrams: number;
    carbsGrams: number;
    fiberGrams: number;
    fatsGrams: number;
  };
}

export interface NutritionResult {
  rer: number; // Resting Energy Requirement (kcal/day)
  mer: number; // Maintenance Energy Requirement (kcal/day)
  dailyCalories: number;
  mealSchedule: MealSchedule;
  dietRecommendations: string[];
  toxicFoods: Array<{ name: string; danger: string; why: string }>;
  idealWeightRange: { min: number; max: number };
}

// Common Indian Dog & Cat Breeds with weight norms
export const POPULAR_INDIAN_BREEDS: Record<Species, Array<{ name: string; minWeight: number; maxWeight: number }>> = {
  Dog: [
    { name: 'Indian Pariah / Desi Dog', minWeight: 14, maxWeight: 22 },
    { name: 'Golden Retriever', minWeight: 25, maxWeight: 34 },
    { name: 'Labrador Retriever', minWeight: 25, maxWeight: 36 },
    { name: 'Beagle', minWeight: 9, maxWeight: 14 },
    { name: 'German Shepherd', minWeight: 28, maxWeight: 40 },
    { name: 'Shih Tzu', minWeight: 4.5, maxWeight: 8 },
    { name: 'Pug', minWeight: 6, maxWeight: 9 },
    { name: 'Indie Hound / Mudhol / Caravan', minWeight: 20, maxWeight: 28 },
    { name: 'Rottweiler', minWeight: 35, maxWeight: 50 },
    { name: 'Pomeranian / Indian Spitz', minWeight: 3, maxWeight: 7 }
  ],
  Cat: [
    { name: 'Indian Billi / Desi Shorthair', minWeight: 3.5, maxWeight: 5 },
    { name: 'Persian Cat', minWeight: 3.2, maxWeight: 5.5 },
    { name: 'Siamese Cat', minWeight: 3, maxWeight: 4.5 },
    { name: 'Maine Coon', minWeight: 5, maxWeight: 9 }
  ]
};

// Toxic Indian food items for pets
export const TOXIC_INDIAN_FOODS = [
  { name: 'Onions & Garlic (Pyaaz / Lehsun)', danger: 'CRITICAL', why: 'Causes hemolytic anemia (destroys red blood cells in dogs & cats).' },
  { name: 'Chai / Coffee (Caffeine)', danger: 'HIGH', why: 'Causes severe tachycardia, tremors, and cardiac distress.' },
  { name: 'Grapes & Raisins (Kishmish)', danger: 'CRITICAL', why: 'Can cause sudden and fatal acute kidney failure.' },
  { name: 'Cooked Chicken/Mutton Bones', danger: 'HIGH', why: 'Splinter into razor-sharp shards that puncture stomach and intestines.' },
  { name: 'Chocolate & Cocoa', danger: 'CRITICAL', why: 'Theobromine is toxic to dog heart and central nervous system.' },
  { name: 'Xylitol (Sugar-free sweets)', danger: 'EXTREME', why: 'Triggers massive insulin release leading to acute hypoglycemia and liver failure.' }
];

/**
 * Calculates RER using the Kleiber veterinary equation: RER = 70 * (weight in kg)^0.75
 */
export function calculateRER(weightKg: number): number {
  if (weightKg <= 0) return 0;
  return Math.round(70 * Math.pow(weightKg, 0.75));
}

/**
 * Calculates MER multiplier based on species, life stage, neuter status, and activity
 */
export function getMERMultiplier(profile: NutritionProfile): number {
  if (profile.species === 'Dog') {
    if (profile.activityLevel === 'Weight Loss') return 1.0;
    if (profile.lifeStage === 'Puppy / Kitten') return profile.ageYears < 0.5 ? 3.0 : 2.0;
    if (profile.activityLevel === 'High / Working') return 2.0;
    if (profile.activityLevel === 'Moderate') return profile.isNeutered ? 1.6 : 1.8;
    return profile.isNeutered ? 1.4 : 1.6; // Sedentary
  } else {
    // Cat
    if (profile.activityLevel === 'Weight Loss') return 0.8;
    if (profile.lifeStage === 'Puppy / Kitten') return 2.5;
    if (profile.isNeutered) return 1.2;
    return 1.4;
  }
}

/**
 * Generates complete nutrition breakdown
 */
export function calculatePetNutrition(profile: NutritionProfile): NutritionResult {
  const rer = calculateRER(profile.weightKg);
  const multiplier = getMERMultiplier(profile);
  const dailyCalories = Math.round(rer * multiplier);

  // Daily water target: roughly 50-60ml per kg body weight
  const waterMl = Math.round(profile.weightKg * 55);

  // Portion distribution based on diet type
  let totalDailyGrams: number;
  let breakdown: MealSchedule['breakdown'];
  let dietRecommendations: string[] = [];

  if (profile.dietType === 'home_cooked') {
    // Home-cooked Indian diet: ~1.2 kcal/gram average (cooked rice + boiled chicken/egg/curd + veggies)
    totalDailyGrams = Math.round(dailyCalories / 1.25);
    breakdown = {
      proteinGrams: Math.round(totalDailyGrams * 0.40), // 40% boiled chicken/egg/paneer
      carbsGrams: Math.round(totalDailyGrams * 0.35),   // 35% white/brown rice or oats
      fiberGrams: Math.round(totalDailyGrams * 0.15),   // 15% pumpkin/carrot/beans
      fatsGrams: Math.round(totalDailyGrams * 0.10)     // 10% fish oil or coconut oil
    };
    dietRecommendations = [
      'Boiled chicken breast, boneless fish, or paneer/egg whites for lean protein.',
      'Soft steamed white rice, pumpkin mash, and grated carrots for healthy digestion.',
      'Add 1 teaspoon of virgin coconut oil or vet-approved fish oil for shiny coat.',
      'Always add a vet-prescribed calcium & multivitamin supplement to home-cooked food.'
    ];
  } else if (profile.dietType === 'kibble') {
    // Standard dry kibble: ~3.6 kcal/gram average
    totalDailyGrams = Math.round(dailyCalories / 3.6);
    breakdown = {
      proteinGrams: Math.round(totalDailyGrams * 0.32),
      carbsGrams: Math.round(totalDailyGrams * 0.45),
      fiberGrams: Math.round(totalDailyGrams * 0.08),
      fatsGrams: Math.round(totalDailyGrams * 0.15)
    };
    dietRecommendations = [
      'Choose complete & balanced premium dry kibble with real meat as #1 ingredient.',
      'Measure portions with a digital kitchen scale rather than cups to avoid accidental obesity.',
      'Soak dry kibble in lukewarm water or bone broth to increase hydration.',
      'Keep fresh, clean water bowls in at least 2 distinct spots in your house.'
    ];
  } else {
    // 50:50 Hybrid
    totalDailyGrams = Math.round(dailyCalories / 2.4);
    breakdown = {
      proteinGrams: Math.round(totalDailyGrams * 0.36),
      carbsGrams: Math.round(totalDailyGrams * 0.40),
      fiberGrams: Math.round(totalDailyGrams * 0.12),
      fatsGrams: Math.round(totalDailyGrams * 0.12)
    };
    dietRecommendations = [
      'Serve high-quality dry kibble for breakfast and home-cooked fresh protein for dinner.',
      'Maintain at least 8 hours between kibble and home meals for optimal enzymatic digestion.',
      'Include fresh plain curd (dahi) at room temperature for natural gut probiotics.'
    ];
  }

  const breakfastGrams = Math.round(totalDailyGrams * 0.5);
  const dinnerGrams = totalDailyGrams - breakfastGrams;

  // Breed ideal weight search
  const breedList = POPULAR_INDIAN_BREEDS[profile.species];
  const matchedBreed = breedList.find(b => b.name.toLowerCase().includes(profile.breed.toLowerCase()));
  const idealWeightRange = matchedBreed
    ? { min: matchedBreed.minWeight, max: matchedBreed.maxWeight }
    : { min: Math.max(2, Math.round(profile.weightKg * 0.9)), max: Math.round(profile.weightKg * 1.1) };

  return {
    rer,
    mer: multiplier,
    dailyCalories,
    mealSchedule: {
      breakfastGrams,
      dinnerGrams,
      waterMl,
      breakdown
    },
    dietRecommendations,
    toxicFoods: TOXIC_INDIAN_FOODS,
    idealWeightRange
  };
}
