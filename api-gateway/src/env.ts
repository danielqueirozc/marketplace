import { coerce, z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: coerce.number().optional().default(3005),
  JWT_SECRET: z.string(),
  USERS_SERVICE_URL:  z.string().url(),
  PRODUCTS_SERVICE_URL:  z.string().url(),
  CHECKOUT_SERVICE_URL: z.string().url(),
  PAYMENTS_SERVICE_URL: z.string().url(),
  CORS_ORIGIN: z.string()
})

export type Env = z.infer<typeof envSchema>