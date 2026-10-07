"""
Tests for PDF Fortress Error Handling
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

from app.core.pdf_protector import protect_pdf
from app.core.validators import (
    CorruptedPDFError,
    InvalidPDFError,
    EmptyPasswordError,
    OutputFailureError,
)


class TestErrorHandling(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_path = Path(self.temp_dir.name)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_corrupted_pdf_file(self):
        """File with %PDF- header but corrupted contents should raise CorruptedPDFError."""
        corrupt_pdf = self.temp_path / "corrupt.pdf"
        corrupt_pdf.write_bytes(b"%PDF-1.4\nBROKEN_GARBAGE_DATA_12345\n%%EOF")

        out_pdf = self.temp_path / "corrupt_protected.pdf"

        with self.assertRaises(CorruptedPDFError):
            protect_pdf(str(corrupt_pdf), str(out_pdf), "SecurePassword")

    def test_empty_zero_byte_file(self):
        """Zero-byte file should be rejected as corrupted/invalid."""
        empty_pdf = self.temp_path / "empty.pdf"
        empty_pdf.write_bytes(b"")

        out_pdf = self.temp_path / "empty_protected.pdf"

        with self.assertRaises((CorruptedPDFError, InvalidPDFError)):
            protect_pdf(str(empty_pdf), str(out_pdf), "SecurePassword")

    def test_fake_pdf_file(self):
        """Text file renamed to .pdf lacking %PDF- header."""
        fake_pdf = self.temp_path / "fake.pdf"
        fake_pdf.write_text("This is an ordinary text file masquerading as a PDF.")

        out_pdf = self.temp_path / "fake_protected.pdf"

        with self.assertRaises(InvalidPDFError):
            protect_pdf(str(fake_pdf), str(out_pdf), "SecurePassword")

    def test_empty_password_rejection(self):
        """Should raise EmptyPasswordError when password is empty."""
        valid_pdf = self.temp_path / "valid.pdf"
        # Minimum valid empty PDF
        valid_pdf.write_bytes(
            b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
            b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
            b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\n"
            b"xref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n"
            b"trailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n190\n%%EOF"
        )
        out_pdf = self.temp_path / "valid_protected.pdf"

        with self.assertRaises(EmptyPasswordError):
            protect_pdf(str(valid_pdf), str(out_pdf), "")


if __name__ == "__main__":
    unittest.main()
