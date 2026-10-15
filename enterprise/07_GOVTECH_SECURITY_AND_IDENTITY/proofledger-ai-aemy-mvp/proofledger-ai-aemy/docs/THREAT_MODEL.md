# Threat Model (Initial)

## In scope
- Payload modification after a record is created.
- Incorrect previous-hash linkage.
- Record deletion or reordering.
- Malformed JSONL.
- Duplicate event IDs under the prototype's policy.

## Out of scope
- Full-ledger rewrite and re-hashing by an attacker.
- Compromised host, interpreter, or repository account.
- Truthfulness of recorded events or correctness/safety of AI decisions.
- Availability, confidentiality, multi-user access control, and production key management.

## Key limitation
A valid hash chain means the implemented consistency checks passed for the records provided. It does not establish that the records are truthful, complete, or externally anchored.
