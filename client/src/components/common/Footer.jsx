import React from 'react';
import { Accessibility, CheckCircle2, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Accessibility className="w-6 h-6 text-blue-400" aria-hidden="true" />
              <div className="flex items-baseline">
                <span className="font-black text-xl tracking-tighter text-white">Omni</span>
                <span className="font-black text-xl tracking-tighter text-blue-400">Way</span>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              OmniWay is a modern crowdsourced physical accessibility directory engineered to track, audit, and highlight verification age for ramps, elevators, accessible restrooms, and step-free entrances.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              Accessibility Commitment
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Engineered according to WCAG 2.1 Level AA and AAA color contrast standards. Optimized for screen readers, keyboard navigation, and high-visibility focus states.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              Freshness Engine Tiers
            </h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li>
                <span className="font-bold text-emerald-400">Fresh (&lt; 30d):</span> High confidence verification.
              </li>
              <li>
                <span className="font-bold text-amber-400">Moderate (30-90d):</span> Verified recently, check notes.
              </li>
              <li>
                <span className="font-bold text-rose-400">Stale (&gt; 90d):</span> Needs community re-verification.
              </li>
              <li>
                <span className="font-bold text-slate-400">Unverified:</span> Awaiting initial community report.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} OmniWay. Open community accessibility data.</p>
          <div className="flex gap-4">
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span>Keyboard Accessible</span>
            <span>•</span>
            <span>High Contrast AAA Text</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

