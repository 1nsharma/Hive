/**
 * PetJanu AI Pet Translator & Training Engine
 * Translates human speech/intent into pet acoustics, canine/feline body language, and behavioral training cues.
 */

import { audioService } from './audioService';
import { intentToCommunicationCue, playRealPetSound } from './petSoundLibrary';

export type PetVocalizationType = 
  | 'bark_calm' 
  | 'bark_alert' 
  | 'bark_playful' 
  | 'cat_meow_cheerful' 
  | 'cat_meow_pleading' 
  | 'cat_purr' 
  | 'cat_chirp' 
  | 'bird_chirp' 
  | 'training_clicker' 
  | 'ultrasonic_whistle';

export interface PetTranslatorProfile {
  name: string;
  species: string; // 'Dog' | 'Cat' | 'Bird' | etc.
  breed: string;
  age?: string;
  weight?: number; // kg
  temperament?: 'High Energy' | 'Calm & Gentle' | 'Shy & Sensitive' | 'Protective' | 'Food Motivated';
  trainingLevel?: 'Puppy / Beginner' | 'Intermediate' | 'Master Companion';
}

export interface PetTranslationResponse {
  sourceText: string;
  intent: 'recall' | 'sit_stay' | 'praise' | 'stop_warning' | 'food_meal' | 'play_walk' | 'comfort_calm' | 'affection' | 'general';
  petVocalization: PetVocalizationType;
  vocalizationLabel: string;
  acousticFrequency: string; // e.g. "180Hz - 240Hz deep canine resonance"
  humanBodyLanguage: {
    posture: string;
    hands: string;
    eyeContact: string;
    vocalPitch: string;
  };
  trainingCue: {
    commandWord: string;
    timingAdvice: string;
    treatRewardAdvice: string;
    clickerMarker: boolean;
  };
  petThoughtSimulation: {
    emotion: string; // e.g. "Excited & Attentive", "Relaxed & Safe"
    internalMonologue: string;
    expectedReaction: string;
  };
}

export interface ReverseDecodeResponse {
  petSoundType: string;
  observedBehavior: string;
  humanInterpretation: string;
  recommendedAction: string;
  urgencyLevel: 'LOW' | 'NEEDS_ATTENTION' | 'URGENT';
}

/**
 * Calculates acoustic pitch factor based on pet species, breed, and weight
 * Small dogs (~5kg) vocalize higher (pitchFactor 1.4-1.8); giant dogs (~35kg+) vocalize deeper (pitchFactor 0.7-0.9)
 */
export function getPitchFactorForPet(profile: PetTranslatorProfile): number {
  const isDog = (profile.species || '').toLowerCase().includes('dog');
  const weight = profile.weight || 15;

  if (!isDog) return 1.0;
  if (weight <= 6) return 1.6; // Toy breed (Chihuahua, Pomeranian)
  if (weight <= 12) return 1.3; // Small breed (Beagle, Pug)
  if (weight <= 22) return 1.0; // Medium breed (Indian Pariah, Indie, Cocker Spaniel)
  if (weight <= 35) return 0.85; // Large breed (Labrador, Golden Retriever, GSD)
  return 0.72; // Giant breed (Great Dane, Rottweiler, Mastiff)
}

/**
 * Play real pet vocalization using the Pet Communication Engine v2.
 * Flow: PetVocalizationType -> intentToCommunicationCue -> playRealPetSound (Howler.js) -> synthesis fallback
 * Returns a promise with whether 'real' audio or 'synthesis' fallback was used.
 */
export function triggerPetAcousticSound(
  vocalization: PetVocalizationType, 
  profile: PetTranslatorProfile,
  onEnd?: () => void
): Promise<'real' | 'synthesis'> {
  // Map vocalization type to the equivalent intent for the Communication Policy layer
  const vocalizationToIntent: Record<PetVocalizationType, string> = {
    bark_calm:         'general',
    bark_alert:        'stop_warning',
    bark_playful:      'praise',
    cat_meow_cheerful: 'general',
    cat_meow_pleading: 'recall',
    cat_purr:          'affection',
    cat_chirp:         'general',
    bird_chirp:        'general',
    training_clicker:  'sit_stay',
    ultrasonic_whistle:'recall',
  };

  const mappedIntent = vocalizationToIntent[vocalization] || 'general';
  const cue = intentToCommunicationCue(mappedIntent, profile.species, profile.temperament);
  return playRealPetSound(cue.sampleKey, profile, onEnd);
}

/**
 * High-precision offline rule-based translation fallback
 */
export function generateLocalPetTranslation(
  text: string, 
  profile: PetTranslatorProfile
): PetTranslationResponse {
  const clean = text.toLowerCase().trim();
  const petName = profile.name || 'Your Pet';
  const isCat = (profile.species || '').toLowerCase().includes('cat');
  const isBird = (profile.species || '').toLowerCase().includes('bird');

  // Detect Intent with word boundaries & bilingual Hindi/English/Hinglish support
  let intent: PetTranslationResponse['intent'] = 'general';
  if (/\b(food|eat|eating|khana|khao|kibble|biscuit|treat|treats|dinner|breakfast|hungry|tasty|meal|doodh)\b|खाना|खाओ|बिस्कुट|भूख/i.test(clean)) {
    intent = 'food_meal';
  } else if (/\b(sit|stay|baith|baitho|baith jao|wait|down|heel|thahar)\b|बैठ|बैठो|रुक|रुको/i.test(clean)) {
    intent = 'sit_stay';
  } else if (/\b(come|come on|here|idhar|idhar aao|paas|paas aao|pass aao|aao|suno|recall|back|this way)\b|पास आओ|इधर आओ|पास|आओ|इधर|सुनो/i.test(clean)) {
    intent = 'recall';
  } else if (/\b(no|stop|don't|chhod|chhodna|ruk|ruko|bad|leave|drop|mat|mat karo|chup)\b|नहीं|मत|छोड़ो|रुको|चुप/i.test(clean)) {
    intent = 'stop_warning';
  } else if (/\b(love|love you|miss you|kiss|hug|pyaar|janu|baby|mera baccha)\b|प्यार|जानू|मेरा बच्चा/i.test(clean)) {
    intent = 'affection';
  } else if (/\b(good|good boy|good girl|shabash|cute|clever|proud|best|yes|badhiya|wah)\b|शाबाश|बढ़िया|वाह/i.test(clean)) {
    intent = 'praise';
  } else if (/\b(walk|play|ghoomne|chalo ghoomne|ball|park|run|chalo|toy|khelo)\b|घूमने|चलो|खेल|दौड़ो/i.test(clean)) {
    intent = 'play_walk';
  } else if (/\b(calm|quiet|shh|relax|easy|soja|so jao|sleep|safe|aram)\b|शांत|सो जाओ|आराम/i.test(clean)) {
    intent = 'comfort_calm';
  }

  // Determine Vocalization
  let petVocalization: PetVocalizationType = 'bark_calm';
  let vocalizationLabel = 'Reassuring Canine Resonance';
  let acousticFreq = '190Hz – 250Hz';

  if (isBird) {
    petVocalization = 'bird_chirp';
    vocalizationLabel = 'High-Frequency Melodic Chirp';
    acousticFreq = '2600Hz – 4200Hz';
  } else if (isCat) {
    if (intent === 'praise' || intent === 'affection' || intent === 'comfort_calm') {
      petVocalization = 'cat_purr';
      vocalizationLabel = 'Low 26Hz Feline Purr & Amplitude Tremolo';
      acousticFreq = '24Hz – 60Hz Healing Wave';
    } else if (intent === 'food_meal' || intent === 'recall') {
      petVocalization = 'cat_meow_pleading';
      vocalizationLabel = 'Urgent High-Pitch Contact Meow';
      acousticFreq = '420Hz – 780Hz Contact Frequency';
    } else {
      petVocalization = 'cat_chirp';
      vocalizationLabel = 'Friendly Welcoming Trill';
      acousticFreq = '380Hz – 950Hz';
    }
  } else {
    // Dog
    if (intent === 'play_walk' || intent === 'praise') {
      petVocalization = 'bark_playful';
      vocalizationLabel = 'High-Pitch Playful Double Yip';
      acousticFreq = '450Hz – 700Hz Cheerful Cadence';
    } else if (intent === 'recall') {
      petVocalization = 'ultrasonic_whistle';
      vocalizationLabel = 'Clean High-Contrast Ultrasonic Recall Whistle';
      acousticFreq = '6500Hz – 7200Hz Penetrating Attention Tone';
    } else if (intent === 'sit_stay') {
      petVocalization = 'training_clicker';
      vocalizationLabel = 'Sharp 3kHz Positive-Reinforcement Clicker Pulse';
      acousticFreq = '3200Hz Immediate Neurological Marker';
    } else if (intent === 'stop_warning') {
      petVocalization = 'bark_alert';
      vocalizationLabel = 'Low Authoritative Single Bark';
      acousticFreq = '160Hz – 220Hz Grounding Frequency';
    } else {
      petVocalization = 'bark_calm';
      vocalizationLabel = 'Warm Low-Register Affirmation Woof';
      acousticFreq = '210Hz Reassurance Envelope';
    }
  }

  // Body Language & Posture Tips
  const bodyLanguageMap: Record<PetTranslationResponse['intent'], PetTranslationResponse['humanBodyLanguage']> = {
    recall: {
      posture: 'Squat slightly lower to appear welcoming and non-threatening',
      hands: 'Extend open hands low near knees, palm facing up',
      eyeContact: 'Soft side-glance, avoid a rigid straight predator stare',
      vocalPitch: 'High, upbeat, cheerful musical cadence ("Here puppy!")'
    },
    sit_stay: {
      posture: 'Stand upright with shoulders relaxed and still',
      hands: 'Hold one open palm flat at chest height like a stop marker',
      eyeContact: 'Calm, steady eye contact with gentle blinking',
      vocalPitch: 'Low, firm, flat pitch without anger or wavering'
    },
    praise: {
      posture: 'Lean in comfortably with gentle forward body angle',
      hands: 'Rub chest or sides of neck (avoid patting top of head immediately)',
      eyeContact: 'Warm squinting eyes (smiling eyes release canine dopamine)',
      vocalPitch: 'High-register melodic sing-song frequency'
    },
    stop_warning: {
      posture: 'Freeze completely and stand tall like a tree',
      hands: 'Cross arms across chest, withdraw all touch immediately',
      eyeContact: 'Turn face 45° away to withdraw social attention',
      vocalPitch: 'Very deep, short single syllable ("Ah-ah" or "No")'
    },
    food_meal: {
      posture: 'Stand calmly by feeding station until pet sits politely',
      hands: 'Keep bowl at waist height, lower only when 4 paws touch ground',
      eyeContact: 'Neutral relaxed gaze',
      vocalPitch: 'Warm rhythmic notification ("Breakfast time!")'
    },
    play_walk: {
      posture: 'Play bow: drop your torso briefly and take 2 quick steps back',
      hands: 'Flash toy or leash at waist level with lively motion',
      eyeContact: 'Lively animated glances with soft smile',
      vocalPitch: 'Excited high-frequency staccato chirps'
    },
    comfort_calm: {
      posture: 'Sit or lie down beside pet without cornering them',
      hands: 'Slow, long strokes from shoulder to tail base matching your breath',
      eyeContact: 'Slow blink (especially for cats and anxious dogs)',
      vocalPitch: 'Deep rhythmic whisper or gentle hum'
    },
    affection: {
      posture: 'Relaxed loose posture on the rug or sofa',
      hands: 'Gentle scratches behind ears, under chin, or chest',
      eyeContact: 'Affectionate soft eyes with frequent blinking',
      vocalPitch: 'Gentle, comforting melodious murmur'
    },
    general: {
      posture: 'Balanced and relaxed stance',
      hands: 'Resting naturally at sides',
      eyeContact: 'Soft gaze',
      vocalPitch: 'Normal conversational tone'
    }
  };

  // Training Cues
  const trainingCueMap: Record<PetTranslationResponse['intent'], PetTranslationResponse['trainingCue']> = {
    recall: {
      commandWord: 'COME / YAHAN AAO',
      timingAdvice: 'Reward immediately within 1.2 seconds of your pet taking their first steps towards you',
      treatRewardAdvice: 'High-value protein treat (boiled chicken / freeze-dried liver)',
      clickerMarker: true
    },
    sit_stay: {
      commandWord: 'SIT / BAITHO',
      timingAdvice: 'Click the exact split-second pet rump makes contact with floor',
      treatRewardAdvice: 'Small pea-sized kibble or soft treat delivered at chin level',
      clickerMarker: true
    },
    praise: {
      commandWord: 'YES / GOOD BOY / SHABASH',
      timingAdvice: 'Pair verbal praise with tactile chest scratches within 2 seconds',
      treatRewardAdvice: 'Warm enthusiasm + affection or surprise jackpot reward',
      clickerMarker: false
    },
    stop_warning: {
      commandWord: 'LEAVE IT / CHHODO',
      timingAdvice: 'Mark redirect the instant your pet looks away from the forbidden object',
      treatRewardAdvice: 'Redirect to legal chew toy or interactive puzzle',
      clickerMarker: false
    },
    food_meal: {
      commandWord: 'WAIT → OK GO!',
      timingAdvice: 'Require 3 seconds of calm eye contact before releasing pet to eat',
      treatRewardAdvice: 'Full balanced meal portion served fresh with fresh water',
      clickerMarker: false
    },
    play_walk: {
      commandWord: 'LET’S GO / CHALO',
      timingAdvice: 'Release with a quick spin or open door cue',
      treatRewardAdvice: 'Sniff walk exploration or vigorous fetch session',
      clickerMarker: false
    },
    comfort_calm: {
      commandWord: 'EASY / SHANTI',
      timingAdvice: 'Soothe slowly to down-regulate heart rate and cortisol',
      treatRewardAdvice: 'Lick mat with peanut butter or calming kefir',
      clickerMarker: false
    },
    affection: {
      commandWord: 'I LOVE YOU / MERI JAAN',
      timingAdvice: 'Give physical affection until pet indicates rest or contentment',
      treatRewardAdvice: 'Loving brush, ear massage, and cozy space',
      clickerMarker: false
    },
    general: {
      commandWord: 'WATCH ME',
      timingAdvice: 'Reinforce eye contact and focus',
      treatRewardAdvice: 'Standard training treat',
      clickerMarker: true
    }
  };

  // Pet Thought Simulation
  const monologueMap: Record<PetTranslationResponse['intent'], PetTranslationResponse['petThoughtSimulation']> = {
    recall: {
      emotion: 'High Energy & Eager Focus',
      internalMonologue: `Human wants me right now! I hear that high musical sound and see open hands. There must be chicken or head scratches! Zooming over!`,
      expectedReaction: `Ears perk forward, head tilts, and pet trots directly towards human with wagging tail.`
    },
    sit_stay: {
      emotion: 'Focused & Receptive',
      internalMonologue: `Flat palm is out, tone is grounded. I know this game: put my butt down, keep my paws still, and tasty things happen.`,
      expectedReaction: `Lowers hindquarters into a crisp sit and maintains steady eye contact.`
    },
    praise: {
      emotion: 'Dopamine Surge & Happiness',
      internalMonologue: `Yay! Human is smiling with soft eyes and talking in that lovely sing-song voice. I did it right! I am the best companion in the universe!`,
      expectedReaction: `Tail wagging in wide lazy circles, soft panting, leaning affectionately against legs.`
    },
    stop_warning: {
      emotion: 'Surprised & Hesitant',
      internalMonologue: `Uh-oh, human turned like a tree and went silent. The fun paused. Better back away from this slipper and check what they want instead.`,
      expectedReaction: `Halts action, looks back at human with ears drawn back, awaits redirection.`
    },
    food_meal: {
      emotion: 'Peak Salivation & Delight',
      internalMonologue: `The sacred bowl sound! The food word! Smells like lamb and veggies. Must remember to sit nicely so bowl reaches the ground faster!`,
      expectedReaction: `Licks chops, dances on front paws, quickly sits at feeding station.`
    },
    play_walk: {
      emotion: 'Hyper-Excitement & Joy',
      internalMonologue: `OUTSIDE! Leash! Sniffing 400 new pee-mails on the street! Let's go let's go let's go!`,
      expectedReaction: `Bounces on front paws, runs to door, grabs favorite toy in mouth.`
    },
    comfort_calm: {
      emotion: 'Deep Safety & Relaxation',
      internalMonologue: `Human's breathing is so calm. The low rhythmic purr/rumble makes my chest relax. No thunder or scary noises can hurt me here.`,
      expectedReaction: `Lets out a heavy contented sigh, lays head flat on paws, muscles soften.`
    },
    affection: {
      emotion: 'Bonding & Pure Love',
      internalMonologue: `Warm hands behind my ears... my human loves me. I will guard them forever and stay right by their side.`,
      expectedReaction: `Nudges hand for more pets, gives gentle nose touch or purrs continuously.`
    },
    general: {
      emotion: 'Curious & Attentive',
      internalMonologue: `Human is speaking my name. My ears are swiveling to catch every syllable.`,
      expectedReaction: `Tilts head 30 degrees, raises one ear, watches human's mouth and hands.`
    }
  };

  return {
    sourceText: text,
    intent,
    petVocalization,
    vocalizationLabel,
    acousticFrequency: acousticFreq,
    humanBodyLanguage: bodyLanguageMap[intent],
    trainingCue: trainingCueMap[intent],
    petThoughtSimulation: monologueMap[intent]
  };
}

/**
 * Reverse Decoder: Translates pet vocalizations and behaviors into human language
 */
export const REVERSE_PET_BEHAVIORS: ReverseDecodeResponse[] = [
  {
    petSoundType: 'Rapid High-Pitch Staccato Barks (2-3 quick bursts)',
    observedBehavior: 'Running between window and human with stiff tail wag',
    humanInterpretation: '"Someone is outside the door/gate! Alert! Check this immediately!"',
    recommendedAction: 'Acknowledge calmly with "Thank you, I see it", inspect the window, then guide pet to their bed with a treat to de-escalate.',
    urgencyLevel: 'NEEDS_ATTENTION'
  },
  {
    petSoundType: 'Low-Frequency Rhythmic Purring while Kneading with Paws',
    observedBehavior: 'Rhythmic paw pushing on blanket, soft squinting eyes',
    humanInterpretation: '"I feel deeply safe, secure, and loved. This feels like my mother nursing me."',
    recommendedAction: 'Gently scratch sides of neck or base of ears. Do not make sudden loud movements.',
    urgencyLevel: 'LOW'
  },
  {
    petSoundType: 'Whining / High-Pitched Murmur near Front Door',
    observedBehavior: 'Pacing near door, nudging door handle, sniffing shoes',
    humanInterpretation: '"Urgent nature call! I really need to go outside for potty right now!"',
    recommendedAction: 'Leash up immediately and take out to their regular bathroom spot. Do not delay.',
    urgencyLevel: 'URGENT'
  },
  {
    petSoundType: 'Play Bow + Sneezing while Bouncing',
    observedBehavior: 'Front chest low on ground, hindquarters high, tail wagging vigorously, fake sneezes',
    humanInterpretation: '"Everything I do right now is just a game! Come chase me or throw the ball!"',
    recommendedAction: 'Engage in play! The sneezing is canine communication confirming non-aggressive intention.',
    urgencyLevel: 'LOW'
  },
  {
    petSoundType: 'Guttural Low Growl with Direct Hard Stare',
    observedBehavior: 'Stiff posture, closed mouth, guarding food bowl or toy',
    humanInterpretation: '"Back off! You are too close to my valuable prize. I am uncomfortable."',
    recommendedAction: 'Do NOT punish or shout. Step back slowly. In future, trade high-value treats for guarded items.',
    urgencyLevel: 'NEEDS_ATTENTION'
  },
  {
    petSoundType: 'Head-Butting and Rubbing Cheek Glands Against You',
    observedBehavior: 'Cat circles legs, rubs forehead against your shin, purrs',
    humanInterpretation: '"You belong to my family tribe! Marking you with my pheromones of affection."',
    recommendedAction: 'Stroke along the cheekbones and under chin where scent glands appreciate touch.',
    urgencyLevel: 'LOW'
  }
];
