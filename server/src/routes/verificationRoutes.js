import { Router } from 'express';
import { createVerification, getVerificationsByPlaceId } from '../controllers/verificationController.js';
import { validate } from '../middleware/validate.js';
import { createVerificationSchema } from '../validators/verificationValidator.js';
import { writeRateLimiter } from '../middleware/rateLimiter.js';

const router = Router({ mergeParams: true });

router.get('/', getVerificationsByPlaceId);
router.post('/', writeRateLimiter, validate(createVerificationSchema, 'body'), createVerification);

export default router;

