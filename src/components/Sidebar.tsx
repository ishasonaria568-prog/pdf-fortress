import React from 'react';
import {
  Lock,
  FileCheck2,
  FileText,
  ShieldAlert,
  History,
  Workflow,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { WorkstationView } from '../types';

interface SidebarProps {
  currentView: WorkstationView;
  onSelectView: (view: WorkstationView) => void;
  hasDocument: boolean;
  historyCount: number;
  onLoadSample?: () => void;
  loadingSample?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  hasDocument,
  historyCount,
  onLoadSample,
  loadingSample,
}) => {
  const navSections = [
    {
      title: 'WORKSPACE',
      items: [
        {
          id: 'protect' as WorkstationView,
          label: 'Protect PDF',
          icon: Lock,
          badge: hasDocument ? 'Active' : undefined,
          badgeColor: 'text-[#4DE3FF] bg-[#4DE3FF]/10',
        },
        {
          id: 'verify' as WorkstationView,
          label: 'Verify PDF',
          icon: FileCheck2,
        },
      ],
    },
    {
      title: 'ANALYSIS',
      items: [
        {
          id: 'doc-info' as WorkstationView,
          label: 'Document Information',
          icon: FileText,
          badge: hasDocument ? 'Loaded' : undefined,
          badgeColor: 'text-[#48D597] bg-[#48D597]/10',
        },
        {
          id: 'security-details' as WorkstationView,
          label: 'Security Details',
          icon: ShieldAlert,
        },
        {
          id: 'history' as WorkstationView,
          label: 'Protection History',
          icon: History,
          badge: historyCount > 0 ? `${historyCount}` : undefined,
          badgeColor: 'text-[#A4AFBC] bg-[#151E29]',
        },
      ],
    },
    {
      title: 'HELP',
      items: [
        {
          id: 'how-it-works' as WorkstationView,
          label: 'How It Works',
          icon: Workflow,
        },
        {
          id: 'security-notes' as WorkstationView,
          label: 'Security Notes',
          icon: BookOpen,
        },
      ],
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#0C1118] border-r border-[#202B37] flex flex-col justify-between p-4 shrink-0 font-sans">
      <div className="space-y-6">
        {navSections.map((sec) => (
          <div key={sec.title} className="space-y-1.5">
            <div className="text-[10px] font-mono font-semibold tracking-wider text-[#66717E] px-3">
              {sec.title}
            </div>

            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#151E29] text-[#F2F5F7] border border-[#202B37] text-[#4DE3FF]'
                        : 'text-[#A4AFBC] hover:text-[#F2F5F7] hover:bg-[#111821]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-[#4DE3FF]' : 'text-[#66717E]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          item.badgeColor || 'text-[#A4AFBC] bg-[#151E29]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Quick Test Helper */}
      {onLoadSample && (
        <div className="pt-4 border-t border-[#202B37] mt-6">
          <button
            onClick={onLoadSample}
            disabled={loadingSample}
            className="w-full py-2 px-3 rounded-xl bg-[#111821] hover:bg-[#151E29] border border-[#202B37] hover:border-[#4DE3FF]/40 text-xs text-[#A4AFBC] hover:text-[#F2F5F7] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4DE3FF]" />
            <span>{loadingSample ? 'Loading document…' : 'Load Sample PDF'}</span>
          </button>
        </div>
      )}
    </aside>
  );
};
