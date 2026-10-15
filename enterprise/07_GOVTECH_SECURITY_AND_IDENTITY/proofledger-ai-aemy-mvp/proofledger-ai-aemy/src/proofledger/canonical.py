"""Deterministic JSON encoding for JSON-compatible event data."""
import json
from typing import Any


def canonical_json_bytes(value: Any) -> bytes:
    """Encode JSON data deterministically for hashing.

    This prototype rejects NaN/Infinity and uses sorted keys, compact separators,
    UTF-8, and unescaped Unicode. Schema-level timestamp/number rules still need
    to be defined by applications using the library.
    """
    text = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
        allow_nan=False,
    )
    return text.encode("utf-8")
