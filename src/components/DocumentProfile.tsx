import React from 'react';
import {
  FileText,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar,
  User,
  Cpu,
  Layers,
  FileBox,
} from 'lucide-react';
import { DocumentAnalysisData } from '../types';

interface DocumentProfileProps {
  data: DocumentAnalysisData;
  onChangeDocument: () => void;
}

export const DocumentProfile: React.FC<DocumentProfileProps> = ({
  data,
  onChangeDocument,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: File Identified with change action */}
      <div className="p-4 rounded-2xl bg-[#111821] border border-[#202B37] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#151E29] border border-[#202B37] flex items-center justify-center text-[#4DE3FF] shrink-0">
            <FileText className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#F2F5F7] font-mono truncate max-w-xs sm:max-w-md">
                {data.filename}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#48D597]/10 text-[#48D597] border border-[#48D597]/30">
                PARSED
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#A4AFBC] font-mono mt-0.5">
              <span>{formatFileSize(data.size_bytes)}</span>
              <span>•</span>
              <span>{data.page_count} page(s)</span>
              <span>•</span>
              <span>{data.pdf_version}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onChangeDocument}
          className="text-xs font-mono text-[#4DE3FF] hover:text-[#8BE9F5] px-3 py-1.5 rounded-lg bg-[#0C1118] border border-[#202B37] hover:border-[#4DE3FF]/40 transition-colors cursor-pointer shrink-0"
        >
          Change document
        </button>
      </div>

      {/* Grid: Document Profile + Security Posture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* DOCUMENT PROFILE PANEL */}
        <div className="p-5 rounded-2xl bg-[#111821] border border-[#202B37] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#202B37]">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A4AFBC] flex items-center gap-2">
              <FileBox className="w-3.5 h-3.5 text-[#4DE3FF]" />
              DOCUMENT PROFILE
            </h3>
            <span className="text-[11px] font-mono text-[#66717E]">
              {data.pdf_version}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37]/70">
              <span className="text-[#66717E] text-[10px] uppercase block">Pages</span>
              <span className="text-[#F2F5F7] font-bold text-sm">
                {data.page_count > 0 ? data.page_count : 'Locked / N/A'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37]/70">
              <span className="text-[#66717E] text-[10px] uppercase block">File Size</span>
              <span className="text-[#F2F5F7] font-bold text-sm">
                {formatFileSize(data.size_bytes)}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37]/70">
              <span className="text-[#66717E] text-[10px] uppercase block">Readable</span>
              <span className="text-[#48D597] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                YES
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37]/70">
              <span className="text-[#66717E] text-[10px] uppercase block">Encrypted</span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  data.is_encrypted ? 'text-[#F3C969]' : 'text-[#A4AFBC]'
                }`}
              >
                {data.is_encrypted ? 'YES' : 'NO'}
              </span>
            </div>
          </div>

          {/* Metadata Fields (Section 9) */}
          <div className="pt-2 border-t border-[#202B37] space-y-2 text-xs">
            <div className="flex justify-between items-center text-[#66717E] font-mono text-[11px]">
              <span>Metadata available:</span>
              <span className={data.has_metadata ? 'text-[#48D597]' : 'text-[#A4AFBC]'}>
                {data.has_metadata ? 'YES' : 'NO'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono pt-1 text-[#A4AFBC]">
              <div className="flex justify-between gap-2">
                <span className="text-[#66717E]">Title:</span>
                <span className="text-[#F2F5F7] truncate max-w-[180px]">
                  {data.metadata.title || 'Not available'}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#66717E]">Author:</span>
                <span className="text-[#F2F5F7] truncate max-w-[180px]">
                  {data.metadata.author || 'Not available'}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#66717E]">Producer:</span>
                <span className="text-[#F2F5F7] truncate max-w-[180px]">
                  {data.metadata.producer || 'Not available'}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#66717E]">Creation date:</span>
                <span className="text-[#F2F5F7] truncate max-w-[180px]">
                  {data.metadata.creation_date || 'Not available'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECURITY POSTURE PANEL */}
        <div className="p-5 rounded-2xl bg-[#111821] border border-[#202B37] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#202B37]">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A4AFBC] flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#4DE3FF]" />
                SECURITY POSTURE
              </h3>
              <span className="text-[11px] font-mono text-[#66717E]">STATUS</span>
            </div>

            {/* Current State Indicator (Section 10) */}
            <div className="p-4 rounded-xl bg-[#0C1118] border border-[#202B37] space-y-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-3 h-3 rounded-full ${
                    data.is_encrypted ? 'bg-[#48D597]' : 'bg-[#F3C969]'
                  }`}
                />
                <span className="font-mono font-bold text-sm text-[#F2F5F7]">
                  {data.is_encrypted
                    ? 'PASSWORD PROTECTED'
                    : 'CURRENTLY UNPROTECTED'}
                </span>
              </div>

              <p className="text-xs text-[#A4AFBC] leading-relaxed">
                {data.is_encrypted
                  ? 'This document already has PDF encryption applied. Compatible viewers will require authentication credentials to render pages.'
                  : 'This file does not have password protection applied. Any compliant viewer can read the content streams directly.'}
              </p>
            </div>
          </div>

          {/* Educational panel: Why Protection Matters (Section 11) */}
          <div className="p-3.5 rounded-xl bg-[#151E29] border border-[#202B37] space-y-1.5">
            <div className="text-xs font-semibold text-[#F2F5F7]">
              Why protect this document?
            </div>
            <p className="text-[11px] text-[#A4AFBC] leading-relaxed">
              A PDF can contain confidential reports, academic records, financial information, business documents, or personal data. Password protection adds an access-control layer so that compatible PDF readers require a password before opening the protected document.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
