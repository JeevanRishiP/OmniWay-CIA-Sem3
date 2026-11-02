import { ZodError } from 'zod';

/**
 * Validate request body, query, or params against a Zod schema
 * @param {import('zod').ZodSchema} schema
 * @param {'body' | 'query' | 'params'} [target='body']
 */
export function validate(schema, target = 'body') {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req[target]);
      req[target] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const invalidParams = err.errors.map((e) => ({
          name: e.path.join('.'),
          reason: e.message
        }));

        return res.status(400).json({
          type: 'https://api.accessibleplace.org/errors/validation-error',
          title: 'Validation Error',
          status: 400,
          detail: 'One or more request parameters failed validation.',
          instance: req.originalUrl,
          invalidParams
        });
      }
      next(err);
    }
  };
}

