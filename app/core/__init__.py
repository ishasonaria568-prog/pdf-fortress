"""
PDF Fortress Core Module
"""

from .pdf_protector import (
    protect_pdf,
    verify_protected_pdf,
    PDFProtectorError,
    MissingFileError,
    InvalidPDFError,
    CorruptedPDFError,
    EmptyPasswordError,
    OutputFailureError,
    SamePathOverwriteError,
)
from .validators import validate_input_pdf, validate_output_path, validate_password
from .security import calculate_password_strength

__all__ = [
    "protect_pdf",
    "verify_protected_pdf",
    "validate_input_pdf",
    "validate_output_path",
    "validate_password",
    "calculate_password_strength",
    "PDFProtectorError",
    "MissingFileError",
    "InvalidPDFError",
    "CorruptedPDFError",
    "EmptyPasswordError",
    "OutputFailureError",
    "SamePathOverwriteError",
]
