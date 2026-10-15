"""
PetJanu Communication Layer - Intent Engine Module

This module handles the classification of human natural language input
into predefined intents for the PetJanu Communication Layer.

Initial implementation: Rule-based classifier with embedding similarity
Future enhancement: Fine-tuned DistilBERT or small transformer
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import json


@dataclass
class Intent:
    """Represents a classified intent with metadata."""
    intent_id: str
    category: str
    priority: str
    urgency_level: int
    confidence: float
    matched_phrase: str
    language: str


@dataclass
class AcousticTemplate:
    """Acoustic parameters for generating species-specific vocalizations."""
    base_frequency_hz: float
    frequency_modulation: str  # 'rising', 'falling', 'steady', 'oscillating'
    duration_ms: int
    amplitude_profile: str  # 'steady', 'fade_in', 'fade_out', 'pulsed'
    harmonic_structure: str  # 'simple', 'complex', 'rich'
    vocalization_type: str  # 'bark', 'meow', 'whine', 'growl', etc.


class IntentEngine:
    """
    Rule-based Intent Engine with embedding similarity matching.
    
    This engine maps natural language phrases to predefined intents
    using a combination of:
    1. Exact phrase matching (fast path)
    2. Keyword-based matching (fallback)
    3. Embedding similarity (future enhancement)
    """
    
    def __init__(self):
        self.intents = self._load_intent_definitions()
        self.phrase_to_intent = self._build_phrase_index()
        
    def _load_intent_definitions(self) -> Dict[str, dict]:
        """Load predefined intent definitions."""
        return {
            # Basic Commands
            "COME_HERE": {
                "category": "basic_command",
                "priority": "normal",
                "urgency_level": 1,
                "phrases": {
                    "en": ["come here", "come on", "come", "aao", "come boy", "come girl"],
                    "hi": ["आओ", "इधर आओ", "पास आओ"]
                },
                "acoustic_template": {
                    "base_frequency_hz": 450,
                    "frequency_modulation": "rising",
                    "duration_ms": 800,
                    "amplitude_profile": "steady",
                    "harmonic_structure": "simple",
                    "vocalization_type": "bark"
                }
            },
            "STOP": {
                "category": "basic_command",
                "priority": "high",
                "urgency_level": 3,
                "phrases": {
                    "en": ["stop", "don't do that", "no", "rukho", "wait", "hold it"],
                    "hi": ["रुको", "नहीं", "बस", "मत करो"]
                },
                "acoustic_template": {
                    "base_frequency_hz": 300,
                    "frequency_modulation": "falling",
                    "duration_ms": 600,
                    "amplitude_profile": "steady",
                    "harmonic_structure": "simple",
                    "vocalization_type": "growl"
                }
            },
            "SIT": {
                "category": "basic_command",
                "priority": "normal",
                "urgency_level": 1,
                "phrases": {
                    "en": ["sit", "sit down", "baitho", "take a seat"],
                    "hi": ["बैठो", "बैठ जाओ"]
                },
                "acoustic_template": {
                    "base_frequency_hz": 400,
                    "frequency_modulation": "steady",
                    "duration_ms": 700,
                    "amplitude_profile": "steady",
                    "harmonic_structure": "simple",
                    "vocalization_type": "bark"
                }
            },
            "STAY": {
                "category": "basic_command",
                "priority": "normal",
                "urgency_level": 2,
                "phrases": {
                    "en": ["stay", "wait here", "thehro", "don't move", "hold"],
                    "hi": ["ठहरो", "यहीं रुको", "मत हिलो"]
                },
                "acoustic_template": {
                    "base_frequency_hz": 350,
                    "frequency_modulation": "steady",
                    "duration_ms": 900,
                    "amplitude_profile": "fade_out",
                    "harmonic_structure": "simple",
                    "vocalization_type": "whine"
                }
            },
            "LIE_DOWN": {
                "category": "basic_command",
                "priority": "normal",
                "urgency_level": 1,
                "phrases": {
                    "en": ["lie down", "let jao", "down", "lay down", "get down"],
                    "hi": ["लेट जाओ", "नीचे लेटो"]
                },
                "acoustic_template": {
                    "base_frequency_hz": 380,
                    "frequency_modulation": "falling",
                    "duration_ms": 750,
                    "amplitude_profile": "fade_out",
                    "harmonic_structure": "simple",
                    "vocalization_type": "whine"
                }
            },
            "HEEL": {
                "category": "basic_command",
                "priority": "normal",
                "urgency_level": 1,
                "phrases": {
                    "en": ["heel", "walk close", "saath chalo", "by my side", "close"],
                    "hi": ["साथ चलो", "पास रहो"]
                },
                "acoustic_template": {
                    "base_frequency_hz": 420,
                    "frequency_modulation": "oscillating",
                    "duration_ms": 650,
                    "amplitude_profile": "pulsed",
                    "harmonic_structure": "simple",
                    "vocalization_type": "bark"
                }
            },
            
            # Affection & Positive Reinforcement
            "GOOD_BOY_GIRL": {
                "category": "affection",
                "priority": "low",
                "urgency_level": 1,
                "phrases": {
                    "en": ["good boy", "good girl", "shabash", "well done", "good dog", "good kitty"],
                    "hi": ["शाबाश", "अच्छा लड़का", "अच्छी लड़की", "वाह"]
                },
                "acoustic_template": {
                    "base_frequency_hz": 550,
                    "frequency_modulation": "rising",
                    "duration_ms": 500,
                    "amplitude_profile": "steady",
                    "harmonic_structure": "rich",
                    "vocalization_type": "whine"
                }
            },
            "AFFECTION": {
                "category": "affection",
                "priority": "low",
                "urgency_level": 1,
                "phrases": {
                    "en": ["i love you", "pyar", "come cuddle", "love you", "you're loved"],
                    "hi": ["मैं तुमसे प्यार करता हूँ", "प्यार", "आओ गले लगें"]
                },
                "acoustic_template": {
                    "base_frequency_hz": 500,
                    "frequency_modulation": "oscillating",
                    "duration_ms": 1000,
                    "amplitude_profile": "fade_in",
                    "harmonic_structure": "rich",
                    "vocalization_type": "purr"
                }
            },
            "TREAT_TIME": {
                "category": "affection",
                "priority": "normal",
                "urgency_level": 2,
                "phrases": {
                    "en": ["want treat", "snack time", "khaana", "treat", "cookie", "biscuit"],
                    "hi": ["ट्रीट चाहिए", "खाना", "स्नैक टाइम"]
                },
                "acoustic_template": {
                    "base_frequency_hz": 600,
                    "frequency_modulation": "rising",
                    "duration_ms": 400,
                    "amplitude_profile": "pulsed",
                    "harmonic_structure": "complex",
                    "vocalization_type": "chirp"
                }
            },
            
            # Safety & Urgency
            "DANGER_ALERT": {
                "category": "safety",
                "priority": "critical",
                "urgency_level": 5,
                "phrases": {
                    "en": ["danger", "bachke", "watch out", "be careful", "alert"],
                    "hi": ["खतरा", "बचके", "सावधान", "देखो"]
                },
                "acoustic_template": {
                    "base_frequency_hz": 800,
                    "frequency_modulation": "oscillating",
                    "duration_ms": 300,
                    "amplitude_profile": "pulsed",
                    "harmonic_structure": "complex",
                    "vocalization_type": "growl"
                }
            },
            "EMERGENCY_RETURN": {
                "category": "safety",
                "priority": "critical",
                "urgency_level": 5,
                "phrases": {
                    "en": ["come now", "jaldi aao", "emergency", "come immediately", "right now"],
                    "hi": ["जल्दी आओ", "तुरंत आओ", "इमरजेंसी"]
                },
                "acoustic_template": {
                    "base_frequency_hz": 700,
                    "frequency_modulation": "rising",
                    "duration_ms": 400,
                    "amplitude_profile": "steady",
                    "harmonic_structure": "complex",
                    "vocalization_type": "howl"
                }
            },
            "NO_BARK": {
                "category": "safety",
                "priority": "high",
                "urgency_level": 3,
                "phrases": {
                    "en": ["quiet", "chup", "stop barking", "enough", "be quiet", "hush"],
                    "hi": ["चुप", "शांत हो जाओ", "बस करो"]
                },
                "acoustic_template": {
                    "base_frequency_hz": 250,
                    "frequency_modulation": "falling",
                    "duration_ms": 800,
                    "amplitude_profile": "fade_out",
                    "harmonic_structure": "simple",
                    "vocalization_type": "growl"
                }
            },
            
            # Daily Routine
            "WALK_TIME": {
                "category": "routine",
                "priority": "normal",
                "urgency_level": 2,
                "phrases": {
                    "en": ["walk time", "ghumne chalein", "ready for walk", "let's go", "outside"],
                    "hi": ["घूमने चलें", "वॉक टाइम", "बाहर चलें"]
                },
                "acoustic_template": {
                    "base_frequency_hz": 520,
                    "frequency_modulation": "rising",
                    "duration_ms": 600,
                    "amplitude_profile": "pulsed",
                    "harmonic_structure": "complex",
                    "vocalization_type": "bark"
                }
            },
            "MEAL_TIME": {
                "category": "routine",
                "priority": "normal",
                "urgency_level": 2,
                "phrases": {
                    "en": ["food time", "khaana ready hai", "dinner", "breakfast", "meal time", "eating time"],
                    "hi": ["खाना तैयार है", "खाने का समय", "डिनर"]
                },
                "acoustic_template": {
                    "base_frequency_hz": 480,
                    "frequency_modulation": "oscillating",
                    "duration_ms": 700,
                    "amplitude_profile": "pulsed",
                    "harmonic_structure": "complex",
                    "vocalization_type": "whine"
                }
            },
            "BEDTIME": {
                "category": "routine",
                "priority": "low",
                "urgency_level": 1,
                "phrases": {
                    "en": ["sleep time", "sone chalo", "bed time", "go to sleep", "night night"],
                    "hi": ["सोने चलो", "बेड टाइम", "रात हो गई"]
                },
                "acoustic_template": {
                    "base_frequency_hz": 320,
                    "frequency_modulation": "falling",
                    "duration_ms": 1200,
                    "amplitude_profile": "fade_out",
                    "harmonic_structure": "simple",
                    "vocalization_type": "whine"
                }
            }
        }
    
    def _build_phrase_index(self) -> Dict[str, str]:
        """Build a reverse index from phrases to intent IDs."""
        phrase_index = {}
        for intent_id, intent_data in self.intents.items():
            for lang, phrases in intent_data["phrases"].items():
                for phrase in phrases:
                    phrase_index[phrase.lower()] = intent_id
        return phrase_index
    
    def classify(self, text: str, language: Optional[str] = None) -> Intent:
        """
        Classify input text into a predefined intent.
        
        Args:
            text: Input text (voice transcription or typed command)
            language: Optional language hint ('en' or 'hi')
            
        Returns:
            Intent object with classification results
        """
        # Normalize text: lowercase only (preserve Unicode characters for non-Latin scripts)
        text_normalized = text.strip().lower()
        
        # Fast path: exact phrase match
        if text_normalized in self.phrase_to_intent:
            intent_id = self.phrase_to_intent[text_normalized]
            intent_data = self.intents[intent_id]
            return Intent(
                intent_id=intent_id,
                category=intent_data["category"],
                priority=intent_data["priority"],
                urgency_level=intent_data["urgency_level"],
                confidence=1.0,
                matched_phrase=text_normalized,
                language=language or "en"
            )
        
        # Fallback: keyword-based matching
        best_match = self._keyword_match(text_normalized)
        if best_match:
            intent_id, confidence, matched_phrase = best_match
            intent_data = self.intents[intent_id]
            return Intent(
                intent_id=intent_id,
                category=intent_data["category"],
                priority=intent_data["priority"],
                urgency_level=intent_data["urgency_level"],
                confidence=confidence,
                matched_phrase=matched_phrase,
                language=language or "en"
            )
        
        # Default fallback: unknown intent
        return Intent(
            intent_id="UNKNOWN",
            category="unknown",
            priority="low",
            urgency_level=0,
            confidence=0.0,
            matched_phrase=text_normalized,
            language=language or "en"
        )
    
    def _keyword_match(self, text: str) -> Optional[Tuple[str, float, str]]:
        """
        Perform keyword-based matching as fallback.
        
        Returns:
            Tuple of (intent_id, confidence, matched_phrase) or None
        """
        keywords_found = []
        
        for intent_id, intent_data in self.intents.items():
            for lang, phrases in intent_data["phrases"].items():
                for phrase in phrases:
                    # Check if phrase keywords appear in input
                    phrase_words = set(phrase.lower().split())
                    text_words = set(text.split())
                    
                    # Calculate overlap
                    overlap = len(phrase_words & text_words)
                    if overlap > 0:
                        confidence = overlap / len(phrase_words)
                        if confidence > 0.5:  # Threshold
                            keywords_found.append((intent_id, confidence, phrase))
        
        if not keywords_found:
            return None
        
        # Return best match
        best = max(keywords_found, key=lambda x: x[1])
        return best
    
    def get_acoustic_template(self, intent_id: str, species: str = "dog") -> Optional[AcousticTemplate]:
        """
        Get acoustic template for an intent, adapted for species.
        
        Args:
            intent_id: The intent identifier
            species: Target species ('dog', 'cat', etc.)
            
        Returns:
            AcousticTemplate object or None if intent not found
        """
        if intent_id not in self.intents:
            return None
        
        intent_data = self.intents[intent_id]
        template = intent_data["acoustic_template"]
        
        # Species-specific adaptations (simplified for MVP)
        if species == "cat":
            # Adjust frequency range for cats (generally higher)
            adjusted_freq = template["base_frequency_hz"] * 1.3
            vocalization_map = {
                "bark": "meow",
                "growl": "hiss",
                "whine": "meow",
                "howl": "yowl",
                "chirp": "chirp",
                "purr": "purr"
            }
            vocalization_type = vocalization_map.get(template["vocalization_type"], "meow")
        else:
            # Default to dog
            adjusted_freq = template["base_frequency_hz"]
            vocalization_type = template["vocalization_type"]
        
        return AcousticTemplate(
            base_frequency_hz=adjusted_freq,
            frequency_modulation=template["frequency_modulation"],
            duration_ms=template["duration_ms"],
            amplitude_profile=template["amplitude_profile"],
            harmonic_structure=template["harmonic_structure"],
            vocalization_type=vocalization_type
        )
    
    def list_intents(self, category: Optional[str] = None) -> List[str]:
        """
        List all available intents, optionally filtered by category.
        
        Args:
            category: Optional category filter
            
        Returns:
            List of intent IDs
        """
        if category is None:
            return list(self.intents.keys())
        
        return [
            intent_id for intent_id, data in self.intents.items()
            if data["category"] == category
        ]
    
    def get_intent_info(self, intent_id: str) -> Optional[dict]:
        """
        Get detailed information about an intent.
        
        Args:
            intent_id: The intent identifier
            
        Returns:
            Dictionary with intent details or None if not found
        """
        if intent_id not in self.intents:
            return None
        
        return {
            "intent_id": intent_id,
            **self.intents[intent_id]
        }


# Example usage and testing
if __name__ == "__main__":
    engine = IntentEngine()
    
    # Test cases
    test_phrases = [
        ("Come here", "en"),
        ("आओ", "hi"),
        ("Sit down", "en"),
        ("Good boy!", "en"),
        ("Danger!", "en"),
        ("Walk time", "en"),
        ("Unknown phrase xyz", "en"),
    ]
    
    print("Intent Engine Test Results\n" + "="*50)
    for phrase, lang in test_phrases:
        intent = engine.classify(phrase, lang)
        print(f"\nInput: '{phrase}' ({lang})")
        print(f"  Intent: {intent.intent_id}")
        print(f"  Category: {intent.category}")
        print(f"  Confidence: {intent.confidence:.2f}")
        print(f"  Priority: {intent.priority}")
        
        # Get acoustic template
        template = engine.get_acoustic_template(intent.intent_id)
        if template:
            print(f"  Acoustic: {template.base_frequency_hz}Hz, {template.vocalization_type}, {template.duration_ms}ms")
