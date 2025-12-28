import { z } from 'zod';
import { insertScholarshipSchema, scholarships } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
};

export const api = {
  scholarships: {
    list: {
      method: 'GET' as const,
      path: '/api/scholarships',
      responses: {
        200: z.array(z.custom<typeof scholarships.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/scholarships/:id',
      responses: {
        200: z.custom<typeof scholarships.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/scholarships',
      input: insertScholarshipSchema.extend({
        deadline: z.union([z.string(), z.date()]).optional(),
      }),
      responses: {
        201: z.custom<typeof scholarships.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/scholarships/:id',
      input: insertScholarshipSchema.extend({
        deadline: z.union([z.string(), z.date()]).optional(),
      }).partial(),
      responses: {
        200: z.custom<typeof scholarships.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/scholarships/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
