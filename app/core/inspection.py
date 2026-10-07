"""
PDF Fortress — Inspection & Verification Module
Core PDF inspection and verification routines
"""

import os
import sys
from pathlib import Path
from typing import Dict, Any, Optional

# Prioritize standard Python environment, then fallback to vendor path if needed
try:
    from pypdf import PdfReader
    from pypdf.errors import PdfReadError
except ImportError:
    _vendor = Path(__file__).resolve().parent.parent.parent / "python_packages"
    if _vendor.exists() and str(_vendor) not in sys.path:
        sys.path.insert(0, str(_vendor))
    from pypdf import PdfReader
    from pypdf.errors import PdfReadError

from .validators import (
    validate_input_pdf,
    CorruptedPDFError,
    InvalidPDFError,
    MissingFileError,
)


def format_size_mb(num_bytes: int) -> str:
    """Formats bytes into human-readable MB / KB."""
    if num_bytes < 1024:
        return f"{num_bytes} B"
    elif num_bytes < 1024 * 1024:
        return f"{num_bytes / 1024:.2f} KB"
    else:
        return f"{num_bytes / (1024 * 1024):.2f} MB"


def get_pdf_info(pdf_path: str | Path) -> Dict[str, Any]:
    """
    Extracts authentic metadata and structural metrics from a PDF without modifying it.
    Returns:
        Dict with keys: filename, size_bytes, size_formatted, pages, is_readable,
        is_encrypted, metadata, pdf_version.
    """
    path = validate_input_pdf(str(pdf_path))
    size_bytes = path.stat().st_size

    # Extract version from first line
    pdf_version = "PDF-1.4"
    try:
        with open(path, "rb") as f:
            header_line = f.read(30).decode("ascii", errors="ignore").splitlines()[0]
            if header_line.startswith("%PDF-"):
                pdf_version = header_line.replace("%", "").strip()
    except Exception:
        pass

    try:
        reader = PdfReader(str(path))
        is_encrypted = bool(reader.is_encrypted)
        
        pages = 0
        if not is_encrypted:
            pages = len(reader.pages)

        # Extract authentic metadata
        metadata: Dict[str, str] = {
            "title": "Not available",
            "author": "Not available",
            "creator": "Not available",
            "producer": "Not available",
            "creation_date": "Not available",
            "modification_date": "Not available",
        }

        if reader.metadata:
            m = reader.metadata
            if getattr(m, "title", None) and str(m.title).strip():
                metadata["title"] = str(m.title).strip()
            if getattr(m, "author", None) and str(m.author).strip():
                metadata["author"] = str(m.author).strip()
            if getattr(m, "creator", None) and str(m.creator).strip():
                metadata["creator"] = str(m.creator).strip()
            if getattr(m, "producer", None) and str(m.producer).strip():
                metadata["producer"] = str(m.producer).strip()
            if getattr(m, "creation_date", None) and str(m.creation_date).strip():
                metadata["creation_date"] = str(m.creation_date).strip()
            if getattr(m, "modification_date", None) and str(m.modification_date).strip():
                metadata["modification_date"] = str(m.modification_date).strip()

        return {
            "filename": path.name,
            "path": str(path),
            "size_bytes": size_bytes,
            "size_formatted": format_size_mb(size_bytes),
            "pages": pages,
            "is_readable": True,
            "is_encrypted": is_encrypted,
            "pdf_version": pdf_version,
            "metadata": metadata,
        }

    except PdfReadError as e:
        raise CorruptedPDFError(f"The PDF could not be read. It may be damaged or unsupported: {e}")
    except Exception as e:
        raise CorruptedPDFError(f"Error inspecting PDF file: {e}")


def verify_existing_pdf(pdf_path: str | Path, test_password: Optional[str] = None) -> Dict[str, Any]:
    """
    Verifies the protection status and integrity of an existing PDF.
    Returns:
        Dict with keys: filename, is_readable, pages, protection_status, output_integrity, unlocked.
    """
    path = validate_input_pdf(str(pdf_path))

    try:
        reader = PdfReader(str(path))
        is_encrypted = bool(reader.is_encrypted)
        
        pages = 0
        unlocked = False

        if is_encrypted:
            protection_status = "PASSWORD PROTECTED"
            if test_password:
                try:
                    decrypted = reader.decrypt(test_password)
                    if decrypted:
                        unlocked = True
                        pages = len(reader.pages)
                except Exception:
                    unlocked = False
        else:
            protection_status = "NOT PROTECTED"
            pages = len(reader.pages)
            unlocked = True

        return {
            "filename": path.name,
            "path": str(path),
            "is_readable": True,
            "pages": pages,
            "protection_status": protection_status,
            "output_integrity": "VALID",
            "unlocked": unlocked,
            "is_encrypted": is_encrypted,
        }

    except PdfReadError as e:
        return {
            "filename": path.name,
            "path": str(path),
            "is_readable": False,
            "pages": 0,
            "protection_status": "UNKNOWN",
            "output_integrity": "CORRUPT",
            "unlocked": False,
            "is_encrypted": False,
            "error": str(e),
        }
    except Exception as e:
        return {
            "filename": path.name,
            "path": str(path),
            "is_readable": False,
            "pages": 0,
            "protection_status": "UNKNOWN",
            "output_integrity": "INVALID",
            "unlocked": False,
            "is_encrypted": False,
            "error": str(e),
        }
