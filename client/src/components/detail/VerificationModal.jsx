import React, { useState, useEffect } from 'react';
import { AccessibleModal } from '../common/AccessibleModal';
import { useVerifyFeature } from '../../hooks/usePlaces';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

const FEATURES = [
  { id: 'ramp', name: 'Wheelchair Ramp' },
  { id: 'lift', name: 'Elevator / Lift' },
  { id: 'accessibleToilet', name: 'Accessible Restroom' },
  { id: 'stepFreeEntrance', name: 'Step-Free Entrance' }
];

export function VerificationModal({
  isOpen,
  onClose,
  placeId,
  placeName,
  initialFeature = 'ramp',
  triggerRef
}) {
  const [selectedFeature, setSelectedFeature] = useState(initialFeature);
  const [observedStatus, setObservedStatus] = useState(true);
  const [conditionRating, setConditionRating] = useState('operational');
  const [details, setDetails] = useState('');
  const [contributorName, setContributorName] = useState('');
  const [validationError, setValidationError] = useState('');

  const verifyMutation = useVerifyFeature(placeId);

  useEffect(() => {
    if (isOpen) {
      setSelectedFeature(initialFeature);
      setObservedStatus(true);
      setConditionRating('operational');
      setDetails('');
      setContributorName('');
      setValidationError('');
    }
  }, [isOpen, initialFeature]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!details.trim()) {
      setValidationError('Please provide brief observational context describing the current state.');
      return;
    }

    if (details.length > 400) {
      setValidationError('Observational notes must be 400 characters or fewer.');
      return;
    }

    try {
      await verifyMutation.mutateAsync({
        feature: selectedFeature,
        observedStatus,
        conditionRating,
        details: details.trim(),
        contributorName: contributorName.trim() || 'Anonymous Community Member'
      });

      onClose();
    } catch (err) {
      setValidationError(err.message || 'Failed to submit verification. Please try again.');
    }
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Accessibility Feature"
      description={`Record an audit for ${placeName || 'this venue'}. Your report immediately updates the community freshness engine.`}
      triggerRef={triggerRef}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Validation Alert */}
        {validationError && (
          <div
            role="alert"
            className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-950 text-xs font-semibold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Feature Dropdown */}
        <div>
          <label htmlFor="verify-feature-select" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
            Feature to Audit <span className="text-rose-600">*</span>
          </label>
          <select
            id="verify-feature-select"
            value={selectedFeature}
            onChange={(e) => setSelectedFeature(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            {FEATURES.map((feat) => (
              <option key={feat.id} value={feat.id}>
                {feat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Operational Status (Segmented Buttons) */}
        <div>
          <span className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
            Is this feature operational & accessible today? <span className="text-rose-600">*</span>
          </span>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Operational status">
            <button
              type="button"
              role="radio"
              aria-checked={observedStatus === true}
              onClick={() => {
                setObservedStatus(true);
                if (conditionRating === 'blocked_or_broken') setConditionRating('operational');
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                observedStatus === true
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-sm'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className={`w-5 h-5 ${observedStatus === true ? 'text-emerald-600' : 'text-slate-400'}`} aria-hidden="true" />
              <span>Yes, Operational</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={observedStatus === false}
              onClick={() => {
                setObservedStatus(false);
                setConditionRating('needs_maintenance');
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                observedStatus === false
                  ? 'bg-rose-50 border-rose-600 text-rose-950 shadow-sm'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <XCircle className={`w-5 h-5 ${observedStatus === false ? 'text-rose-600' : 'text-slate-400'}`} aria-hidden="true" />
              <span>No, Broken / Blocked</span>
            </button>
          </div>
        </div>

        {/* Condition Rating */}
        <div>
          <label htmlFor="verify-condition-select" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
            Physical Condition & Quality
          </label>
          <select
            id="verify-condition-select"
            value={conditionRating}
            onChange={(e) => setConditionRating(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            <option value="excellent">Excellent - Pristine, unobstructed, modern</option>
            <option value="operational">Operational - Functional and accessible</option>
            <option value="needs_maintenance">Needs Maintenance - Minor hurdles, heavy door, worn surface</option>
            <option value="blocked_or_broken">Blocked or Broken - Completely unusable</option>
          </select>
        </div>

        {/* Observational Context Notes */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="verify-notes-textarea" className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              Observational Notes <span className="text-rose-600">*</span>
            </label>
            <span
              className={`text-xs font-semibold ${
                details.length > 380 ? 'text-rose-600 font-bold' : 'text-slate-500'
              }`}
            >
              {details.length} / 400
            </span>
          </div>
          <textarea
            id="verify-notes-textarea"
            rows={3}
            maxLength={400}
            required
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="e.g., Ramp is clear of ice and debris, push-button automated door opens fully in under 2 seconds..."
            className="w-full bg-white border-2 border-slate-300 rounded-xl p-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
          />
        </div>

        {/* Contributor Name (Optional) */}
        <div>
          <label htmlFor="verify-name-input" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
            Your Name or Community Handle (Optional)
          </label>
          <input
            id="verify-name-input"
            type="text"
            maxLength={50}
            value={contributorName}
            onChange={(e) => setContributorName(e.target.value)}
            placeholder="Leave blank for 'Anonymous Community Member'"
            className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors focus-visible:ring-4 focus-visible:ring-blue-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={verifyMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-md transition-all disabled:opacity-50 focus-visible:ring-4 focus-visible:ring-blue-600"
          >
            {verifyMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            <span>{verifyMutation.isPending ? 'Logging Verification...' : 'Submit Verification'}</span>
          </button>
        </div>
      </form>
    </AccessibleModal>
  );
}

