import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePlace } from '../../hooks/usePlaces';
import {
  Building2,
  MapPin,
  CheckSquare,
  AlertCircle,
  Loader2,
  Accessibility,
  ArrowUpDown,
  Bath,
  DoorOpen
} from 'lucide-react';

const CATEGORIES = [
  { id: 'restaurant', label: 'Restaurant & Dining' },
  { id: 'transit', label: 'Transit Station & Bus Depot' },
  { id: 'retail', label: 'Retail Store & Mall' },
  { id: 'healthcare', label: 'Healthcare & Clinic' },
  { id: 'public_service', label: 'Public & Government Service' },
  { id: 'education', label: 'Education & Library' },
  { id: 'entertainment', label: 'Theater & Entertainment' },
  { id: 'other', label: 'Other Commercial / Public Venue' }
];

export function AddPlaceForm() {
  const navigate = useNavigate();
  const createMutation = useCreatePlace();

  // General Details State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('restaurant');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  // Initial Features State
  const [features, setFeatures] = useState({
    ramp: { available: false, notes: '' },
    lift: { available: false, notes: '' },
    accessibleToilet: { available: false, notes: '' },
    stepFreeEntrance: { available: false, notes: '' }
  });

  const [creatorName, setCreatorName] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleFeatureToggle = (key) => {
    setFeatures((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        available: !prev[key].available
      }
    }));
  };

  const handleFeatureNoteChange = (key, text) => {
    setFeatures((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        notes: text
      }
    }));
  };

  const validateForm = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Place or venue name is required.';
    if (!category) errs.category = 'Category selection is required.';
    if (!street.trim()) errs.street = 'Street address is required.';
    if (!city.trim()) errs.city = 'City is required.';
    if (!state.trim()) errs.state = 'State / Province is required.';
    if (!postalCode.trim()) errs.postalCode = 'Postal / Zip code is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validationErrs = validateForm();
    if (Object.keys(validationErrs).length > 0) {
      setErrors(validationErrs);
      // Focus first error field
      const firstKey = Object.keys(validationErrs)[0];
      const el = document.getElementById(`place-${firstKey}`);
      if (el) el.focus();
      return;
    }

    setErrors({});

    try {
      const payload = {
        name: name.trim(),
        category,
        address: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: country.trim() || 'USA'
        },
        initialFeatures: {
          ramp: {
            available: features.ramp.available,
            notes: features.ramp.notes.trim(),
            contributorName: creatorName.trim() || 'Place Creator'
          },
          lift: {
            available: features.lift.available,
            notes: features.lift.notes.trim(),
            contributorName: creatorName.trim() || 'Place Creator'
          },
          accessibleToilet: {
            available: features.accessibleToilet.available,
            notes: features.accessibleToilet.notes.trim(),
            contributorName: creatorName.trim() || 'Place Creator'
          },
          stepFreeEntrance: {
            available: features.stepFreeEntrance.available,
            notes: features.stepFreeEntrance.notes.trim(),
            contributorName: creatorName.trim() || 'Place Creator'
          }
        }
      };

      const result = await createMutation.mutateAsync(payload);
      if (result?.place?._id) {
        navigate(`/places/${result.place._id}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      setServerError(err.message || 'Failed to register place. Please check fields and retry.');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">
      {/* Server / Network Error Alert */}
      {serverError && (
        <div
          role="alert"
          className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-950 text-sm font-semibold flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" aria-hidden="true" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Section 1: General Details */}
      <section aria-labelledby="section-general-heading" className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
            <Building2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="section-general-heading" className="text-xl font-bold text-slate-950">
              1. Venue Information
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">Enter venue identity and category classification.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="md:col-span-2">
            <label htmlFor="place-name" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              Venue Name <span className="text-rose-600">*</span>
            </label>
            <input
              id="place-name"
              type="text"
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'place-name-err' : undefined}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Toit Indiranagar, Manipal Hospital, Orion Mall..."
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
            />
            {errors.name && (
              <p id="place-name-err" className="mt-1.5 text-xs font-bold text-rose-600">
                {errors.name}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="md:col-span-2">
            <label htmlFor="place-category" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              Category <span className="text-rose-600">*</span>
            </label>
            <select
              id="place-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Section 2: Address */}
      <section aria-labelledby="section-address-heading" className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <MapPin className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="section-address-heading" className="text-xl font-bold text-slate-950">
              2. Physical Address
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">Accurate street and city details ensure precise community locating.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Street */}
          <div className="md:col-span-2">
            <label htmlFor="place-street" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              Street Address <span className="text-rose-600">*</span>
            </label>
            <input
              id="place-street"
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g., 298, 100 Feet Road, Indiranagar"
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
            />
            {errors.street && <p className="mt-1 text-xs font-bold text-rose-600">{errors.street}</p>}
          </div>

          {/* City */}
          <div>
            <label htmlFor="place-city" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              City <span className="text-rose-600">*</span>
            </label>
            <input
              id="place-city"
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Bengaluru"
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
            />
            {errors.city && <p className="mt-1 text-xs font-bold text-rose-600">{errors.city}</p>}
          </div>

          {/* State */}
          <div>
            <label htmlFor="place-state" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              State <span className="text-rose-600">*</span>
            </label>
            <input
              id="place-state"
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g., Karnataka"
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
            />
            {errors.state && <p className="mt-1 text-xs font-bold text-rose-600">{errors.state}</p>}
          </div>

          {/* Postal Code */}
          <div>
            <label htmlFor="place-postalCode" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              PIN / Postal Code <span className="text-rose-600">*</span>
            </label>
            <input
              id="place-postalCode"
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="e.g., 560038"
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
            />
            {errors.postalCode && <p className="mt-1 text-xs font-bold text-rose-600">{errors.postalCode}</p>}
          </div>

          {/* Country */}
          <div>
            <label htmlFor="place-country" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              Country
            </label>
            <input
              id="place-country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="India"
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Initial Accessibility Verification Check */}
      <section aria-labelledby="section-features-heading" className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
            <CheckSquare className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="section-features-heading" className="text-xl font-bold text-slate-950">
              3. Initial Accessibility Check (Optional)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Check off known features you have personally verified. Each verified feature will begin in the <strong>Fresh</strong> tier.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Ramp */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={features.ramp.available}
                onChange={() => handleFeatureToggle('ramp')}
                className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <div>
                <span className="flex items-center gap-1.5 text-base font-bold text-slate-950">
                  <Accessibility className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  <span>Wheelchair Ramp Present & Operational</span>
                </span>
                <span className="text-xs text-slate-600 block mt-0.5">
                  Permanent inclined ramp available with compliant handrails.
                </span>
              </div>
            </label>
            {features.ramp.available && (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <label htmlFor="ramp-notes" className="block text-xs font-bold text-slate-700 mb-1">
                  Observational Context Note (Optional):
                </label>
                <input
                  id="ramp-notes"
                  type="text"
                  maxLength={300}
                  value={features.ramp.notes}
                  onChange={(e) => handleFeatureNoteChange('ramp', e.target.value)}
                  placeholder="e.g., Concrete ramp on west side, slope is gentle"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                />
              </div>
            )}
          </div>

          {/* Elevator / Lift */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={features.lift.available}
                onChange={() => handleFeatureToggle('lift')}
                className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <div>
                <span className="flex items-center gap-1.5 text-base font-bold text-slate-950">
                  <ArrowUpDown className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  <span>Elevator / Platform Lift Available</span>
                </span>
                <span className="text-xs text-slate-600 block mt-0.5">
                  Operational elevator connecting all public floors.
                </span>
              </div>
            </label>
            {features.lift.available && (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <label htmlFor="lift-notes" className="block text-xs font-bold text-slate-700 mb-1">
                  Observational Context Note (Optional):
                </label>
                <input
                  id="lift-notes"
                  type="text"
                  maxLength={300}
                  value={features.lift.notes}
                  onChange={(e) => handleFeatureNoteChange('lift', e.target.value)}
                  placeholder="e.g., Spacious elevator with low Braille buttons"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                />
              </div>
            )}
          </div>

          {/* Accessible Restroom */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={features.accessibleToilet.available}
                onChange={() => handleFeatureToggle('accessibleToilet')}
                className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <div>
                <span className="flex items-center gap-1.5 text-base font-bold text-slate-950">
                  <Bath className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  <span>Accessible Restroom / Toilet Present</span>
                </span>
                <span className="text-xs text-slate-600 block mt-0.5">
                  Restroom stall with grab bars and wheelchair turning space.
                </span>
              </div>
            </label>
            {features.accessibleToilet.available && (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <label htmlFor="toilet-notes" className="block text-xs font-bold text-slate-700 mb-1">
                  Observational Context Note (Optional):
                </label>
                <input
                  id="toilet-notes"
                  type="text"
                  maxLength={300}
                  value={features.accessibleToilet.notes}
                  onChange={(e) => handleFeatureNoteChange('accessibleToilet', e.target.value)}
                  placeholder="e.g., Automatic door button, sturdy grab bars on both sides"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                />
              </div>
            )}
          </div>

          {/* Step-Free Entrance */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={features.stepFreeEntrance.available}
                onChange={() => handleFeatureToggle('stepFreeEntrance')}
                className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <div>
                <span className="flex items-center gap-1.5 text-base font-bold text-slate-950">
                  <DoorOpen className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  <span>Step-Free Entrance Available</span>
                </span>
                <span className="text-xs text-slate-600 block mt-0.5">
                  Zero threshold or flush doorway into venue.
                </span>
              </div>
            </label>
            {features.stepFreeEntrance.available && (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <label htmlFor="stepfree-notes" className="block text-xs font-bold text-slate-700 mb-1">
                  Observational Context Note (Optional):
                </label>
                <input
                  id="stepfree-notes"
                  type="text"
                  maxLength={300}
                  value={features.stepFreeEntrance.notes}
                  onChange={(e) => handleFeatureNoteChange('stepFreeEntrance', e.target.value)}
                  placeholder="e.g., Wide automatic sliding glass entrance"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                />
              </div>
            )}
          </div>

          {/* Creator Contributor Name */}
          <div className="pt-2">
            <label htmlFor="creator-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Name or Handle for the Verification Audit:
            </label>
            <input
              id="creator-name"
              type="text"
              maxLength={50}
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="e.g., Jamie Taylor (defaults to 'Place Creator')"
              className="w-full sm:w-1/2 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-600"
            />
          </div>
        </div>
      </section>

      {/* Action Submit Button */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors focus-visible:ring-4 focus-visible:ring-blue-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-lg shadow-blue-700/20 transition-all disabled:opacity-50 focus-visible:ring-4 focus-visible:ring-blue-600"
        >
          {createMutation.isPending && <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />}
          <span>{createMutation.isPending ? 'Registering Venue...' : 'Register Venue & Save'}</span>
        </button>
      </div>
    </form>
  );
}

