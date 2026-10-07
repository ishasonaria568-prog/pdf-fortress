import React from 'react';
import { Github, Linkedin, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#202B37] bg-[#070A0F] py-6 px-4 sm:px-6 font-mono text-xs text-[#A4AFBC]">
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* Left: Product & Purpose */}
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-[#4DE3FF]" />
          <div>
            <span className="font-bold text-[#F2F5F7] tracking-tight mr-2">
              PDF FORTRESS
            </span>
            <span className="text-[11px] text-[#66717E] hidden md:inline">
              — Secure the document. Understand the protection.
            </span>
          </div>
        </div>

        {/* Center: Builder attribution */}
        <div className="text-xs text-[#A4AFBC]">
          Built by <span className="text-[#F2F5F7] font-semibold">Isha Sonaria</span>
        </div>

        {/* Right: Personal profile links (Section 29) */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/ishasonaria568-prog"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Isha Sonaria on GitHub"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0C1118] border border-[#202B37] text-[#A4AFBC] hover:text-[#F2F5F7] hover:border-[#4DE3FF]/40 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="text-[11px]">GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/isha-sonaria/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Isha Sonaria on LinkedIn"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0C1118] border border-[#202B37] text-[#A4AFBC] hover:text-[#F2F5F7] hover:border-[#4DE3FF]/40 transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span className="text-[11px]">LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
