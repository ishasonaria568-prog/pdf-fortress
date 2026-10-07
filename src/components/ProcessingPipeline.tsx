import React from 'react';
import { Lock, CheckCircle2, Loader2 } from 'lucide-react';

interface ProcessingPipelineProps {
  currentStageIndex: number;
}

export const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({
  currentStageIndex,
}) => {
  const steps = [
    { num: '01', label: 'READING DOCUMENT', desc: 'Opening source binary stream & parsing xref table' },
    { num: '02', label: 'VALIDATING PDF', desc: 'Validating magic bytes (%PDF-) and document integrity' },
    { num: '03', label: 'COPYING DOCUMENT PAGES', desc: 'Instantiating new PdfWriter and transferring pages' },
    { num: '04', label: 'APPLYING PASSWORD PROTECTION', desc: 'Executing Standard Security Handler with credentials' },
    { num: '05', label: 'WRITING PROTECTED FILE', desc: 'Atomic disk write to destination target' },
    { num: '06', label: 'VERIFYING OUTPUT', desc: 'Parsing output file to ensure active password lock' },
    { num: '07', label: 'PROTECTION COMPLETE', desc: 'All cryptographic checks verified successfully' },
  ];

  return (
    <div className="p-8 rounded-2xl bg-[#111821] border border-[#202B37] space-y-8 animate-fadeIn">
      {/* Central Spinner & Active Stage */}
      <div className="text-center space-y-3">
        <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#202B37]" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#4DE3FF] animate-spin" />
          <Lock className="w-5 h-5 text-[#4DE3FF]" />
        </div>

        <div>
          <span className="text-[11px] font-mono text-[#4DE3FF] tracking-wider uppercase font-semibold">
            PROCESSING IN PROGRESS
          </span>
          <h3 className="text-lg font-bold font-mono text-[#F2F5F7] mt-0.5">
            {steps[Math.min(currentStageIndex, steps.length - 1)].label}
          </h3>
          <p className="text-xs text-[#A4AFBC] mt-0.5">
            {steps[Math.min(currentStageIndex, steps.length - 1)].desc}
          </p>
        </div>
      </div>

      {/* Stepped Workflow Pipeline List */}
      <div className="max-w-lg mx-auto space-y-2 font-mono text-xs">
        {steps.map((st, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const isPending = idx > currentStageIndex;

          return (
            <div
              key={st.num}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                isDone
                  ? 'bg-[#0C1118] border-[#48D597]/30 text-[#48D597]'
                  : isCurrent
                  ? 'bg-[#151E29] border-[#4DE3FF]/50 text-[#F2F5F7] shadow-sm'
                  : 'bg-[#0C1118]/50 border-[#202B37]/50 text-[#66717E]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] opacity-70">STEP {st.num}</span>
                <span className="font-semibold text-xs">{st.label}</span>
              </div>

              <div>
                {isDone && <CheckCircle2 className="w-4 h-4 text-[#48D597]" />}
                {isCurrent && <Loader2 className="w-4 h-4 text-[#4DE3FF] animate-spin" />}
                {isPending && <span className="text-[10px] text-[#66717E]">WAITING</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
