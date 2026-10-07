# PDF Fortress

**Private documents. Protected by design.**  
*Built by Isha Sonaria*

Password-protect your PDF files locally, without sending your documents to the cloud.

---

## Features

- **Standard PDF Password Protection**: Applies user password security handler to encrypt documents so viewers prompt for a password prior to rendering.
- **Local Processing Only**: Zero cloud upload, no external API telemetry, and complete on-device execution.
- **Python CLI & Minimal Modern Interface**: Seamless workflow via terminal command line or clean, editorial web interface.
- **Robust Input & Output Validation**:
  - Validates `.pdf` extension, magic bytes (`%PDF-`), and file accessibility.
  - Rejects empty, corrupted, or unreadable source documents with clear diagnostic feedback.
  - Guards against accidental source file overwrites.
- **Output Verification**: Verifies output existence, ensures the file is encrypted, and tests decryption prior to reporting success.
- **Password Strength Guidance**: Evaluates entropy, length, and character diversity without logging or storing credentials.
- **Midnight Security / Editorial Aesthetic**: Minimal, calm, dark navy `#07111F` aesthetic with cyan accents.

---

## Author & Profiles

- **Developer**: Isha Sonaria
- **GitHub**: [ishasonaria568-prog](https://github.com/ishasonaria568-prog)
- **LinkedIn**: [isha-sonaria](https://www.linkedin.com/in/isha-sonaria/)

---

## Technologies

- **Python 3.10+**: Core encryption engine, validation layer, and CLI.
- **pypdf**: Standard PDF document handling and security handler.
- **TypeScript & React 19**: Modern cybersecurity console interface with local PDF processing.
- **Tailwind CSS**: Precision styling with dark obsidian palette and technical typography.
- **Standard Library Unittest**: Automated regression testing suite.

---

## Project Structure

```text
pdf_fortress/
│
├── app/
│   ├── __init__.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── pdf_protector.py    # Main protection workflow & verification
│   │   ├── validators.py       # Input, output, and format validation
│   │   └── security.py         # Password strength scoring & sanitization
│   │
│   ├── cli/
│   │   ├── __init__.py
│   │   └── main.py             # Command-line interface entry point
│   │
│   └── ui/                     # Web/Console application components
│
├── tests/
│   ├── __init__.py
│   ├── test_pdf_protector.py   # Encryption, multi-page, & verification tests
│   ├── test_validation.py      # Missing file, weak password, & path tests
│   └── test_errors.py          # Corrupt PDF & error resilience tests
│
├── pdf_fortress.py             # Top-level CLI launcher
├── requirements.txt
├── README.md
└── LICENSE
```

---

## Installation

### 1. Python Environment (Kali Linux / Debian / Ubuntu / macOS)

```bash
git clone https://github.com/ishasonaria568-prog/pdf-fortress.git
cd pdf-fortress
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

*Tip for Kali Linux (PEP 668 managed environments):*
```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

### 2. Run Test Suite

```bash
python3 -m unittest discover tests
```

---

## CLI Usage

PDF Fortress includes a native, full-featured CLI engineered for Kali Linux and terminal workstations.

### 1. Basic Protection

```bash
python pdf_fortress.py input.pdf output.pdf "StrongPassword"
```

Terminal output:
```text
PDF FORTRESS
────────────────────────────────────────

[+] Input:
    input.pdf

[+] Output:
    output.pdf

[+] Validating PDF...
    OK

[+] Reading document...
    OK

[+] Pages:
    12

[+] Applying password protection...
    OK

[+] Writing protected PDF...
    OK

[+] Verifying output...
    OK

────────────────────────────────────────
[✓] PDF PROTECTED SUCCESSFULLY
────────────────────────────────────────
```

### 2. Interactive Password Prompt (Secure, Hidden Input)

```bash
python pdf_fortress.py input.pdf output.pdf
```
Prompts for password and confirmation without echoing characters to the terminal.

### 3. Standard Input (Piped / Scripting)

```bash
echo "StrongPassword" | python pdf_fortress.py input.pdf output.pdf --password-stdin
```

### 4. Overwrite Existing Output (`--force`)

```bash
python pdf_fortress.py report.pdf protected.pdf "StrongPassword" --force
```

### 5. Document Information (`--info`)

Inspects metadata, structural metrics, and encryption status without modifying the file:

```bash
python pdf_fortress.py document.pdf --info
```

### 6. Protection Verification (`--verify`)

Verifies the integrity and security handler status of an existing PDF:

```bash
python pdf_fortress.py protected.pdf --verify
```

### 7. Help & Version

```bash
python pdf_fortress.py --help
python pdf_fortress.py --version
```

### CLI Exit Codes

| Code | Meaning |
|---|---|
| `0` | Success |
| `1` | General runtime error |
| `2` | Invalid usage, argument mismatch, or empty password |
| `3` | Input PDF error (missing, invalid, or corrupt) |
| `4` | Output file error (already exists without `--force`, unwriteable, or same as input) |
| `5` | Verification failure |

---

## Graphical Interface (Web Workstation)

The existing graphical interface remains available separately.

1. Start the workstation server:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:3000` in your browser.
2. Open `http://localhost:3000` in your browser.
3. Drag-and-drop any `.pdf` document or click **Try Sample PDF**.
4. Enter your protection password and observe the real-time strength meter.
5. Click **🔐 PROTECT PDF**.
6. The app verifies the output and presents one-click download and an in-browser verification test.

---

## Security Notes

Honest cryptographic disclosure:
- **What PDF Password Protection Provides**: PDF standard encryption (Standard Security Handler) encrypts document content streams and dictionary objects. Legitimate PDF readers (Adobe Acrobat, Chrome PDF Viewer, Apple Preview, Foxit, PDF.js) will require the password before rendering any document contents.
- **What It Does Not Provide**: PDF standard encryption is only as secure as the chosen password. Short or common passwords are vulnerable to offline brute-force or dictionary attacks. Always select high-entropy passwords with letters, numbers, and symbols.
- **Privacy Assurance**: Both the CLI and Web Console operate **strictly locally**. Zero files or passwords are ever transmitted over the network or saved in server logs.

---

## Project Learning Outcomes

This project demonstrates core computer science and cybersecurity engineering principles:
1. **Python File Handling**: Managing binary streams (`rb` / `wb`), temporary files, safe file pointers, and preventing race conditions or disk overwrites.
2. **PDF Structure & Document Processing**: Parsing PDF xref tables, trailers, catalog objects, and manipulating page trees.
3. **Cryptographic Protection**: Implementing the PDF standard security handler and verifying encryption state.
4. **Command-Line Arguments & POSIX Tool Design**: Building structured CLIs with `argparse`, proper exit codes, and sanitized terminal outputs.
5. **Defensive Programming & Exception Handling**: Creating domain-specific error hierarchies (`MissingFileError`, `InvalidPDFError`, `CorruptedPDFError`) and validating input before invoking low-level operations.
6. **Secure Credential Handling**: Enforcing privacy rules where sensitive credentials are never written to logs or telemetry.

---

© 2026 ISHU CYBERSECURITY • Secure. Encrypt. Protect.
