import React from 'react';
import { Shield, Lock, Key, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const SecurityDetailsView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#111821] border border-[#202B37] space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-[#4DE3FF]">
          <Shield className="w-4 h-4" />
          <span>CRYPTOGRAPHIC SPECIFICATION</span>
        </div>
        <h2 className="text-xl font-bold font-mono text-[#F2F5F7]">
          SECURITY ARCHITECTURE & DETAILS
        </h2>
        <p className="text-xs text-[#A4AFBC]">
          Technical mechanics of PDF Standard Security Handlers and document access controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Encryption Handler Card */}
        <div className="p-5 rounded-2xl bg-[#111821] border border-[#202B37] space-y-3 font-mono text-xs">
          <div className="text-[11px] font-semibold uppercase text-[#A4AFBC] pb-2 border-b border-[#202B37] flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#4DE3FF]" />
            Standard Security Handler (ISO 32000-1)
          </div>

          <p className="text-[#A4AFBC] leading-relaxed font-sans text-xs">
            PDF Fortress leverages the Standard Security Handler specified by the PDF reference standard.
            When a password is configured:
          </p>

          <div className="space-y-2 pt-1 text-[#F2F5F7]">
            <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37]">
              <span className="text-[#4DE3FF] block font-bold">1. Key Derivation</span>
              <span className="text-[#A4AFBC] text-[11px] font-sans">
                The user password is normalized, padded with standard byte vectors, and combined with document ID entries to compute the encryption key.
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37]">
              <span className="text-[#4DE3FF] block font-bold">2. Stream Cipher Execution</span>
              <span className="text-[#A4AFBC] text-[11px] font-sans">
                Each string and stream object in the PDF is encrypted individually with an object-specific initialization key.
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0C1118] border border-[#202B37]">
              <span className="text-[#4DE3FF] block font-bold">3. Header Verification (/O &amp; /U Entries)</span>
              <span className="text-[#A4AFBC] text-[11px] font-sans">
                Owner (/O) and User (/U) validation dictionaries are embedded in the trailer dictionary to verify passwords on open.
              </span>
            </div>
          </div>
        </div>

        {/* Permissions & Trust Model */}
        <div className="p-5 rounded-2xl bg-[#111821] border border-[#202B37] space-y-3 font-mono text-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-[11px] font-semibold uppercase text-[#A4AFBC] pb-2 border-b border-[#202B37] flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-[#48D597]" />
              Access Control &amp; Password Types
            </div>

            <div className="space-y-2 text-xs font-sans text-[#A4AFBC]">
              <div className="p-3 rounded-xl bg-[#0C1118] border border-[#202B37] space-y-1">
                <span className="font-bold font-mono text-[#F2F5F7] text-xs">
                  User Password (Open Password)
                </span>
                <p className="text-[11px] leading-relaxed">
                  Required to decrypt the file streams and render pages. Without this password, legitimate viewers cannot read the content.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0C1118] border border-[#202B37] space-y-1">
                <span className="font-bold font-mono text-[#F2F5F7] text-xs">
                  Owner Password (Permissions Password)
                </span>
                <p className="text-[11px] leading-relaxed">
                  Controls permissions flags such as printing, copying text, or modifying pages in authorized software.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#151E29] border border-[#202B37] text-[11px] text-[#F3C969] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-sans">
              Passwords with high character entropy and mixed character types are strongly recommended to withstand offline dictionary attacks.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
