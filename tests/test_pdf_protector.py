"""
Tests for PDF Fortress Core Protection Engine
Built by Isha Sonaria
"""

import os
import sys
import tempfile
import unittest
from pathlib import Path

# Ensure app root is in sys.path
_root = Path(__file__).resolve().parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from pypdf import PdfWriter, PdfReader
from app.core.pdf_protector import protect_pdf, verify_protected_pdf
from app.core.validators import (
    PDFProtectorError,
    OutputFailureError,
)


class TestPDFProtector(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_path = Path(self.temp_dir.name)

        # Create a valid source PDF
        self.sample_pdf_path = self.temp_path / "sample.pdf"
        writer = PdfWriter()
        writer.add_blank_page(width=612, height=792)
        writer.add_blank_page(width=612, height=792)
        with open(self.sample_pdf_path, "wb") as f:
            writer.write(f)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_successful_pdf_protection(self):
        """Test standard protection of a valid 2-page PDF."""
        output_pdf_path = self.temp_path / "sample_protected.pdf"
        password = "SecurePassword#2026"

        result = protect_pdf(
            input_path=str(self.sample_pdf_path),
            output_path=str(output_pdf_path),
            password=password,
        )

        self.assertEqual(result["status"], "PROTECTED")
        self.assertEqual(result["page_count"], 2)
        self.assertTrue(result["verified"])
        self.assertTrue(output_pdf_path.exists())
        self.assertGreater(output_pdf_path.stat().st_size, 0)

        # Verify output with PdfReader
        reader = PdfReader(str(output_pdf_path))
        self.assertTrue(reader.is_encrypted, "Output PDF must be encrypted")

        # Wrong password should fail
        decrypt_wrong = reader.decrypt("WrongPassword999")
        self.assertFalse(decrypt_wrong, "Wrong password must not decrypt PDF")

        # Correct password should succeed
        decrypt_correct = reader.decrypt(password)
        self.assertTrue(decrypt_correct, "Correct password must decrypt PDF")
        self.assertEqual(len(reader.pages), 2)

    def test_progress_callback_invocations(self):
        """Test that stages are reported to the progress callback."""
        output_pdf_path = self.temp_path / "callback_test.pdf"
        stages_recorded = []

        def on_progress(stage, percent):
            stages_recorded.append((stage, percent))

        result = protect_pdf(
            input_path=str(self.sample_pdf_path),
            output_path=str(output_pdf_path),
            password="StrongPass!456",
            progress_callback=on_progress,
        )

        self.assertTrue(result["verified"])
        stage_names = [s[0] for s in stages_recorded]
        self.assertIn("ANALYZING DOCUMENT", stage_names)
        self.assertIn("READING PDF", stage_names)
        self.assertIn("COPYING PAGES", stage_names)
        self.assertIn("APPLYING PROTECTION", stage_names)
        self.assertIn("VERIFYING OUTPUT", stage_names)
        self.assertIn("SECURE", stage_names)

    def test_verify_protected_pdf_helper(self):
        """Test verify_protected_pdf directly."""
        output_pdf_path = self.temp_path / "verify_helper.pdf"
        protect_pdf(str(self.sample_pdf_path), str(output_pdf_path), "CheckPass123")

        verify_info = verify_protected_pdf(output_pdf_path, "CheckPass123")
        self.assertTrue(verify_info["verified"])
        self.assertTrue(verify_info["is_encrypted"])
        self.assertEqual(verify_info["page_count"], 2)

        # Calling verification with bad password should raise OutputFailureError
        with self.assertRaises(OutputFailureError):
            verify_protected_pdf(output_pdf_path, "BadPassword")


if __name__ == "__main__":
    unittest.main()
