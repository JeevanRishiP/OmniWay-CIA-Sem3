import { Place } from '../models/Place.js';
import { VerificationNote } from '../models/VerificationNote.js';
import { AppError } from '../middleware/errorHandler.js';
import { calculateOverallFreshness } from '../utils/freshnessCalculator.js';
import { subDays } from 'date-fns';

/**
 * List places with search, filtering, and pagination
 */
export async function getPlaces(req, res, next) {
  try {
    const {
      search,
      category,
      ramp,
      lift,
      toilet,
      accessibleToilet,
      stepFree,
      stepFreeEntrance,
      freshOnly,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Search by name, street, or city (case-insensitive regex)
    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { 'address.street': { $regex: s, $options: 'i' } },
        { 'address.city': { $regex: s, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Feature availability filters
    if (ramp === 'true') {
      query['features.ramp.available'] = true;
    }
    if (lift === 'true') {
      query['features.lift.available'] = true;
    }
    if (toilet === 'true' || accessibleToilet === 'true') {
      query['features.accessibleToilet.available'] = true;
    }
    if (stepFree === 'true' || stepFreeEntrance === 'true') {
      query['features.stepFreeEntrance.available'] = true;
    }

    // Fresh only filter: at least one feature verified in last 30 days
    if (freshOnly === 'true') {
      const thirtyDaysAgo = subDays(new Date(), 30);
      query.$or = query.$or ? query.$or : [];
      const freshConditions = [
        { 'features.ramp.lastVerifiedAt': { $gte: thirtyDaysAgo } },
        { 'features.lift.lastVerifiedAt': { $gte: thirtyDaysAgo } },
        { 'features.accessibleToilet.lastVerifiedAt': { $gte: thirtyDaysAgo } },
        { 'features.stepFreeEntrance.lastVerifiedAt': { $gte: thirtyDaysAgo } }
      ];

      if (query.$or.length > 0) {
        // If search already populated $or, combine with $and
        query.$and = [{ $or: query.$or }, { $or: freshConditions }];
        delete query.$or;
      } else {
        query.$or = freshConditions;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [total, places] = await Promise.all([
      Place.countDocuments(query),
      Place.find(query)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    // Ensure calculated freshness is returned
    const placesWithFreshness = places.map((place) => ({
      ...place,
      overallFreshnessScore: calculateOverallFreshness(place.features)
    }));

    res.status(200).json({
      places: placesWithFreshness,
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

/**
 * Get place by ID with statistics
 */
export async function getPlaceById(req, res, next) {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);

    if (!place) {
      throw new AppError(
        `Place with ID '${id}' not found`,
        404,
        'Place Not Found',
        'https://api.accessibleplace.org/errors/place-not-found'
      );
    }

    // Calculate dynamic stats
    const featureKeys = ['ramp', 'lift', 'accessibleToilet', 'stepFreeEntrance'];
    let totalVerifications = 0;
    let featuresAvailableCount = 0;

    featureKeys.forEach((key) => {
      const feat = place.features?.[key];
      if (feat) {
        totalVerifications += feat.verificationCount || 0;
        if (feat.available) featuresAvailableCount++;
      }
    });

    const dynamicFreshness = calculateOverallFreshness(place.features);
    const placeObj = place.toObject();
    placeObj.overallFreshnessScore = dynamicFreshness;

    res.status(200).json({
      place: placeObj,
      stats: {
        totalVerifications,
        featuresAvailableCount,
        overallFreshness: dynamicFreshness
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new place with optional initial features and initial audit notes
 */
export async function createPlace(req, res, next) {
  try {
    const { name, category, address, location, initialFeatures } = req.body;

    const placeData = {
      name,
      category,
      address,
      features: {
        ramp: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
        lift: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
        accessibleToilet: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' },
        stepFreeEntrance: { available: false, lastVerifiedAt: null, verificationCount: 0, notes: '' }
      }
    };

    if (location?.coordinates && location.coordinates.length === 2) {
      placeData.location = {
        type: 'Point',
        coordinates: location.coordinates
      };
    }

    const initialNotesToCreate = [];
    const now = new Date();

    if (initialFeatures && typeof initialFeatures === 'object') {
      const featureKeys = ['ramp', 'lift', 'accessibleToilet', 'stepFreeEntrance'];
      for (const key of featureKeys) {
        const feat = initialFeatures[key];
        if (feat && (feat.available !== undefined || feat.notes)) {
          const isAvailable = Boolean(feat.available);
          const noteText = feat.notes?.trim() || (isAvailable ? 'Marked available during place creation' : 'Marked unavailable during place creation');

          placeData.features[key] = {
            available: isAvailable,
            lastVerifiedAt: now,
            verificationCount: 1,
            notes: noteText
          };

          initialNotesToCreate.push({
            feature: key,
            observedStatus: isAvailable,
            contributorName: feat.contributorName?.trim() || 'Place Creator',
            details: noteText,
            conditionRating: isAvailable ? 'operational' : 'needs_maintenance',
            verifiedAt: now
          });
        }
      }
    }

    placeData.overallFreshnessScore = calculateOverallFreshness(placeData.features, now);

    const place = new Place(placeData);
    await place.save();

    // Persist any initial verification notes linked to this new place
    if (initialNotesToCreate.length > 0) {
      await VerificationNote.insertMany(
        initialNotesToCreate.map((n) => ({ ...n, placeId: place._id }))
      );
    }

    res.status(201).json({
      message: 'Place registered successfully',
      place
    });
  } catch (err) {
    next(err);
  }
}

