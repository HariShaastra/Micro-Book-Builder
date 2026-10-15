/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FacilityIntroProps {
  title: string;
  facilityKey: string;
  description: string;
  steps: string[];
  tip?: string;
  className?: string;
}

export default function FacilityIntro({
  title,
  facilityKey,
  description,
  steps,
  tip,
  className = ""
}: FacilityIntroProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-editorial-sidebar/50 border border-editorial-border rounded-xl p-4 sm:p-5 shadow-2xs transition-all ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-editorial-sidebar flex items-center justify-center text-editorial-accent shrink-0">
            <Info size={14} />
          </div>
          <div>
            <span className="text-[9px] font-mono uppercase font-bold tracking-widest text-editorial-accent">
              Facility Guide
            </span>
            <h3 className="font-serif italic font-bold text-sm sm:text-base text-editorial-text leading-tight">
              {title}
            </h3>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-editorial-muted hover:text-editorial-text p-1 rounded transition-colors text-xs flex items-center gap-1 font-mono"
          title={isCollapsed ? "Expand Guide" : "Collapse Guide"}
        >
          <span className="text-[10px] hidden sm:inline">{isCollapsed ? 'Show' : 'Hide'}</span>
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="mt-3 pt-3 border-t border-editorial-divider text-xs text-editorial-text space-y-2 font-serif leading-relaxed">
          <p className="italic text-editorial-text">
            {description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-sans text-[11px]">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white/60 p-2 rounded border border-editorial-border/40">
                <span className="font-mono font-bold text-editorial-accent mr-1">0{idx + 1}.</span>
                <span className="text-editorial-text font-medium">{step}</span>
              </div>
            ))}
          </div>

          {tip && (
            <div className="text-[11px] font-sans text-editorial-muted flex items-center gap-1.5 pt-1">
              <span className="font-bold uppercase tracking-wider text-[9px] text-editorial-accent">Pro-Tip:</span>
              <span>{tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
