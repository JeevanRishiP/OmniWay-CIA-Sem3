import mongoose from 'mongoose';
import { Place } from '../models/Place.js';
import { VerificationNote } from '../models/VerificationNote.js';
import { AppError } from '../middleware/errorHandler.js';
import { calculateOverallFreshness } from '../utils/freshnessCalculator.js';

/**
 * Submit verification note and refresh place feature timestamp
 */
export async function createVerification(req, res, next) {
  try {
    const { id } = req.params;
    const { feature, observedStatus, details, conditionRating = 'operational', contributorName = 'Anonymous Community Member' } = req.body;

    const place = await Place.findById(id);
    if (!place) {
      throw new AppError(
        `Place with ID '${id}' not found`,
        404,
        'Place Not Found',
        'https://api.accessibleplace.org/errors/place-not-found'
      );
    }

    const verifiedAt = new Date();

    // Create the immutable audit record
    const note = new VerificationNote({
      placeId: place._id,
      feature,
      observedStatus: Boolean(observedStatus),
      contributorName: contributorName?.trim() || 'Anonymous Community Member',
      details: details.trim(),
      conditionRating,
      verifiedAt
    });

    await note.save();

    // Atomic update of the Place document's embedded feature status
    const updateQuery = {
      $set: {
        [`features.${feature}.available`]: Boolean(observedStatus),
        [`features.${feature}.lastVerifiedAt`]: verifiedAt,
        [`features.${feature}.notes`]: details.trim()
      },
      $inc: {
        [`features.${feature}.verificationCount`]: 1
      }
    };

    const updatedPlace = await Place.findByIdAndUpdate(id, updateQuery, {
      new: true,
      runValidators: true
    });

    // Recompute overall freshness score
    updatedPlace.overallFreshnessScore = calculateOverallFreshness(updatedPlace.features, verifiedAt);
    await updatedPlace.save();

    res.status(201).json({
      message: 'Feature verification recorded successfully',
      place: updatedPlace,
      note
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get audit timeline of verifications for a place
 */
export async function getVerificationsByPlaceId(req, res, next) {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, feature } = req.query;

    const placeExists = await Place.exists({ _id: id });
    if (!placeExists) {
      throw new AppError(
        `Place with ID '${id}' not found`,
        404,
        'Place Not Found',
        'https://api.accessibleplace.org/errors/place-not-found'
      );
    }

    const query = { placeId: id };
    if (feature && ['ramp', 'lift', 'accessibleToilet', 'stepFreeEntrance'].includes(feature)) {
      query.feature = feature;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [total, notes] = await Promise.all([
      VerificationNote.countDocuments(query),
      VerificationNote.find(query)
        .sort({ verifiedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    res.status(200).json({
      notes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (err) {
    next(err);
  }
}

