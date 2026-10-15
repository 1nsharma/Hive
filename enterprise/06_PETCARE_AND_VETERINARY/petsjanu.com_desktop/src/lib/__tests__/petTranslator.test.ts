import { describe, it, expect, vi } from 'vitest';
import {
  generateLocalPetTranslation,
  getPitchFactorForPet,
  triggerPetAcousticSound,
  REVERSE_PET_BEHAVIORS,
  PetTranslatorProfile
} from '../petTranslator';
import { audioService } from '../audioService';
import { SAMPLE_REGISTRY } from '../petSoundLibrary';

describe('AI Pet Translator & Training Engine', () => {
  const dogProfile: PetTranslatorProfile = {
    name: 'Bruno',
    species: 'Dog',
    breed: 'Indian Pariah / Desi Dog',
    weight: 18,
    temperament: 'High Energy'
  };

  const catProfile: PetTranslatorProfile = {
    name: 'Milo',
    species: 'Cat',
    breed: 'Persian Cat',
    weight: 4.5,
    temperament: 'Calm & Gentle'
  };

  describe('Pitch Factor Calculations', () => {
    it('calculates higher pitch factor for small toy breeds', () => {
      const toyDog: PetTranslatorProfile = { name: 'Chico', species: 'Dog', breed: 'Chihuahua', weight: 3 };
      expect(getPitchFactorForPet(toyDog)).toBeGreaterThan(1.4);
    });

    it('calculates deeper pitch factor for large/giant breeds', () => {
      const giantDog: PetTranslatorProfile = { name: 'Titan', species: 'Dog', breed: 'Great Dane', weight: 55 };
      expect(getPitchFactorForPet(giantDog)).toBeLessThan(0.8);
    });

    it('returns default 1.0 for non-dog species', () => {
      expect(getPitchFactorForPet(catProfile)).toBe(1.0);
    });
  });

  describe('Local Heuristic Pet Translation', () => {
    it('translates recall commands to ultrasonic whistle and welcoming posture', () => {
      const result = generateLocalPetTranslation('Come here Bruno right now!', dogProfile);
      expect(result.intent).toBe('recall');
      expect(result.petVocalization).toBe('ultrasonic_whistle');
      expect(result.humanBodyLanguage.posture).toContain('Squat');
      expect(result.trainingCue.commandWord).toContain('COME');
      expect(result.petThoughtSimulation.internalMonologue).toContain('Human wants me');
    });

    it('translates sit/stay commands with clicker marker and flat palm posture', () => {
      const result = generateLocalPetTranslation('Sit down and stay there', dogProfile);
      expect(result.intent).toBe('sit_stay');
      expect(result.petVocalization).toBe('training_clicker');
      expect(result.humanBodyLanguage.hands).toContain('palm');
      expect(result.trainingCue.clickerMarker).toBe(true);
    });

    it('translates food and dinner calls to feeding cues', () => {
      const result = generateLocalPetTranslation('Dinner time! Come get your food', dogProfile);
      expect(result.intent).toBe('food_meal');
      expect(result.petThoughtSimulation.emotion).toContain('Salivation');
    });

    it('translates Hindi and Hinglish recall commands like paas aao and come on', () => {
      const hinglishResult = generateLocalPetTranslation('Bruno paas aao jaldi', dogProfile);
      expect(hinglishResult.intent).toBe('recall');

      const comeOnResult = generateLocalPetTranslation('Come on Bruno, come on', dogProfile);
      expect(comeOnResult.intent).toBe('recall');

      const hindiDevanagariResult = generateLocalPetTranslation('पास आओ ब्रूनो', dogProfile);
      expect(hindiDevanagariResult.intent).toBe('recall');
    });

    it('translates Hindi commands for sit (बैठ जाओ) and praise (शाबाश)', () => {
      const sitResult = generateLocalPetTranslation('बैठ जाओ ब्रूनो', dogProfile);
      expect(sitResult.intent).toBe('sit_stay');

      const praiseResult = generateLocalPetTranslation('शाबाश मेरे शेर', dogProfile);
      expect(praiseResult.intent).toBe('praise');
    });

    it('translates feline affection to purr vocalization', () => {
      const result = generateLocalPetTranslation('I love you so much my sweet kitten', catProfile);
      expect(result.intent).toBe('affection');
      expect(result.petVocalization).toBe('cat_purr');
      expect(result.vocalizationLabel).toContain('Purr');
    });

    it('translates bird speech into melodic chirp', () => {
      const birdProfile: PetTranslatorProfile = { name: 'Kiwi', species: 'Bird', breed: 'Budgie' };
      const result = generateLocalPetTranslation('Hello pretty bird!', birdProfile);
      expect(result.petVocalization).toBe('bird_chirp');
    });
  });

  describe('Sound Trigger Integration', () => {
    it('invokes audioService methods safely without throwing', () => {
      // Force fallback by temporarily clearing the registry
      const backupRegistry = { ...SAMPLE_REGISTRY };
      for (const key in SAMPLE_REGISTRY) delete SAMPLE_REGISTRY[key];

      const spyBark = vi.spyOn(audioService, 'playCanineBark').mockImplementation(() => {});
      const spyClicker = vi.spyOn(audioService, 'playTrainingClicker').mockImplementation(() => {});
      const spyPurr = vi.spyOn(audioService, 'playCatPurr').mockImplementation(() => {});

      triggerPetAcousticSound('bark_calm', dogProfile);
      expect(spyBark).toHaveBeenCalled();

      triggerPetAcousticSound('training_clicker', dogProfile);
      expect(spyClicker).toHaveBeenCalled();

      triggerPetAcousticSound('cat_purr', catProfile);
      expect(spyPurr).toHaveBeenCalled();

      spyBark.mockRestore();
      spyClicker.mockRestore();
      spyPurr.mockRestore();

      // Restore registry
      Object.assign(SAMPLE_REGISTRY, backupRegistry);
    });
  });

  describe('Reverse Pet Decoder Behavior Corpus', () => {
    it('contains valid behavioral definitions with actionable recommendations', () => {
      expect(REVERSE_PET_BEHAVIORS.length).toBeGreaterThanOrEqual(5);
      REVERSE_PET_BEHAVIORS.forEach((b) => {
        expect(b.petSoundType).toBeTruthy();
        expect(b.humanInterpretation).toBeTruthy();
        expect(b.recommendedAction).toBeTruthy();
        expect(['LOW', 'NEEDS_ATTENTION', 'URGENT']).toContain(b.urgencyLevel);
      });
    });
  });
});
