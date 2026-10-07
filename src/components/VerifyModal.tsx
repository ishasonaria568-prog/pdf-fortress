import React, { useState } from 'react';
import { Lock, Unlock, CheckCircle2, AlertCircle, Eye, EyeOff, X } from 'lucide-react';

interface VerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  protectedBase64: string;
  filename: string;
}

export const VerifyModal: React.FC<VerifyModalProps> = ({
  isOpen,
  onClose,
  protectedBase64,
  filename,
}) => {
  const [testPassword, setTestPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{
    success: boolean;
    unlocked?: boolean;
    is_encrypted?: boolean;
    message?: string;
    page_count?: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleTestVerify = async () => {
    if (!testPassword) return;

    setVerifying(true);
    setVerifyResult(null);

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_base64: protectedBase64,
          password: testPassword,
        }),
      });

      const data = await response.json();
      setVerifyResult(data);
    } catch (err: any) {
      setVerifyResult({
        success: false,
        message: err?.message || 'Verification request failed.',
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070A0F]/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-[#111821] border border-[#202B37] p-6 shadow-2xl space-y-5 font-mono text-xs">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#66717E] hover:text-[#F2F5F7] hover:bg-[#151E29] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0C1118] border border-[#202B37] flex items-center justify-center text-[#4DE3FF]">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F2F5F7]">
              VERIFY DOCUMENT LOCK
            </h3>
            <p className="text-[11px] text-[#A4AFBC]">
              Test decrypting this file with your protection password.
            </p>
          </div>
        </div>

        {/* Target Details */}
        <div className="p-3 rounded-xl bg-[#0C1118] border border-[#202B37] space-y-1">
          <div className="flex justify-between text-[#A4AFBC]">
            <span>Target:</span>
            <span className="text-[#F2F5F7] truncate max-w-[220px]">{filename}</span>
          </div>
          <div className="flex justify-between text-[#A4AFBC]">
            <span>Security Handler:</span>
            <span className="text-[#48D597] font-semibold">ENCRYPTED</span>
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <label className="text-xs text-[#A4AFBC] uppercase font-semibold">
            Password to test
          </label>
          <div className="relative rounded-xl bg-[#0C1118] border border-[#202B37] focus-within:border-[#4DE3FF] transition-all">
            <input
              type={showPassword ? 'text' : 'password'}
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder="Enter protection password"
              className="w-full bg-transparent px-3 py-2.5 pr-10 text-xs text-[#F2F5F7] placeholder-[#66717E] focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleTestVerify()}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66717E] hover:text-[#A4AFBC] cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Result Message */}
        {verifyResult && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
              verifyResult.unlocked
                ? 'bg-[#48D597]/10 border-[#48D597]/30 text-[#48D597]'
                : 'bg-[#FF6577]/10 border-[#FF6577]/30 text-[#FF6577]'
            }`}
          >
            {verifyResult.unlocked ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <div className="font-bold">
                {verifyResult.unlocked ? 'DECRYPTION VERIFIED' : 'ACCESS DENIED'}
              </div>
              <div className="text-[11px] opacity-90">{verifyResult.message}</div>
              {verifyResult.page_count !== undefined && (
                <div className="text-[10px] text-[#A4AFBC]">
                  Unlocked {verifyResult.page_count} page(s).
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-1">
          <button
            onClick={handleTestVerify}
            disabled={verifying || !testPassword}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#4DE3FF] hover:bg-[#8BE9F5] disabled:opacity-50 text-[#070A0F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>{verifying ? 'Testing…' : 'Unlock & Test'}</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-[#0C1118] hover:bg-[#151E29] border border-[#202B37] text-xs text-[#A4AFBC] hover:text-[#F2F5F7] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
