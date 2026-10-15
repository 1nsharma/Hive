# PetJanu Communication Layer - Intent Set Definition

## Overview

This document defines the **predefined intent set** for the PetJanu Communication Layer MVP. These intents represent the core commands and communications that pet owners commonly use with their pets.

---

## 🎯 Core Intent Set (MVP - 15 Intents)

### Category 1: Basic Commands (6 intents)

| Intent ID | Human Phrase Examples | Description | Expected Pet Behaviour |
|-----------|----------------------|-------------|----------------------|
| `COME_HERE` | "Come here", "Aao", "Come on" | Call pet to owner | Pet approaches owner |
| `STOP` | "Stop", "Ruko", "Don't do that" | Halt current action | Pet stops current activity |
| `SIT` | "Sit", "Baitho", "Sit down" | Command to sit | Pet sits down |
| `STAY` | "Stay", "Thehro", "Wait here" | Command to remain in place | Pet stays in current position |
| `LIE_DOWN` | "Lie down", "Let jao", "Down" | Command to lie down | Pet lies down |
| `HEEL` | "Walk close", "Saath chalo", "Heel" | Walk beside owner | Pet walks closely beside owner |

### Category 2: Affection & Positive Reinforcement (3 intents)

| Intent ID | Human Phrase Examples | Description | Expected Pet Behaviour |
|-----------|----------------------|-------------|----------------------|
| `GOOD_BOY_GIRL` | "Good boy", "Good girl", "Shabash" | Praise for good behaviour | Pet feels positive, may wag tail |
| `AFFECTION` | "I love you", "Pyar", "Come cuddle" | Express love/affection | Pet seeks physical contact |
| `TREAT_TIME` | "Want treat?", "Snack time", "Khaana" | Signal treat is coming | Pet shows excitement, anticipates food |

### Category 3: Safety & Urgency (3 intents)

| Intent ID | Human Phrase Examples | Description | Expected Pet Behaviour |
|-----------|----------------------|-------------|----------------------|
| `DANGER_ALERT` | "Danger!", "Bachke!", "Watch out!" | Warn of immediate threat | Pet becomes alert, may freeze or retreat |
| `EMERGENCY_RETURN` | "Come now!", "Jaldi aao!", "Emergency!" | Urgent recall command | Pet immediately returns to owner |
| `NO_BARK` | "Quiet", "Chup", "Stop barking" | Stop vocalization | Pet stops barking/howling |

### Category 4: Daily Routine (3 intents)

| Intent ID | Human Phrase Examples | Description | Expected Pet Behaviour |
|-----------|----------------------|-------------|----------------------|
| `WALK_TIME` | "Walk time", "Ghumne chalein", "Ready for walk?" | Signal walk is about to start | Pet shows excitement, moves toward door/leash |
| `MEAL_TIME` | "Food time", "Khaana ready hai", "Dinner" | Signal meal is ready | Pet moves to feeding area |
| `BEDTIME` | "Sleep time", "Sone chalo", "Bed time" | Signal end of day/rest time | Pet settles down, goes to bed area |

---

## 🔤 Intent Encoding Schema

Each intent is encoded with the following structure:

```json
{
  "intent_id": "COME_HERE",
  "category": "basic_command",
  "priority": "normal",
  "urgency_level": 1,
  "acoustic_template": {
    "base_frequency_hz": 450,
    "frequency_modulation": "rising",
    "duration_ms": 800,
    "amplitude_profile": "steady",
    "harmonic_structure": "simple"
  },
  "species_variants": {
    "dog": {
      "vocalization_type": "bark",
      "breed_adjustments": {}
    },
    "cat": {
      "vocalization_type": "meow",
      "breed_adjustments": {}
    }
  }
}
```

---

## 📊 Intent Metadata Fields

| Field | Type | Description | Example Values |
|-------|------|-------------|----------------|
| `intent_id` | string | Unique identifier (UPPER_SNAKE_CASE) | `"COME_HERE"` |
| `category` | string | Functional category | `"basic_command"`, `"affection"`, `"safety"`, `"routine"` |
| `priority` | string | Importance level | `"low"`, `"normal"`, `"high"`, `"critical"` |
| `urgency_level` | integer | Numeric urgency (1-5) | `1` (normal), `5` (emergency) |
| `acoustic_template` | object | Base acoustic parameters | See schema above |
| `species_variants` | object | Species-specific adaptations | dog, cat, bird, etc. |

---

## 🐕 Species-Specific Considerations

### Dogs
- **Vocalization types:** Bark, whine, growl, howl
- **Frequency range:** 50 Hz - 4 kHz (varies by breed size)
- **Key acoustic features:** 
  - Large breeds: lower frequency, longer duration
  - Small breeds: higher frequency, shorter duration
  - Pitch contour indicates emotional valence

### Cats
- **Vocalization types:** Meow, purr, hiss, chirp
- **Frequency range:** 200 Hz - 8 kHz
- **Key acoustic features:**
  - More complex frequency modulations
  - Longer sustained tones possible
  - Purring has distinct harmonic structure

### Birds (Future Expansion)
- **Vocalization types:** Chirp, squawk, whistle, mimicry
- **Frequency range:** 1 kHz - 10+ kHz
- **Key acoustic features:**
  - Very rapid frequency modulations
  - Complex harmonic structures
  - Species-specific patterns

---

## 🧪 Validation Protocol

### Expert Review Checklist
- [ ] Each intent has clear behavioural expectation
- [ ] Acoustic templates are species-appropriate
- [ ] No conflicting or ambiguous intents
- [ ] Priority levels align with real-world urgency
- [ ] Multilingual phrase examples are accurate

### User Testing Protocol
1. Present intent + generated audio to pet owners
2. Ask: "What do you think this sound communicates to your pet?"
3. Test actual pet response in controlled setting
4. Collect feedback on acoustic naturalness
5. Iterate on acoustic templates based on results

### Success Metrics
- **Owner comprehension rate:** >80% correctly identify intent
- **Pet response rate:** >60% show expected behaviour (initial baseline)
- **Naturalness score:** >3.5/5.0 Mean Opinion Score (MOS)

---

## 🔄 Intent Set Evolution

### Phase 1 (MVP): 15 Core Intents
- Current document scope
- Focus on most common, high-value commands

### Phase 2 (Expansion): 30-50 Intents
- Add nuanced commands (e.g., "fetch", "drop it", "go to place")
- Include emotional states (e.g., "calm down", "play time")
- Species-specific additions

### Phase 3 (Personalization): Custom Intents
- Allow users to define custom commands
- Learn individual pet-owner communication patterns
- Adaptive intent mapping based on pet's unique responses

---

## 📝 Multilingual Support

### Supported Languages (MVP)
1. **English** - Primary
2. **Hindi** - India market focus

### Intent Mapping Example

| English | Hindi | Intent ID |
|---------|-------|-----------|
| "Come here" | "आओ" / "इधर आओ" | `COME_HERE` |
| "Sit" | "बैठो" | `SIT` |
| "Good boy" | "शाबाश" / "अच्छा लड़का" | `GOOD_BOY_GIRL` |
| "Stop" | "रुको" / "नहीं" | `STOP` |

### Future Languages
- Bengali
- Tamil
- Telugu
- Marathi
- Spanish (for global expansion)

---

## 📋 Implementation Checklist

- [ ] Finalize all 15 intent definitions with animal behaviourist review
- [ ] Create acoustic template for each intent (species-specific)
- [ ] Build Intent Engine classifier (rule-based + embeddings)
- [ ] Implement multilingual phrase matching (EN, HI)
- [ ] Test each intent with sample pet cohort (n=20+)
- [ ] Document baseline performance metrics
- [ ] Create feedback collection mechanism for continuous improvement

---

**Version:** 0.1.0  
**Status:** Draft for Expert Review  
**Last Updated:** 2026-01-15  
**Authors:** PetJanu Research Team  
**Reviewers:** [Pending - Animal Behaviourists]
