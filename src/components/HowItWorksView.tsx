import React from 'react';
import { Workflow, FileText, CheckCircle2, Lock, Shield, HardDrive, KeyRound } from 'lucide-react';

export const HowItWorksView: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Document Ingestion & Parsing',
      desc: 'The input PDF is read directly from memory or local filesystem. Magic bytes (%PDF-) and xref cross-reference tables are validated.',
      icon: FileText,
    },
    {
      num: '02',
      title: 'Structural Intelligence Analysis',
      desc: 'PDF Fortress inspects the document page tree, embedded metadata entries, and encryption flags without modifying source bytes.',
      icon: Shield,
    },
    {
      num: '03',
      title: 'Protection Policy Configuration',
      desc: 'The operator defines a protection password and destination output path. Real-time entropy evaluation ensures cryptographic resistance.',
      icon: KeyRound,
    },
    {
      num: '04',
      title: 'Page Tree Transfer & Stream Encryption',
      desc: 'A new PdfWriter is initialized. All document page objects, resources, and catalog dictionaries are copied and encrypted with the Standard Security Handler.',
      icon: Lock,
    },
    {
      num: '05',
      title: 'Output Generation & Integrity Verification',
      desc: 'The protected binary is written to the destination path. PDF Fortress re-opens the output with PdfReader to confirm the file is encrypted and unlocks with the password.',
      icon: CheckCircle2,
    },
    {
      num: '06',
      title: 'Security Report & Delivery',
      desc: 'The final Protection Report is displayed, logging the completed operation to local audit history and making the protected file available for download.',
      icon: HardDrive,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#111821] border border-[#202B37] space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-[#4DE3FF]">
          <Workflow className="w-4 h-4" />
          <span>WORKSTATION PIPELINE</span>
        </div>
        <h2 className="text-xl font-bold font-mono text-[#F2F5F7]">
          HOW PROTECTION WORKS
        </h2>
        <p className="text-xs text-[#A4AFBC]">
          The end-to-end security workflow that safeguards your PDF documents locally.
        </p>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.num}
              className="p-5 rounded-2xl bg-[#111821] border border-[#202B37] flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#4DE3FF]">
                  STAGE {st.num}
                </span>
                <Icon className="w-4 h-4 text-[#A4AFBC]" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-[#F2F5F7] font-mono">
                  {st.title}
                </h3>
                <p className="text-xs text-[#A4AFBC] leading-relaxed">
                  {st.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-[#202B37]/60 text-[10px] font-mono text-[#48D597]">
                ✓ On-Device Execution
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
