"""
PetJanu Communication Layer - ASR Module (Phase 2)

This module handles Automatic Speech Recognition using Whisper.
It converts human voice commands to text for intent classification.

Supported modes:
1. Whisper Large (high accuracy, requires GPU)
2. Whisper Small/medium (faster, CPU-friendly)
3. Mock mode (for testing without dependencies)
"""

from typing import Optional, Dict, Any
import warnings
import numpy as np

# Try to import optional dependencies
try:
    import whisper
    WHISPER_AVAILABLE = True
except ImportError:
    WHISPER_AVAILABLE = False
    warnings.warn("Whisper not available. Using mock ASR for testing.")


class ASREngine:
    """
    Automatic Speech Recognition Engine using Whisper.
    
    Converts audio input (human voice commands) to text.
    Supports multiple languages including English and Hindi.
    """
    
    def __init__(self, model_size: str = 'base', language: Optional[str] = None):
        """
        Initialize ASR engine.
        
        Args:
            model_size: Whisper model size ('tiny', 'base', 'small', 'medium', 'large')
            language: Optional language code ('en', 'hi', etc.)
        """
        self.model_size = model_size
        self.language = language
        self.model = None
        
        if WHISPER_AVAILABLE:
            try:
                print(f"Loading Whisper model: {model_size}...")
                self.model = whisper.load_model(model_size)
                print(f"✅ Whisper model loaded successfully")
            except Exception as e:
                print(f"⚠️  Failed to load Whisper: {e}")
                print("Falling back to mock mode")
        else:
            print("⚠️  Whisper not installed. Using mock ASR mode.")
    
    def transcribe(self, audio_input: np.ndarray, 
                   sample_rate: int = 16000,
                   language: Optional[str] = None) -> Dict[str, Any]:
        """
        Transcribe audio to text.
        
        Args:
            audio_input: Audio waveform as numpy array
            sample_rate: Sample rate of audio (default 16kHz for Whisper)
            language: Optional language override
            
        Returns:
            Dictionary with:
                - text: Transcribed text
                - language: Detected language
                - confidence: Confidence score (if available)
                - segments: Word-level segments (if available)
        """
        if self.model is not None and WHISPER_AVAILABLE:
            return self._transcribe_whisper(audio_input, sample_rate, language)
        else:
            return self._transcribe_mock(audio_input, sample_rate, language)
    
    def _transcribe_whisper(self, audio_input: np.ndarray,
                            sample_rate: int,
                            language: Optional[str]) -> Dict[str, Any]:
        """Transcribe using Whisper."""
        # Ensure audio is float32 and normalized
        if audio_input.dtype != np.float32:
            audio_input = audio_input.astype(np.float32)
        
        # Normalize to [-1, 1] range
        max_val = np.max(np.abs(audio_input))
        if max_val > 0:
            audio_input = audio_input / max_val
        
        # Prepare options
        options = {
            'language': language or self.language,
            'task': 'transcribe',
        }
        
        # Transcribe
        result = self.model.transcribe(
            audio_input,
            **options
        )
        
        return {
            'text': result.get('text', '').strip(),
            'language': result.get('language', 'unknown'),
            'confidence': result.get('avg_logprob', 0.0),
            'segments': result.get('segments', []),
            'full_result': result  # Keep full result for debugging
        }
    
    def _transcribe_mock(self, audio_input: np.ndarray,
                         sample_rate: int,
                         language: Optional[str]) -> Dict[str, Any]:
        """Mock transcription for testing without Whisper."""
        # In mock mode, we simulate common commands based on audio characteristics
        # This is just for testing the pipeline
        
        audio_duration = len(audio_input) / sample_rate
        
        # Simple heuristic: different durations map to different commands
        if audio_duration < 0.5:
            text = "stop"
        elif audio_duration < 1.0:
            text = "come here"
        elif audio_duration < 1.5:
            text = "good boy"
        else:
            text = "walk time"
        
        return {
            'text': text,
            'language': language or self.language or 'en',
            'confidence': 0.8,
            'segments': [],
            'mock': True,
            'audio_duration': audio_duration
        }
    
    def transcribe_file(self, filepath: str, 
                        language: Optional[str] = None) -> Dict[str, Any]:
        """
        Transcribe audio from file.
        
        Args:
            filepath: Path to audio file (WAV, MP3, etc.)
            language: Optional language override
            
        Returns:
            Same dict structure as transcribe()
        """
        if self.model is not None and WHISPER_AVAILABLE:
            # Whisper can directly load files
            options = {
                'language': language or self.language,
                'task': 'transcribe',
            }
            
            result = self.model.transcribe(filepath, **options)
            
            return {
                'text': result.get('text', '').strip(),
                'language': result.get('language', 'unknown'),
                'confidence': result.get('avg_logprob', 0.0),
                'segments': result.get('segments', [])
            }
        else:
            # Mock mode: read filename as hint
            filename = filepath.lower()
            if 'come' in filename:
                text = "come here"
            elif 'stop' in filename:
                text = "stop"
            elif 'good' in filename:
                text = "good boy"
            else:
                text = "unknown command"
            
            return {
                'text': text,
                'language': language or self.language or 'en',
                'confidence': 0.8,
                'segments': [],
                'mock': True
            }


# Example usage
if __name__ == "__main__":
    import numpy as np
    
    # Initialize ASR engine
    asr = ASREngine(model_size='base')
    
    # Test with mock audio (sine wave simulating speech)
    sample_rate = 16000
    duration = 1.0  # seconds
    
    # Generate test audio (simple tone)
    t = np.linspace(0, duration, int(sample_rate * duration))
    audio = 0.5 * np.sin(2 * np.pi * 440 * t)  # 440 Hz tone
    
    print("\n" + "="*60)
    print("ASR Engine Test")
    print("="*60)
    
    # Transcribe
    result = asr.transcribe(audio, sample_rate=sample_rate)
    
    print(f"\n📝 Transcription Result:")
    print(f"   Text: '{result['text']}'")
    print(f"   Language: {result['language']}")
    print(f"   Confidence: {result['confidence']:.3f}")
    print(f"   Mock mode: {result.get('mock', False)}")
    
    if result.get('mock'):
        print(f"   Audio duration: {result.get('audio_duration', 0):.2f}s")
    
    print("\n" + "="*60)
    print("To use real Whisper, install with: pip install openai-whisper")
    print("="*60)
