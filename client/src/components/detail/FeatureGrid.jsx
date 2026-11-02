import React from 'react';
import { FreshnessBadge } from '../common/FreshnessBadge';
import {
  Accessibility,
  ArrowUpDown,
  Bath,
  DoorOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  PlusCircle,
  Clock,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';

const FEATURE_CONFIGS = [
  {
    key: 'ramp',
    title: 'Wheelchair Ramp',
    description: 'Permanent inclined plane replacing stairs with compliant slope and handrails.',
    icon: Accessibility
  },
  {
    key: 'lift',
    title: 'Elevator / Lift',
    description: 'Vertical platform or elevator providing access between different floor levels.',
    icon: ArrowUpDown
  },
  {
    key: 'accessibleToilet',
    title: 'Accessible Restroom',
    description: 'Restroom with wide door clearance, grab bars, and wheelchair turning space.',
    icon: Bath
  },
  {
    key: 'stepFreeEntrance',
    title: 'Step-Free Entrance',
    description: 'Primary or dedicated entrance with flush or beveled threshold and zero steps.',
    icon: DoorOpen
  }
];

export function FeatureGrid({ features, onOpenVerifyModal }) {
  return (
    <section aria-labelledby="features-matrix-heading" className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 id="features-matrix-heading" className="text-2xl font-bold text-slate-950 tracking-tight">
            Accessibility Features & Verification Status
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Real-time status based on crowdsourced community verifications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURE_CONFIGS.map(({ key, title, description, icon: Icon }) => {
          const featureData = features?.[key] || {
            available: false,
            lastVerifiedAt: null,
            verificationCount: 0,
            notes: ''
          };

          const isAvailable = featureData.available;
          const hasBeenVerified = Boolean(featureData.lastVerifiedAt);
          const verificationCount = featureData.verificationCount || 0;
          const formattedDate = hasBeenVerified
            ? format(new Date(featureData.lastVerifiedAt), 'MMMM d, yyyy')
            : null;

          return (
            <div
              key={key}
              className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                {/* Header: Title, Icon & Freshness Badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
                      <p className="text-xs text-slate-600">{description}</p>
                    </div>
                  </div>
                  <FreshnessBadge lastVerifiedAt={featureData.lastVerifiedAt} />
                </div>

                {/* Status Indicator Banner */}
                <div
                  className={`rounded-xl p-3 mb-4 flex items-center justify-between border ${
                    !hasBeenVerified
                      ? 'bg-slate-50 border-slate-200 text-slate-700'
                      : isAvailable
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {!hasBeenVerified ? (
                      <>
                        <HelpCircle className="w-5 h-5 text-slate-500" aria-hidden="true" />
                        <span>Status Unconfirmed</span>
                      </>
                    ) : isAvailable ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                        <span>Present & Operational</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600" aria-hidden="true" />
                        <span>Not Present / Inaccessible</span>
                      </>
                    )}
                  </div>

                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 text-slate-700">
                    {verificationCount} {verificationCount === 1 ? 'audit' : 'audits'}
                  </span>
                </div>

                {/* Verification Metadata & Latest Note */}
                <div className="space-y-3 mb-6 text-sm">
                  {hasBeenVerified && formattedDate && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>Last verified: {formattedDate}</span>
                    </div>
                  )}

                  {featureData.notes ? (
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <span className="font-bold text-slate-900 block mb-0.5">Latest Community Note:</span>
                        <p className="italic leading-relaxed">"{featureData.notes}"</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No detailed notes logged yet.</p>
                  )}
                </div>
              </div>

              {/* Action Button to Verify this Feature */}
              <button
                type="button"
                onClick={(e) => onOpenVerifyModal(key, e.currentTarget)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-600 hover:border-blue-700 transition-colors shadow-sm focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
              >
                <PlusCircle className="w-4 h-4" aria-hidden="true" />
                <span>Verify or Update this Feature</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

