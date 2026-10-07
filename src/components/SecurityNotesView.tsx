import React from 'react';
import { BookOpen, ShieldCheck, AlertCircle, Key, Laptop, FileCheck } from 'lucide-react';

export const SecurityNotesView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#111821] border border-[#202B37] space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-[#4DE3FF]">
          <BookOpen className="w-4 h-4" />
          <span>TECHNICAL ADVISORY</span>
        </div>
        <h2 className="text-xl font-bold font-mono text-[#F2F5F7]">
          UNDERSTANDING PDF PROTECTION
        </h2>
        <p className="text-xs text-[#A4AFBC]">
          Factual security advisory on access controls, encryption boundaries, and best practices.
        </p>
      </div>

      <div className="space-y-4">
        {/* Core Principles */}
        <div className="p-6 rounded-2xl bg-[#111821] border border-[#202B37] space-y-4">
          <h3 className="text-sm font-bold font-mono text-[#F2F5F7] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#48D597]" />
            What PDF Password Protection Provides
          </h3>
          <p className="text-xs text-[#A4AFBC] leading-relaxed">
            PDF standard encryption wraps document content streams, xref offsets, and embedded assets with cryptographic ciphers. Compatible PDF readers (Adobe Acrobat, Chrome PDF Viewer, Apple Preview, Firefox PDF.js, Foxit) enforce this standard by refusing to parse or render pages until the user supplies the correct decryption key.
          </p>
        </div>

        {/* Limitations & Realities */}
        <div className="p-6 rounded-2xl bg-[#111821] border border-[#202B37] space-y-4">
          <h3 className="text-sm font-bold font-mono text-[#F2F5F7] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#F3C969]" />
            What PDF Password Protection Does Not Guarantee
          </h3>
          <ul className="space-y-2 text-xs text-[#A4AFBC] list-disc list-inside leading-relaxed">
            <li>
              <strong className="text-[#F2F5F7]">Offline Brute-Force Immunity:</strong> An adversary who possesses the protected PDF file can run offline password recovery tools. The security of the document is directly proportional to password entropy.
            </li>
            <li>
              <strong className="text-[#F2F5F7]">Display Capture Prevention:</strong> Once an authorized user opens the document, standard PDF encryption cannot prevent physical screen photography, external screenshots, or optical character recognition (OCR).
            </li>
            <li>
              <strong className="text-[#F2F5F7]">Permissions Enforcement in Non-Compliant Tools:</strong> Owner permissions (disallowing printing or text copy) rely on viewer compliance. Only open/read encryption is cryptographically enforced.
            </li>
          </ul>
        </div>

        {/* Best Practice Guidance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#0C1118] border border-[#202B37] space-y-1.5">
            <Key className="w-4 h-4 text-[#4DE3FF]" />
            <span className="font-bold text-[#F2F5F7] block">Use Unique Passwords</span>
            <p className="text-[11px] text-[#A4AFBC] font-sans">
              Never reuse passwords across documents or organizational accounts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0C1118] border border-[#202B37] space-y-1.5">
            <Laptop className="w-4 h-4 text-[#4DE3FF]" />
            <span className="font-bold text-[#F2F5F7] block">Secure the Endpoint</span>
            <p className="text-[11px] text-[#A4AFBC] font-sans">
              Protect local disks with operating system volume encryption (BitLocker / FileVault).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0C1118] border border-[#202B37] space-y-1.5">
            <FileCheck className="w-4 h-4 text-[#4DE3FF]" />
            <span className="font-bold text-[#F2F5F7] block">Always Test Output</span>
            <p className="text-[11px] text-[#A4AFBC] font-sans">
              Test opening the protected file immediately in your viewer to verify access credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
