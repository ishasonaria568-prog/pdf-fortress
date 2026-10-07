#!/usr/bin/env python3
"""
PDF Fortress — Built by Isha Sonaria
Native CLI Launcher
"""

import sys
from pathlib import Path

# Add project root and vendored fallback packages to sys.path
_root = Path(__file__).resolve().parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

_vendor = _root / "python_packages"
if _vendor.exists() and str(_vendor) not in sys.path:
    sys.path.insert(0, str(_vendor))

from app.cli.main import main

if __name__ == "__main__":
    sys.exit(main())
