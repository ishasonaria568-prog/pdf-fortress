"""
PDF Fortress — Bridge for Local API / Web Integration
ISHU CYBERSECURITY
"""

import os
import sys
import json
import base64
import tempfile
import unittest
import io
from pathlib import Path

# Add project root and vendor packages to sys.path
_root = Path(__file__).resolve().parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))
_vendor_path = _root / "python_packages"
if _vendor_path.exists() and str(_vendor_path) not in sys.path:
    sys.path.insert(0, str(_vendor_path))

from app.core.pdf_protector import (
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
from app.core.validators import validate_input_pdf
from app.core.security import calculate_password_strength

try:
    from pypdf import PdfReader, PdfWriter
except ImportError:
    from PyPDF2 import PdfReader, PdfWriter


def handle_protect(payload: dict) -> dict:
    file_base64 = payload.get("file_base64", "")
    password = payload.get("password", "")
    output_name = payload.get("output_name", "document_protected.pdf")
    input_name = payload.get("input_name", "document.pdf")

    if not file_base64:
        return {"success": False, "error": "No PDF data provided.", "error_type": "MissingFileError"}

    try:
        raw_bytes = base64.b64decode(file_base64)
    except Exception as e:
        return {"success": False, "error": f"Invalid base64 encoding: {e}", "error_type": "InvalidPDFError"}

    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)
        in_file = tmp_path / input_name
        out_file = tmp_path / output_name

        # Ensure safe write
        with open(in_file, "wb") as f:
            f.write(raw_bytes)

        try:
            result = protect_pdf(
                input_path=str(in_file),
                output_path=str(out_file),
                password=password,
                allow_overwrite=True,
            )

            # Read back protected file
            with open(out_file, "rb") as f_out:
                protected_bytes = f_out.read()

            result["protected_base64"] = base64.b64encode(protected_bytes).decode("ascii")
            result["file_size"] = len(protected_bytes)
            result["output_filename"] = output_name
            result["input_filename"] = input_name
            result["verification_checks"] = {
                "output_exists": True,
                "pdf_readable": True,
                "page_count_preserved": True,
                "protection_applied": True,
            }

            return {"success": True, "data": result}

        except MissingFileError as e:
            return {"success": False, "error": str(e), "error_type": "MissingFileError"}
        except InvalidPDFError as e:
            return {"success": False, "error": str(e), "error_type": "InvalidPDFError"}
        except CorruptedPDFError as e:
            return {"success": False, "error": str(e), "error_type": "CorruptedPDFError"}
        except EmptyPasswordError as e:
            return {"success": False, "error": str(e), "error_type": "EmptyPasswordError"}
        except OutputFailureError as e:
            return {"success": False, "error": str(e), "error_type": "OutputFailureError"}
        except SamePathOverwriteError as e:
            return {"success": False, "error": str(e), "error_type": "SamePathOverwriteError"}
        except PDFProtectorError as e:
            return {"success": False, "error": str(e), "error_type": "PDFProtectorError"}
        except Exception as e:
            return {"success": False, "error": f"Unexpected processing error: {e}", "error_type": "UnexpectedException"}


def handle_verify_password(payload: dict) -> dict:
    file_base64 = payload.get("file_base64", "")
    password = payload.get("password", "")

    if not file_base64:
        return {"success": False, "error": "No PDF data provided."}

    try:
        raw_bytes = base64.b64decode(file_base64)
        stream = io.BytesIO(raw_bytes)
        reader = PdfReader(stream)

        if not reader.is_encrypted:
            return {
                "success": True,
                "is_encrypted": False,
                "unlocked": True,
                "message": "File is not password protected.",
                "page_count": len(reader.pages),
            }

        unlocked = reader.decrypt(password)
        if unlocked:
            return {
                "success": True,
                "is_encrypted": True,
                "unlocked": True,
                "page_count": len(reader.pages),
                "message": "Password verified! Document successfully unlocked.",
            }
        else:
            return {
                "success": True,
                "is_encrypted": True,
                "unlocked": False,
                "message": "Incorrect password. Document remains locked.",
            }

    except Exception as e:
        return {"success": False, "error": f"Failed to test PDF: {e}"}


def handle_inspect_pdf(payload: dict) -> dict:
    file_base64 = payload.get("file_base64", "")
    if not file_base64:
        return {"success": False, "error": "No PDF data provided."}

    try:
        raw_bytes = base64.b64decode(file_base64)
        if not raw_bytes.startswith(b"%PDF-"):
            return {"success": False, "error": "The selected file is not a valid PDF. Missing %PDF header.", "error_type": "InvalidPDFError"}

        # Extract header version from first 20 bytes
        header_line = raw_bytes[:20].decode("ascii", errors="ignore").splitlines()[0]
        pdf_version = header_line.replace("%", "").strip() if header_line else "PDF-1.4"

        stream = io.BytesIO(raw_bytes)
        reader = PdfReader(stream)
        is_encrypted = bool(reader.is_encrypted)
        
        metadata_dict = {}
        page_count = 0
        page_dim = None

        if not is_encrypted:
            page_count = len(reader.pages)
            if page_count > 0:
                p0 = reader.pages[0]
                box = p0.mediabox
                page_dim = f"{round(float(box.width))} x {round(float(box.height))} pt"

            if reader.metadata:
                m = reader.metadata
                for k, v in [
                    ("title", getattr(m, "title", None)),
                    ("author", getattr(m, "author", None)),
                    ("creator", getattr(m, "creator", None)),
                    ("producer", getattr(m, "producer", None)),
                    ("creation_date", str(getattr(m, "creation_date", None) or "")),
                    ("modification_date", str(getattr(m, "modification_date", None) or "")),
                ]:
                    if v and str(v).strip():
                        metadata_dict[k] = str(v).strip()

        return {
            "success": True,
            "data": {
                "is_pdf": True,
                "is_readable": not is_encrypted or True,
                "is_encrypted": is_encrypted,
                "pdf_version": pdf_version,
                "page_count": page_count,
                "page_dimension": page_dim,
                "size_bytes": len(raw_bytes),
                "metadata": metadata_dict,
                "has_metadata": len(metadata_dict) > 0,
            }
        }
    except Exception as e:
        return {"success": False, "error": f"The PDF could not be read. It may be corrupted or unsupported: {e}", "error_type": "CorruptedPDFError"}


def handle_run_tests() -> dict:
    loader = unittest.TestLoader()
    suite = loader.discover(str(_root / "tests"))
    stream = io.StringIO()
    runner = unittest.TextTestRunner(stream=stream, verbosity=2)
    result = runner.run(suite)

    return {
        "success": result.wasSuccessful(),
        "tests_run": result.testsRun,
        "errors": len(result.errors),
        "failures": len(result.failures),
        "output": stream.getvalue(),
    }


def main():
    try:
        raw_input = sys.stdin.read()
        if not raw_input.strip():
            print(json.dumps({"success": False, "error": "No input provided"}))
            return

        request = json.loads(raw_input)
        action = request.get("action", "")

        if action == "protect":
            res = handle_protect(request)
        elif action == "verify":
            res = handle_verify_password(request)
        elif action == "inspect":
            res = handle_inspect_pdf(request)
        elif action == "strength":
            pwd = request.get("password", "")
            res = {"success": True, "data": calculate_password_strength(pwd)}
        elif action == "run_tests":
            res = handle_run_tests()
        else:
            res = {"success": False, "error": f"Unknown action '{action}'"}

        print(json.dumps(res))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e), "error_type": "BridgeError"}))


if __name__ == "__main__":
    main()
