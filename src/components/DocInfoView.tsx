import React from 'react';
import { FileText, Layers, Hash, Calendar, Shield, Sparkles } from 'lucide-react';
import { DocumentAnalysisData } from '../types';

interface DocInfoViewProps {
  document: DocumentAnalysisData | null;
  onLoadSample: () => void;
  onNavigateToProtect: () => void;
}

export const DocInfoView: React.FC<DocInfoViewProps> = ({
  document,
  onLoadSample,
  onNavigateToProtect,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!document) {
    return (
      <div className="p-12 rounded-2xl bg-[#111821] border border-[#202B37] text-center space-y-4 font-mono animate-fadeIn">
        <div className="w-12 h-12 rounded-xl bg-[#0C1118] border border-[#202B37] mx-auto flex items-center justify-center text-[#4DE3FF]">
          <FileText className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#F2F5F7]">No Document Loaded</h3>
          <p className="text-xs text-[#A4AFBC] max-w-sm mx-auto">
            Load a PDF document in the workspace to view comprehensive metadata and structural properties.
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={onNavigateToProtect}
            className="px-4 py-2 rounded-xl bg-[#4DE3FF] text-[#070A0F] font-semibold text-xs transition-colors hover:bg-[#8BE9F5] cursor-pointer"
          >
            Load a PDF
          </button>
          <button
            onClick={onLoadSample}
            className="px-4 py-2 rounded-xl bg-[#0C1118] border border-[#202B37] text-[#A4AFBC] hover:text-[#F2F5F7] text-xs transition-colors cursor-pointer"
          >
            Load Sample PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#111821] border border-[#202B37] space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-[#4DE3FF]">
          <FileText className="w-4 h-4" />
          <span>DOCUMENT METRICS</span>
        </div>
        <h2 className="text-xl font-bold font-mono text-[#F2F5F7]">
          DOCUMENT INFORMATION
        </h2>
        <p className="text-xs text-[#A4AFBC]">
          Structural metadata and internal properties parsed from {document.filename}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Core Properties */}
        <div className="p-5 rounded-2xl bg-[#111821] border border-[#202B37] space-y-3">
          <div className="text-[11px] font-semibold uppercase text-[#A4AFBC] pb-2 border-b border-[#202B37]">
            Core File Properties
          </div>

          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-[#202B37]/50">
              <span className="text-[#66717E]">Filename:</span>
              <span className="text-[#F2F5F7] truncate max-w-[200px]">{document.filename}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#202B37]/50">
              <span className="text-[#66717E]">Size:</span>
              <span className="text-[#F2F5F7]">{formatFileSize(document.size_bytes)} ({document.size_bytes} bytes)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#202B37]/50">
              <span className="text-[#66717E]">Page Count:</span>
              <span className="text-[#F2F5F7]">{document.page_count}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#202B37]/50">
              <span className="text-[#66717E]">Page Dimensions:</span>
              <span className="text-[#F2F5F7]">{document.page_dimension || 'Standard Page'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#66717E]">Specification:</span>
              <span className="text-[#4DE3FF]">{document.pdf_version}</span>
            </div>
          </div>
        </div>

        {/* Embedded Metadata Dictionary */}
        <div className="p-5 rounded-2xl bg-[#111821] border border-[#202B37] space-y-3">
          <div className="text-[11px] font-semibold uppercase text-[#A4AFBC] pb-2 border-b border-[#202B37]">
            Document Dictionary Metadata
          </div>

          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-[#202B37]/50">
              <span className="text-[#66717E]">Title:</span>
              <span className="text-[#F2F5F7] truncate max-w-[200px]">
                {document.metadata.title || 'Not specified'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#202B37]/50">
              <span className="text-[#66717E]">Author:</span>
              <span className="text-[#F2F5F7] truncate max-w-[200px]">
                {document.metadata.author || 'Not specified'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#202B37]/50">
              <span className="text-[#66717E]">Creator:</span>
              <span className="text-[#F2F5F7] truncate max-w-[200px]">
                {document.metadata.creator || 'Not specified'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#202B37]/50">
              <span className="text-[#66717E]">Producer:</span>
              <span className="text-[#F2F5F7] truncate max-w-[200px]">
                {document.metadata.producer || 'Not specified'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#66717E]">Created:</span>
              <span className="text-[#F2F5F7] truncate max-w-[200px]">
                {document.metadata.creation_date || 'Not specified'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
