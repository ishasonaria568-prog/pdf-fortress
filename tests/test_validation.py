"""
Tests for PDF Fortress Validators
ISHU CYBERSECURITY
"""

import tempfile
import unittest
from pathlib import Path

# Ensure vendor path or app root is in sys.path
import sys
_root = Path(__file__).resolve().parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from app.core.validators import (
    validate_input_pdf,
    validate_output_path,
    validate_password,
    MissingFileError,
    InvalidPDFError,
    EmptyPasswordError,
    SamePathOverwriteError,
)
from app.core.security import calculate_password_strength


class TestValidators(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_path = Path(self.temp_dir.name)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_missing_input_file(self):
        non_existent = self.temp_path / "does_not_exist.pdf"
        with self.assertRaises(MissingFileError):
            validate_input_pdf(str(non_existent))

    def test_invalid_extension(self):
        txt_file = self.temp_path / "notes.txt"
        txt_file.write_text("Hello World")
        with self.assertRaises(InvalidPDFError):
            validate_input_pdf(str(txt_file))

    def test_empty_password(self):
        with self.assertRaises(EmptyPasswordError):
            validate_password("")
        with self.assertRaises(EmptyPasswordError):
            validate_password(None)

    def test_password_strength_calculation(self):
        weak = calculate_password_strength("abc")
        self.assertEqual(weak["rating"], "Weak")

        fair = calculate_password_strength("abcdefgh1")
        self.assertIn(fair["rating"], ["Fair", "Strong"])

        strong = calculate_password_strength("ComplexPass#2026")
        self.assertIn(strong["rating"], ["Strong", "Very Strong"])
        self.assertTrue(strong["checks"]["has_symbols"])
        self.assertTrue(strong["checks"]["has_numbers"])
        self.assertTrue(strong["checks"]["has_uppercase"])

    def test_same_input_and_output_path_prevention(self):
        fake_pdf = self.temp_path / "report.pdf"
        fake_pdf.write_bytes(b"%PDF-1.4\n%test\n")

        # Without overwrite allowed
        with self.assertRaises(SamePathOverwriteError):
            validate_output_path(str(fake_pdf), fake_pdf, allow_overwrite=False)

        # With overwrite explicitly allowed
        out = validate_output_path(str(fake_pdf), fake_pdf, allow_overwrite=True)
        self.assertEqual(out, fake_pdf)


if __name__ == "__main__":
    unittest.main()
