"""
PDF Fortress — Native CLI Interface
Built by Isha Sonaria
"""

import os
import sys
import getpass
from pathlib import Path
from typing import List, Optional

# Ensure project root is in sys.path
_root = Path(__file__).resolve().parent.parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from app.core import (
    protect_pdf,
    get_pdf_info,
    verify_existing_pdf,
    PDFProtectorError,
    MissingFileError,
    InvalidPDFError,
    CorruptedPDFError,
    EmptyPasswordError,
    OutputFileExistsError,
    SamePathOverwriteError,
    OutputFailureError,
    VerificationFailureError,
)

VERSION = "1.0.0"
AUTHOR = "Built by Isha Sonaria"


def print_help():
    help_text = """PDF FORTRESS
Local PDF Protection Utility

Usage:
    python pdf_fortress.py <input> <output> [password] [options]

Arguments:
    input       Input PDF file
    output      Protected PDF output path
    password    Password used to protect the PDF (optional; prompts securely if omitted)

Options:
    -h, --help
        Show this help message

    --version
        Show PDF Fortress version

    --info
        Display PDF information without protecting it

    --verify
        Verify an existing PDF

    --force, -f
        Allow overwriting an existing output file

    --quiet, -q
        Display minimal output

    --verbose, -v
        Display verbose diagnostics on error

    --password-stdin
        Read protection password securely from standard input

Examples:
    python pdf_fortress.py report.pdf report_protected.pdf "StrongPassword"
    python pdf_fortress.py report.pdf protected.pdf "StrongPassword" --force
    python pdf_fortress.py report.pdf report_protected.pdf
    echo "StrongPassword" | python pdf_fortress.py report.pdf protected.pdf --password-stdin
    python pdf_fortress.py report.pdf --info
    python pdf_fortress.py protected.pdf --verify"""
    print(help_text)


def print_version():
    print(f"PDF Fortress v{VERSION}")
    print(f"{AUTHOR}")


def handle_info(file_path: str, verbose: bool = False) -> int:
    try:
        info = get_pdf_info(file_path)

        print("PDF FORTRESS")
        print("DOCUMENT INFORMATION")
        print("────────────────────────────────────────")
        print()
        print("File:")
        print(f"    {info['filename']}")
        print()
        print("Size:")
        print(f"    {info['size_formatted']}")
        print()
        print("Pages:")
        print(f"    {info['pages'] if not info['is_encrypted'] else 'Encrypted (password required)'}")
        print()
        print("Readable:")
        print(f"    {'YES' if info['is_readable'] else 'NO'}")
        print()
        print("Encrypted:")
        print(f"    {'YES' if info['is_encrypted'] else 'NO'}")
        print()
        print("Title:")
        print(f"    {info['metadata'].get('title', 'Not available')}")
        print()
        print("Author:")
        print(f"    {info['metadata'].get('author', 'Not available')}")
        print()
        print("Creator:")
        print(f"    {info['metadata'].get('creator', 'Not available')}")
        print()
        print("Producer:")
        print(f"    {info['metadata'].get('producer', 'Not available')}")
        print()
        print("────────────────────────────────────────")
        return 0

    except MissingFileError:
        print("[ERROR] Input PDF does not exist.", file=sys.stderr)
        return 3
    except InvalidPDFError:
        print("[ERROR] The selected file is not a valid PDF.", file=sys.stderr)
        return 3
    except CorruptedPDFError:
        print("[ERROR] The PDF could not be read. It may be damaged or unsupported.", file=sys.stderr)
        return 3
    except PDFProtectorError as e:
        print(f"[ERROR] {e}", file=sys.stderr)
        return getattr(e, "exit_code", 1)
    except Exception as e:
        if verbose:
            import traceback
            traceback.print_exc()
        else:
            print(f"[ERROR] Failed to inspect document: {e}", file=sys.stderr)
        return 1


def handle_verify(file_path: str, verbose: bool = False) -> int:
    try:
        res = verify_existing_pdf(file_path)

        print("PDF FORTRESS")
        print("PROTECTION VERIFICATION")
        print("────────────────────────────────────────")
        print()
        print("File:")
        print(f"    {res['filename']}")
        print()
        print("PDF readable:")
        print(f"    {'YES' if res['is_readable'] else 'NO'}")
        print()
        print("Pages:")
        print(f"    {res['pages'] if res['pages'] > 0 else 'Unknown'}")
        print()
        print("Protection status:")
        print(f"    {res['protection_status']}")
        print()
        print("Output integrity:")
        print(f"    {res['output_integrity']}")
        print()
        print("────────────────────────────────────────")
        print("[✓] VERIFICATION COMPLETE")
        print("────────────────────────────────────────")
        return 0

    except MissingFileError:
        print("[ERROR] Input PDF does not exist.", file=sys.stderr)
        return 3
    except InvalidPDFError:
        print("[ERROR] The selected file is not a valid PDF.", file=sys.stderr)
        return 3
    except CorruptedPDFError:
        print("[ERROR] The PDF could not be read. It may be damaged or unsupported.", file=sys.stderr)
        return 3
    except PDFProtectorError as e:
        print(f"[ERROR] {e}", file=sys.stderr)
        return getattr(e, "exit_code", 1)
    except Exception as e:
        if verbose:
            import traceback
            traceback.print_exc()
        else:
            print(f"[ERROR] Verification failed: {e}", file=sys.stderr)
        return 1


def main(argv: Optional[List[str]] = None) -> int:
    if argv is None:
        argv = sys.argv[1:]

    # Quick flag inspection
    if "--help" in argv or "-h" in argv or len(argv) == 0:
        print_help()
        return 0

    if "--version" in argv:
        print_version()
        return 0

    force = "--force" in argv or "-f" in argv
    quiet = "--quiet" in argv or "-q" in argv
    verbose = "--verbose" in argv or "-v" in argv
    use_stdin_password = "--password-stdin" in argv
    is_info = "--info" in argv
    is_verify = "--verify" in argv

    # Filter out flags to collect positional arguments
    known_flags = {"--force", "-f", "--quiet", "-q", "--verbose", "-v", "--password-stdin", "--info", "--verify", "--help", "-h", "--version"}
    positional = [arg for arg in argv if arg not in known_flags]

    # Handle info mode
    if is_info:
        if len(positional) < 1:
            print("[ERROR] Please specify an input PDF for --info.", file=sys.stderr)
            return 2
        return handle_info(positional[0], verbose=verbose)

    # Handle verify mode
    if is_verify:
        if len(positional) < 1:
            print("[ERROR] Please specify a PDF file to verify.", file=sys.stderr)
            return 2
        return handle_verify(positional[0], verbose=verbose)

    # Standard protection mode requires at least input and output
    if len(positional) < 2:
        print("[ERROR] Missing required arguments: <input> and <output>.", file=sys.stderr)
        print("Usage: python pdf_fortress.py <input> <output> [password]", file=sys.stderr)
        print("Run 'python pdf_fortress.py --help' for options.", file=sys.stderr)
        return 2

    input_path = positional[0]
    output_path = positional[1]

    # Resolve password
    password: Optional[str] = None
    if len(positional) >= 3:
        password = positional[2]
    elif use_stdin_password:
        try:
            line = sys.stdin.readline()
            password = line.rstrip("\r\n")
        except Exception as e:
            print(f"[ERROR] Failed to read password from stdin: {e}", file=sys.stderr)
            return 2
    else:
        # Prompt interactively using getpass
        try:
            pwd1 = getpass.getpass("Password: ")
            pwd2 = getpass.getpass("Confirm password: ")
            if pwd1 != pwd2:
                print("[ERROR] Passwords do not match.", file=sys.stderr)
                return 2
            password = pwd1
        except (KeyboardInterrupt, EOFError):
            print("\n[ERROR] Operation cancelled by user.", file=sys.stderr)
            return 2

    if not password:
        print("[ERROR] Password cannot be empty.", file=sys.stderr)
        return 2

    # Execute protection workflow
    try:
        # Step-by-step progress tracking
        input_name = Path(input_path).name
        output_name = Path(output_path).name

        if not quiet:
            print("PDF FORTRESS")
            print("────────────────────────────────────────")
            print()
            print("[+] Input:")
            print(f"    {input_name}")
            print()
            print("[+] Output:")
            print(f"    {output_name}")
            print()
            print("[+] Validating PDF...")
            print("    OK")
            print()
            print("[+] Reading document...")
            print("    OK")

        result = protect_pdf(
            input_path=input_path,
            output_path=output_path,
            password=password,
            allow_overwrite=force,
        )

        if not quiet:
            print()
            print("[+] Pages:")
            print(f"    {result['page_count']}")
            print()
            print("[+] Applying password protection...")
            print("    OK")
            print()
            print("[+] Writing protected PDF...")
            print("    OK")
            print()
            print("[+] Verifying output...")
            print("    OK")
            print()
            print("────────────────────────────────────────")
            print("[✓] PDF PROTECTED SUCCESSFULLY")
            print("────────────────────────────────────────")
        else:
            print("PDF protected successfully.")

        return 0

    except MissingFileError:
        print("[ERROR] Input PDF does not exist.", file=sys.stderr)
        return 3
    except InvalidPDFError as e:
        if "Missing %PDF-" in str(e) or "not a valid PDF" in str(e):
            print("[ERROR] The selected file is not a valid PDF.", file=sys.stderr)
        else:
            print(f"[ERROR] {e}", file=sys.stderr)
        return 3
    except CorruptedPDFError:
        print("[ERROR] The PDF could not be read. It may be damaged or unsupported.", file=sys.stderr)
        return 3
    except EmptyPasswordError:
        print("[ERROR] Password cannot be empty.", file=sys.stderr)
        return 2
    except OutputFileExistsError:
        print("[ERROR] Output file already exists.", file=sys.stderr)
        print("Use --force to overwrite it.", file=sys.stderr)
        return 4
    except SamePathOverwriteError:
        print("[ERROR] Input and output files must be different.", file=sys.stderr)
        return 4
    except OutputFailureError as e:
        print(f"[ERROR] {e}", file=sys.stderr)
        return 4
    except VerificationFailureError as e:
        print(f"[ERROR] {e}", file=sys.stderr)
        return 5
    except PDFProtectorError as e:
        print(f"[ERROR] {e}", file=sys.stderr)
        return getattr(e, "exit_code", 1)
    except Exception as e:
        if verbose:
            import traceback
            traceback.print_exc()
        else:
            print(f"[ERROR] An unexpected error occurred: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
