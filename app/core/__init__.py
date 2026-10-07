"""
PDF Fortress — Core Engine
"""

from .pdf_protector import protect_pdf, verify_protected_pdf
from .inspection import get_pdf_info, verify_existing_pdf
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
from .security import calculate_password_strength

__all__ = [
    "protect_pdf",
    "verify_protected_pdf",
    "get_pdf_info",
    "verify_existing_pdf",
    "validate_input_pdf",
    "validate_output_path",
    "validate_password",
    "calculate_password_strength",
    "PDFProtectorError",
    "MissingFileError",
    "InvalidPDFError",
    "CorruptedPDFError",
    "EmptyPasswordError",
    "OutputFileExistsError",
    "SamePathOverwriteError",
    "OutputFailureError",
    "VerificationFailureError",
]
