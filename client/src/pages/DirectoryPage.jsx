import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlaces } from '../hooks/usePlaces';
import { useDebounce } from '../hooks/useDebounce';
import { FilterBar } from '../components/directory/FilterBar';
import { PlaceCard } from '../components/directory/PlaceCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import {
  MapPin,
  PlusCircle,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  SearchX
} from 'lucide-react';

export function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featureFilters, setFeatureFilters] = useState({
    ramp: false,
    lift: false,
    toilet: false,
    stepFree: false
  });
  const [freshOnly, setFreshOnly] = useState(false);
  const [page, setPage] = useState(1);

  // Construct query parameters for usePlaces hook
  const queryParams = {
    search: debouncedSearch.trim() || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    ramp: featureFilters.ramp ? 'true' : undefined,
    lift: featureFilters.lift ? 'true' : undefined,
    toilet: featureFilters.toilet ? 'true' : undefined,
    stepFree: featureFilters.stepFree ? 'true' : undefined,
    freshOnly: freshOnly ? 'true' : undefined,
    page,
    limit: 12
  };

  const { data, isLoading, isError, error } = usePlaces(queryParams);

  const places = data?.places || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 12, totalPages: 1 };

  const handleFeatureToggle = (featureKey) => {
    setFeatureFilters((prev) => ({
      ...prev,
      [featureKey]: !prev[featureKey]
    }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setFeatureFilters({
      ramp: false,
      lift: false,
      toilet: false,
      stepFree: false
    });
    setFreshOnly(false);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <section aria-labelledby="hero-title" className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 mb-4">
          <ShieldCheck className="w-4 h-4 text-blue-700" aria-hidden="true" />
          <span>Crowdsourced Physical Accessibility with Time-Audited Verification</span>
        </div>
        <h1 id="hero-title" className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-4">
          Know What's Truly Accessible <span className="text-blue-700">Right Now</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
          Physical accessibility features degrade, change, or get blocked over time. <strong>OmniWay</strong> provides up-to-date, crowdsourced records tracking <strong>when</strong> each ramp, lift, accessible restroom, and step-free entrance was last verified.
        </p>
      </section>

      {/* Filter and Search Bar */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        onSearchClear={() => {
          setSearchTerm('');
          setPage(1);
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={(val) => {
          setSelectedCategory(val);
          setPage(1);
        }}
        featureFilters={featureFilters}
        onFeatureToggle={handleFeatureToggle}
        freshOnly={freshOnly}
        onFreshOnlyToggle={(val) => {
          setFreshOnly(val);
          setPage(1);
        }}
        onResetFilters={handleResetFilters}
        totalResults={pagination.total}
      />

      {/* Directory Grid Section */}
      <section aria-labelledby="places-grid-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 id="places-grid-heading" className="text-xl font-bold text-slate-950 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" aria-hidden="true" />
            <span>Verified Places ({pagination.total})</span>
          </h2>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>Page {pagination.page} of {pagination.totalPages}</span>
          </div>
        </div>

        {/* Content Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div
            role="alert"
            className="p-8 bg-rose-50 border-2 border-rose-300 rounded-2xl text-center max-w-xl mx-auto my-12"
          >
            <p className="text-base font-bold text-rose-900 mb-2">Unable to load venues</p>
            <p className="text-xs text-rose-700 mb-6">{error?.message || 'A network error occurred.'}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-rose-700 text-white rounded-xl text-xs font-bold hover:bg-rose-800 focus-visible:ring-4 focus-visible:ring-rose-600"
            >
              Retry
            </button>
          </div>
        ) : places.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-white rounded-2xl border-2 border-dashed border-slate-300 max-w-2xl mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-slate-950 mb-2">No venues match your current filters</h3>
            <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
              We couldn't find any places matching your search or accessibility requirements. Try clearing some filters or add this venue to help the community!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors focus-visible:ring-4 focus-visible:ring-blue-600"
              >
                Clear All Filters
              </button>
              <Link
                to="/places/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition-colors focus-visible:ring-4 focus-visible:ring-blue-600"
              >
                <PlusCircle className="w-4 h-4" aria-hidden="true" />
                <span>Add New Place</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Place Cards Grid */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <nav aria-label="Pagination Navigation" className="mt-12 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-white border-2 border-slate-300 text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm focus-visible:ring-4 focus-visible:ring-blue-600"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setPage(pageNum)}
                        aria-current={page === pageNum ? 'page' : undefined}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                          page === pageNum
                            ? 'bg-blue-700 text-white shadow-sm'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-white border-2 border-slate-300 text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm focus-visible:ring-4 focus-visible:ring-blue-600"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}

