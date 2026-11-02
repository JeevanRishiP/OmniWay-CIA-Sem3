import { z } from 'zod';

export const createVerificationSchema = z.object({
  feature: z.enum(['ramp', 'lift', 'accessibleToilet', 'stepFreeEntrance'], {
    required_error: 'Feature type is required',
    invalid_type_error: 'Invalid feature. Must be ramp, lift, accessibleToilet, or stepFreeEntrance'
  }),
  observedStatus: z.boolean({
    required_error: 'observedStatus boolean is required'
  }),
  details: z
    .string({ required_error: 'Observational details are required' })
    .trim()
    .min(1, 'Please provide observational context')
    .max(400, 'Details cannot exceed 400 characters'),
  conditionRating: z
    .enum(['excellent', 'operational', 'needs_maintenance', 'blocked_or_broken'], {
      invalid_type_error: 'Invalid condition rating'
    })
    .default('operational')
    .optional(),
  contributorName: z
    .string()
    .trim()
    .max(50, 'Contributor name cannot exceed 50 characters')
    .default('Anonymous Community Member')
    .optional()
});

