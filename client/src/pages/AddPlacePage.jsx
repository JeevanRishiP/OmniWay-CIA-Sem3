import React from 'react';
import { Link } from 'react-router-dom';
import { AddPlaceForm } from '../components/forms/AddPlaceForm';
import { ChevronRight, PlusCircle, ShieldCheck } from 'lucide-react';

export function AddPlacePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
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
            <span className="text-slate-900" aria-current="page">
              Add Place
            </span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 mb-3">
          <PlusCircle className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
          <span>Crowdsource A New Venue</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mb-2">
          Register an Accessible Venue
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Help community members navigate with confidence by adding a venue. You can specify initial known accessibility features, and community members can audit them going forward.
        </p>
      </div>

      {/* Sectioned Form */}
      <AddPlaceForm />
    </div>
  );
}

