"""
PDF Fortress — Validation Module
Core Validation & Exception Classes
"""

import os
from pathlib import Path
from typing import Optional


class PDFProtectorError(Exception):
    """Base exception for PDF Fortress errors."""
    exit_code = 1


class MissingFileError(PDFProtectorError):
    """Raised when the specified PDF file cannot be found."""
    exit_code = 3


class InvalidPDFError(PDFProtectorError):
    """Raised when the file is not a valid PDF."""
    exit_code = 3


class CorruptedPDFError(PDFProtectorError):
    """Raised when the PDF file is corrupted or unreadable."""
    exit_code = 3


class EmptyPasswordError(PDFProtectorError):
    """Raised when an empty or whitespace-only password is provided."""
    exit_code = 2


class OutputFailureError(PDFProtectorError):
    """Raised when output file cannot be written or saved."""
    exit_code = 4


class OutputFileExistsError(OutputFailureError):
    """Raised when output file already exists without --force."""
    exit_code = 4


class SamePathOverwriteError(OutputFailureError):
    """Raised when input and output paths are identical."""
    exit_code = 4


class VerificationFailureError(OutputFailureError):
    """Raised when verification of the protected file fails."""
    exit_code = 5


def validate_input_pdf(input_path: str) -> Path:
    """
    Validates that the input path exists, is a file, has a .pdf extension,
    is non-empty, and possesses a valid PDF header.
    
    Returns:
        Path: Resolved absolute path.
    """
    if not input_path or not str(input_path).strip():
        raise MissingFileError("Input PDF does not exist.")

    # Expand user home directory (~) and resolve
    path = Path(input_path).expanduser().resolve()

    if not path.exists():
        raise MissingFileError(f"Input PDF does not exist: '{path.name}'")

    if not path.is_file():
        raise InvalidPDFError(f"The selected target is not a file: '{path.name}'")

    if path.suffix.lower() != ".pdf":
        raise InvalidPDFError("The selected file is not a valid PDF. Must end with .pdf extension.")

    # Check file size
    try:
        size = path.stat().st_size
        if size == 0:
            raise CorruptedPDFError("The PDF could not be read. File is empty (0 bytes).")
    except OSError as e:
        raise InvalidPDFError(f"Unable to read file metadata: {e}")

    # Check PDF magic bytes (%PDF-)
    try:
        with open(path, "rb") as f:
            header = f.read(1024)
            if b"%PDF-" not in header:
                raise InvalidPDFError("The selected file is not a valid PDF. Missing %PDF- header.")
    except (OSError, IOError) as e:
        raise CorruptedPDFError(f"The PDF could not be read. It may be damaged or inaccessible: {e}")

    return path


def validate_output_path(output_path: str, input_path: Path, allow_overwrite: bool = False) -> Path:
    """
    Validates output path: ensures .pdf extension, verifies parent directory,
    rejects same input/output unless explicitly allowed, and checks for existing output unless allow_overwrite is True.
    
    Returns:
        Path: Resolved output path.
    """
    if not output_path or not str(output_path).strip():
        raise OutputFailureError("Output path cannot be empty.")

    out = Path(output_path).expanduser().resolve()

    if out.suffix.lower() != ".pdf":
        raise OutputFailureError("Output file must have a .pdf extension.")

    # Prevent overwriting original source file without explicit overwrite permission
    if out == input_path and not allow_overwrite:
        raise SamePathOverwriteError("Input and output files must be different.")

    # Check if output already exists (and is different from input)
    if out.exists() and not allow_overwrite:
        raise OutputFileExistsError("Output file already exists. Use --force to overwrite it.")

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
        raise EmptyPasswordError("Password cannot be empty.")
    
    return password
