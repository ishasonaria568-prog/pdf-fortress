"""
PDF Fortress — Security Utilities
ISHU CYBERSECURITY
"""

import re
from typing import Dict, Any, Tuple


def calculate_password_strength(password: str) -> Dict[str, Any]:
    """
    Evaluates password strength based on entropy, length, and character diversity.
    Does NOT store or log the password.
    
    Returns:
        Dict with 'score' (0-100), 'rating' ('Weak', 'Fair', 'Strong', 'Very Strong'),
        'checks' (dict of passed criteria), and 'recommendation'.
    """
    if not password:
        return {
            "score": 0,
            "rating": "Weak",
            "is_acceptable": False,
            "checks": {
                "min_length": False,
                "has_lowercase": False,
                "has_uppercase": False,
                "has_numbers": False,
                "has_symbols": False,
            },
            "recommendation": "Please enter a protection password.",
        }

    length = len(password)
    has_lowercase = bool(re.search(r"[a-z]", password))
    has_uppercase = bool(re.search(r"[A-Z]", password))
    has_numbers = bool(re.search(r"[0-9]", password))
    has_symbols = bool(re.search(r"[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`]", password))

    score = 0

    # Length scoring
    if length >= 14:
        score += 35
    elif length >= 10:
        score += 25
    elif length >= 8:
        score += 15
    else:
        score += max(5, length * 2)

    # Diversity scoring
    diversity_count = sum([has_lowercase, has_uppercase, has_numbers, has_symbols])
    score += diversity_count * 15

    # Bonus for complex combinations
    if length >= 10 and diversity_count >= 3:
        score += 5

    score = min(100, score)

    if score < 40 or length < 6:
        rating = "Weak"
        is_acceptable = length >= 4
        recommendation = "Use at least 8 characters with a mix of letters, numbers and symbols."
    elif score < 65 or length < 8:
        rating = "Fair"
        is_acceptable = True
        recommendation = "Add symbols or numbers to increase protection resistance."
    elif score < 85:
        rating = "Strong"
        is_acceptable = True
        recommendation = "Good password strength for document protection."
    else:
        rating = "Very Strong"
        is_acceptable = True
        recommendation = "High entropy password. Excellent cryptographic protection."

    return {
        "score": score,
        "rating": rating,
        "is_acceptable": is_acceptable,
        "checks": {
            "min_length": length >= 8,
            "has_lowercase": has_lowercase,
            "has_uppercase": has_uppercase,
            "has_numbers": has_numbers,
            "has_symbols": has_symbols,
        },
        "recommendation": recommendation,
    }


def sanitize_log_message(message: str) -> str:
    """
    Safely sanitizes text by scrubbing sensitive terms to prevent accidental credential leakage.
    """
    return re.sub(r'(?i)(password[\s:=]+)[^\s,]+', r'\1********', message)
