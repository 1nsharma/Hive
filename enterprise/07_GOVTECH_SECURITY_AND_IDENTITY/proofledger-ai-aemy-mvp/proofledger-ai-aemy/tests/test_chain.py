import tempfile
import unittest
from pathlib import Path
from proofledger.ledger import build_chain, read_jsonl, write_jsonl
from proofledger.verifier import verify_chain
from proofledger.cli import demo_events

class ChainTests(unittest.TestCase):
    def setUp(self):
        self.chain = build_chain(demo_events())

    def test_valid_chain_passes(self):
        valid, errors = verify_chain(self.chain)
        self.assertTrue(valid, errors)

    def test_payload_tampering_fails(self):
        changed = [dict(e) for e in self.chain]
        changed[1]["action"] = "changed_action"
        self.assertFalse(verify_chain(changed)[0])

    def test_link_tampering_fails(self):
        changed = [dict(e) for e in self.chain]
        changed[1]["previous_hash"] = "f" * 64
        self.assertFalse(verify_chain(changed)[0])

    def test_reordering_fails(self):
        changed = [self.chain[1], self.chain[0], self.chain[2]]
        self.assertFalse(verify_chain(changed)[0])

    def test_deletion_from_middle_fails(self):
        changed = [self.chain[0], self.chain[2]]
        self.assertFalse(verify_chain(changed)[0])

    def test_duplicate_event_id_fails(self):
        changed = [dict(e) for e in self.chain]
        changed[1]["event_id"] = changed[0]["event_id"]
        # Rehash to isolate duplicate-ID policy from hash mismatch.
        changed = build_chain(changed)
        self.assertFalse(verify_chain(changed)[0])

    def test_empty_chain_is_valid(self):
        self.assertEqual(verify_chain([]), (True, []))

    def test_jsonl_round_trip(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "ledger.jsonl"
            write_jsonl(path, self.chain)
            loaded = read_jsonl(path)
            self.assertEqual(loaded, self.chain)
            self.assertTrue(verify_chain(loaded)[0])

    def test_malformed_json_reports_line(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "bad.jsonl"
            path.write_text('{"ok": true}\n{bad json}\n', encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "line 2"):
                read_jsonl(path)
