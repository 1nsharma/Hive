"""
PetJanu Feedback Pipeline

Captures and logs user-pet interactions for future model improvement.
Implements the data collection strategy for building proprietary PetJanu dataset.

Key Components:
- Interaction logging (command → cue → pet response → outcome)
- User feedback collection (thumbs up/down)
- Pet response analysis hooks (for automated behavior detection)
- Privacy-compliant data storage with user consent tracking
"""

import json
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime
from enum import Enum


class PetResponseType(Enum):
    """Classified pet response types"""
    OBEYED = "obeyed"  # Pet performed expected behavior
    IGNORED = "ignored"  # No response
    CONFUSED = "confused"  # Hesitant or partial response
    STRESSED = "stressed"  # Signs of stress/anxiety
    EXCITED = "excited"  # Positive excitement
    UNKNOWN = "unknown"


class UserFeedbackType(Enum):
    """User feedback types"""
    THUMBS_UP = "thumbs_up"
    THUMBS_DOWN = "thumbs_down"
    NEUTRAL = "neutral"


@dataclass
class InteractionLog:
    """Represents a single user-pet interaction"""
    interaction_id: str
    user_id: str
    pet_id: str
    timestamp: str
    
    # Input
    command_text: str  # Original human command
    intent: str  # Extracted intent
    species: str
    pet_profile: Dict[str, Any]  # breed, age, personality, etc.
    
    # Output
    cue_clip_id: str  # Selected cue from library
    cue_played: bool  # Whether cue was successfully played
    
    # Response
    pet_response_type: PetResponseType
    pet_response_description: str  # Human description of response
    pet_audio_recording: Optional[str]  # Path to recorded pet vocalization
    pet_video_recording: Optional[str]  # Path to recorded video (optional)
    
    # Feedback
    user_feedback: Optional[UserFeedbackType]
    user_notes: Optional[str]
    
    # Metadata
    context: Dict[str, Any] = None  # time, location, emotional state, etc.
    created_at: str = None
    
    def __post_init__(self):
        if self.context is None:
            self.context = {}
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()
    
    def to_dict(self) -> Dict:
        data = asdict(self)
        data['pet_response_type'] = self.pet_response_type.value
        if self.user_feedback:
            data['user_feedback'] = self.user_feedback.value
        return data
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'InteractionLog':
        data['pet_response_type'] = PetResponseType(data['pet_response_type'])
        if data.get('user_feedback'):
            data['user_feedback'] = UserFeedbackType(data['user_feedback'])
        return cls(**data)


@dataclass
class ConsentRecord:
    """User consent for data collection"""
    user_id: str
    consent_given: bool
    consent_timestamp: str
    data_usage_scope: List[str]  # e.g., ["model_improvement", "research"]
    can_share_anonymized: bool
    withdrawal_request: bool = False
    withdrawal_timestamp: Optional[str] = None
    
    def to_dict(self) -> Dict:
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'ConsentRecord':
        return cls(**data)


class FeedbackPipeline:
    """
    Manages the feedback loop for PetJanu.
    
    Collects:
    - User commands and intents
    - Generated cues
    - Pet responses (audio/video/behavior classification)
    - User feedback
    
    This data will be used for:
    - Model improvement (RLHF-style preference learning)
    - Individual pet customization
    - Species-specific pattern discovery
    """
    
    def __init__(self, data_dir: str = "data/interactions"):
        """
        Initialize feedback pipeline.
        
        Args:
            data_dir: Directory for storing interaction logs
        """
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        
        self.interactions_file = self.data_dir / "interactions.jsonl"
        self.consent_file = self.data_dir / "consent_records.json"
        
        # Load existing consent records
        self.consent_records: Dict[str, ConsentRecord] = {}
        if self.consent_file.exists():
            self._load_consent()
    
    def log_interaction(self, interaction: InteractionLog) -> None:
        """
        Log a single interaction.
        
        Args:
            interaction: InteractionLog object
        """
        # Check consent
        consent = self.consent_records.get(interaction.user_id)
        if not consent or not consent.consent_given or consent.withdrawal_request:
            raise PermissionError(
                f"User {interaction.user_id} has not given consent or has withdrawn"
            )
        
        # Append to JSONL file
        with open(self.interactions_file, 'a', encoding='utf-8') as f:
            json.dump(interaction.to_dict(), f, ensure_ascii=False)
            f.write('\n')
    
    def record_user_feedback(
        self,
        interaction_id: str,
        feedback: UserFeedbackType,
        notes: Optional[str] = None
    ) -> None:
        """
        Update an interaction with user feedback.
        
        Args:
            interaction_id: ID of the interaction to update
            feedback: User feedback type
            notes: Optional user notes
        """
        # Find and update interaction
        interactions = self.load_interactions()
        updated = False
        
        for i, interaction in enumerate(interactions):
            if interaction.interaction_id == interaction_id:
                interaction.user_feedback = feedback
                interaction.user_notes = notes
                interactions[i] = interaction
                updated = True
                break
        
        if not updated:
            raise ValueError(f"Interaction {interaction_id} not found")
        
        # Rewrite file
        with open(self.interactions_file, 'w', encoding='utf-8') as f:
            for interaction in interactions:
                json.dump(interaction.to_dict(), f, ensure_ascii=False)
                f.write('\n')
    
    def classify_pet_response(
        self,
        audio_path: Optional[str] = None,
        video_path: Optional[str] = None,
        user_description: Optional[str] = None
    ) -> PetResponseType:
        """
        Classify pet response using available signals.
        
        MVP: Simple rule-based classification from user description.
        Future: Automated behavior detection from audio/video.
        
        Args:
            audio_path: Path to pet vocalization recording
            video_path: Path to video recording
            user_description: Human description of pet's behavior
        
        Returns:
            PetResponseType classification
        """
        # MVP: Use keywords in user description
        if user_description:
            desc_lower = user_description.lower()
            
            if any(word in desc_lower for word in ['came', 'obeyed', 'did it', 'worked']):
                return PetResponseType.OBEYED
            elif any(word in desc_lower for word in ['ignored', 'no response', 'nothing']):
                return PetResponseType.IGNORED
            elif any(word in desc_lower for word in ['confused', 'hesitant', 'unsure']):
                return PetResponseType.CONFUSED
            elif any(word in desc_lower for word in ['stressed', 'scared', 'anxious']):
                return PetResponseType.STRESSED
            elif any(word in desc_lower for word in ['excited', 'happy', 'enthusiastic']):
                return PetResponseType.EXCITED
        
        return PetResponseType.UNKNOWN
    
    def give_consent(
        self,
        user_id: str,
        data_usage_scope: List[str],
        can_share_anonymized: bool = True
    ) -> ConsentRecord:
        """
        Record user consent for data collection.
        
        Args:
            user_id: User identifier
            data_usage_scope: List of allowed uses
            can_share_anonymized: Whether anonymized data can be shared
        
        Returns:
            ConsentRecord object
        """
        consent = ConsentRecord(
            user_id=user_id,
            consent_given=True,
            consent_timestamp=datetime.now().isoformat(),
            data_usage_scope=data_usage_scope,
            can_share_anonymized=can_share_anonymized
        )
        
        self.consent_records[user_id] = consent
        self._save_consent()
        
        return consent
    
    def withdraw_consent(self, user_id: str) -> None:
        """
        User withdraws consent for data collection.
        
        Args:
            user_id: User identifier
        """
        if user_id in self.consent_records:
            self.consent_records[user_id].withdrawal_request = True
            self.consent_records[user_id].withdrawal_timestamp = datetime.now().isoformat()
            self._save_consent()
    
    def load_interactions(
        self,
        user_id: Optional[str] = None,
        intent: Optional[str] = None,
        response_type: Optional[PetResponseType] = None
    ) -> List[InteractionLog]:
        """
        Load interactions with optional filters.
        
        Args:
            user_id: Filter by user
            intent: Filter by intent
            response_type: Filter by pet response type
        
        Returns:
            List of InteractionLog objects
        """
        if not self.interactions_file.exists():
            return []
        
        interactions = []
        with open(self.interactions_file, 'r', encoding='utf-8') as f:
            for line in f:
                data = json.loads(line.strip())
                
                # Apply filters
                if user_id and data['user_id'] != user_id:
                    continue
                if intent and data['intent'] != intent:
                    continue
                if response_type and data['pet_response_type'] != response_type.value:
                    continue
                
                interactions.append(InteractionLog.from_dict(data))
        
        return interactions
    
    def get_statistics(self) -> Dict:
        """
        Generate statistics from collected interactions.
        
        Returns:
            Dictionary with summary statistics
        """
        interactions = self.load_interactions()
        
        if not interactions:
            return {"total_interactions": 0}
        
        stats = {
            "total_interactions": len(interactions),
            "by_intent": {},
            "by_response_type": {},
            "by_user_feedback": {},
            "success_rate": 0.0
        }
        
        # Count by intent
        for interaction in interactions:
            intent = interaction.intent
            stats["by_intent"][intent] = stats["by_intent"].get(intent, 0) + 1
            
            response = interaction.pet_response_type.value
            stats["by_response_type"][response] = stats["by_response_type"].get(response, 0) + 1
            
            if interaction.user_feedback:
                feedback = interaction.user_feedback.value
                stats["by_user_feedback"][feedback] = stats["by_user_feedback"].get(feedback, 0) + 1
        
        # Calculate success rate (obeys / total)
        obeyed_count = stats["by_response_type"].get("obeyed", 0)
        stats["success_rate"] = obeyed_count / len(interactions) if interactions else 0.0
        
        return stats
    
    def export_for_training(
        self,
        output_file: str,
        anonymize: bool = True
    ) -> int:
        """
        Export interactions for model training.
        
        Args:
            output_file: Path to output JSONL file
            anonymize: Whether to remove PII
        
        Returns:
            Number of interactions exported
        """
        interactions = self.load_interactions()
        count = 0
        
        with open(output_file, 'w', encoding='utf-8') as f:
            for interaction in interactions:
                # Skip if user withdrew consent
                consent = self.consent_records.get(interaction.user_id)
                if not consent or consent.withdrawal_request:
                    continue
                
                data = interaction.to_dict()
                
                if anonymize:
                    data['user_id'] = hashlib_sha256(data['user_id'])[:8]
                    data['pet_id'] = hashlib_sha256(data['pet_id'])[:8]
                
                json.dump(data, f, ensure_ascii=False)
                f.write('\n')
                count += 1
        
        return count
    
    def _save_consent(self) -> None:
        """Save consent records to file"""
        data = {
            user_id: record.to_dict()
            for user_id, record in self.consent_records.items()
        }
        
        with open(self.consent_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def _load_consent(self) -> None:
        """Load consent records from file"""
        with open(self.consent_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        self.consent_records = {
            user_id: ConsentRecord.from_dict(record)
            for user_id, record in data.items()
        }


def hashlib_sha256(text: str) -> str:
    """Helper function for anonymization"""
    import hashlib
    return hashlib.sha256(text.encode()).hexdigest()


def generate_interaction_id(user_id: str, timestamp: str) -> str:
    """Generate unique interaction ID"""
    return hashlib_sha256(f"{user_id}:{timestamp}")[:16]


if __name__ == "__main__":
    # Example usage
    pipeline = FeedbackPipeline()
    
    print("=" * 80)
    print("PetJanu Feedback Pipeline")
    print("=" * 80)
    print()
    
    # Simulate user consent
    print("1. Recording user consent...")
    consent = pipeline.give_consent(
        user_id="user_001",
        data_usage_scope=["model_improvement", "research"],
        can_share_anonymized=True
    )
    print(f"   Consent recorded for {consent.user_id}")
    print()
    
    # Simulate interaction
    print("2. Logging interaction...")
    interaction = InteractionLog(
        interaction_id=generate_interaction_id("user_001", datetime.now().isoformat()),
        user_id="user_001",
        pet_id="pet_001",
        timestamp=datetime.now().isoformat(),
        command_text="Come here buddy!",
        intent="COME_HERE",
        species="dog",
        pet_profile={
            "breed": "Golden Retriever",
            "age": 3,
            "personality": "friendly"
        },
        cue_clip_id="cue_001",
        cue_played=True,
        pet_response_type=PetResponseType.OBEYED,
        pet_response_description="Dog immediately came running",
        pet_audio_recording=None,
        pet_video_recording=None,
        user_feedback=UserFeedbackType.THUMBS_UP,
        user_notes="Worked perfectly!",
        context={
            "location": "backyard",
            "time_of_day": "morning"
        }
    )
    
    pipeline.log_interaction(interaction)
    print(f"   Interaction logged: {interaction.interaction_id}")
    print()
    
    # Get statistics
    print("3. Pipeline Statistics:")
    stats = pipeline.get_statistics()
    print(f"   Total Interactions: {stats['total_interactions']}")
    print(f"   Success Rate: {stats['success_rate']:.1%}")
    print(f"   By Intent: {stats['by_intent']}")
    print(f"   By Response: {stats['by_response_type']}")
    print()
    
    # Export for training
    output_file = pipeline.data_dir / "training_export.jsonl"
    count = pipeline.export_for_training(str(output_file), anonymize=True)
    print(f"4. Exported {count} interactions for training (anonymized)")
    print(f"   Saved to: {output_file}")
