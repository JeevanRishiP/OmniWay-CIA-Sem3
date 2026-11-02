import React from 'react';
import { Link } from 'react-router-dom';
import { FreshnessBadge } from '../common/FreshnessBadge';
import {
  MapPin,
  ArrowRight,
  Accessibility,
  ArrowUpDown,
  Bath,
  DoorOpen,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';

const CATEGORY_LABELS = {
  restaurant: 'Restaurant',
  transit: 'Transit Station',
  retail: 'Retail Store',
  healthcare: 'Healthcare',
  public_service: 'Public Service',
  education: 'Education & Library',
  entertainment: 'Entertainment',
  other: 'General Venue'
};

export function PlaceCard({ place }) {
  const { _id, name, category, address, features, overallFreshnessScore } = place;

  const featureList = [
    {
      key: 'ramp',
      label: 'Ramp',
      icon: Accessibility,
      data: features?.ramp
    },
    {
      key: 'lift',
      label: 'Lift / Elevator',
      icon: ArrowUpDown,
      data: features?.lift
    },
    {
      key: 'accessibleToilet',
      label: 'Restroom',
      icon: Bath,
      data: features?.accessibleToilet
    },
    {
      key: 'stepFreeEntrance',
      label: 'Step-Free',
      icon: DoorOpen,
      data: features?.stepFreeEntrance
    }
  ];

  return (
    <article className="bg-white rounded-2xl border-2 border-slate-200/90 hover:border-blue-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-5 sm:p-6">
        {/* Header: Category & Overall Freshness */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            {CATEGORY_LABELS[category] || category}
          </span>
          <FreshnessBadge lastVerifiedAt={getLatestVerification(features)} compact />
        </div>

        {/* Place Title */}
        <h3 className="text-xl font-bold text-slate-950 mb-2 group-hover:text-blue-700 transition-colors line-clamp-1">
          <Link to={`/places/${_id}`} className="focus-visible:outline-none">
            {name}
          </Link>
        </h3>

        {/* Address */}
        <div className="flex items-start gap-1.5 text-xs font-medium text-slate-600 mb-6">
          <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
          <span className="line-clamp-1">
            {address?.street}, {address?.city}, {address?.state} {address?.postalCode}
          </span>
        </div>

        {/* 2x2 Mini Feature Badges Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-6" role="list" aria-label="Accessibility Features Snapshot">
          {featureList.map(({ key, label, icon: Icon, data }) => {
            const isAvailable = data?.available;
            const hasVerified = Boolean(data?.lastVerifiedAt);

            return (
              <div
                key={key}
                role="listitem"
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" aria-hidden="true" />
                    <span className="truncate">{label}</span>
                  </span>

                  {hasVerified ? (
                    isAvailable ? (
                      <span className="inline-flex items-center text-[10px] font-black text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                        YES
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-black text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded">
                        NO
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center text-[10px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                      ?
                    </span>
                  )}
                </div>

                <div className="text-[11px]">
                  <FreshnessBadge lastVerifiedAt={data?.lastVerifiedAt} compact />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer Button */}
      <div className="p-4 bg-slate-50 border-t border-slate-200/80 mt-auto">
        <Link
          to={`/places/${_id}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition-all focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
        >
          <span>View Details & Verify</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function getLatestVerification(features) {
  if (!features) return null;
  const dates = Object.values(features)
    .map((f) => (f?.lastVerifiedAt ? new Date(f.lastVerifiedAt).getTime() : 0))
    .filter(Boolean);
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates));
}

