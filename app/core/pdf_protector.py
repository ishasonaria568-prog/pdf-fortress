"""
PDF Fortress — Core PDF Protection Engine
"""

import os
import sys
from pathlib import Path
from typing import Dict, Any, Optional, Callable

# Prioritize standard Python environment, then fallback to vendor path if needed
try:
    from pypdf import PdfReader, PdfWriter
    from pypdf.errors import PdfReadError
except ImportError:
    _vendor = Path(__file__).resolve().parent.parent.parent / "python_packages"
    if _vendor.exists() and str(_vendor) not in sys.path:
        sys.path.insert(0, str(_vendor))
    try:
        from pypdf import PdfReader, PdfWriter
        from pypdf.errors import PdfReadError
    except ImportError:
        try:
            from PyPDF2 import PdfReader, PdfWriter
            from PyPDF2.errors import PdfReadError
        except ImportError:
            raise ImportError(
                "PDF Fortress requires 'pypdf'. Please install it using:\n"
                "    python -m pip install -r requirements.txt"
            )

from .validators import (
    validate_input_pdf,
    validate_output_path,
    validate_password,
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


def verify_protected_pdf(output_path: Path, password: str) -> Dict[str, Any]:
    """
    Verifies that the generated output PDF exists, is a valid PDF,
    is actively encrypted, and decrypts with the supplied password.
    
    Returns:
        Dict: Information about the verified protected document.
    """
    if not output_path.exists():
        raise VerificationFailureError("Output verification failed: Output file was not created.")

    if output_path.stat().st_size == 0:
        raise VerificationFailureError("Output verification failed: Generated PDF is empty (0 bytes).")

    try:
        reader = PdfReader(str(output_path))
    except Exception as e:
        raise VerificationFailureError(f"Output verification failed: Output file could not be parsed as PDF: {e}")

    if not reader.is_encrypted:
        raise VerificationFailureError("Output verification failed: Output PDF is not encrypted.")

    # Test decrypting with the password to guarantee protection took effect
    try:
        decrypt_result = reader.decrypt(password)
        if not decrypt_result:
            raise VerificationFailureError("Output verification failed: Output file could not be unlocked with the protection password.")
    except Exception as e:
        raise VerificationFailureError(f"Output verification failed during password decryption test: {e}")

    return {
        "verified": True,
        "is_encrypted": True,
        "page_count": len(reader.pages),
        "file_size": output_path.stat().st_size,
    }


def protect_pdf(
    input_path: str,
    output_path: str,
    password: str,
    allow_overwrite: bool = False,
    progress_callback: Optional[Callable[[str, int], None]] = None,
) -> Dict[str, Any]:
    """
    Protects a PDF with password encryption.
    
    Args:
        input_path: Path to the input PDF file.
        output_path: Path to save the protected PDF copy.
        password: The protection password to apply.
        allow_overwrite: Whether to permit overwriting an existing output file.
        progress_callback: Optional callback receiving (stage_name, percent_int).
        
    Returns:
        Dict containing processing metadata and verification results.
    """
    def report(stage: str, percent: int):
        if progress_callback:
            try:
                progress_callback(stage, percent)
            except Exception:
                pass

    # Stage 1: Validate input, password, and output
    report("ANALYZING DOCUMENT", 15)
    valid_input = validate_input_pdf(input_path)
    valid_password = validate_password(password)
    valid_output = validate_output_path(output_path, valid_input, allow_overwrite=allow_overwrite)

    # Stage 2: Read PDF
    report("READING PDF", 35)
    try:
        reader = PdfReader(str(valid_input))
        total_pages = len(reader.pages)
        if total_pages == 0:
            raise CorruptedPDFError("The PDF document contains no pages.")
    except PdfReadError as e:
        raise CorruptedPDFError(f"The PDF could not be read. It may be damaged or unsupported: {e}")
    except (MissingFileError, InvalidPDFError, CorruptedPDFError):
        raise
    except Exception as e:
        raise CorruptedPDFError(f"Unexpected error while opening PDF: {e}")

    # Stage 3: Copy pages to writer
    report("COPYING PAGES", 60)
    writer = PdfWriter()
    for index, page in enumerate(reader.pages):
        try:
            writer.add_page(page)
        except Exception as e:
            raise CorruptedPDFError(f"Failed to copy page {index + 1} from source document: {e}")

    # Copy document metadata if present
    if reader.metadata:
        try:
            writer.add_metadata(reader.metadata)
        except Exception:
            pass

    # Stage 4: Apply encryption
    report("APPLYING PROTECTION", 80)
    try:
        # Standard PDF encryption: user password required to open document
        writer.encrypt(user_password=valid_password)
    except Exception as e:
        raise OutputFailureError(f"Failed to apply encryption to PDF: {e}")

    # Stage 5: Save output file
    try:
        with open(valid_output, "wb") as f_out:
            writer.write(f_out)
    except (OSError, IOError) as e:
        raise OutputFailureError(f"Unable to save the protected PDF. Check output path and permissions: {e}")

    # Stage 6: Verify output
    report("VERIFYING OUTPUT", 95)
    verification = verify_protected_pdf(valid_output, valid_password)

    report("SECURE", 100)

    return {
        "status": "PROTECTED",
        "input_filename": valid_input.name,
        "input_path": str(valid_input),
        "output_filename": valid_output.name,
        "output_path": str(valid_output),
        "page_count": total_pages,
        "file_size": verification["file_size"],
        "verified": True,
        "verification_checks": {
            "output_exists": True,
            "pdf_readable": True,
            "page_count_preserved": True,
            "protection_applied": True,
        },
    }
