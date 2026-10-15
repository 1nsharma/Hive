"""
PetJanu Communication Layer - Pet Response Analysis Module (Phase 3)

This module analyzes pet responses to generated cues using:
1. Audio analysis (NatureLM-audio, BEATs embeddings)
2. Video/pose analysis (optional future integration)
3. Behavioral classification

The goal is to measure:
- Pet Response Rate: Did the pet respond to the cue?
- Response Quality: Was the response appropriate?
- Emotional State: Was the pet stressed, excited, calm?
"""

from typing import Dict, Any, Optional, List
import numpy as np
from dataclasses import dataclass
import warnings

# Try to import optional dependencies
try:
    import torch
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

try:
    from transformers import AutoModel, AutoProcessor
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False


@dataclass
class PetResponse:
    """Represents analyzed pet response."""
    response_detected: bool
    response_type: str  # 'approach', 'vocalize', 'ignore', 'avoid', 'play'
    confidence: float
    emotional_state: Optional[str]  # 'excited', 'calm', 'stressed', 'neutral'
    latency_ms: Optional[float]  # Response latency
    audio_features: Optional[Dict[str, Any]]
    metadata: Dict[str, Any]


class PetResponseAnalyzer:
    """
    Analyzes pet responses to generated cues.
    
    Uses audio analysis to detect:
    - Vocalizations (barks, meows, whines)
    - Movement sounds (approaching, retreating)
    - Emotional indicators (stress vocalizations, excitement)
    """
    
    def __init__(self, model_name: str = 'mock', species: str = 'dog'):
        """
        Initialize response analyzer.
        
        Args:
            model_name: Model to use ('mock', 'beats', 'naturelm')
            species: Target species ('dog', 'cat', 'bird')
        """
        self.model_name = model_name
        self.species = species
        self.model = None
        self.processor = None
        
        if model_name == 'beats' and TRANSFORMERS_AVAILABLE and TORCH_AVAILABLE:
            try:
                print(f"Loading BEATs model...")
                self.model = AutoModel.from_pretrained("microsoft/beats")
                self.processor = AutoProcessor.from_pretrained("microsoft/beats")
                print("✅ BEATs model loaded")
            except Exception as e:
                print(f"⚠️  Failed to load BEATs: {e}")
                print("Falling back to mock mode")
                self.model_name = 'mock'
        elif model_name == 'naturelm':
            print("⚠️  NatureLM-audio requires manual setup. Using mock mode.")
            self.model_name = 'mock'
        else:
            print("ℹ️  Using mock response analyzer for testing")
    
    def analyze_audio(self, audio_data: np.ndarray, 
                      sample_rate: int = 16000,
                      cue_intent: str = 'UNKNOWN',
                      timestamp_ms: float = 0) -> PetResponse:
        """
        Analyze pet audio response.
        
        Args:
            audio_data: Pet vocalization audio as numpy array
            sample_rate: Sample rate of audio
            cue_intent: The intent that was sent (for context)
            timestamp_ms: Time since cue was played
            
        Returns:
            PetResponse object with analysis results
        """
        if self.model_name in ['beats', 'naturelm'] and self.model is not None:
            return self._analyze_with_model(audio_data, sample_rate, cue_intent, timestamp_ms)
        else:
            return self._analyze_mock(audio_data, sample_rate, cue_intent, timestamp_ms)
    
    def _analyze_with_model(self, audio_data: np.ndarray,
                            sample_rate: int,
                            cue_intent: str,
                            timestamp_ms: float) -> PetResponse:
        """Analyze using ML model."""
        # Normalize audio
        if audio_data.dtype != np.float32:
            audio_data = audio_data.astype(np.float32)
        max_val = np.max(np.abs(audio_data))
        if max_val > 0:
            audio_data = audio_data / max_val
        
        # Get embeddings from model
        if self.model_name == 'beats':
            inputs = self.processor(audio_data, sampling_rate=sample_rate, return_tensors="pt")
            with torch.no_grad():
                embeddings = self.model(**inputs).last_hidden_state
            
            # Analyze embeddings (simplified)
            embedding_mean = embeddings.mean().item()
            
            # Classify based on embedding characteristics
            if embedding_mean > 0.1:
                response_type = 'vocalize'
                emotional_state = 'excited'
            elif embedding_mean < -0.1:
                response_type = 'avoid'
                emotional_state = 'stressed'
            else:
                response_type = 'calm'
                emotional_state = 'neutral'
            
            return PetResponse(
                response_detected=True,
                response_type=response_type,
                confidence=0.75,
                emotional_state=emotional_state,
                latency_ms=timestamp_ms,
                audio_features={'embedding_mean': embedding_mean},
                metadata={'model': self.model_name}
            )
        else:
            # Fallback
            return self._analyze_mock(audio_data, sample_rate, cue_intent, timestamp_ms)
    
    def _analyze_mock(self, audio_data: np.ndarray,
                      sample_rate: int,
                      cue_intent: str,
                      timestamp_ms: float) -> PetResponse:
        """Mock analysis for testing without models."""
        # Calculate basic audio features
        duration = len(audio_data) / sample_rate
        energy = np.mean(np.abs(audio_data))
        zero_crossing_rate = np.sum(np.abs(np.diff(np.sign(audio_data)))) / (2 * len(audio_data))
        
        # Simple heuristics for demo
        response_detected = energy > 0.01  # Detect if there's any sound
        
        if not response_detected:
            response_type = 'ignore'
            emotional_state = 'neutral'
        elif energy > 0.1:
            response_type = 'vocalize'
            emotional_state = 'excited'
        elif zero_crossing_rate > 0.1:
            response_type = 'approach'  # High ZCR might indicate movement
            emotional_state = 'curious'
        else:
            response_type = 'calm'
            emotional_state = 'neutral'
        
        # Adjust based on cue intent (simulated logic)
        if cue_intent in ['COME_HERE', 'TREAT_TIME'] and response_detected:
            # Positive response expected
            if energy > 0.05:
                response_type = 'approach'
                emotional_state = 'excited'
        elif cue_intent in ['STOP', 'NO_BARK'] and not response_detected:
            # Compliance (quiet) is good
            response_type = 'comply'
            emotional_state = 'calm'
        
        return PetResponse(
            response_detected=response_detected,
            response_type=response_type,
            confidence=0.6,  # Lower confidence for mock
            emotional_state=emotional_state,
            latency_ms=timestamp_ms,
            audio_features={
                'duration_s': duration,
                'energy': float(energy),
                'zero_crossing_rate': float(zero_crossing_rate)
            },
            metadata={'model': 'mock', 'species': self.species}
        )
    
    def analyze_video_frame(self, frame: np.ndarray) -> Dict[str, Any]:
        """
        Analyze video frame for pet behavior (placeholder).
        
        Future integration with pose estimation models.
        """
        # Placeholder for future video analysis
        return {
            'pet_detected': False,
            'pose': None,
            'movement_vector': None,
            'metadata': {'video_analysis': 'not_implemented'}
        }
    
    def get_response_metrics(self, interactions: List[Dict]) -> Dict[str, Any]:
        """
        Calculate aggregate metrics from multiple interactions.
        
        Args:
            interactions: List of interaction records with pet_response
            
        Returns:
            Dictionary with aggregate metrics
        """
        if not interactions:
            return {'error': 'No interactions provided'}
        
        total = len(interactions)
        responses = [i.get('pet_response', {}) for i in interactions]
        
        # Calculate metrics
        response_count = sum(1 for r in responses if r.get('response_detected', False))
        response_rate = response_count / total if total > 0 else 0
        
        # Response type distribution
        response_types = {}
        for r in responses:
            rt = r.get('response_type', 'unknown')
            response_types[rt] = response_types.get(rt, 0) + 1
        
        # Emotional state distribution
        emotional_states = {}
        for r in responses:
            es = r.get('emotional_state', 'unknown')
            if es:
                emotional_states[es] = emotional_states.get(es, 0) + 1
        
        # Average latency (for responses only)
        latencies = [r.get('latency_ms') for r in responses if r.get('latency_ms') is not None]
        avg_latency = np.mean(latencies) if latencies else None
        
        return {
            'total_interactions': total,
            'response_rate': response_rate,
            'response_count': response_count,
            'response_type_distribution': response_types,
            'emotional_state_distribution': emotional_states,
            'average_latency_ms': avg_latency,
            'success_metric': response_rate  # Primary success metric
        }


# Example usage
if __name__ == "__main__":
    # Initialize analyzer
    analyzer = PetResponseAnalyzer(model_name='mock', species='dog')
    
    # Test with mock audio (simulating dog bark)
    sample_rate = 16000
    duration = 0.5  # seconds
    
    # Generate test audio (burst of noise simulating bark)
    t = np.linspace(0, duration, int(sample_rate * duration))
    # Create a bark-like sound: short burst with frequency sweep
    freq_sweep = np.linspace(800, 400, len(t))
    phase = np.cumsum(2 * np.pi * freq_sweep / sample_rate)
    envelope = np.exp(-t * 10)  # Exponential decay
    audio = 0.3 * np.sin(phase) * envelope
    
    print("\n" + "="*60)
    print("Pet Response Analyzer Test")
    print("="*60)
    
    # Analyze response
    response = analyzer.analyze_audio(
        audio, 
        sample_rate=sample_rate,
        cue_intent='COME_HERE',
        timestamp_ms=250
    )
    
    print(f"\n🐕 Pet Response Analysis:")
    print(f"   Response Detected: {response.response_detected}")
    print(f"   Response Type: {response.response_type}")
    print(f"   Confidence: {response.confidence:.2f}")
    print(f"   Emotional State: {response.emotional_state}")
    print(f"   Latency: {response.latency_ms} ms")
    
    if response.audio_features:
        print(f"   Audio Features:")
        for key, value in response.audio_features.items():
            print(f"      {key}: {value}")
    
    # Test aggregate metrics
    print("\n" + "="*60)
    print("Testing Aggregate Metrics")
    print("="*60)
    
    mock_interactions = [
        {'pet_response': {'response_detected': True, 'response_type': 'approach', 'emotional_state': 'excited', 'latency_ms': 200}},
        {'pet_response': {'response_detected': True, 'response_type': 'vocalize', 'emotional_state': 'excited', 'latency_ms': 150}},
        {'pet_response': {'response_detected': False, 'response_type': 'ignore', 'emotional_state': 'neutral'}},
        {'pet_response': {'response_detected': True, 'response_type': 'approach', 'emotional_state': 'calm', 'latency_ms': 300}},
    ]
    
    metrics = analyzer.get_response_metrics(mock_interactions)
    
    print(f"\n📊 Aggregate Metrics:")
    print(f"   Total Interactions: {metrics['total_interactions']}")
    print(f"   Response Rate: {metrics['response_rate']:.1%}")
    print(f"   Response Types: {metrics['response_type_distribution']}")
    print(f"   Emotional States: {metrics['emotional_state_distribution']}")
    print(f"   Avg Latency: {metrics['average_latency_ms']:.0f} ms")
    
    print("\n" + "="*60)
    print("For production: Install transformers & torch for real analysis")
    print("="*60)
