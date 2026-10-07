"""
PDF Fortress — CLI Interface
ISHU CYBERSECURITY

Command-Line Utility for PDF Protection
"""

import sys
import argparse
from pathlib import Path

# Add project root to sys.path so it works seamlessly
_root = Path(__file__).resolve().parent.parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from app.core.pdf_protector import (
    protect_pdf,
    PDFProtectorError,
    MissingFileError,
    InvalidPDFError,
    CorruptedPDFError,
    EmptyPasswordError,
    OutputFailureError,
    SamePathOverwriteError,
)
from app.core.security import calculate_password_strength


def parse_args(args=None):
    parser = argparse.ArgumentParser(
        prog="pdf_fortress",
        description="PDF Fortress — Secure PDF Protection Utility by ISHU CYBERSECURITY",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python pdf_fortress.py document.pdf document_protected.pdf "StrongPass#2026"
  python pdf_fortress.py confidential.pdf confidential_sec.pdf "MyPass123" --force

Privacy & Security:
  - Local processing only. No cloud upload.
  - Protection passwords are never saved, logged, or printed to the terminal.
        """,
    )

    parser.add_argument("input_pdf", help="Path to the input PDF file to protect")
    parser.add_argument("output_pdf", help="Path where the protected PDF will be written")
    parser.add_argument("password", help="Protection password (never logged or displayed)")
    parser.add_argument("-f", "--force", action="store_true", help="Force overwrite if output file exists")
    parser.add_argument("-v", "--verbose", action="store_true", help="Display verbose diagnostic details on error")

    return parser.parse_args(args)


def main(args=None) -> int:
    parsed = parse_args(args)

    input_filename = Path(parsed.input_pdf).name

    print("[PDF FORTRESS]")
    print(f"[+] Input: {input_filename}")

    # Check password strength guidance
    strength = calculate_password_strength(parsed.password)
    if strength["rating"] == "Weak":
        print(f"[!] Warning: Password strength is Weak. {strength['recommendation']}")

    print("[+] Reading PDF...")
    print("[+] Applying protection...")
    print("[+] Saving output...")

    try:
        result = protect_pdf(
            input_path=parsed.input_pdf,
            output_path=parsed.output_pdf,
            password=parsed.password,
            allow_overwrite=parsed.force,
        )

        print("[+] Verification successful")
        print()
        print("[SUCCESS] PDF protected successfully.")
        print(f"    Output: {result['output_filename']} ({result['file_size']} bytes, {result['page_count']} pages)")
        print("    Status: PROTECTED")
        return 0

    except MissingFileError as e:
        print(f"\n[ERROR] PDF file not found: {e}", file=sys.stderr)
        return 1
    except InvalidPDFError as e:
        print(f"\n[ERROR] Invalid PDF: {e}", file=sys.stderr)
        return 1
    except CorruptedPDFError as e:
        print(f"\n[ERROR] Corrupted PDF: {e}", file=sys.stderr)
        return 1
    except EmptyPasswordError:
        print("\n[ERROR] Please enter a protection password.", file=sys.stderr)
        return 1
    except SamePathOverwriteError as e:
        print(f"\n[ERROR] {e}", file=sys.stderr)
        print("    Hint: Use --force or specify a distinct output file name.", file=sys.stderr)
        return 1
    except OutputFailureError as e:
        print(f"\n[ERROR] Output failure: {e}", file=sys.stderr)
        return 1
    except PDFProtectorError as e:
        print(f"\n[ERROR] Protection failure: {e}", file=sys.stderr)
        return 1
    except Exception as e:
        if parsed.verbose:
            import traceback
            traceback.print_exc()
        else:
            print(f"\n[ERROR] An unexpected error occurred while processing the PDF: {e}", file=sys.stderr)
            print("    Run with -v/--verbose for diagnostic details.", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
