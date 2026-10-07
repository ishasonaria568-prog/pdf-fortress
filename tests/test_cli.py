"""
Tests for PDF Fortress Native CLI Interface
"""

import os
import sys
import tempfile
import unittest
import subprocess
from pathlib import Path

_root = Path(__file__).resolve().parent.parent
_vendor = _root / "python_packages"
if _vendor.exists() and str(_vendor) not in sys.path:
    sys.path.insert(0, str(_vendor))

from pypdf import PdfWriter


class TestCLIInterface(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_path = Path(self.temp_dir.name)

        # Generate standard test PDF
        self.sample_pdf = self.temp_path / "sample.pdf"
        writer = PdfWriter()
        writer.add_blank_page(width=612, height=792)
        writer.add_blank_page(width=612, height=792)
        with open(self.sample_pdf, "wb") as f:
            writer.write(f)

        self.cli_script = str(_root / "pdf_fortress.py")

    def tearDown(self):
        self.temp_dir.cleanup()

    def run_cli(self, args, input_data=None):
        cmd = [sys.executable, self.cli_script] + args
        return subprocess.run(
            cmd,
            input=input_data,
            capture_output=True,
            text=True,
            cwd=str(_root),
        )

    def test_cli_version(self):
        res = self.run_cli(["--version"])
        self.assertEqual(res.returncode, 0)
        self.assertIn("PDF Fortress v", res.stdout)
        self.assertIn("Built by Isha Sonaria", res.stdout)

    def test_cli_help(self):
        res = self.run_cli(["--help"])
        self.assertEqual(res.returncode, 0)
        self.assertIn("PDF FORTRESS", res.stdout)
        self.assertIn("Usage:", res.stdout)
        self.assertIn("--info", res.stdout)
        self.assertIn("--verify", res.stdout)

    def test_cli_protect_success(self):
        out_pdf = self.temp_path / "protected.pdf"
        res = self.run_cli([str(self.sample_pdf), str(out_pdf), "StrongPass#2026"])
        self.assertEqual(res.returncode, 0)
        self.assertIn("PDF PROTECTED SUCCESSFULLY", res.stdout)
        self.assertTrue(out_pdf.exists())
        self.assertGreater(out_pdf.stat().st_size, 0)

    def test_cli_quiet_mode(self):
        out_pdf = self.temp_path / "quiet_prot.pdf"
        res = self.run_cli([str(self.sample_pdf), str(out_pdf), "Pass123", "--quiet"])
        self.assertEqual(res.returncode, 0)
        self.assertEqual(res.stdout.strip(), "PDF protected successfully.")

    def test_cli_password_stdin(self):
        out_pdf = self.temp_path / "stdin_prot.pdf"
        res = self.run_cli(
            [str(self.sample_pdf), str(out_pdf), "--password-stdin", "--quiet"],
            input_data="MyStdinPassword\n",
        )
        self.assertEqual(res.returncode, 0)
        self.assertTrue(out_pdf.exists())

    def test_cli_interactive_password(self):
        out_pdf = self.temp_path / "interactive_prot.pdf"
        res = self.run_cli(
            [str(self.sample_pdf), str(out_pdf), "--quiet"],
            input_data="MyInteractivePass#1\nMyInteractivePass#1\n",
        )
        self.assertEqual(res.returncode, 0)
        self.assertTrue(out_pdf.exists())

    def test_cli_info_mode(self):
        res = self.run_cli([str(self.sample_pdf), "--info"])
        self.assertEqual(res.returncode, 0)
        self.assertIn("DOCUMENT INFORMATION", res.stdout)
        self.assertIn("File:", res.stdout)
        self.assertIn("Pages:", res.stdout)
        self.assertIn("Encrypted:", res.stdout)

    def test_cli_verify_mode(self):
        # First protect
        out_pdf = self.temp_path / "to_verify.pdf"
        self.run_cli([str(self.sample_pdf), str(out_pdf), "CheckPass", "--quiet"])
        # Now verify
        res = self.run_cli([str(out_pdf), "--verify"])
        self.assertEqual(res.returncode, 0)
        self.assertIn("PROTECTION VERIFICATION", res.stdout)
        self.assertIn("PASSWORD PROTECTED", res.stdout)
        self.assertIn("VERIFICATION COMPLETE", res.stdout)

    def test_cli_missing_input(self):
        missing = self.temp_path / "does_not_exist.pdf"
        out_pdf = self.temp_path / "out.pdf"
        res = self.run_cli([str(missing), str(out_pdf), "Pass"])
        self.assertEqual(res.returncode, 3)
        self.assertIn("Input PDF does not exist", res.stderr)

    def test_cli_invalid_pdf(self):
        fake = self.temp_path / "fake.txt"
        fake.write_text("Not a pdf")
        out_pdf = self.temp_path / "out.pdf"
        res = self.run_cli([str(fake), str(out_pdf), "Pass"])
        self.assertEqual(res.returncode, 3)
        self.assertIn("The selected file is not a valid PDF", res.stderr)

    def test_cli_corrupted_pdf(self):
        corrupt = self.temp_path / "corrupt.pdf"
        corrupt.write_bytes(b"%PDF-1.4\nJUNK_DATA\n%%EOF")
        out_pdf = self.temp_path / "out.pdf"
        res = self.run_cli([str(corrupt), str(out_pdf), "Pass"])
        self.assertEqual(res.returncode, 3)
        self.assertIn("The PDF could not be read", res.stderr)

    def test_cli_empty_password(self):
        out_pdf = self.temp_path / "out.pdf"
        res = self.run_cli([str(self.sample_pdf), str(out_pdf), ""])
        self.assertEqual(res.returncode, 2)
        self.assertIn("Password cannot be empty", res.stderr)

    def test_cli_existing_output_without_force(self):
        existing_out = self.temp_path / "already_exists.pdf"
        existing_out.write_bytes(b"%PDF-1.4\n")
        res = self.run_cli([str(self.sample_pdf), str(existing_out), "Pass"])
        self.assertEqual(res.returncode, 4)
        self.assertIn("Output file already exists", res.stderr)

    def test_cli_existing_output_with_force(self):
        existing_out = self.temp_path / "already_exists.pdf"
        existing_out.write_bytes(b"%PDF-1.4\n")
        res = self.run_cli([str(self.sample_pdf), str(existing_out), "Pass", "--force", "--quiet"])
        self.assertEqual(res.returncode, 0)
        self.assertEqual(res.stdout.strip(), "PDF protected successfully.")

    def test_cli_same_input_and_output(self):
        res = self.run_cli([str(self.sample_pdf), str(self.sample_pdf), "Pass"])
        self.assertEqual(res.returncode, 4)
        self.assertIn("Input and output files must be different", res.stderr)


if __name__ == "__main__":
    unittest.main()
