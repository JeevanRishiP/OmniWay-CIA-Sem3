import React from 'react';

export function SkeletonCard() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading place information"
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="h-6 bg-slate-200 rounded w-2/3" />
          <div className="h-5 bg-slate-200 rounded-full w-20" />
        </div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-5" />

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="h-16 bg-slate-100 rounded-xl p-2.5 border border-slate-200/60" />
          <div className="h-16 bg-slate-100 rounded-xl p-2.5 border border-slate-200/60" />
          <div className="h-16 bg-slate-100 rounded-xl p-2.5 border border-slate-200/60" />
          <div className="h-16 bg-slate-100 rounded-xl p-2.5 border border-slate-200/60" />
        </div>
      </div>

      <div className="h-10 bg-slate-200 rounded-xl w-full" />
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}

