"""
PetJanu Communication Layer - Audio Generation Module (Phase 2)

This module converts acoustic templates into actual audio waveforms using
a vocoder (HiFi-GAN or similar). It supports both retrieval-based and 
generative approaches.

Architecture:
1. Acoustic Template → Spectrogram (using parametric modeling)
2. Spectrogram → Waveform (using HiFi-GAN vocoder)
3. Post-processing (normalization, fade in/out)
"""

from typing import Optional, Tuple
import numpy as np
from dataclasses import dataclass
import warnings

# Try to import optional dependencies
try:
    import torch
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    warnings.warn("PyTorch not available. Using fallback synthesis.")

try:
    import librosa
    LIBROSA_AVAILABLE = True
except ImportError:
    LIBROSA_AVAILABLE = False
    warnings.warn("librosa not available. Using basic synthesis.")


@dataclass
class AudioOutput:
    """Represents generated audio output."""
    waveform: np.ndarray
    sample_rate: int
    duration_ms: float
    species: str
    intent_id: str
    generation_method: str  # 'retrieval', 'synthesis', 'vocoder'
    metadata: dict


class AudioGenerator:
    """
    Converts acoustic templates into audio waveforms.
    
    Supports three modes:
    1. Retrieval-based: Return pre-recorded clips (MVP approach)
    2. Parametric synthesis: Generate simple tones based on acoustic params
    3. Vocoder-based: Use HiFi-GAN or similar for high-quality synthesis
    """
    
    def __init__(self, mode: str = 'synthesis', cue_library=None):
        """
        Initialize audio generator.
        
        Args:
            mode: 'retrieval', 'synthesis', or 'vocoder'
            cue_library: CueLibrary instance for retrieval mode
        """
        self.mode = mode
        self.cue_library = cue_library
        self.sample_rate = 22050  # Default sample rate
        
        if mode == 'vocoder' and not TORCH_AVAILABLE:
            print("⚠️  PyTorch not available. Falling back to synthesis mode.")
            self.mode = 'synthesis'
    
    def generate(self, acoustic_template, species: str = 'dog', 
                 intent_id: str = 'UNKNOWN') -> AudioOutput:
        """
        Generate audio from acoustic template.
        
        Args:
            acoustic_template: AcousticTemplate object or dict
            species: Target species ('dog', 'cat', 'bird')
            intent_id: Intent identifier for logging
            
        Returns:
            AudioOutput object with waveform and metadata
        """
        if self.mode == 'retrieval' and self.cue_library:
            return self._retrieve_audio(acoustic_template, species, intent_id)
        elif self.mode == 'vocoder':
            return self._generate_with_vocoder(acoustic_template, species, intent_id)
        else:
            return self._synthesize_parametric(acoustic_template, species, intent_id)
    
    def _retrieve_audio(self, acoustic_template, species: str, 
                        intent_id: str) -> AudioOutput:
        """Retrieve pre-recorded audio from cue library."""
        if not self.cue_library:
            raise ValueError("Cue library required for retrieval mode")
        
        # Get cue from library
        cue = self.cue_library.get_cue(intent_id, species)
        
        if cue and 'audio_path' in cue:
            # In production, load actual audio file
            # waveform, sr = librosa.load(cue['audio_path'], sr=self.sample_rate)
            # For now, generate placeholder
            waveform = self._synthesize_parametric(acoustic_template, species, intent_id).waveform
            return AudioOutput(
                waveform=waveform,
                sample_rate=self.sample_rate,
                duration_ms=acoustic_template.duration_ms,
                species=species,
                intent_id=intent_id,
                generation_method='retrieval',
                metadata={'cue_id': cue.get('id', 'unknown')}
            )
        else:
            # Fallback to synthesis
            return self._synthesize_parametric(acoustic_template, species, intent_id)
    
    def _generate_with_vocoder(self, acoustic_template, species: str,
                                intent_id: str) -> AudioOutput:
        """Generate audio using vocoder (HiFi-GAN)."""
        # Step 1: Generate mel spectrogram from acoustic parameters
        mel_spec = self._acoustic_to_mel(acoustic_template, species)
        
        # Step 2: Load pre-trained HiFi-GAN vocoder
        # In production: load hifigan generator from checkpoint
        # vocoder = load_hifigan('path/to/checkpoint')
        
        # Step 3: Generate waveform from mel spectrogram
        # with torch.no_grad():
        #     waveform = vocoder(mel_spec)
        
        # Placeholder: use parametric synthesis
        waveform = self._synthesize_parametric(acoustic_template, species, intent_id).waveform
        
        return AudioOutput(
            waveform=waveform,
            sample_rate=self.sample_rate,
            duration_ms=acoustic_template.duration_ms,
            species=species,
            intent_id=intent_id,
            generation_method='vocoder',
            metadata={'vocoder': 'hifigan-placeholder'}
        )
    
    def _acoustic_to_mel(self, acoustic_template, species: str) -> np.ndarray:
        """Convert acoustic parameters to mel spectrogram."""
        # Extract parameters
        freq = acoustic_template.base_frequency_hz
        duration = acoustic_template.duration_ms / 1000.0  # Convert to seconds
        mod_type = acoustic_template.frequency_modulation
        
        # Calculate number of frames
        n_frames = int(duration * 50)  # 50 frames per second
        
        # Create frequency contour based on modulation type
        if mod_type == 'rising':
            freqs = np.linspace(freq * 0.8, freq * 1.2, n_frames)
        elif mod_type == 'falling':
            freqs = np.linspace(freq * 1.2, freq * 0.8, n_frames)
        elif mod_type == 'oscillating':
            t = np.linspace(0, 4 * np.pi, n_frames)
            freqs = freq * (1 + 0.2 * np.sin(t))
        else:  # steady
            freqs = np.full(n_frames, freq)
        
        # Create mel spectrogram (simplified)
        n_mels = 80
        mel_spec = np.zeros((n_mels, n_frames))
        
        # Add energy at target frequencies
        for i, f in enumerate(freqs):
            mel_bin = int(f / (self.sample_rate / 2) * n_mels)
            mel_bin = min(max(mel_bin, 0), n_mels - 1)
            mel_spec[mel_bin, i] = 1.0
        
        return mel_spec
    
    def _synthesize_parametric(self, acoustic_template, species: str,
                                intent_id: str) -> AudioOutput:
        """
        Synthesize audio using parametric methods.
        
        This creates a simplified approximation based on acoustic parameters.
        Suitable for MVP testing and development.
        """
        # Extract parameters
        freq = acoustic_template.base_frequency_hz
        duration = acoustic_template.duration_ms / 1000.0  # seconds
        mod_type = acoustic_template.frequency_modulation
        amp_profile = acoustic_template.amplitude_profile
        vocal_type = acoustic_template.vocalization_type
        
        # Generate time array
        n_samples = int(duration * self.sample_rate)
        t = np.linspace(0, duration, n_samples)
        
        # Generate frequency modulation
        if mod_type == 'rising':
            freq_t = np.linspace(freq * 0.8, freq * 1.2, n_samples)
        elif mod_type == 'falling':
            freq_t = np.linspace(freq * 1.2, freq * 0.8, n_samples)
        elif mod_type == 'oscillating':
            freq_t = freq * (1 + 0.2 * np.sin(2 * np.pi * 4 * t))
        else:  # steady
            freq_t = np.full(n_samples, freq)
        
        # Generate waveform (FM synthesis)
        phase = np.cumsum(2 * np.pi * freq_t / self.sample_rate)
        waveform = np.sin(phase)
        
        # Add harmonics based on harmonic structure
        if acoustic_template.harmonic_structure == 'rich':
            waveform += 0.3 * np.sin(2 * phase)  # 2nd harmonic
            waveform += 0.15 * np.sin(3 * phase)  # 3rd harmonic
        elif acoustic_template.harmonic_structure == 'complex':
            waveform += 0.2 * np.sin(2 * phase)
            waveform += 0.1 * np.sin(2.5 * phase)  # Non-integer harmonic
        
        # Apply amplitude envelope
        if amp_profile == 'fade_in':
            envelope = np.linspace(0, 1, n_samples)
        elif amp_profile == 'fade_out':
            envelope = np.linspace(1, 0, n_samples)
        elif amp_profile == 'pulsed':
            pulse_freq = 5  # 5 Hz pulsing
            envelope = 0.5 + 0.5 * np.sin(2 * np.pi * pulse_freq * t)
        else:  # steady
            envelope = np.ones(n_samples)
        
        waveform = waveform * envelope
        
        # Normalize
        if np.max(np.abs(waveform)) > 0:
            waveform = waveform / np.max(np.abs(waveform)) * 0.9
        
        # Apply species-specific adjustments
        waveform = self._apply_species_characteristics(waveform, species, vocal_type)
        
        return AudioOutput(
            waveform=waveform,
            sample_rate=self.sample_rate,
            duration_ms=acoustic_template.duration_ms,
            species=species,
            intent_id=intent_id,
            generation_method='synthesis',
            metadata={
                'base_frequency_hz': freq,
                'modulation_type': mod_type,
                'amplitude_profile': amp_profile,
                'vocalization_type': vocal_type
            }
        )
    
    def _apply_species_characteristics(self, waveform: np.ndarray, 
                                        species: str, vocal_type: str) -> np.ndarray:
        """Apply species-specific audio characteristics."""
        if species == 'cat':
            # Cats have higher frequencies and more rapid modulations
            # Already handled in frequency adjustment, add subtle noise
            noise = np.random.normal(0, 0.02, len(waveform))
            waveform = waveform + noise
        elif species == 'bird':
            # Birds have very rapid frequency modulations
            t = np.arange(len(waveform)) / self.sample_rate
            rapid_mod = 0.1 * np.sin(2 * np.pi * 20 * t)  # 20 Hz modulation
            waveform = waveform * (1 + rapid_mod)
        
        return waveform
    
    def save_audio(self, audio_output: AudioOutput, filepath: str):
        """Save audio to file."""
        if LIBROSA_AVAILABLE:
            import soundfile as sf
            sf.write(filepath, audio_output.waveform, audio_output.sample_rate)
        else:
            # Fallback: save as WAV using stdlib
            import wave
            import struct
            
            # Normalize to 16-bit range
            waveform_int16 = (audio_output.waveform * 32767).astype(np.int16)
            
            with wave.open(filepath, 'wb') as wav_file:
                wav_file.setnchannels(1)  # Mono
                wav_file.setsampwidth(2)  # 2 bytes per sample (16-bit)
                wav_file.setframerate(audio_output.sample_rate)
                for sample in waveform_int16:
                    wav_file.writeframes(struct.pack('<h', sample))
        
        print(f"✅ Audio saved to {filepath}")
    
    def play_audio(self, audio_output: AudioOutput):
        """Play audio (requires sounddevice)."""
        try:
            import sounddevice as sd
            sd.play(audio_output.waveform, audio_output.sample_rate)
            sd.wait()
            print("✅ Audio played")
        except ImportError:
            print("⚠️  sounddevice not available. Install with: pip install sounddevice")


# Example usage
if __name__ == "__main__":
    from src.intent_engine.intent_classifier import IntentEngine
    
    # Initialize
    engine = IntentEngine()
    generator = AudioGenerator(mode='synthesis')
    
    # Test: Generate "come here" command for dog
    intent = engine.classify("come here")
    template = engine.get_acoustic_template(intent.intent_id, species='dog')
    
    print(f"\nGenerating audio for intent: {intent.intent_id}")
    print(f"Species: dog")
    print(f"Frequency: {template.base_frequency_hz} Hz")
    print(f"Duration: {template.duration_ms} ms")
    print(f"Vocalization: {template.vocalization_type}")
    
    # Generate audio
    audio = generator.generate(template, species='dog', intent_id=intent.intent_id)
    
    print(f"\n✅ Generated audio:")
    print(f"   Duration: {audio.duration_ms:.1f} ms")
    print(f"   Sample rate: {audio.sample_rate} Hz")
    print(f"   Samples: {len(audio.waveform)}")
    print(f"   Method: {audio.generation_method}")
    
    # Save to file
    generator.save_audio(audio, '/tmp/test_come_here_dog.wav')
    
    # Test cat version
    print("\n" + "="*60)
    template_cat = engine.get_acoustic_template(intent.intent_id, species='cat')
    audio_cat = generator.generate(template_cat, species='cat', intent_id=intent.intent_id)
    
    print(f"\n✅ Generated audio (cat):")
    print(f"   Frequency: {template_cat.base_frequency_hz} Hz")
    print(f"   Vocalization: {template_cat.vocalization_type}")
    
    generator.save_audio(audio_cat, '/tmp/test_come_here_cat.wav')
