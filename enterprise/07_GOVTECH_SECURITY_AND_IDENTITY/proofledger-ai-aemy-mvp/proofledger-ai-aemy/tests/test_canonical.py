import unittest
from proofledger.canonical import canonical_json_bytes

class CanonicalTests(unittest.TestCase):
    def test_key_order_is_stable(self):
        self.assertEqual(canonical_json_bytes({"b": 2, "a": 1}), canonical_json_bytes({"a": 1, "b": 2}))

    def test_unicode_is_utf8(self):
        self.assertEqual(canonical_json_bytes({"name": "Aemy"}), b'{"name":"Aemy"}')

    def test_non_finite_number_rejected(self):
        with self.assertRaises(ValueError):
            canonical_json_bytes({"value": float("nan")})
