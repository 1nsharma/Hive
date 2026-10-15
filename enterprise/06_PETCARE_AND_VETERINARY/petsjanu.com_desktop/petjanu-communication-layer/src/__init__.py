"""
PetJanu Communication Layer - Core Module Exports

This module provides the main interface for the PetJanu Communication Layer,
integrating the Intent Engine with future components (Communication Layer,
Audio Generation, and Feedback Pipeline).
"""

from .intent_engine.intent_classifier import IntentEngine, Intent, AcousticTemplate
from typing import Optional, Dict, Any


class PetJanuCommunicationLayer:
    """
    Main interface for the PetJanu Communication Layer.
    
    This class orchestrates the flow from human input to species-specific
    acoustic output:
    
    1. Human Input (voice/text) → Intent Engine → Classified Intent
    2. Intent + Pet Profile + Context → Communication Layer → Acoustic Parameters
    3. Acoustic Parameters → Audio Generator → Waveform
    4. Pet Response → Feedback Pipeline → Model Updates
    
    Current Status: MVP (Intent Engine only)
    Future: Full integration with Communication Layer and Audio Generation
    """
    
    def __init__(self):
        """Initialize the Communication Layer with all required components."""
        self.intent_engine = IntentEngine()
        # TODO: Initialize Communication Layer (core IP)
        # TODO: Initialize Audio Generation Module (vocoder)
        # TODO: Initialize Feedback Pipeline
        
    def process_command(
        self,
        command: str,
        pet_profile: Optional[Dict[str, Any]] = None,
        context: Optional[Dict[str, Any]] = None,
        language: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Process a human command and generate species-specific acoustic output.
        
        Args:
            command: Human input (voice transcription or text)
            pet_profile: Pet information (species, breed, age, personality, etc.)
            context: Situational context (time, location, emotional state, etc.)
            language: Language hint ('en' or 'hi')
            
        Returns:
            Dictionary containing:
                - intent: Classified intent object
                - acoustic_template: Species-specific acoustic parameters
                - confidence: Classification confidence score
                - metadata: Additional processing information
        """
        # Default pet profile
        if pet_profile is None:
            pet_profile = {
                "species": "dog",
                "breed": "mixed",
                "age_years": 3,
                "personality": "average"
            }
        
        # Default context
        if context is None:
            context = {
                "time_of_day": "day",
                "location": "home",
                "emotional_state": "neutral"
            }
        
        # Step 1: Classify intent
        intent = self.intent_engine.classify(command, language)
        
        # Step 2: Get species-specific acoustic template
        species = pet_profile.get("species", "dog")
        acoustic_template = None
        
        if intent.intent_id != "UNKNOWN":
            acoustic_template = self.intent_engine.get_acoustic_template(
                intent.intent_id,
                species=species
            )
        
        # Step 3: Apply context-based adjustments (future enhancement)
        # TODO: Implement Communication Layer logic here
        # - Adjust acoustic parameters based on pet's personality
        # - Modify based on emotional state and context
        # - Apply individual pet preferences (learned over time)
        
        # Step 4: Generate audio (future enhancement)
        # TODO: Call Audio Generation Module
        # waveform = audio_generator.generate(acoustic_template)
        
        return {
            "intent": {
                "id": intent.intent_id,
                "category": intent.category,
                "priority": intent.priority,
                "urgency_level": intent.urgency_level,
                "confidence": intent.confidence,
                "matched_phrase": intent.matched_phrase,
                "language": intent.language
            },
            "acoustic_template": {
                "base_frequency_hz": acoustic_template.base_frequency_hz if acoustic_template else None,
                "frequency_modulation": acoustic_template.frequency_modulation if acoustic_template else None,
                "duration_ms": acoustic_template.duration_ms if acoustic_template else None,
                "amplitude_profile": acoustic_template.amplitude_profile if acoustic_template else None,
                "harmonic_structure": acoustic_template.harmonic_structure if acoustic_template else None,
                "vocalization_type": acoustic_template.vocalization_type if acoustic_template else None
            } if acoustic_template else None,
            "pet_profile": pet_profile,
            "context": context,
            "metadata": {
                "processing_status": "complete" if acoustic_template else "intent_only",
                "next_steps": [
                    "Implement Communication Layer for context-aware adjustments",
                    "Integrate Audio Generation Module (vocoder)",
                    "Add Feedback Pipeline for learning"
                ]
            }
        }
    
    def get_available_intents(self, category: Optional[str] = None) -> list:
        """
        Get list of available intents, optionally filtered by category.
        
        Args:
            category: Optional category filter
            
        Returns:
            List of intent IDs
        """
        return self.intent_engine.list_intents(category)
    
    def get_intent_details(self, intent_id: str) -> Optional[dict]:
        """
        Get detailed information about a specific intent.
        
        Args:
            intent_id: The intent identifier
            
        Returns:
            Dictionary with intent details or None if not found
        """
        return self.intent_engine.get_intent_info(intent_id)
    
    def log_interaction(
        self,
        command: str,
        intent_result: Dict[str, Any],
        pet_response: Optional[str] = None,
        user_feedback: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Log an interaction for future learning (placeholder for feedback pipeline).
        
        Args:
            command: Original human command
            intent_result: Result from process_command()
            pet_response: Observed pet behaviour (optional)
            user_feedback: User rating/feedback (optional)
            
        Returns:
            Interaction log entry
        """
        # TODO: Implement proper logging and feedback collection
        # TODO: Store in database for future model training
        # TODO: Trigger preference learning updates
        
        log_entry = {
            "timestamp": "TODO: add timestamp",
            "command": command,
            "intent": intent_result.get("intent", {}),
            "pet_response": pet_response,
            "user_feedback": user_feedback,
            "status": "logged_pending_implementation"
        }
        
        return log_entry


# Convenience function for quick testing
def create_communication_layer() -> PetJanuCommunicationLayer:
    """Factory function to create a new Communication Layer instance."""
    return PetJanuCommunicationLayer()


# Example usage and demonstration
if __name__ == "__main__":
    print("=" * 70)
    print("PetJanu Communication Layer - MVP Demonstration")
    print("=" * 70)
    
    # Initialize the communication layer
    comm_layer = PetJanuCommunicationLayer()
    
    # Test scenarios
    test_scenarios = [
        {
            "command": "Come here buddy!",
            "pet_profile": {"species": "dog", "breed": "labrador", "age_years": 2},
            "description": "Basic recall command for young dog"
        },
        {
            "command": "आओ",
            "pet_profile": {"species": "dog", "breed": "desi", "age_years": 5},
            "language": "hi",
            "description": "Hindi recall command for adult Indian dog"
        },
        {
            "command": "Good boy!",
            "pet_profile": {"species": "dog", "breed": "golden_retriever", "age_years": 4},
            "description": "Positive reinforcement"
        },
        {
            "command": "Danger! Watch out!",
            "pet_profile": {"species": "dog", "breed": "german_shepherd", "age_years": 3},
            "description": "Emergency safety alert"
        },
        {
            "command": "Walk time!",
            "pet_profile": {"species": "dog", "breed": "beagle", "age_years": 1},
            "description": "Routine activity for puppy"
        },
        {
            "command": "Sit down please",
            "pet_profile": {"species": "cat", "breed": "persian", "age_years": 3},
            "description": "Command for cat (note: species adaptation)"
        },
    ]
    
    for i, scenario in enumerate(test_scenarios, 1):
        print(f"\n{'='*70}")
        print(f"Scenario {i}: {scenario['description']}")
        print(f"{'='*70}")
        print(f"Command: '{scenario['command']}'")
        print(f"Pet: {scenario['pet_profile']['breed']} {scenario['pet_profile']['species']}, "
              f"{scenario['pet_profile']['age_years']} years old")
        
        # Extract language if provided
        language = scenario.get("language", None)
        
        # Process the command
        result = comm_layer.process_command(
            command=scenario["command"],
            pet_profile=scenario["pet_profile"],
            language=language
        )
        
        # Display results
        print(f"\n📋 Intent Classification:")
        print(f"   ID: {result['intent']['id']}")
        print(f"   Category: {result['intent']['category']}")
        print(f"   Priority: {result['intent']['priority']}")
        print(f"   Urgency Level: {result['intent']['urgency_level']}/5")
        print(f"   Confidence: {result['intent']['confidence']*100:.0f}%")
        print(f"   Matched Phrase: '{result['intent']['matched_phrase']}'")
        
        if result['acoustic_template']:
            print(f"\n🔊 Acoustic Template ({result['pet_profile']['species']}):")
            print(f"   Vocalization Type: {result['acoustic_template']['vocalization_type']}")
            print(f"   Base Frequency: {result['acoustic_template']['base_frequency_hz']} Hz")
            print(f"   Duration: {result['acoustic_template']['duration_ms']} ms")
            print(f"   Frequency Modulation: {result['acoustic_template']['frequency_modulation']}")
            print(f"   Amplitude Profile: {result['acoustic_template']['amplitude_profile']}")
            print(f"   Harmonic Structure: {result['acoustic_template']['harmonic_structure']}")
        else:
            print(f"\n⚠️  No acoustic template generated (unknown intent)")
        
        print(f"\n📝 Metadata:")
        print(f"   Status: {result['metadata']['processing_status']}")
    
    # Summary
    print(f"\n{'='*70}")
    print("MVP Feature Summary")
    print(f"{'='*70}")
    print("✅ Intent Engine: Rule-based classification with multilingual support")
    print("✅ Acoustic Templates: Species-specific parameter generation")
    print("✅ Pet Profiles: Basic species/breed/age handling")
    print("🔜 Communication Layer: Context-aware adjustments (pending)")
    print("🔜 Audio Generation: Vocoder integration (pending)")
    print("🔜 Feedback Pipeline: Learning from interactions (pending)")
    print(f"\nFor full documentation, see ARCHITECTURE.md and INTENT_SET.md")
    print(f"{'='*70}\n")
