"""Command-line interface for ProofLedger AI."""
import argparse
import sys
from pathlib import Path

from .ledger import build_chain, read_jsonl, write_jsonl
from .verifier import verify_chain


def demo_events():
    return [
        {"event_id": "evt-001", "timestamp": "2026-10-05T10:00:00Z", "actor": "Agent_Dev", "action": "synthetic_code_review", "policy_result": "allowed", "result": "demo_only", "schema_version": "0.1"},
        {"event_id": "evt-002", "timestamp": "2026-10-05T10:01:00Z", "actor": "Agent_Ops", "action": "synthetic_api_check", "policy_result": "needs_review", "result": "demo_only", "schema_version": "0.1"},
        {"event_id": "evt-003", "timestamp": "2026-10-05T10:02:00Z", "actor": "Agent_Sales", "action": "synthetic_payment_request", "policy_result": "blocked", "result": "demo_only", "schema_version": "0.1"},
    ]


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(prog="proofledger", description="ProofLedger AI local audit-trail prototype")
    sub = parser.add_subparsers(dest="command", required=True)
    demo = sub.add_parser("demo", help="write a synthetic sample ledger")
    demo.add_argument("--output", required=True, help="output JSONL path")
    verify = sub.add_parser("verify", help="verify a JSONL ledger")
    verify.add_argument("path", help="ledger JSONL path")
    args = parser.parse_args(argv)

    if args.command == "demo":
        chain = build_chain(demo_events())
        write_jsonl(args.output, chain)
        print(f"Wrote {len(chain)} synthetic events to {args.output}")
        return 0

    try:
        events = read_jsonl(args.path)
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    valid, errors = verify_chain(events)
    if valid:
        print(f"PASS: verified {len(events)} events")
        return 0
    print("FAIL: ledger verification failed")
    for error in errors:
        print(f"- {error}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
