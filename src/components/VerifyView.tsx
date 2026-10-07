import React, { useState, useRef } from 'react';
import {
  FileCheck2,
  Lock,
  Unlock,
  Upload,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileText,
  Eye,
  EyeOff,
} from 'lucide-react';

export const VerifyView: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [fileData, setFileData] = useState<{
    name: string;
    size: number;
    base64: string;
    is_encrypted: boolean;
    page_count: number;
    pdf_version: string;
    metadata: Record<string, string>;
  } | null>(null);

  const [testPassword, setTestPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{
    success: boolean;
    unlocked?: boolean;
    message?: string;
    page_count?: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = (file: File) => {
    setErrorMsg(null);
    setVerifyResult(null);
    setTestPassword('');
    setAnalyzing(true);

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg("This file doesn't appear to be a valid PDF.");
      setAnalyzing(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1] || '';

      try {
        const resp = await fetch('/api/inspect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file_base64: base64 }),
        });
        const res = await resp.json();

        if (!res.success) {
          setErrorMsg(res.error || 'The PDF could not be analyzed.');
          setAnalyzing(false);
          return;
        }

        setFileData({
          name: file.name,
          size: file.size,
          base64,
          is_encrypted: res.data?.is_encrypted || false,
          page_count: res.data?.page_count || 0,
          pdf_version: res.data?.pdf_version || 'PDF-1.4',
          metadata: res.data?.metadata || {},
        });
      } catch {
        setErrorMsg('Error inspecting PDF file properties.');
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTestPassword = async () => {
    if (!fileData || !testPassword) return;
    setVerifying(true);
    setVerifyResult(null);

    try {
      const resp = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_base64: fileData.base64,
          password: testPassword,
        }),
      });
      const data = await resp.json();
      setVerifyResult(data);
    } catch {
      setVerifyResult({
        success: false,
        message: 'Decryption test request failed.',
      });
    } finally {
      setVerifying(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* View Header */}
      <div className="p-6 rounded-2xl bg-[#111821] border border-[#202B37] space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#4DE3FF]">
          <FileCheck2 className="w-4 h-4" />
          <span>VERIFICATION SUITE</span>
        </div>
        <h2 className="text-xl font-bold font-mono text-[#F2F5F7]">
          VERIFY EXISTING PDF
        </h2>
        <p className="text-xs text-[#A4AFBC]">
          Inspect any PDF file to determine whether password protection is active and test password unlock.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleSelectFile(e.target.files[0]);
          }
        }}
      />

      {/* Select file box if none loaded */}
      {!fileData && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-10 rounded-2xl bg-[#0C1118] border-2 border-dashed border-[#202B37] hover:border-[#4DE3FF]/50 text-center cursor-pointer transition-all space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-[#111821] border border-[#202B37] mx-auto flex items-center justify-center text-[#4DE3FF]">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-sm text-[#F2F5F7] block">
              {analyzing ? 'Inspecting PDF…' : 'Select PDF to verify'}
            </span>
            <span className="text-xs text-[#A4AFBC]">
              Choose a file from your computer to inspect security posture
            </span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-[#FF6577]/10 border border-[#FF6577]/30 flex items-start gap-2.5 text-xs text-[#FF6577]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* File analysis results */}
      {fileData && (
        <div className="space-y-6">
          {/* Header Summary */}
          <div className="p-4 rounded-xl bg-[#111821] border border-[#202B37] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#151E29] border border-[#202B37] flex items-center justify-center text-[#4DE3FF] shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 font-mono">
                <span className="font-bold text-sm text-[#F2F5F7] truncate block">
                  {fileData.name}
                </span>
                <span className="text-xs text-[#A4AFBC]">
                  {formatFileSize(fileData.size)} • {fileData.pdf_version}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setFileData(null);
                setVerifyResult(null);
                setTestPassword('');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#0C1118] border border-[#202B37] text-xs font-mono text-[#4DE3FF] hover:text-[#8BE9F5] transition-colors cursor-pointer shrink-0"
            >
              Verify another file
            </button>
          </div>

          {/* DOCUMENT SECURITY STATUS PANEL (Section 22) */}
          <div className="p-6 rounded-2xl bg-[#111821] border border-[#202B37] space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#202B37]">
              <span className="font-semibold uppercase tracking-wider text-[#A4AFBC]">
                DOCUMENT SECURITY STATUS
              </span>
              <span
                className={`px-2.5 py-0.5 rounded font-bold ${
                  fileData.is_encrypted
                    ? 'bg-[#48D597]/15 text-[#48D597] border border-[#48D597]/30'
                    : 'bg-[#F3C969]/15 text-[#F3C969] border border-[#F3C969]/30'
                }`}
              >
                {fileData.is_encrypted ? 'PROTECTED' : 'NOT PROTECTED'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#0C1118] border border-[#202B37]">
                <span className="text-[#66717E] text-[10px] block">ENCRYPTED</span>
                <span className="text-[#F2F5F7] font-bold text-sm">
                  {fileData.is_encrypted ? 'YES' : 'NO'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0C1118] border border-[#202B37]">
                <span className="text-[#66717E] text-[10px] block">READABLE</span>
                <span className="text-[#48D597] font-bold text-sm">
                  {fileData.is_encrypted ? 'LOCKED' : 'YES'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0C1118] border border-[#202B37]">
                <span className="text-[#66717E] text-[10px] block">PAGE COUNT</span>
                <span className="text-[#F2F5F7] font-bold text-sm">
                  {fileData.is_encrypted ? 'Hidden' : fileData.page_count}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0C1118] border border-[#202B37]">
                <span className="text-[#66717E] text-[10px] block">PARSER</span>
                <span className="text-[#4DE3FF] font-bold text-sm">Valid PDF</span>
              </div>
            </div>

            {/* Test Password Unlock Section (if encrypted) */}
            {fileData.is_encrypted ? (
              <div className="p-4 rounded-xl bg-[#0C1118] border border-[#202B37] space-y-3 pt-3">
                <div className="flex items-center gap-2 text-xs text-[#F2F5F7] font-semibold">
                  <Lock className="w-3.5 h-3.5 text-[#4DE3FF]" />
                  <span>Test password decryption on this file</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 rounded-xl bg-[#151E29] border border-[#202B37] focus-within:border-[#4DE3FF]">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={testPassword}
                      onChange={(e) => setTestPassword(e.target.value)}
                      placeholder="Enter protection password"
                      className="w-full bg-transparent px-3 py-2 pr-9 text-xs text-[#F2F5F7] placeholder-[#66717E] focus:outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handleTestPassword()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#66717E] hover:text-[#A4AFBC]"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    onClick={handleTestPassword}
                    disabled={verifying || !testPassword}
                    className="px-4 py-2 rounded-xl bg-[#4DE3FF] hover:bg-[#8BE9F5] disabled:opacity-40 text-[#070A0F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>{verifying ? 'Verifying…' : 'Unlock & Test'}</span>
                  </button>
                </div>

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
                        {verifyResult.unlocked ? 'PASSWORD VALIDATED' : 'ACCESS DENIED'}
                      </div>
                      <div className="text-[11px] opacity-90">{verifyResult.message}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#0C1118] border border-[#202B37] text-xs text-[#A4AFBC] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F3C969] shrink-0" />
                <span>
                  This file is currently unprotected. You can switch to the &quot;Protect PDF&quot; tab to configure a password for it.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
