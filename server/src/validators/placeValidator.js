import { z } from 'zod';

export const featureInitialSchema = z.object({
  available: z.boolean().default(false),
  notes: z.string().max(300, 'Notes cannot exceed 300 characters').optional().default(''),
  contributorName: z.string().max(50, 'Contributor name cannot exceed 50 characters').optional()
}).optional();

export const createPlaceSchema = z.object({
  name: z
    .string({ required_error: 'Place name is required' })
    .trim()
    .min(1, 'Place name cannot be empty')
    .max(120, 'Name cannot exceed 120 characters'),
  category: z.enum(
    [
      'restaurant',
      'transit',
      'retail',
      'healthcare',
      'public_service',
      'education',
      'entertainment',
      'other'
    ],
    {
      required_error: 'Category is required',
      invalid_type_error: 'Invalid place category'
    }
  ),
  address: z.object({
    street: z.string({ required_error: 'Street is required' }).trim().min(1, 'Street cannot be empty'),
    city: z.string({ required_error: 'City is required' }).trim().min(1, 'City cannot be empty'),
    state: z.string({ required_error: 'State is required' }).trim().min(1, 'State cannot be empty'),
    postalCode: z.string({ required_error: 'Postal code is required' }).trim().min(1, 'Postal code cannot be empty'),
    country: z.string().trim().default('India').optional()
  }),
  location: z
    .object({
      type: z.literal('Point').default('Point'),
      coordinates: z.tuple([z.number(), z.number()]).optional()
    })
    .optional(),
  initialFeatures: z
    .object({
      ramp: featureInitialSchema,
      lift: featureInitialSchema,
      accessibleToilet: featureInitialSchema,
      stepFreeEntrance: featureInitialSchema
    })
    .optional()
});

export const queryPlacesSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  ramp: z.enum(['true', 'false']).optional(),
  lift: z.enum(['true', 'false']).optional(),
  toilet: z.enum(['true', 'false']).optional(),
  accessibleToilet: z.enum(['true', 'false']).optional(),
  stepFree: z.enum(['true', 'false']).optional(),
  stepFreeEntrance: z.enum(['true', 'false']).optional(),
  freshOnly: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12)
});

