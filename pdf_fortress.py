#!/usr/bin/env python3
"""
PDF Fortress — Built by Isha Sonaria
Native CLI Launcher
"""

import sys
from pathlib import Path

# Add project root to sys.path so app modules are found
_root = Path(__file__).resolve().parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from app.cli.main import main

if __name__ == "__main__":
    sys.exit(main())
