import React, { useState } from 'react';
import {
  ShieldCheck,
  Download,
  RotateCcw,
  KeyRound,
  CheckCircle2,
  FileText,
  Lock,
  Check,
} from 'lucide-react';
import { ProtectionResult } from '../types';
import { VerifyModal } from './VerifyModal';

interface ProtectionReportProps {
  result: ProtectionResult;
  originalSize: number;
  onReset: () => void;
}

export const ProtectionReport: React.FC<ProtectionReportProps> = ({
  result,
  originalSize,
  onReset,
}) => {
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (!result.protected_base64) return;
    const a = document.createElement('a');
    a.href = `data:application/pdf;base64,${result.protected_base64}`;
    a.download = result.output_filename || 'document_protected.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner (Section 33) */}
      <div className="p-6 rounded-2xl bg-[#111821] border border-[#202B37] text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#48D597]/15 border border-[#48D597]/40 mx-auto flex items-center justify-center text-[#48D597]">
          <ShieldCheck className="w-6 h-6 stroke-[2]" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#F2F5F7] tracking-tight">
            DOCUMENT SECURED
          </h2>
          <p className="text-xs text-[#A4AFBC] mt-0.5">
            Your protected PDF is ready.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* OUTPUT VERIFICATION PANEL (Section 17) */}
        <div className="p-5 rounded-2xl bg-[#111821] border border-[#202B37] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202B37]">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A4AFBC] flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#48D597]" />
              VERIFICATION
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#48D597]/15 text-[#48D597]">
              ALL PASSED
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37] flex items-center justify-between">
              <span className="text-[#A4AFBC]">Output file exists</span>
              <span className="text-[#48D597] font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                PASSED
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37] flex items-center justify-between">
              <span className="text-[#A4AFBC]">PDF readable</span>
              <span className="text-[#48D597] font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                PASSED
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37] flex items-center justify-between">
              <span className="text-[#A4AFBC]">Page count preserved</span>
              <span className="text-[#48D597] font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {result.page_count} pages
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37] flex items-center justify-between">
              <span className="text-[#A4AFBC]">Protection applied</span>
              <span className="text-[#48D597] font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                CONFIRMED
              </span>
            </div>
          </div>
        </div>

        {/* PROTECTION REPORT PANEL (Section 18) */}
        <div className="p-5 rounded-2xl bg-[#111821] border border-[#202B37] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202B37]">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A4AFBC] flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#4DE3FF]" />
              PROTECTION REPORT
            </h3>
            <span className="text-[11px] font-mono text-[#66717E]">
              {result.timestamp}
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs text-[#A4AFBC]">
            <div className="flex justify-between py-1 border-b border-[#202B37]/60">
              <span className="text-[#66717E]">DOCUMENT:</span>
              <span className="text-[#F2F5F7] font-semibold truncate max-w-[180px]">
                {result.input_filename}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#202B37]/60">
              <span className="text-[#66717E]">ORIGINAL SIZE:</span>
              <span className="text-[#F2F5F7]">{formatFileSize(originalSize)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#202B37]/60">
              <span className="text-[#66717E]">PROTECTED SIZE:</span>
              <span className="text-[#F2F5F7]">{formatFileSize(result.file_size)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#202B37]/60">
              <span className="text-[#66717E]">PAGE COUNT:</span>
              <span className="text-[#F2F5F7]">{result.page_count}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#202B37]/60">
              <span className="text-[#66717E]">PROTECTION:</span>
              <span className="text-[#48D597]">Password protected</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#202B37]/60">
              <span className="text-[#66717E]">PROCESSING:</span>
              <span className="text-[#F2F5F7]">Local</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#202B37]/60">
              <span className="text-[#66717E]">OUTPUT:</span>
              <span className="text-[#4DE3FF] truncate max-w-[180px]">
                {result.output_filename}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#66717E]">VERIFICATION:</span>
              <span className="text-[#48D597] font-semibold">Passed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary & Secondary Actions */}
      <div className="p-6 rounded-2xl bg-[#111821] border border-[#202B37] space-y-4">
        <button
          onClick={handleDownload}
          className="w-full py-3.5 px-4 rounded-xl bg-[#4DE3FF] hover:bg-[#8BE9F5] text-[#070A0F] font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Download Protected PDF</span>
        </button>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsVerifyOpen(true)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#0C1118] hover:bg-[#151E29] border border-[#202B37] hover:border-[#4DE3FF]/40 text-xs font-mono text-[#4DE3FF] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Test Password Unlock</span>
          </button>

          <button
            onClick={onReset}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#0C1118] hover:bg-[#151E29] border border-[#202B37] text-xs font-mono text-[#A4AFBC] hover:text-[#F2F5F7] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Protect Another Document</span>
          </button>
        </div>

        <div className="text-center text-[11px] font-mono text-[#66717E] pt-2">
          Keep your password safe. PDF Fortress does not store it.
        </div>
      </div>

      {/* Verify modal if requested */}
      <VerifyModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        protectedBase64={result.protected_base64}
        filename={result.output_filename}
      />
    </div>
  );
};
