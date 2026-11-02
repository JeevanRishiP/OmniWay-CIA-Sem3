import React, { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { History, User, CheckCircle2, XCircle, Filter, Calendar } from 'lucide-react';

const FEATURE_NAMES = {
  ramp: 'Wheelchair Ramp',
  lift: 'Elevator / Lift',
  accessibleToilet: 'Accessible Restroom',
  stepFreeEntrance: 'Step-Free Entrance'
};

const CONDITION_BADGES = {
  excellent: { label: 'Excellent', class: 'bg-emerald-100 text-emerald-950 border-emerald-300' },
  operational: { label: 'Operational', class: 'bg-blue-100 text-blue-950 border-blue-300' },
  needs_maintenance: { label: 'Needs Repair', class: 'bg-amber-100 text-amber-950 border-amber-300' },
  blocked_or_broken: { label: 'Broken / Blocked', class: 'bg-rose-100 text-rose-950 border-rose-300' }
};

export function VerificationTimeline({ notes = [], isLoading }) {
  const [featureFilter, setFeatureFilter] = useState('all');

  const filteredNotes = featureFilter === 'all'
    ? notes
    : notes.filter((n) => n.feature === featureFilter);

  return (
    <section aria-labelledby="timeline-heading" className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
        <div>
          <h2 id="timeline-heading" className="text-xl sm:text-2xl font-bold text-slate-950 flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600" aria-hidden="true" />
            <span>Verification Audit Log</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Immutable, time-stamped timeline of community observations.
          </p>
        </div>

        {/* Feature Filter for timeline */}
        <div className="flex items-center gap-2">
          <label htmlFor="timeline-feature-filter" className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span>Filter Feature:</span>
          </label>
          <select
            id="timeline-feature-filter"
            value={featureFilter}
            onChange={(e) => setFeatureFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <option value="all">All Features</option>
            <option value="ramp">Ramps</option>
            <option value="lift">Lifts</option>
            <option value="accessibleToilet">Restrooms</option>
            <option value="stepFreeEntrance">Step-Free</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4 py-8 animate-pulse">
          <div className="h-20 bg-slate-100 rounded-xl" />
          <div className="h-20 bg-slate-100 rounded-xl" />
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No verification entries found for this feature.</p>
          <p className="text-xs text-slate-500 mt-1">Be the first community member to log an audit report above.</p>
        </div>
      ) : (
        <ol className="relative border-l-2 border-slate-200 ml-3 sm:ml-4 space-y-6" role="list">
          {filteredNotes.map((note) => {
            const verifiedDate = new Date(note.verifiedAt);
            const condition = CONDITION_BADGES[note.conditionRating] || CONDITION_BADGES.operational;

            return (
              <li key={note._id} className="ml-6 sm:ml-8 group" role="listitem">
                {/* Timeline node marker */}
                <span
                  className={`absolute -left-[9px] mt-1.5 w-4 h-4 rounded-full border-2 border-white ring-4 ring-slate-100 ${
                    note.observedStatus ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  aria-hidden="true"
                />

                <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-5 hover:bg-slate-50 transition-colors">
                  {/* Top Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-950">
                        {FEATURE_NAMES[note.feature] || note.feature}
                      </span>
                      {note.observedStatus ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                          <span>Operational</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
                          <span>Inaccessible / Broken</span>
                        </span>
                      )}

                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${condition.class}`}>
                        {condition.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium" title={format(verifiedDate, 'PPP p')}>
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{formatDistanceToNow(verifiedDate, { addSuffix: true })}</span>
                    </div>
                  </div>

                  {/* Observational Details */}
                  <p className="text-sm text-slate-800 leading-relaxed font-normal mb-3">
                    "{note.details}"
                  </p>

                  {/* Contributor Footer */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 border-t border-slate-200/80 pt-2 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    <span>Audited by: </span>
                    <span className="font-semibold text-slate-800">{note.contributorName}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

