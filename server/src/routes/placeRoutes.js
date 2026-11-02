import { Router } from 'express';
import { getPlaces, getPlaceById, createPlace } from '../controllers/placeController.js';
import { createVerification, getVerificationsByPlaceId } from '../controllers/verificationController.js';
import { validate } from '../middleware/validate.js';
import { createPlaceSchema, queryPlacesSchema } from '../validators/placeValidator.js';
import { createVerificationSchema } from '../validators/verificationValidator.js';
import { writeRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Place listing and search
router.get('/', validate(queryPlacesSchema, 'query'), getPlaces);

// Create new place
router.post('/', writeRateLimiter, validate(createPlaceSchema, 'body'), createPlace);

// Place details
router.get('/:id', getPlaceById);

// Verification timeline & submission
router.get('/:id/notes', getVerificationsByPlaceId);
router.post('/:id/verify', writeRateLimiter, validate(createVerificationSchema, 'body'), createVerification);

export default router;

