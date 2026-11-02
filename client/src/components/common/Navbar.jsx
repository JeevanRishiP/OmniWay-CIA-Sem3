import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MapPin, PlusCircle, ShieldCheck, Accessibility } from 'lucide-react';

export function Navbar() {
  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-blue-700 text-white shadow-sm'
        : 'text-slate-800 hover:bg-slate-200 hover:text-slate-950'
    }`;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-slate-950 font-bold text-xl tracking-tight rounded-lg p-1 group"
            aria-label="OmniWay Homepage"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center shadow-md group-hover:from-blue-800 group-hover:to-blue-600 transition-all">
              <Accessibility className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="flex items-baseline">
              <span className="font-black text-2xl tracking-tighter text-slate-950">Omni</span>
              <span className="font-black text-2xl tracking-tighter text-blue-600">Way</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav aria-label="Main Navigation" className="flex items-center gap-2 sm:gap-4">
            <NavLink to="/" end className={navLinkClass}>
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>Directory</span>
            </NavLink>

            <NavLink to="/places/new" className={navLinkClass}>
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>Add Place</span>
            </NavLink>

            <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-300 text-xs font-semibold text-slate-700" title="All features are time-audited and WCAG AA compliant">
              <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>Time-Audited</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

