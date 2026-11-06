import mongoose from 'mongoose';
import { calculateOverallFreshness } from '../utils/freshnessCalculator.js';

const FeatureStatusSchema = new mongoose.Schema(
  {
    available: {
      type: Boolean,
      required: true,
      default: false
    },
    lastVerifiedAt: {
      type: Date,
      default: null,
      index: true
    },
    verificationCount: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      maxlength: 300,
      default: ''
    }
  },
  { _id: false }
);

const PlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
      index: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'restaurant',
        'transit',
        'retail',
        'healthcare',
        'public_service',
        'education',
        'entertainment',
        'other'
      ],
      index: true
    },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true, index: true },
      state: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
      country: { type: String, default: 'India' }
    },
    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number] // [longitude, latitude]
      }
    },
    features: {
      ramp: { type: FeatureStatusSchema, default: () => ({}) },
      lift: { type: FeatureStatusSchema, default: () => ({}) },
      accessibleToilet: { type: FeatureStatusSchema, default: () => ({}) },
      stepFreeEntrance: { type: FeatureStatusSchema, default: () => ({}) }
    },
    overallFreshnessScore: {
      type: String,
      enum: ['fresh', 'moderate', 'stale', 'unverified'],
      default: 'unverified'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Geo-spatial index for radius queries (sparse allows documents without location)
PlaceSchema.index({ location: '2dsphere' }, { sparse: true });
// Compound index for search filters
PlaceSchema.index({ 'address.city': 1, category: 1 });
PlaceSchema.index({ name: 'text', 'address.street': 'text', 'address.city': 'text' });

// Auto-recalculate overall freshness before saving
PlaceSchema.pre('save', function (next) {
  if (this.features) {
    this.overallFreshnessScore = calculateOverallFreshness(this.features);
  }
  next();
});

export const Place = mongoose.model('Place', PlaceSchema);

