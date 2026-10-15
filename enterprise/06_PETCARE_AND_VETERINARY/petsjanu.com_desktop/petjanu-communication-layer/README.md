# 🐾 PetJanu Communication Layer - README

## Overview

The **PetJanu Communication Layer** is the core IP of the PetJanu platform — a semantic bridge that translates human intent into species-specific acoustic patterns that pets can understand.

This is **not** a wrapper around existing models (Whisper, LLM, Dog2vec). Instead, it's a research-backed communication system that:
- Maps human commands to predefined intents
- Generates species-specific acoustic templates
- Learns from real pet feedback over time
- Respects the distinction between "representation learning" and "communication generation"

---

## 🎯 What This Is (and Isn't)

### ✅ What We Are Building
- A **semantic communication bridge** between humans and pets
- An **intent-to-acoustic-pattern mapper** backed by animal behaviour science
- A **learning system** that improves from real-world interactions
- A **species-specific and individual-pet-specific** communication layer

### ❌ What We Are NOT Building
- A simple wrapper around Whisper + LLM + Dog2vec
- A "translation" system claiming to convert pet sounds to human language
- A free-form generative model without guardrails

---

## 🚀 Quick Start

### Installation

```bash
cd petjanu-communication-layer

# No external dependencies required for MVP (pure Python)
# Future versions will require: torch, transformers, hifi-gan, etc.
```

### Basic Usage

```python
from src import PetJanuCommunicationLayer

# Initialize the communication layer
comm_layer = PetJanuCommunicationLayer()

# Process a command
result = comm_layer.process_command(
    command="Come here buddy!",
    pet_profile={
        "species": "dog",
        "breed": "labrador",
        "age_years": 2
    }
)

print(f"Intent: {result['intent']['id']}")
print(f"Category: {result['intent']['category']}")
print(f"Acoustic: {result['acoustic_template']['vocalization_type']}")
print(f"Frequency: {result['acoustic_template']['base_frequency_hz']} Hz")
```

### Multilingual Support

```python
# Hindi command
result = comm_layer.process_command(
    command="आओ",
    language="hi",
    pet_profile={"species": "dog", "breed": "desi", "age_years": 5}
)
```

### Species Adaptation

```python
# For cats (automatic frequency and vocalization type adjustment)
result = comm_layer.process_command(
    command="Sit down please",
    pet_profile={"species": "cat", "breed": "persian", "age_years": 3}
)
# Returns: meow vocalization with higher frequency range
```

---

## 📦 Module Structure

```
petjanu-communication-layer/
├── ARCHITECTURE.md          # Detailed system architecture
├── INTENT_SET.md            # Complete intent definitions
├── README.md                # This file
├── src/
│   ├── __init__.py          # Main module interface
│   ├── intent_engine/
│   │   └── intent_classifier.py  # Rule-based intent classification
│   ├── communication_layer/      # (Future) Core IP implementation
│   ├── audio_generation/         # (Future) Vocoder integration
│   ├── feedback_pipeline/        # (Future) Learning from feedback
│   └── tests/                    # Unit and integration tests
└── tests/
    └── test_intent_engine.py     # Test suite
```

---

## 🧠 Intent Engine (MVP)

The current MVP includes a **rule-based Intent Engine** with the following features:

### Supported Intents (15 total)

#### Basic Commands (6)
- `COME_HERE` - Recall command
- `STOP` - Halt current action
- `SIT` - Sit down command
- `STAY` - Remain in place
- `LIE_DOWN` - Lie down command
- `HEEL` - Walk beside owner

#### Affection & Positive Reinforcement (3)
- `GOOD_BOY_GIRL` - Praise
- `AFFECTION` - Express love
- `TREAT_TIME` - Signal treat

#### Safety & Urgency (3)
- `DANGER_ALERT` - Warn of threat
- `EMERGENCY_RETURN` - Urgent recall
- `NO_BARK` - Stop vocalization

#### Daily Routine (3)
- `WALK_TIME` - Signal walk
- `MEAL_TIME` - Signal meal
- `BEDTIME` - Signal rest

### Features

✅ **Multilingual Support**: English and Hindi (expandable)  
✅ **Fast Classification**: Exact match + keyword fallback  
✅ **Confidence Scoring**: Reports match confidence  
✅ **Species Adaptation**: Automatic frequency/vocalization adjustments  
✅ **Extensible**: Easy to add new intents and phrases

---

## 🔊 Acoustic Templates

Each intent maps to an **acoustic template** with the following parameters:

| Parameter | Description | Example Values |
|-----------|-------------|----------------|
| `base_frequency_hz` | Fundamental frequency | 250-800 Hz (dogs), 325-1040 Hz (cats) |
| `frequency_modulation` | Pitch contour | `rising`, `falling`, `steady`, `oscillating` |
| `duration_ms` | Sound length | 300-1200 ms |
| `amplitude_profile` | Loudness pattern | `steady`, `fade_in`, `fade_out`, `pulsed` |
| `harmonic_structure` | Complexity | `simple`, `complex`, `rich` |
| `vocalization_type` | Sound category | `bark`, `meow`, `whine`, `growl`, `howl`, `chirp`, `purr` |

### Species-Specific Adaptations

**Dogs:**
- Frequency range: 50 Hz - 4 kHz (varies by breed size)
- Vocalization types: bark, whine, growl, howl
- Large breeds: lower frequency, longer duration
- Small breeds: higher frequency, shorter duration

**Cats:**
- Frequency range: 200 Hz - 8 kHz
- Vocalization types: meow, purr, hiss, chirp, yowl
- More complex frequency modulations
- Automatic 1.3x frequency multiplier applied

---

## 🗺️ Roadmap

### Phase 1: Foundation (Current - Weeks 1-4)
- ✅ Define intent set (15 commands)
- ✅ Build rule-based Intent Engine
- ✅ Create acoustic templates (rule-based mapping)
- ⏳ Integrate HiFi-GAN vocoder for audio generation
- ⏳ Deploy MVP with hardcoded mappings

### Phase 2: Data Collection (Weeks 5-12)
- ⏳ Launch user-facing app with feedback collection
- ⏳ Implement pet reaction recording (video/audio)
- ⏳ Build annotation pipeline for pet behaviour classification
- ⏳ Collect initial dataset (1000+ interactions)

### Phase 3: Learning System (Weeks 13-20)
- ⏳ Train few-shot learning model on collected data
- ⏳ Implement preference learning (RLHF-style)
- ⏳ Develop individual pet profiles with personalized mappings
- ⏳ A/B test learned model vs. rule-based baseline

### Phase 4: Scale & Refine (Weeks 21+)
- ⏳ Expand intent set based on usage patterns
- ⏳ Multi-species support (cats, birds, etc.)
- ⏳ Real-time adaptation during interactions
- ⏳ Research partnerships for validation studies

---

## 🧪 Testing

### Run Unit Tests

```bash
cd petjanu-communication-layer
python src/intent_engine/intent_classifier.py
```

### Run Full Demo

```bash
python -c "
import sys
sys.path.insert(0, '.')
from src import PetJanuCommunicationLayer

comm = PetJanuCommunicationLayer()

# Test multiple scenarios
scenarios = [
    ('Come here!', {'species': 'dog', 'breed': 'labrador'}),
    ('आओ', {'species': 'dog', 'breed': 'desi'}),
    ('Good boy!', {'species': 'dog', 'breed': 'retriever'}),
    ('Danger!', {'species': 'dog', 'breed': 'shepherd'}),
]

for command, profile in scenarios:
    result = comm.process_command(command, profile)
    print(f'{command} → {result[\"intent\"][\"id\"]} ({result[\"acoustic_template\"][\"vocalization_type\"]})')
"
```

---

## 📊 Evaluation Metrics

Since "translation accuracy" has no ground truth, we use proxy metrics:

| Metric | Description | Target (MVP) |
|--------|-------------|--------------|
| **Intent Classification Accuracy** | Correct intent identified | >95% (rule-based) |
| **Owner Comprehension Rate** | Owner correctly identifies intent | >80% |
| **Pet Response Rate** | Pet shows expected behaviour | >60% (baseline) |
| **Acoustic Naturalness** | MOS score from listeners | >3.5/5.0 |
| **Latency** | Input → output time | <200ms |

---

## 🔬 Research Considerations

### Ethical Guidelines
- **No anthropomorphism:** We don't claim pets "speak" like humans
- **Evidence-based claims:** Validate effectiveness through controlled studies
- **Pet welfare first:** Monitor for stress signals, allow opt-out

### Validation Strategy
- Partner with veterinary behaviourists
- Conduct controlled experiments with measurable outcomes
- Publish findings for peer review (builds credibility)

---

## 🛠️ Tech Stack

| Component | Current (MVP) | Future |
|-----------|---------------|--------|
| Intent Engine | Rule-based + embeddings | DistilBERT / TinyLLM |
| Communication Layer | Rule-based templates | Few-shot / Meta-learning |
| Vocoder | N/A (templates only) | HiFi-GAN / WaveGlow / Diffusion |
| Behaviour Detection | N/A | OpenPose + custom classifier |
| Feedback Pipeline | Placeholder | RLlib / Custom RL |
| Data Storage | In-memory | Supabase PostgreSQL + Firebase |

---

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system architecture and design decisions
- **[INTENT_SET.md](./INTENT_SET.md)** - Detailed intent definitions and validation protocols
- **[README.md](./README.md)** - This file (quick start and overview)

---

## 🤝 Contributing

We welcome contributions! Key areas for contribution:

1. **Animal Behaviour Experts:** Validate intent definitions and acoustic templates
2. **ML Researchers:** Improve communication layer with few-shot/meta-learning
3. **Audio Engineers:** Optimize vocoder for species-specific vocalizations
4. **Developers:** Build feedback pipeline and data collection infrastructure

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add/update tests
5. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details.

---

## 📞 Contact

- **Website:** [https://petsjanu.com](https://petsjanu.com)
- **Research Team:** research@petsjanu.com
- **Support:** support@petsjanu.com

---

**Version:** 0.1.0 (MVP)  
**Status:** Development  
**Last Updated:** 2026-01-15  
**Authors:** PetJanu Research Team
