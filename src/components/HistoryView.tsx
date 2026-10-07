import React from 'react';
import { History, Trash2, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { HistoryRecord } from '../types';

interface HistoryViewProps {
  history: HistoryRecord[];
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onClearHistory,
}) => {
  const formatFileSize = (bytes?: number): string => {
    if (!bytes || bytes === 0) return '—';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#111821] border border-[#202B37] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#4DE3FF]">
            <History className="w-4 h-4" />
            <span>LOCAL AUDIT LOG</span>
          </div>
          <h2 className="text-xl font-bold font-mono text-[#F2F5F7]">
            PROTECTION HISTORY
          </h2>
          <p className="text-xs text-[#A4AFBC]">
            Recent document protection actions on this device. Passwords are never logged.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="px-3 py-1.5 rounded-xl bg-[#0C1118] hover:bg-[#151E29] border border-[#202B37] text-xs font-mono text-[#FF6577] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History Table or Empty State (Section 21) */}
      {history.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#111821] border border-[#202B37] text-center space-y-3 font-mono text-xs">
          <div className="w-10 h-10 rounded-xl bg-[#0C1118] border border-[#202B37] mx-auto flex items-center justify-center text-[#66717E]">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-[#A4AFBC]">No protection activity yet.</div>
          <p className="text-[11px] text-[#66717E] max-w-sm mx-auto">
            When you protect documents with PDF Fortress, records of the completed operations will be saved in your browser&apos;s local storage.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-[#111821] border border-[#202B37] overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#202B37] text-[10px] uppercase text-[#66717E]">
                <th className="pb-3 font-semibold">Document</th>
                <th className="pb-3 font-semibold">Output</th>
                <th className="pb-3 font-semibold">Action</th>
                <th className="pb-3 font-semibold">Result</th>
                <th className="pb-3 font-semibold">Pages</th>
                <th className="pb-3 font-semibold">Size</th>
                <th className="pb-3 font-semibold text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202B37]/60">
              {history.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#151E29]/40 transition-colors">
                  <td className="py-3 text-[#F2F5F7] font-semibold truncate max-w-[140px]">
                    {rec.document_name}
                  </td>
                  <td className="py-3 text-[#4DE3FF] truncate max-w-[140px]">
                    {rec.output_name}
                  </td>
                  <td className="py-3 text-[#A4AFBC]">{rec.action}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-[#48D597] font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 text-[#A4AFBC]">{rec.page_count}</td>
                  <td className="py-3 text-[#A4AFBC]">
                    {formatFileSize(rec.protected_size || rec.original_size)}
                  </td>
                  <td className="py-3 text-right text-[#66717E]">{rec.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
