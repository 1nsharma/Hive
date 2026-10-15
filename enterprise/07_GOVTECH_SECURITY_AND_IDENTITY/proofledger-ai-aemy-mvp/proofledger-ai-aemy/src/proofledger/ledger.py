"""Create and persist a local JSONL hash chain."""
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

from .canonical import canonical_json_bytes
from .hashing import GENESIS_HASH, event_hash


def make_event(*, event_id: str, actor: str, action: str,
               policy_result: str, result: str,
               previous_hash: str = GENESIS_HASH,
               timestamp: str | None = None) -> dict[str, Any]:
    """Create a synthetic event with a computed event_hash."""
    if not event_id.strip():
        raise ValueError("event_id must not be empty")
    if not actor.strip() or not action.strip():
        raise ValueError("actor and action must not be empty")
    if timestamp is None:
        timestamp = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    event = {
        "schema_version": "0.1",
        "event_id": event_id,
        "timestamp": timestamp,
        "actor": actor,
        "action": action,
        "policy_result": policy_result,
        "result": result,
        "previous_hash": previous_hash,
    }
    event["event_hash"] = event_hash(event)
    return event


def build_chain(events: Iterable[dict[str, Any]]) -> list[dict[str, Any]]:
    """Re-hash input event payloads into a new chain, preserving event content.

    Input `event_hash` and `previous_hash` are ignored and recomputed. Use only
    for constructing a new ledger, not for validating an existing one.
    """
    chain: list[dict[str, Any]] = []
    previous = GENESIS_HASH
    for raw in events:
        event = dict(raw)
        event.pop("event_hash", None)
        event.pop("previous_hash", None)
        event["previous_hash"] = previous
        event["event_hash"] = event_hash(event)
        chain.append(event)
        previous = event["event_hash"]
    return chain


def write_jsonl(path: str | Path, events: Iterable[dict[str, Any]]) -> None:
    """Write events as one compact JSON object per line."""
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("w", encoding="utf-8", newline="\n") as handle:
        for event in events:
            handle.write(canonical_json_bytes(event).decode("utf-8") + "\n")


def read_jsonl(path: str | Path) -> list[dict[str, Any]]:
    """Read JSONL events; raise ValueError with line number on invalid input."""
    events: list[dict[str, Any]] = []
    with Path(path).open("r", encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, start=1):
            if not line.strip():
                continue
            try:
                item = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"invalid JSON on line {line_number}: {exc.msg}") from exc
            if not isinstance(item, dict):
                raise ValueError(f"line {line_number} must contain a JSON object")
            events.append(item)
    return events
