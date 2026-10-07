import React, { useRef, useState } from 'react';
import { Upload, FileText, Shield, Sparkles, AlertCircle } from 'lucide-react';

interface DocumentIntakeProps {
  onFileSelect: (file: File) => void;
  onLoadSample: () => void;
  loadingSample: boolean;
  errorMessage?: string | null;
}

export const DocumentIntake: React.FC<DocumentIntakeProps> = ({
  onFileSelect,
  onLoadSample,
  loadingSample,
  errorMessage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-[#F2F5F7] tracking-tight">
            Load document
          </h2>
          <p className="text-xs text-[#A4AFBC]">
            Select a PDF to inspect its basic properties before applying protection.
          </p>
        </div>

        <button
          onClick={onLoadSample}
          disabled={loadingSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111821] hover:bg-[#151E29] border border-[#202B37] hover:border-[#4DE3FF]/40 text-xs font-mono text-[#A4AFBC] hover:text-[#F2F5F7] transition-all cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#4DE3FF]" />
          <span>{loadingSample ? 'Analyzing sample…' : 'Try sample PDF'}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
          }
        }}
      />

      {/* Empty State / Ingestion Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all bg-[#0C1118]/80 ${
          isDragging
            ? 'border-[#4DE3FF] bg-[#4DE3FF]/5'
            : 'border-[#202B37] hover:border-[#4DE3FF]/50 hover:bg-[#111821]'
        }`}
      >
        {/* Shield / Document Illustration */}
        <div className="w-16 h-16 rounded-2xl bg-[#111821] border border-[#202B37] group-hover:border-[#4DE3FF]/40 mx-auto flex items-center justify-center text-[#A4AFBC] group-hover:text-[#4DE3FF] transition-colors mb-4 shadow-inner">
          <div className="relative">
            <Shield className="w-8 h-8 text-[#4DE3FF] stroke-[1.5]" />
            <FileText className="w-4 h-4 text-[#F2F5F7] absolute inset-0 m-auto" />
          </div>
        </div>

        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-base font-bold text-[#F2F5F7]">
            Ready to secure a document?
          </h3>
          <p className="text-xs text-[#A4AFBC] leading-relaxed">
            Load a PDF to inspect its document profile and configure password protection.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-[#4DE3FF] text-[#070A0F] font-semibold text-xs transition-colors hover:bg-[#8BE9F5] shadow-sm pointer-events-none"
          >
            Select PDF
          </button>
          <span className="text-xs text-[#66717E]">
            or drop your file here
          </span>
        </div>

        <div className="mt-4 text-[11px] font-mono text-[#66717E]">
          Supported format: PDF documents (.pdf) • 100% on-device parsing
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-[#FF6577]/10 border border-[#FF6577]/30 flex items-start gap-2.5 text-xs text-[#FF6577]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
