# ProofLedger AI

**Amit Sharma | Aemy** · AI + Blockchain Systems Builder

ProofLedger AI is an experimental, local-first prototype for tamper-evident audit trails for AI action records.

## What it does
- Records structured synthetic events.
- Canonicalizes event data before hashing.
- Links records using SHA-256 hashes.
- Verifies event hashes and previous-record linkage.
- Demonstrates detection of payload edits, reordering, and broken links.

## Security boundary
This is **tamper-evident, not inherently immutable**. A hash chain alone cannot prove that an event occurred, that an AI decision was correct, or that an attacker cannot rewrite the entire chain and recompute all hashes. Stronger guarantees need independently protected checkpoints, digital signatures, access controls, and a carefully defined threat model.

Do not store real customer data, credentials, API keys, wallet secrets, or sensitive prompts in this prototype.

## Requirements
- Python 3.10+
- No third-party runtime dependencies

## Quick start
From the repository root:

```bash
python -m unittest discover -s tests -v
python -m proofledger.cli demo --output examples/demo-ledger.jsonl
python -m proofledger.cli verify examples/demo-ledger.jsonl
```

If Python cannot find the package from the source layout, install it in editable mode:

```bash
python -m pip install -e .
```

## Example commands

Create a ledger from synthetic events:
```bash
python -m proofledger.cli demo --output /tmp/proofledger-demo.jsonl
```

Verify it:
```bash
python -m proofledger.cli verify /tmp/proofledger-demo.jsonl
```

Tamper with a copy of the file and verify again to see integrity failure.

## Architecture
1. `canonical.py` — deterministic JSON encoding for supported JSON values.
2. `hashing.py` — SHA-256 event hash calculation.
3. `ledger.py` — event creation and JSONL persistence.
4. `verifier.py` — hash and chain-link verification.
5. `cli.py` — demo and verification commands.

## Current limitations
- Local JSONL storage only; no blockchain deployment or anchoring.
- No signature/key management.
- A full-ledger rewrite can evade hash-chain-only checks if there is no trusted external checkpoint.
- This project checks defined record-integrity properties; it does not prove that records are truthful or that AI actions are safe.
- The demo uses fictional events only.

## Status
Early experimental prototype. Security claims must be limited to the test cases actually run.
