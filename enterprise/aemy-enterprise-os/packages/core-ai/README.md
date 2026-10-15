# @aemy/core-ai

The foundational AI gateway package for the Aemy Enterprise OS.

## Features
- **ResilientAIClient**: Google Gemini model orchestration with exponential retry, circuit breaker protection, and automatic fallback.
- **CircuitBreaker**: Watches error storms and token burn rates; triggers `steer` -> `constrain` -> `tripped` states.
- **VernacularCommerceParser**: High-precision parser for vernacular Hindi/Hinglish MSME shop orders, voice intents, and Khata (credit) entries.
