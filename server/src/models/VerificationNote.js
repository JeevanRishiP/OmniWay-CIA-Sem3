import mongoose from 'mongoose';

const VerificationNoteSchema = new mongoose.Schema(
  {
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      required: true,
      index: true
    },
    feature: {
      type: String,
      required: true,
      enum: ['ramp', 'lift', 'accessibleToilet', 'stepFreeEntrance'],
      index: true
    },
    observedStatus: {
      type: Boolean,
      required: true
    },
    contributorName: {
      type: String,
      trim: true,
      maxlength: 50,
      default: 'Anonymous Community Member'
    },
    details: {
      type: String,
      trim: true,
      maxlength: [400, 'Details cannot exceed 400 characters'],
      required: [true, 'Please provide observational context']
    },
    conditionRating: {
      type: String,
      enum: ['excellent', 'operational', 'needs_maintenance', 'blocked_or_broken'],
      default: 'operational'
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
      index: -1
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const VerificationNote = mongoose.model('VerificationNote', VerificationNoteSchema);

