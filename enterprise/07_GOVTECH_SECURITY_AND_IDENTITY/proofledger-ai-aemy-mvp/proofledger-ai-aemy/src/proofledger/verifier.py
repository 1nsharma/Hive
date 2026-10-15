"""Validate hashes and linkage in a ProofLedger JSONL chain."""
from typing import Any

from .hashing import GENESIS_HASH, event_hash


def verify_chain(events: list[dict[str, Any]]) -> tuple[bool, list[str]]:
    """Return (valid, errors); does not authenticate truth or prevent full rewrites."""
    errors: list[str] = []
    previous = GENESIS_HASH
    seen_ids: set[str] = set()

    for index, event in enumerate(events, start=1):
        required = {
            "schema_version", "event_id", "timestamp", "actor", "action",
            "policy_result", "result", "previous_hash", "event_hash",
        }
        missing = sorted(required - set(event))
        if missing:
            errors.append(f"event {index}: missing fields: {', '.join(missing)}")
            continue

        event_id = event.get("event_id")
        if not isinstance(event_id, str) or not event_id:
            errors.append(f"event {index}: event_id must be a non-empty string")
        elif event_id in seen_ids:
            errors.append(f"event {index}: duplicate event_id {event_id!r}")
        else:
            seen_ids.add(event_id)

        if event.get("previous_hash") != previous:
            errors.append(f"event {index}: previous_hash does not match prior event")

        expected = event_hash(event)
        if event.get("event_hash") != expected:
            errors.append(f"event {index}: event_hash mismatch")

        claimed = event.get("event_hash")
        if isinstance(claimed, str) and len(claimed) == 64:
            previous = claimed
        else:
            # Keep going but force subsequent linkage to fail in a predictable way.
            previous = ""

    return (not errors, errors)
