"""
PDF Fortress — Bridge for Local API / Web Integration
Connects Express Server to Core PDF Engine
"""

import os
import sys
import json
import base64
import tempfile
import unittest
import io
from pathlib import Path

# Add project root to sys.path
_root = Path(__file__).resolve().parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from app.core import (
    protect_pdf,
    verify_protected_pdf,
    get_pdf_info,
    verify_existing_pdf,
    calculate_password_strength,
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

            return {"success": True, "data": result}

        except MissingFileError as e:
            return {"success": False, "error": str(e), "error_type": "MissingFileError"}
        except InvalidPDFError as e:
            return {"success": False, "error": str(e), "error_type": "InvalidPDFError"}
        except CorruptedPDFError as e:
            return {"success": False, "error": str(e), "error_type": "CorruptedPDFError"}
        except EmptyPasswordError as e:
            return {"success": False, "error": str(e), "error_type": "EmptyPasswordError"}
        except OutputFileExistsError as e:
            return {"success": False, "error": str(e), "error_type": "OutputFileExistsError"}
        except SamePathOverwriteError as e:
            return {"success": False, "error": str(e), "error_type": "SamePathOverwriteError"}
        except OutputFailureError as e:
            return {"success": False, "error": str(e), "error_type": "OutputFailureError"}
        except VerificationFailureError as e:
            return {"success": False, "error": str(e), "error_type": "VerificationFailureError"}
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
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            tmp.write(raw_bytes)
            tmp_path = tmp.name

        try:
            info = verify_existing_pdf(tmp_path, test_password=password)
            if not info["is_encrypted"]:
                return {
                    "success": True,
                    "is_encrypted": False,
                    "unlocked": True,
                    "message": "File is not password protected.",
                    "page_count": info["pages"],
                }
            elif info["unlocked"]:
                return {
                    "success": True,
                    "is_encrypted": True,
                    "unlocked": True,
                    "page_count": info["pages"],
                    "message": "Password verified! Document successfully unlocked.",
                }
            else:
                return {
                    "success": True,
                    "is_encrypted": True,
                    "unlocked": False,
                    "message": "Incorrect password. Document remains locked.",
                }
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    except Exception as e:
        return {"success": False, "error": f"Failed to test PDF: {e}"}


def handle_inspect_pdf(payload: dict) -> dict:
    file_base64 = payload.get("file_base64", "")
    if not file_base64:
        return {"success": False, "error": "No PDF data provided."}

    try:
        raw_bytes = base64.b64decode(file_base64)
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            tmp.write(raw_bytes)
            tmp_path = tmp.name

        try:
            info = get_pdf_info(tmp_path)
            return {
                "success": True,
                "data": {
                    "is_pdf": True,
                    "is_readable": info["is_readable"],
                    "is_encrypted": info["is_encrypted"],
                    "pdf_version": info["pdf_version"],
                    "page_count": info["pages"],
                    "size_bytes": info["size_bytes"],
                    "metadata": info["metadata"],
                    "has_metadata": any(v != "Not available" for v in info["metadata"].values()),
                }
            }
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    except (InvalidPDFError, CorruptedPDFError) as e:
        return {"success": False, "error": str(e), "error_type": type(e).__name__}
    except Exception as e:
        return {"success": False, "error": f"The PDF could not be read: {e}", "error_type": "CorruptedPDFError"}


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
