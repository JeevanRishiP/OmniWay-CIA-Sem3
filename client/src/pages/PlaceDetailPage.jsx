import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlace, usePlaceNotes } from '../hooks/usePlaces';
import { FeatureGrid } from '../components/detail/FeatureGrid';
import { VerificationTimeline } from '../components/detail/VerificationTimeline';
import { VerificationModal } from '../components/detail/VerificationModal';
import { FreshnessBadge } from '../components/common/FreshnessBadge';
import {
  MapPin,
  ChevronRight,
  Share2,
  Check,
  PlusCircle,
  ShieldCheck,
  Building2,
  ArrowLeft
} from 'lucide-react';

const CATEGORY_LABELS = {
  restaurant: 'Restaurant & Dining',
  transit: 'Transit Station',
  retail: 'Retail Store',
  healthcare: 'Healthcare & Clinic',
  public_service: 'Public Service',
  education: 'Education & Library',
  entertainment: 'Entertainment & Theater',
  other: 'General Venue'
};

export function PlaceDetailPage() {
  const { id } = useParams();
  const { data: placeData, isLoading, isError, error } = usePlace(id);
  const { data: notesData, isLoading: isNotesLoading } = usePlaceNotes(id);

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedFeatureToVerify, setSelectedFeatureToVerify] = useState('ramp');
  const [copiedLink, setCopiedLink] = useState(false);

  const lastTriggerButtonRef = useRef(null);

  const handleOpenVerifyModal = (featureKey = 'ramp', triggerEl = null) => {
    setSelectedFeatureToVerify(featureKey);
    lastTriggerButtonRef.current = triggerEl;
    setIsVerifyModalOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="h-40 bg-white rounded-2xl border border-slate-200 p-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-white rounded-2xl border border-slate-200" />
          <div className="h-64 bg-white rounded-2xl border border-slate-200" />
        </div>
      </div>
    );
  }

  if (isError || !placeData?.place) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div
          role="alert"
          className="p-8 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-950 mb-6"
        >
          <h1 className="text-2xl font-bold mb-2">Venue Not Found</h1>
          <p className="text-sm text-rose-700 leading-relaxed">
            {error?.message || "The place you are looking for does not exist or may have been removed."}
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-800 transition-colors focus-visible:ring-4 focus-visible:ring-blue-600"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  const { place, stats } = placeData;
  const notes = notesData?.notes || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <li>
            <Link to="/" className="hover:text-blue-700 hover:underline focus-visible:outline-none">
              Directory
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </li>
          <li>
            <span className="text-slate-900 line-clamp-1" aria-current="page">
              {place.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* Header Banner Section */}
      <header className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 shadow-sm mb-10">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-900 border border-slate-300">
                <Building2 className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                <span>{CATEGORY_LABELS[place.category] || place.category}</span>
              </span>

              <FreshnessBadge lastVerifiedAt={getLatestVerification(place.features)} />
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {place.name}
            </h1>

            <div className="flex items-start gap-2 text-sm font-semibold text-slate-600">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                {place.address?.street}, {place.address?.city}, {place.address?.state}{' '}
                {place.address?.postalCode}, {place.address?.country}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors focus-visible:ring-4 focus-visible:ring-blue-600"
              aria-label={copiedLink ? 'Link copied to clipboard' : 'Share venue link'}
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-600" aria-hidden="true" />
                  <span>Share Place</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={(e) => handleOpenVerifyModal('ramp', e.currentTarget)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-md transition-all focus-visible:ring-4 focus-visible:ring-blue-600"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>Verify a Feature</span>
            </button>
          </div>
        </div>

        {/* Overall Verification Status Summary Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Confirmed Features
            </span>
            <span className="text-2xl font-black text-slate-950">
              {stats?.featuresAvailableCount ?? 0} <span className="text-sm font-normal text-slate-500">of 4 core features</span>
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Community Audits Logged
            </span>
            <span className="text-2xl font-black text-slate-950">
              {stats?.totalVerifications ?? 0} <span className="text-sm font-normal text-slate-500">verifications</span>
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Reliability Score
            </span>
            <span className="text-2xl font-black capitalize text-blue-700">
              {place.overallFreshnessScore || 'Unverified'}
            </span>
          </div>
        </div>
      </header>

      {/* 4 Core Features Grid */}
      <FeatureGrid
        features={place.features}
        onOpenVerifyModal={handleOpenVerifyModal}
      />

      {/* Verification Timeline Audit Log */}
      <VerificationTimeline
        notes={notes}
        isLoading={isNotesLoading}
      />

      {/* Verification Dialog Modal */}
      <VerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        placeId={place._id}
        placeName={place.name}
        initialFeature={selectedFeatureToVerify}
        triggerRef={lastTriggerButtonRef}
      />
    </div>
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

