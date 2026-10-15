"""Hashing helpers for ProofLedger AI."""
import hashlib
from typing import Any

from .canonical import canonical_json_bytes

GENESIS_HASH = "0" * 64


def event_hash(event_without_hash: dict[str, Any]) -> str:
    """Return SHA-256 hex digest of canonical event data excluding event_hash."""
    payload = dict(event_without_hash)
    payload.pop("event_hash", None)
    return hashlib.sha256(canonical_json_bytes(payload)).hexdigest()
