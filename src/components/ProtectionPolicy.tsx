import React, { useState, useEffect } from 'react';
import {
  Lock,
  Key,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  FolderOutput,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { DocumentAnalysisData } from '../types';

interface ProtectionPolicyProps {
  document: DocumentAnalysisData;
  onApplyProtection: (password: string, outputFilename: string) => void;
  isProcessing: boolean;
}

export type PasswordRating = 'Weak' | 'Fair' | 'Strong' | 'Very Strong';

export interface StrengthAnalysis {
  score: number;
  rating: PasswordRating;
  feedback: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
}

export function evaluateStrength(password: string): StrengthAnalysis {
  if (!password) {
    return {
      score: 0,
      rating: 'Weak',
      feedback: 'Enter a protection password.',
      checks: {
        length: false,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false,
      },
    };
  }

  const length = password.length;
  const uppercase = /[A-Z]/.test(password);
  const lowercase = /[a-z]/.test(password);
  const numbers = /[0-9]/.test(password);
  const symbols = /[^a-zA-Z0-9]/.test(password);

  let score = 0;
  if (length >= 14) score += 35;
  else if (length >= 10) score += 25;
  else if (length >= 8) score += 15;
  else score += length * 2;

  const diversity = [uppercase, lowercase, numbers, symbols].filter(Boolean).length;
  score += diversity * 15;
  score = Math.min(100, score);

  let rating: PasswordRating = 'Weak';
  let feedback = 'Use at least 8 characters with numbers and symbols.';

  if (score < 40 || length < 6) {
    rating = 'Weak';
    feedback = 'Weak entropy. Vulnerable to dictionary attacks.';
  } else if (score < 65 || length < 8) {
    rating = 'Fair';
    feedback = 'Fair. Add numbers or special characters to strengthen.';
  } else if (score < 85) {
    rating = 'Strong';
    feedback = 'Strong. Good resistance against brute force.';
  } else {
    rating = 'Very Strong';
    feedback = 'Very strong entropy. Cryptographically robust.';
  }

  return {
    score,
    rating,
    feedback,
    checks: {
      length: length >= 8,
      uppercase,
      lowercase,
      numbers,
      symbols,
    },
  };
}

export const ProtectionPolicy: React.FC<ProtectionPolicyProps> = ({
  document,
  onApplyProtection,
  isProcessing,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [outputFilename, setOutputFilename] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [allowOverwrite, setAllowOverwrite] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const strength = evaluateStrength(password);

  // Auto-generate suggested output name
  useEffect(() => {
    if (document.filename) {
      const dotIndex = document.filename.lastIndexOf('.');
      if (dotIndex !== -1) {
        const base = document.filename.substring(0, dotIndex);
        setOutputFilename(`${base}_protected.pdf`);
      } else {
        setOutputFilename(`${document.filename}_protected.pdf`);
      }
    }
  }, [document.filename]);

  const ratingColors: Record<PasswordRating, string> = {
    Weak: 'text-[#FF6577]',
    Fair: 'text-[#F3C969]',
    Strong: 'text-[#4DE3FF]',
    'Very Strong': 'text-[#48D597]',
  };

  const barColors: Record<PasswordRating, string> = {
    Weak: 'bg-[#FF6577]',
    Fair: 'bg-[#F3C969]',
    Strong: 'bg-[#4DE3FF]',
    'Very Strong': 'bg-[#48D597]',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!password) {
      setValidationError('Enter a password before protecting the document.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!outputFilename.trim().toLowerCase().endsWith('.pdf')) {
      setValidationError('Output filename must end with .pdf extension.');
      return;
    }

    if (
      outputFilename.trim().toLowerCase() === document.filename.toLowerCase() &&
      !allowOverwrite
    ) {
      setValidationError(
        'Output filename matches original document. Check the overwrite confirmation box to proceed.'
      );
      return;
    }

    onApplyProtection(password, outputFilename.trim());
  };

  const isFormValid =
    password.length > 0 &&
    password === confirmPassword &&
    outputFilename.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Policy Configuration Card */}
      <div className="p-6 rounded-2xl bg-[#111821] border border-[#202B37] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#202B37]">
          <div>
            <h3 className="text-sm font-bold font-mono tracking-wide text-[#F2F5F7] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#4DE3FF]" />
              PROTECTION POLICY
            </h3>
            <p className="text-xs text-[#A4AFBC] mt-0.5">
              Define password credentials and output destination for the secured copy.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#66717E] hidden sm:inline">
            POLICY CONFIGURATION
          </span>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#F2F5F7] font-mono">
                Password
              </label>
              {password && (
                <span className={`text-[11px] font-mono font-bold ${ratingColors[strength.rating]}`}>
                  {strength.rating}
                </span>
              )}
            </div>

            <div className="relative rounded-xl bg-[#0C1118] border border-[#202B37] focus-within:border-[#4DE3FF] transition-all">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter protection password"
                disabled={isProcessing}
                autoComplete="new-password"
                className="w-full bg-transparent px-3.5 py-2.5 pr-10 text-xs font-mono text-[#F2F5F7] placeholder-[#66717E] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#66717E] hover:text-[#A4AFBC] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#F2F5F7] font-mono">
                Confirm password
              </label>
              {confirmPassword && (
                <span
                  className={`text-[11px] font-mono ${
                    password === confirmPassword ? 'text-[#48D597]' : 'text-[#FF6577]'
                  }`}
                >
                  {password === confirmPassword ? '✓ Matches' : 'Mismatch'}
                </span>
              )}
            </div>

            <div className="relative rounded-xl bg-[#0C1118] border border-[#202B37] focus-within:border-[#4DE3FF] transition-all">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter protection password"
                disabled={isProcessing}
                autoComplete="new-password"
                className="w-full bg-transparent px-3.5 py-2.5 pr-10 text-xs font-mono text-[#F2F5F7] placeholder-[#66717E] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#66717E] hover:text-[#A4AFBC] cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Password Strength Meter & Evaluation (Section 13) */}
        {password.length > 0 && (
          <div className="p-3.5 rounded-xl bg-[#0C1118] border border-[#202B37] space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#A4AFBC]">Entropy Score: {strength.score}%</span>
              <span className={ratingColors[strength.rating]}>{strength.feedback}</span>
            </div>

            <div className="w-full h-1 bg-[#151E29] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${barColors[strength.rating]}`}
                style={{ width: `${strength.score}%` }}
              />
            </div>

            <div className="flex flex-wrap gap-2 text-[10px] text-[#A4AFBC] pt-1">
              <span className={strength.checks.length ? 'text-[#48D597]' : 'text-[#66717E]'}>
                {strength.checks.length ? '✓' : '○'} 8+ chars
              </span>
              <span>•</span>
              <span className={strength.checks.uppercase ? 'text-[#48D597]' : 'text-[#66717E]'}>
                {strength.checks.uppercase ? '✓' : '○'} Uppercase
              </span>
              <span>•</span>
              <span className={strength.checks.lowercase ? 'text-[#48D597]' : 'text-[#66717E]'}>
                {strength.checks.lowercase ? '✓' : '○'} Lowercase
              </span>
              <span>•</span>
              <span className={strength.checks.numbers ? 'text-[#48D597]' : 'text-[#66717E]'}>
                {strength.checks.numbers ? '✓' : '○'} Numbers
              </span>
              <span>•</span>
              <span className={strength.checks.symbols ? 'text-[#48D597]' : 'text-[#66717E]'}>
                {strength.checks.symbols ? '✓' : '○'} Symbols
              </span>
            </div>

            <div className="text-[10px] text-[#66717E] pt-0.5">
              Password is evaluated locally.
            </div>
          </div>
        )}

        {/* Output Filename Configuration */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#F2F5F7] font-mono flex items-center gap-1.5">
            <FolderOutput className="w-3.5 h-3.5 text-[#4DE3FF]" />
            Output filename
          </label>

          <input
            type="text"
            value={outputFilename}
            onChange={(e) => setOutputFilename(e.target.value)}
            disabled={isProcessing}
            placeholder="document_protected.pdf"
            className="w-full bg-[#0C1118] border border-[#202B37] focus:border-[#4DE3FF] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#F2F5F7] font-mono"
          />

          {/* Overwrite Confirmation Guard */}
          {document.filename &&
            outputFilename.trim().toLowerCase() === document.filename.toLowerCase() && (
              <div className="p-3 rounded-xl bg-[#F3C969]/10 border border-[#F3C969]/30 text-xs text-[#F3C969] space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Output filename matches the original document.</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#F2F5F7] text-[11px]">
                  <input
                    type="checkbox"
                    checked={allowOverwrite}
                    onChange={(e) => setAllowOverwrite(e.target.checked)}
                    className="rounded border-[#202B37] text-[#4DE3FF] focus:ring-0"
                  />
                  <span>Confirm overwrite of source file</span>
                </label>
              </div>
            )}
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-3.5 rounded-xl bg-[#FF6577]/10 border border-[#FF6577]/30 flex items-start gap-2.5 text-xs text-[#FF6577]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      {/* PROTECTION SUMMARY PREVIEW (Section 14) */}
      <div className="p-6 rounded-2xl bg-[#111821] border border-[#202B37] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#202B37]">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A4AFBC] flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#48D597]" />
            PROTECTION SUMMARY
          </h3>
          <span className="text-[11px] font-mono text-[#66717E]">
            PRE-EXECUTION CHECK
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37]/70">
            <span className="text-[#66717E] text-[10px] uppercase block">Input</span>
            <span className="text-[#F2F5F7] truncate block">{document.filename}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37]/70">
            <span className="text-[#66717E] text-[10px] uppercase block">Output</span>
            <span className="text-[#4DE3FF] truncate block">
              {outputFilename || 'Pending…'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37]/70">
            <span className="text-[#66717E] text-[10px] uppercase block">Pages</span>
            <span className="text-[#F2F5F7] block">{document.page_count}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37]/70">
            <span className="text-[#66717E] text-[10px] uppercase block">Protection</span>
            <span className="text-[#48D597] block">Password required</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37]/70">
            <span className="text-[#66717E] text-[10px] uppercase block">Processing</span>
            <span className="text-[#F2F5F7] block">Local</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37]/70">
            <span className="text-[#66717E] text-[10px] uppercase block">Password</span>
            <span className="text-[#A4AFBC] block font-mono">
              {password ? '••••••••' : 'Not set'}
            </span>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={!isFormValid || isProcessing}
          className="w-full py-3.5 px-4 rounded-xl bg-[#4DE3FF] hover:bg-[#8BE9F5] disabled:opacity-40 disabled:cursor-not-allowed text-[#070A0F] font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Lock className="w-4 h-4" />
          <span>{isProcessing ? 'Processing…' : 'Apply Protection'}</span>
        </button>
      </div>
    </form>
  );
};
