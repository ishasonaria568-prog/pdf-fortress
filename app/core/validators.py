"""
PDF Fortress — Validation Module
ISHU CYBERSECURITY
"""

import os
from pathlib import Path
from typing import Tuple, Optional


class PDFProtectorError(Exception):
    """Base exception for PDF Fortress errors."""
    pass


class MissingFileError(PDFProtectorError):
    """Raised when the specified PDF file cannot be found."""
    pass


class InvalidPDFError(PDFProtectorError):
    """Raised when the file is not a valid PDF."""
    pass


class CorruptedPDFError(PDFProtectorError):
    """Raised when the PDF file is corrupted or unreadable."""
    pass


class EmptyPasswordError(PDFProtectorError):
    """Raised when an empty or whitespace-only password is provided."""
    pass


class SamePathOverwriteError(PDFProtectorError):
    """Raised when input and output paths are the same without overwrite permission."""
    pass


class OutputFailureError(PDFProtectorError):
    """Raised when output file cannot be written or saved."""
    pass


def validate_input_pdf(input_path: str) -> Path:
    """
    Validates that the input path exists, is a file, has a .pdf extension,
    is non-empty, and possesses a valid PDF header.
    
    Returns:
        Path: Resolved absolute path.
    """
    if not input_path:
        raise MissingFileError("PDF file path cannot be empty.")

    path = Path(input_path).resolve()

    if not path.exists():
        raise MissingFileError(f"PDF file not found: {path.name}")

    if not path.is_file():
        raise InvalidPDFError(f"Selected target is not a file: {path.name}")

    if path.suffix.lower() != ".pdf":
        raise InvalidPDFError("The selected file is not a valid PDF. Must end with .pdf extension.")

    # Check file size
    try:
        size = path.stat().st_size
        if size == 0:
            raise CorruptedPDFError("The PDF file is empty (0 bytes).")
    except OSError as e:
        raise InvalidPDFError(f"Unable to read file metadata: {e}")

    # Check PDF magic bytes (%PDF-)
    try:
        with open(path, "rb") as f:
            header = f.read(1024)
            if b"%PDF-" not in header:
                raise InvalidPDFError("The selected file is not a valid PDF. Missing %PDF header.")
    except (OSError, IOError) as e:
        raise CorruptedPDFError(f"The PDF could not be read. It may be corrupted or inaccessible: {e}")

    return path


def validate_output_path(output_path: str, input_path: Path, allow_overwrite: bool = False) -> Path:
    """
    Validates output path: ensure .pdf extension, verify parent directory,
    and prevent accidental overwrite of original input file.
    
    Returns:
        Path: Resolved output path.
    """
    if not output_path:
        raise OutputFailureError("Output path cannot be empty.")

    out = Path(output_path).resolve()

    if out.suffix.lower() != ".pdf":
        raise OutputFailureError("Output file must have a .pdf extension.")

    # Prevent accidental overwrite of the source file
    if out == input_path and not allow_overwrite:
        raise SamePathOverwriteError(
            "Output file cannot be identical to the original input file. "
            "Use a different name (e.g. filename_protected.pdf) or specify overwrite permission."
        )

    # Check parent directory
    parent = out.parent
    if not parent.exists():
        try:
            parent.mkdir(parents=True, exist_ok=True)
        except OSError as e:
            raise OutputFailureError(f"Unable to create output directory '{parent}': {e}")

    if not os.access(parent, os.W_OK):
        raise OutputFailureError(f"Unable to save the protected PDF. Check output path and write permissions in '{parent}'.")

    return out


def validate_password(password: Optional[str]) -> str:
    """
    Validates that a password is provided and non-empty.
    
    Returns:
        str: Validated password string.
    """
    if password is None or len(password) == 0:
        raise EmptyPasswordError("Please enter a protection password.")
    
    return password
