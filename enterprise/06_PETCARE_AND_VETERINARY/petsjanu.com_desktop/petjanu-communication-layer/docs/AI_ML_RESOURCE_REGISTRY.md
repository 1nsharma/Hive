# PetJanu AI/ML Resource Registry

## 🌍 Complete Open-Source AI/ML Landscape for PetJanu

This document consolidates all foundation models, datasets, infrastructure, and tools required to build the PetJanu Communication Layer.

---

## 1. Foundation Models

### Core Models for PetJanu MVP

| Model | Developer | License | Commercial Use | Size | GPU Req | I/O | Role in PetJanu |
|-------|-----------|---------|----------------|------|---------|-----|-----------------|
| **NatureLM-audio** | Earth Species Project | CC BY 4.0 | ✅ Yes | 8B (Llama 3.1 8B + LoRA) | ~16GB+ VRAM | Audio → Text | Animal audio understanding, vocalization analysis |
| **Whisper Large-v3** | OpenAI | MIT | ✅ Yes | 1.55B params | ~10GB VRAM | Audio → Text | ASR: Human speech → text commands |
| **LLaMA 3.1-8B** | Meta | Custom (commercial OK) | ✅ Yes | 8B params | ~16GB VRAM | Text → Text | Intent extraction engine |
| **Dog2vec** | Kenny Q. Zhu et al. | Unknown | ⚠️ Contact authors | Unknown | Unknown | Dog audio → Embedding | Canine vocalization encoding |
| **BEATs** | Microsoft | MIT | ✅ Yes | Unknown | Unknown | Audio → Embedding | Audio encoder backbone |
| **DolphinGemma** | Google | Apache 2.0 (expected) | ✅ Yes | 400M params | Mobile-friendly | Dolphin audio → Sound prediction | Multi-species sound modeling (future) |
| **Perch 2.0** | Google DeepMind | Apache 2.0 | ✅ Yes | Unknown | Unknown | Environmental audio → Species detection | Bioacoustic species detection |

### Model Status Notes

- ✅ **NatureLM-audio**: License updated from CC-BY-NC-SA to **CC BY 4.0** - now commercially usable!
- ⚠️ **Dog2vec**: Code not yet public. Contact: kenny.zhu@sjtu.edu.cn
- 🔄 **DolphinGemma**: Expected open-source Summer 2025
- ✅ **Whisper**: Ready for immediate use, fine-tune on Hinglish optional

---

## 2. Datasets

### Primary Datasets for MVP

| Dataset | Developer | License | Commercial Use | Size | Content | Role |
|---------|-----------|---------|----------------|------|---------|------|
| **DogSpeak** | Hridayesh Lekhak et al. | CC-BY-NC-SA-4.0 | ❌ No (research only) | 77,202 dog vocalizations | 156 dogs, 5 breeds | Training/evaluation (non-commercial) |
| **EmotionalCanines** | Tuan M. Dang et al. | Unknown | ⚠️ Verify | ~1,000 annotated clips | Dog vocalizations + arousal/valence labels | Emotion analysis research |
| **Dolph2Vec Dataset** | Research Team | CC BY 4.0 | ✅ Yes | 180,000 dolphin whistles | 5 years of recordings | Multi-species reference |
| **MeerKAT** | Research Team | Open | ⚠️ Verify | Largest terrestrial mammal dataset | Meerkat vocalizations with transcriptions | Annotation methodology reference |
| **Earth Species Library** | Earth Species Project | Mixed | Varies | Multiple species | Birds, bats, otters, macaques | Multi-species expansion |

### Data Access Tools

| Tool | Developer | License | Description |
|------|-----------|---------|-------------|
| **alp-data** | Earth Species Project | Open | Unified Python library for 35+ bioacoustic datasets |
| **AVEX** | Earth Species Project | Open | Unified interface for animal vocalization encoders |
| **bacpipe** | Bioacoustic AI Consortium | Open | Pipeline with AVES, BEATs, BioLingual models |

---

## 3. Benchmarks & Evaluation

| Benchmark | Developer | Description | Use Case |
|-----------|-----------|-------------|----------|
| **BEANS-Zero** | Earth Species Project | Zero-shot bioacoustic audio+text benchmark | Model evaluation on unseen species/tasks |
| **AVEX** | Earth Species Project | Animal vocalization encoder benchmark | Encoder comparison and validation |

---

## 4. Engineering Stack

### Core Technologies

| Category | Technology | Purpose |
|----------|------------|---------|
| **Language** | Python 3.10+ | Primary development language |
| **Deep Learning** | PyTorch 2.0+ | Model training and inference |
| **Model Hub** | Hugging Face Transformers | Model and dataset management |
| **Audio Processing** | torchaudio, librosa, FFmpeg | Audio loading, feature extraction, processing |
| **Vector Search** | FAISS | Cue library indexing and retrieval |
| **API Framework** | FastAPI | RESTful API endpoints |
| **Real-time Communication** | WebSocket / WebRTC | Low-latency audio streaming |
| **Database** | PostgreSQL / Supabase | User, pet, interaction logs |
| **Object Storage** | S3 / MinIO | Raw audio files and processed features |
| **Monitoring** | Prometheus + Grafana | System metrics and performance tracking |

---

## 5. Related Open-Source Projects

### Reference Implementations

| Project | Developer | GitHub | License | Relevance |
|---------|-----------|--------|---------|-----------|
| **echoAnimal** | Aashritha-2005 | [Link](https://github.com/Aashritha-2005/echoAnimal) | Open | Audio feature → behavior translation pipeline |
| **naturelm-cats** | shindevlin | [Link](https://github.com/shindevlin/naturelm-cats) | Open | NatureLM-audio cat extension |
| **MegaDetector-Acoustic** | Microsoft | [Link](https://github.com/microsoft/MegaDetector-Acoustic) | MIT | Species detection from audio |
| **Bioacoustics Model Zoo** | Community | [PyPI](https://pypi.org/project/bioacoustics-model-zoo) | Open | Integrated bioacoustic ML models |

### Pet-Specific AI Projects

| Project | Developer | Link | Description |
|---------|-----------|------|-------------|
| **VetJarvis-4B-Instruct** | CHOONOK COMPANY | [HF](https://huggingface.co/choonok/VetJarvis-4B-Instruct) | 4B parameter LLM for pet veterinary knowledge |
| **PetLingo-CatPlanet** | Community | [Devpost](https://devpost.com/) | ML-driven pet language translator (18 emotion states) |

---

## 6. Research Consortia & Partnerships

| Organization | Website | Description | Partnership Potential |
|--------------|---------|-------------|----------------------|
| **Earth Species Project** | [earthspecies.org](https://earthspecies.org) | Largest non-profit for animal language decoding | Strategic partner for core tech and data infrastructure |
| **Bioacoustic AI Consortium** | [bioacousticai.eu](https://bioacousticai.eu) | European research alliance: AI signal processing + hardware + ethology | Methodology reference and collaboration |

---

## 7. Licensing Compliance Matrix

### Commercial Use Status

| Resource | License | Commercial Use | Action Required |
|----------|---------|----------------|-----------------|
| NatureLM-audio | CC BY 4.0 | ✅ Allowed | Attribution required |
| Whisper Large-v3 | MIT | ✅ Allowed | None |
| LLaMA 3.1 | Meta Custom | ✅ Allowed (with compliance) | Accept license terms |
| DogSpeak | CC-BY-NC-SA-4.0 | ❌ Not allowed | Use for research/evaluation only |
| EmotionalCanines | Unknown | ⚠️ Verify | Contact authors |
| Dolph2Vec Dataset | CC BY 4.0 | ✅ Allowed | Attribution required |
| MegaDetector-Acoustic | MIT | ✅ Allowed | None |
| BEATs | MIT | ✅ Allowed | None |

### PetJanu Data Strategy

1. **Registry Requirement**: All datasets must be logged in `PetJanu Dataset Registry` with:
   - Source URL
   - License type
   - Commercial use flag
   - Attribution requirements
   - Date ingested

2. **Proprietary Data Collection**: 
   - Collect user interaction data with explicit consent
   - Build commercial moat through unique PetJanu dataset
   - Enable future model fine-tuning with owned data

---

## 8. Key Insights & Differentiation Opportunities

### ✅ Major Advantages

1. **NatureLM-audio is now commercially viable** (CC BY 4.0)
2. **Google entering bioacoustics space** with DolphinGemma and Perch 2.0
3. **Microsoft contributing MIT-licensed models** (MegaDetector-Acoustic)
4. **Large-scale datasets emerging** (180K dolphin whistles, largest meerkat dataset)

### ⚠️ Critical Gaps

1. **No "Human Intent → Animal Vocalization" mapping exists** - This is PetJanu's core IP
2. **Dog2vec code unavailable** - Must contact authors or build alternative
3. **DogSpeak non-commercial** - Cannot use for commercial training

### 🎯 PetJanu's Unique Value Proposition

1. **Communication Engine**: Bridge human intent to species-specific acoustic patterns
2. **Feedback Loop**: Learn from real pet responses via user interactions
3. **Multi-species Architecture**: Start with dogs, extend to cats/birds using same framework
4. **Ethical Data Collection**: Build proprietary dataset with user consent

---

## 9. Next Steps

### Immediate Actions (Sprint 1)

- [ ] Set up PetJanu Dataset Registry (JSON/DB schema)
- [ ] Curate initial cue library (5-10 recordings per intent, legally cleared)
- [ ] Implement logging pipeline with Supabase
- [ ] License audit for all external resources

### Phase 2 (Post-MVP)

- [ ] Contact Dog2vec authors for code access
- [ ] Fine-tune NatureLM-audio on proprietary PetJanu data
- [ ] Build generative vocalization module (vocoder + acoustic templates)
- [ ] Expand to multi-species support

---

*Last Updated: 2025*
*Document Version: 1.0*
