import React from 'react';
import { SearchInput } from './SearchInput';
import { Sparkles, SlidersHorizontal, RotateCcw, Check, Building2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'restaurant', label: 'Restaurants & Dining' },
  { id: 'transit', label: 'Transit & Stations' },
  { id: 'retail', label: 'Retail & Shopping' },
  { id: 'healthcare', label: 'Healthcare & Clinics' },
  { id: 'public_service', label: 'Public Services' },
  { id: 'education', label: 'Education & Libraries' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'other', label: 'Other' }
];

export function FilterBar({
  searchTerm,
  onSearchChange,
  onSearchClear,
  selectedCategory,
  onCategoryChange,
  featureFilters,
  onFeatureToggle,
  freshOnly,
  onFreshOnlyToggle,
  onResetFilters,
  totalResults
}) {
  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    Object.values(featureFilters).filter(Boolean).length +
    (freshOnly ? 1 : 0) +
    (searchTerm ? 1 : 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-8">
      {/* Search Input Row */}
      <div className="mb-6">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          onClear={onSearchClear}
          placeholder="Search by venue name, street address, or city..."
        />
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-slate-100">
        {/* Category Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="category-select" className="text-sm font-bold text-slate-900 shrink-0 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-600" aria-hidden="true" />
            <span>Category:</span>
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Feature Check Chips */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by accessibility features">
          <button
            type="button"
            onClick={() => onFeatureToggle('ramp')}
            aria-pressed={featureFilters.ramp}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
              featureFilters.ramp
                ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {featureFilters.ramp && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
            <span>Wheelchair Ramp</span>
          </button>

          <button
            type="button"
            onClick={() => onFeatureToggle('lift')}
            aria-pressed={featureFilters.lift}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
              featureFilters.lift
                ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {featureFilters.lift && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
            <span>Elevator / Lift</span>
          </button>

          <button
            type="button"
            onClick={() => onFeatureToggle('toilet')}
            aria-pressed={featureFilters.toilet}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
              featureFilters.toilet
                ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {featureFilters.toilet && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
            <span>Accessible Restroom</span>
          </button>

          <button
            type="button"
            onClick={() => onFeatureToggle('stepFree')}
            aria-pressed={featureFilters.stepFree}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
              featureFilters.stepFree
                ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {featureFilters.stepFree && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
            <span>Step-Free Entrance</span>
          </button>
        </div>

        {/* Freshly Verified Quick-Filter Switch */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={freshOnly}
              onChange={(e) => onFreshOnlyToggle(e.target.checked)}
              className="sr-only peer"
              id="fresh-only-switch"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            <span className="ml-2.5 text-xs font-bold text-slate-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>Freshly Verified (&lt; 30d)</span>
            </span>
          </label>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-300"
              title="Reset all search queries and filters"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Screen reader live updates */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {totalResults !== undefined && `${totalResults} places found matching current filters.`}
      </div>
    </div>
  );
}

