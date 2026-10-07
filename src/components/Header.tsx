import React from 'react';
import { Shield, Menu, X } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#202B37] bg-[#070A0F]/90 backdrop-blur-md">
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Product Logo & Brand Signature */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 rounded-lg bg-[#111821] border border-[#202B37] text-[#A4AFBC] hover:text-[#F2F5F7] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          <div className="w-8 h-8 rounded-lg bg-[#111821] border border-[#202B37] flex items-center justify-center text-[#4DE3FF] shadow-sm">
            <Shield className="w-4 h-4 stroke-[2]" />
          </div>

          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-[#F2F5F7] text-sm sm:text-base leading-tight font-mono">
              PDF FORTRESS
            </span>
            <span className="text-[11px] text-[#A4AFBC] leading-tight font-sans">
              Built by Isha Sonaria
            </span>
          </div>
        </div>

        {/* Center: Current Workspace Identifier */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0C1118] border border-[#202B37] text-xs font-mono">
          <span className="text-[#66717E]">WORKSPACE:</span>
          <span className="text-[#4DE3FF] font-medium tracking-wide">
            DOCUMENT SECURITY WORKSPACE
          </span>
        </div>

        {/* Right: Local Mode & System Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0C1118] border border-[#202B37]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#48D597] opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#48D597]"></span>
            </span>
            <span className="text-[11px] font-mono tracking-wider text-[#A4AFBC]">
              LOCAL MODE
            </span>
            <span className="text-[11px] font-mono font-semibold text-[#48D597] hidden sm:inline">
              ● Ready
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
