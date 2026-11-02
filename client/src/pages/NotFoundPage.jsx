import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-6 border border-blue-200">
        <MapPinOff className="w-10 h-10" aria-hidden="true" />
      </div>
      <h1 className="text-4xl font-black text-slate-950 tracking-tight mb-3">404 - Page Not Found</h1>
      <p className="text-base text-slate-600 mb-8 leading-relaxed max-w-md mx-auto">
        The page or venue you are looking for does not exist or may have been moved to another location.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-800 transition-colors focus-visible:ring-4 focus-visible:ring-blue-600"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Return to Directory</span>
      </Link>
    </div>
  );
}

