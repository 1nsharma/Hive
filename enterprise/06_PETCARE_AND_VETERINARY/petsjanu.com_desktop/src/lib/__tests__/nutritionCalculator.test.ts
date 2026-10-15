import { describe, it, expect } from 'vitest';
import { 
  calculateRER, 
  getMERMultiplier, 
  calculatePetNutrition, 
  NutritionProfile 
} from '../nutritionCalculator';

describe('AI Nutrition & Calorie Intelligence Calculator', () => {
  it('calculates Kleiber Resting Energy Requirement (RER) correctly', () => {
    // 10 kg dog: 70 * (10)^0.75 ≈ 70 * 5.6234 ≈ 394 kcal
    const rer10 = calculateRER(10);
    expect(rer10).toBeGreaterThanOrEqual(390);
    expect(rer10).toBeLessThanOrEqual(400);

    // 20 kg dog: 70 * (20)^0.75 ≈ 70 * 9.4574 ≈ 662 kcal
    const rer20 = calculateRER(20);
    expect(rer20).toBeGreaterThanOrEqual(650);
    expect(rer20).toBeLessThanOrEqual(675);

    // 0 or negative weight edge case
    expect(calculateRER(0)).toBe(0);
    expect(calculateRER(-5)).toBe(0);
  });

  it('adjusts MER multipliers for life stages, neuter status, and activity', () => {
    const adultNeuteredDog: NutritionProfile = {
      species: 'Dog',
      breed: 'Indian Pariah / Desi Dog',
      ageYears: 3,
      weightKg: 18,
      lifeStage: 'Adult',
      activityLevel: 'Moderate',
      isNeutered: true,
      dietType: 'hybrid'
    };
    expect(getMERMultiplier(adultNeuteredDog)).toBe(1.6);

    const activeIntactDog: NutritionProfile = {
      ...adultNeuteredDog,
      isNeutered: false,
      activityLevel: 'High / Working'
    };
    expect(getMERMultiplier(activeIntactDog)).toBe(2.0);

    const weightLossDog: NutritionProfile = {
      ...adultNeuteredDog,
      activityLevel: 'Weight Loss'
    };
    expect(getMERMultiplier(weightLossDog)).toBe(1.0);
  });

  it('generates full nutrition plan with daily calories, water, and meal portions', () => {
    const profile: NutritionProfile = {
      species: 'Dog',
      breed: 'Golden Retriever',
      ageYears: 2,
      weightKg: 28,
      lifeStage: 'Adult',
      activityLevel: 'Moderate',
      isNeutered: true,
      dietType: 'home_cooked'
    };

    const result = calculatePetNutrition(profile);

    expect(result.dailyCalories).toBeGreaterThan(1000);
    expect(result.mealSchedule.breakfastGrams).toBeGreaterThan(0);
    expect(result.mealSchedule.dinnerGrams).toBeGreaterThan(0);
    expect(result.mealSchedule.waterMl).toBeGreaterThan(1200); // ~55ml/kg
    expect(result.dietRecommendations.length).toBeGreaterThan(0);
    expect(result.toxicFoods.length).toBeGreaterThan(0);
  });

  it('contains critical toxic food warnings like onions, grapes, and chocolate', () => {
    const profile: NutritionProfile = {
      species: 'Cat',
      breed: 'Persian Cat',
      ageYears: 2,
      weightKg: 4,
      lifeStage: 'Adult',
      activityLevel: 'Moderate',
      isNeutered: true,
      dietType: 'kibble'
    };

    const result = calculatePetNutrition(profile);
    const toxicNames = result.toxicFoods.map(t => t.name.toLowerCase());
    expect(toxicNames.some(n => n.includes('onion'))).toBe(true);
    expect(toxicNames.some(n => n.includes('chocolate'))).toBe(true);
    expect(toxicNames.some(n => n.includes('grapes'))).toBe(true);
  });
});
