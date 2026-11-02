import React from 'react';
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import { CheckCircle2, Clock, AlertTriangle, HelpCircle } from 'lucide-react';

export function FreshnessBadge({ lastVerifiedAt, compact = false, className = '' }) {
  if (!lastVerifiedAt) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-dashed border-slate-400 ${className}`}
        title="This feature has never been verified by a community member"
      >
        <HelpCircle className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
        <span>{compact ? 'Unverified' : 'Not yet verified'}</span>
        <span className="sr-only">(Status: Not yet verified by community)</span>
      </span>
    );
  }

  const verifiedDate = new Date(lastVerifiedAt);
  const isValidDate = !isNaN(verifiedDate.getTime());

  if (!isValidDate) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300 ${className}`}>
        <HelpCircle className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
        <span>Unverified</span>
      </span>
    );
  }

  const daysElapsed = Math.max(0, differenceInDays(new Date(), verifiedDate));
  const relativeTime = formatDistanceToNow(verifiedDate, { addSuffix: true });

  // Fresh (< 30 days)
  if (daysElapsed < 30) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-950 border border-emerald-400 ${className}`}
        title={`Verified ${relativeTime} - High reliability tier (< 30 days)`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
        <span>{compact ? `${daysElapsed === 0 ? 'Today' : `${daysElapsed}d ago`}` : `Confirmed ${relativeTime}`}</span>
        <span className="sr-only">Confirmed operational {relativeTime} (Reliable verification)</span>
      </span>
    );
  }

  // Moderate (30 to 90 days)
  if (daysElapsed <= 90) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-950 border border-amber-400 ${className}`}
        title={`Verified ${relativeTime} - Moderate age tier (30-90 days)`}
      >
        <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" aria-hidden="true" />
        <span>{compact ? `${Math.round(daysElapsed / 30)}mo ago` : `Confirmed ${relativeTime}`}</span>
        <span className="sr-only">Confirmed operational {relativeTime} (Moderate age, check recent notes)</span>
      </span>
    );
  }

  // Stale (> 90 days)
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-950 border border-rose-400 ${className}`}
      title={`Verified ${relativeTime} - Stale (> 90 days). Needs community re-verification.`}
    >
      <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0" aria-hidden="true" />
      <span>{compact ? 'Needs audit' : `Stale (${relativeTime})`}</span>
      <span className="sr-only">Last confirmed {relativeTime} (Needs re-verification)</span>
    </span>
  );
}

