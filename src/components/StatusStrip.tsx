import React from 'react';

interface StatusStripProps {
  documentStatus: 'No Document' | 'Ready' | 'Corrupt' | 'Protected';
  securityStatus: 'Pending' | 'Configured' | 'Password Required';
  processingStatus: 'Waiting' | 'In Progress' | 'Complete' | 'Failed';
  verificationStatus: 'Waiting' | 'Passed' | 'Unable to verify';
}

export const StatusStrip: React.FC<StatusStripProps> = ({
  documentStatus,
  securityStatus,
  processingStatus,
  verificationStatus,
}) => {
  const getDotColor = (state: string) => {
    switch (state) {
      case 'Ready':
      case 'Complete':
      case 'Passed':
      case 'Configured':
        return 'bg-[#48D597]';
      case 'In Progress':
        return 'bg-[#4DE3FF] animate-pulse';
      case 'Password Required':
      case 'Corrupt':
      case 'Failed':
        return 'bg-[#FF6577]';
      case 'Protected':
        return 'bg-[#F3C969]';
      default:
        return 'bg-[#66717E]';
    }
  };

  const stages = [
    { label: 'DOCUMENT', value: documentStatus },
    { label: 'SECURITY', value: securityStatus },
    { label: 'PROCESSING', value: processingStatus },
    { label: 'VERIFICATION', value: verificationStatus },
  ];

  return (
    <div className="w-full bg-[#0C1118] border border-[#202B37] rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs shadow-sm">
      {stages.map((stg, i) => (
        <div key={stg.label} className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${getDotColor(stg.value)}`} />
          <span className="text-[#66717E] uppercase tracking-wider text-[11px]">
            {stg.label}
          </span>
          <span className="text-[#202B37]">—</span>
          <span
            className={`font-medium ${
              stg.value === 'Ready' || stg.value === 'Complete' || stg.value === 'Passed'
                ? 'text-[#48D597]'
                : stg.value === 'In Progress' || stg.value === 'Configured'
                ? 'text-[#4DE3FF]'
                : 'text-[#A4AFBC]'
            }`}
          >
            {stg.value}
          </span>

          {i < stages.length - 1 && (
            <span className="hidden md:inline text-[#202B37] ml-3">|</span>
          )}
        </div>
      ))}
    </div>
  );
};
