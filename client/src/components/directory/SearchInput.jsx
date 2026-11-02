import React from 'react';
import { Search, X } from 'lucide-react';

export function SearchInput({ value, onChange, onClear, placeholder = 'Search by place name, street, or city...' }) {
  return (
    <div className="relative w-full">
      <label htmlFor="directory-search-input" className="sr-only">
        Search accessible places by name, street address, or city
      </label>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
        <Search className="w-5 h-5" aria-hidden="true" />
      </div>
      <input
        id="directory-search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 text-base font-medium shadow-sm transition-all focus:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
          aria-label="Clear search input"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

