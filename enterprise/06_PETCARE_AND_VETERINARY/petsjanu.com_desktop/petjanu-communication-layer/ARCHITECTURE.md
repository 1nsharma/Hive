# 🐾 PetJanu Communication Layer Architecture

## Vision

PetJanu Communication Layer is **not** a wrapper around existing models. It is a **semantic bridge** that translates human intent into species-specific acoustic patterns that pets can understand. This layer is the core IP of the PetJanu platform.

---

## 🎯 Core Philosophy

### What We Are NOT Building
- ❌ A simple wrapper around Whisper + LLM + Dog2vec
- ❌ A "translation" system claiming to convert pet sounds to human language
- ❌ A free-form generative model without guardrails

### What We ARE Building
- ✅ A **semantic communication bridge** between humans and pets
- ✅ An **intent-to-acoustic-pattern mapper** backed by animal behaviour science
- ✅ A **learning system** that improves from real pet feedback
- ✅ A **species-specific and individual-pet-specific** communication layer

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Human Input Layer                            │
│  (Voice/Text: "Come here", "Stop", "Good boy", etc.)           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Intent Engine                                │
│  • Lightweight classifier (DistilBERT / rule-based + embeddings)│
│  • Maps natural language → predefined intent set (10-15 cmds)  │
│  • Output: Intent ID (e.g., "COME_HERE", "STOP", "AFFECTION")  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              PetJanu Communication Layer (CORE IP)             │
│  Input:                                                        │
│    - Human Intent (e.g., "COME_HERE")                          │
│    - Pet Profile (species, breed, age, personality, history)   │
│    - Context (time, location, emotional state)                 │
│                                                                │
│  Processing:                                                   │
│    - Semantic bridge: intent → species-specific acoustic pattern│
│    - Rule-based mapping (expert-validated) → data-driven model │
│    - Few-shot learning / meta-learning for new pets            │
│                                                                │
│  Output:                                                       │
│    - Acoustic parameters (frequency, duration, pitch contour)  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                Audio Generation Module                          │
│  • Vocoder / Generative Model (HiFi-GAN, WaveGlow, Diffusion)  │
│  • Converts acoustic parameters → waveform                     │
│  • Fine-tuned on species-specific vocalizations                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Pet Response                                 │
│  (Video/Audio captured for feedback loop)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               Feedback & Learning Pipeline                      │
│  • Pet reaction classification (pose estimation + audio)       │
│  • User feedback (thumbs up/down)                              │
│  • Reward signal → RLHF-style model updates                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Component Details

### 1. Intent Engine

**Purpose:** Convert human natural language into a predefined set of intents.

**Implementation Options:**
- **Option A (Initial):** Rule-based classifier with embedding similarity
  - Fast, interpretable, low latency
  - Predefined intent set: 10-15 commands (COME_HERE, STOP, GOOD_BOY, DANGER, etc.)
  
- **Option B (Advanced):** Fine-tuned DistilBERT or small transformer
  - Better generalization
  - Still maps to predefined intent set (not free-form generation)

**Why not pure LLM?**
- Latency concerns for real-time interaction
- Overkill for limited intent space
- Risk of hallucination / unpredictable outputs

---

### 2. PetJanu Communication Layer (Core IP)

**Purpose:** Map human intent + pet profile + context → species-specific acoustic pattern.

**Key Design Decisions:**
- **Not direct translation:** We don't claim to "speak dog" — we generate cues that convey intent
- **Expert-validated rules first:** Start with rule-based mappings validated by animal behaviourists
- **Data-driven evolution:** Gradually shift to learned models as paired data accumulates

**Training Data Requirements:**
- Paired data: (Human Intent, Pet Vocalization) — limited initially
- Strategies for data scarcity:
  - Few-shot learning
  - Meta-learning
  - Reinforcement learning from pet feedback

**Initial Approach:**
- Rule-based mapping (e.g., "COME_HERE" → specific bark frequency/duration pattern)
- Validated by animal behaviour experts
- Stored as parameterized acoustic templates

---

### 3. Audio Generation Module

**Purpose:** Convert acoustic parameters → audible waveform.

**Important Note on Dog2vec / NatureLM-audio:**
- These models provide **embeddings/representations**, not direct audio generation
- You need a **vocoder** or **generative module** to convert representations → waveform

**Options:**
- **HiFi-GAN:** High-fidelity vocoder, fast inference
- **WaveGlow:** Flow-based vocoder, good quality
- **Diffusion-based audio generators:** State-of-the-art quality, slower

**Fine-tuning Strategy:**
- Use species-specific vocalization datasets
- Adapt pre-trained vocoders to canine/feline audio characteristics

---

### 4. Feedback & Learning Pipeline

**Purpose:** Continuously improve the communication layer from real-world interactions.

**Data Collection:**
```
User logs:
  - Command given (intent)
  - Generated audio (acoustic parameters + waveform)
  - Pet reaction (video/audio)
  - Outcome (obeyed, ignored, stressed, etc.)
```

**Pet Reaction Classification:**
- Use pretrained animal behaviour classifiers
- Pose estimation (body language)
- Audio analysis (vocalization response)

**Preference Learning:**
- User feedback → reward signal
- RLHF-style updates to communication layer
- Individual pet preferences learned over time

---

## 📊 Evaluation Metrics

Since "translation accuracy" has no ground truth, we use proxy metrics:

| Metric | Description | Measurement Method |
|--------|-------------|-------------------|
| **Pet Response Rate** | Did pet show expected behaviour after cue? | Human annotator / automated behaviour detector |
| **User Satisfaction** | Did owner find the generated sound effective? | Thumbs up/down feedback |
| **Acoustic Naturalness** | Does generated sound seem natural? | MOS score / pretrained classifier |
| **Latency** | Time from input → audio output | Critical for real-time interaction |

---

## 🗺️ Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)
- [ ] Define intent set (10-15 commands)
- [ ] Build rule-based Intent Engine
- [ ] Create expert-validated acoustic templates (rule-based mapping)
- [ ] Integrate HiFi-GAN vocoder for audio generation
- [ ] Deploy MVP with hardcoded mappings

### Phase 2: Data Collection (Weeks 5-12)
- [ ] Launch user-facing app with feedback collection
- [ ] Implement pet reaction recording (video/audio)
- [ ] Build annotation pipeline for pet behaviour classification
- [ ] Collect initial dataset (1000+ interactions)

### Phase 3: Learning System (Weeks 13-20)
- [ ] Train few-shot learning model on collected data
- [ ] Implement preference learning (RLHF-style)
- [ ] Develop individual pet profiles with personalized mappings
- [ ] A/B test learned model vs. rule-based baseline

### Phase 4: Scale & Refine (Weeks 21+)
- [ ] Expand intent set based on usage patterns
- [ ] Multi-species support (cats, birds, etc.)
- [ ] Real-time adaptation during interactions
- [ ] Research partnerships for validation studies

---

## 🧪 Research Considerations

### Ethical Guidelines
- **No anthropomorphism:** Don't claim pets "speak" like humans
- **Evidence-based claims:** Validate effectiveness through controlled studies
- **Pet welfare first:** Monitor for stress signals, allow opt-out

### Validation Strategy
- Partner with veterinary behaviourists
- Conduct controlled experiments with measurable outcomes
- Publish findings for peer review (builds credibility)

---

## 🛠️ Tech Stack Recommendations

| Component | Recommended Technology | Alternative |
|-----------|----------------------|-------------|
| Intent Engine | DistilBERT / Rule-based + embeddings | TinyLLM, FastText |
| Communication Layer | PyTorch / JAX for custom models | TensorFlow |
| Vocoder | HiFi-GAN | WaveGlow, DiffWave |
| Behaviour Detection | OpenPose + custom classifier | DeepLabCut, SLEAP |
| Feedback Pipeline | RLlib / Custom RL implementation | Stable Baselines3 |
| Data Storage | Supabase PostgreSQL + Firebase | MongoDB, TimescaleDB |

---

## 📚 Key References

1. **Dog2vec:** Canine vocalization representation learning
2. **NatureLM-audio:** Foundation model for animal audio understanding
3. **HiFi-GAN:** High-fidelity neural vocoder
4. **RLHF:** Reinforcement Learning from Human Feedback (adapt to pet feedback)
5. **Few-shot Learning:** Meta-learning approaches for low-data regimes

---

## 🤝 Next Steps

1. **Finalize intent set** (collaborate with animal behaviourists)
2. **Create initial acoustic templates** (rule-based mappings)
3. **Set up data collection infrastructure** (user app + feedback pipeline)
4. **Build evaluation framework** (metrics + annotation tools)
5. **Start MVP development** (Intent Engine + Communication Layer + Vocoder)

---

**Version:** 0.1.0  
**Status:** Architecture Draft  
**Last Updated:** 2026-01-15  
**Authors:** PetJanu Research Team
