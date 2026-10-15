"""
PetJanu Cue Library Manager

Manages the retrieval-based cue library for MVP.
Stores and indexes dog vocalization audio clips by intent, context, and acoustic features.

MVP Strategy: Use pre-recorded dog vocalizations (retrieval-based) instead of generation.
"""

import json
import hashlib
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime
import numpy as np


@dataclass
class AcousticFeatures:
    """Acoustic features of a vocalization clip"""
    duration_seconds: float
    mean_frequency_hz: float
    max_frequency_hz: float
    min_frequency_hz: float
    mean_pitch: float
    energy_level: float  # 0.0 - 1.0
    spectral_centroid: float
    
    def to_dict(self) -> Dict:
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'AcousticFeatures':
        return cls(**data)


@dataclass
class CueClip:
    """Represents a single cue clip in the library"""
    clip_id: str
    file_path: str
    intent: str  # e.g., "COME_HERE", "STOP", "PLAY"
    species: str  # "dog", "cat", etc.
    breed: Optional[str]
    age_category: str  # "puppy", "adult", "senior"
    emotional_context: str  # "excited", "calm", "urgent", "playful"
    recording_source: str  # Source of the recording
    license_type: str
    acoustic_features: AcousticFeatures
    metadata: Dict[str, Any] = None
    created_at: str = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()
    
    def to_dict(self) -> Dict:
        data = asdict(self)
        data['acoustic_features'] = self.acoustic_features.to_dict()
        return data
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'CueClip':
        data['acoustic_features'] = AcousticFeatures.from_dict(data['acoustic_features'])
        return cls(**data)


class CueLibrary:
    """
    Retrieval-based cue library for PetJanu MVP.
    
    Stores pre-recorded animal vocalizations indexed by:
    - Intent (COME_HERE, STOP, PLAY, etc.)
    - Species
    - Emotional context
    - Acoustic features
    
    For MVP: Simple keyword-based retrieval.
    Future: FAISS-based semantic search over acoustic embeddings.
    """
    
    def __init__(self, library_file: Optional[str] = None):
        """
        Initialize the cue library.
        
        Args:
            library_file: Path to JSON file for persistence
        """
        self.clips: Dict[str, CueClip] = {}
        self.library_file = Path(library_file) if library_file else None
        
        # Index by intent for fast retrieval
        self.intent_index: Dict[str, List[str]] = {}
        self.species_index: Dict[str, List[str]] = {}
        
        if self.library_file and self.library_file.exists():
            self.load()
    
    def add_clip(self, clip: CueClip) -> None:
        """
        Add a clip to the library.
        
        Args:
            clip: CueClip object
        """
        self.clips[clip.clip_id] = clip
        
        # Update indices
        if clip.intent not in self.intent_index:
            self.intent_index[clip.intent] = []
        self.intent_index[clip.intent].append(clip.clip_id)
        
        if clip.species not in self.species_index:
            self.species_index[clip.species] = []
        self.species_index[clip.species].append(clip.clip_id)
        
        self.save()
    
    def get_clip(self, clip_id: str) -> Optional[CueClip]:
        """Get a clip by ID"""
        return self.clips.get(clip_id)
    
    def retrieve_by_intent(
        self,
        intent: str,
        species: str = "dog",
        emotional_context: Optional[str] = None,
        limit: int = 5
    ) -> List[CueClip]:
        """
        Retrieve clips matching intent and optional filters.
        
        Args:
            intent: Target intent (e.g., "COME_HERE")
            species: Species filter (default: "dog")
            emotional_context: Optional emotional context filter
            limit: Maximum number of clips to return
        
        Returns:
            List of matching CueClip objects, sorted by relevance
        """
        # Get candidate clips by intent
        candidate_ids = self.intent_index.get(intent, [])
        
        if not candidate_ids:
            return []
        
        # Filter by species
        candidates = [
            self.clips[clip_id]
            for clip_id in candidate_ids
            if self.clips[clip_id].species == species
        ]
        
        # Filter by emotional context if specified
        if emotional_context:
            candidates = [
                c for c in candidates
                if c.emotional_context == emotional_context
            ]
        
        # Sort by acoustic features (future: use embedding similarity)
        # For now, just return first N clips
        return candidates[:limit]
    
    def get_all_intents(self) -> List[str]:
        """List all intents in the library"""
        return list(self.intent_index.keys())
    
    def get_library_stats(self) -> Dict:
        """Get statistics about the library"""
        stats = {
            "total_clips": len(self.clips),
            "clips_by_intent": {},
            "clips_by_species": {},
            "clips_by_emotion": {}
        }
        
        for intent, clip_ids in self.intent_index.items():
            stats["clips_by_intent"][intent] = len(clip_ids)
        
        for species, clip_ids in self.species_index.items():
            stats["clips_by_species"][species] = len(clip_ids)
        
        emotion_counts = {}
        for clip in self.clips.values():
            emotion = clip.emotional_context
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
        stats["clips_by_emotion"] = emotion_counts
        
        return stats
    
    def save(self) -> None:
        """Save library to JSON file"""
        if not self.library_file:
            return
        
        data = {
            "version": "1.0",
            "last_updated": datetime.now().isoformat(),
            "clips": {
                clip_id: clip.to_dict()
                for clip_id, clip in self.clips.items()
            },
            "indices": {
                "intent": self.intent_index,
                "species": self.species_index
            }
        }
        
        self.library_file.parent.mkdir(parents=True, exist_ok=True)
        with open(self.library_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def load(self) -> None:
        """Load library from JSON file"""
        if not self.library_file or not self.library_file.exists():
            raise FileNotFoundError(f"Library file not found: {self.library_file}")
        
        with open(self.library_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        self.clips = {
            clip_id: CueClip.from_dict(clip_data)
            for clip_id, clip_data in data['clips'].items()
        }
        
        self.intent_index = data['indices']['intent']
        self.species_index = data['indices']['species']
    
    def export_catalog(self) -> str:
        """Export library catalog as Markdown"""
        if not self.clips:
            return "No clips in library."
        
        lines = ["# PetJanu Cue Library Catalog", ""]
        
        stats = self.get_library_stats()
        lines.append(f"**Total Clips:** {stats['total_clips']}")
        lines.append("")
        
        lines.append("## Clips by Intent")
        lines.append("")
        
        for intent, clip_ids in sorted(self.intent_index.items()):
            lines.append(f"### {intent} ({len(clip_ids)} clips)")
            lines.append("")
            
            for clip_id in clip_ids[:5]:  # Show first 5
                clip = self.clips[clip_id]
                features = clip.acoustic_features
                lines.append(
                    f"- **{clip_id}**: {clip.breed or 'Unknown'} ({clip.age_category}), "
                    f"{clip.emotional_context}, {features.duration_seconds:.2f}s"
                )
            
            if len(clip_ids) > 5:
                lines.append(f"- ... and {len(clip_ids) - 5} more")
            
            lines.append("")
        
        return "\n".join(lines)


def generate_clip_id(file_path: str, intent: str) -> str:
    """Generate unique clip ID from file path and intent"""
    hash_input = f"{file_path}:{intent}:{datetime.now().isoformat()}"
    return hashlib.md5(hash_input.encode()).hexdigest()[:12]


def initialize_sample_library() -> CueLibrary:
    """
    Initialize library with sample entries for testing.
    
    In production, these would be real audio files with verified licenses.
    """
    library = CueLibrary()
    
    # Sample clips for MVP intents (simulated entries)
    sample_clips = [
        CueClip(
            clip_id="cue_001",
            file_path="data/cue_library/dog_come_here_excited_01.wav",
            intent="COME_HERE",
            species="dog",
            breed="Golden Retriever",
            age_category="adult",
            emotional_context="excited",
            recording_source="User recording (consent obtained)",
            license_type="Proprietary",
            acoustic_features=AcousticFeatures(
                duration_seconds=1.2,
                mean_frequency_hz=450,
                max_frequency_hz=1200,
                min_frequency_hz=200,
                mean_pitch=0.65,
                energy_level=0.8,
                spectral_centroid=800
            )
        ),
        CueClip(
            clip_id="cue_002",
            file_path="data/cue_library/dog_come_here_playful_01.wav",
            intent="COME_HERE",
            species="dog",
            breed="Labrador",
            age_category="adult",
            emotional_context="playful",
            recording_source="User recording (consent obtained)",
            license_type="Proprietary",
            acoustic_features=AcousticFeatures(
                duration_seconds=0.9,
                mean_frequency_hz=520,
                max_frequency_hz=1400,
                min_frequency_hz=250,
                mean_pitch=0.7,
                energy_level=0.75,
                spectral_centroid=850
            )
        ),
        CueClip(
            clip_id="cue_003",
            file_path="data/cue_library/dog_stop_sharp_01.wav",
            intent="STOP",
            species="dog",
            breed="German Shepherd",
            age_category="adult",
            emotional_context="urgent",
            recording_source="User recording (consent obtained)",
            license_type="Proprietary",
            acoustic_features=AcousticFeatures(
                duration_seconds=0.6,
                mean_frequency_hz=380,
                max_frequency_hz=900,
                min_frequency_hz=180,
                mean_pitch=0.5,
                energy_level=0.9,
                spectral_centroid=650
            )
        ),
        CueClip(
            clip_id="cue_004",
            file_path="data/cue_library/dog_play_bark_01.wav",
            intent="PLAY",
            species="dog",
            breed="Beagle",
            age_category="adult",
            emotional_context="playful",
            recording_source="User recording (consent obtained)",
            license_type="Proprietary",
            acoustic_features=AcousticFeatures(
                duration_seconds=1.5,
                mean_frequency_hz=600,
                max_frequency_hz=1500,
                min_frequency_hz=300,
                mean_pitch=0.75,
                energy_level=0.85,
                spectral_centroid=950
            )
        ),
    ]
    
    for clip in sample_clips:
        library.add_clip(clip)
    
    return library


if __name__ == "__main__":
    # Example usage
    library = initialize_sample_library()
    
    print("=" * 80)
    print("PetJanu Cue Library")
    print("=" * 80)
    print()
    
    stats = library.get_library_stats()
    print(f"Total Clips: {stats['total_clips']}")
    print(f"Clips by Intent: {stats['clips_by_intent']}")
    print(f"Clips by Species: {stats['clips_by_species']}")
    print()
    
    print("-" * 80)
    print("Retrieval Test: COME_HERE (dog, excited)")
    print("-" * 80)
    
    results = library.retrieve_by_intent("COME_HERE", species="dog", emotional_context="excited")
    for clip in results:
        print(f"  - {clip.clip_id}: {clip.breed} ({clip.emotional_context})")
    
    print()
    print("-" * 80)
    print("Library Catalog Export")
    print("-" * 80)
    print(library.export_catalog())
    
    # Save to file
    library.library_file = Path("data/cue_library/cue_library.json")
    library.save()
    print(f"\nLibrary saved to: {library.library_file}")
