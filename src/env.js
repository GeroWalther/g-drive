import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    SINGLE_STORE_HOST: z.string(),
    SINGLE_STORE_PORT: z.string(),
    SINGLE_STORE_USER: z.string(),
    SINGLE_STORE_PASS: z.string(),
    SINGLE_STORE_DB_NAME: z.string(),
    // AWS S3 Configuration
    AWS_USER_ACCESS_KEY_ID: z.string().optional(),
    AWS_USER_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_S3_REGION: z.string().optional().default("eu-north-1"),
    AWS_S3_BUCKET_NAME: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    SINGLE_STORE_HOST: process.env.SINGLE_STORE_HOST,
    SINGLE_STORE_PORT: process.env.SINGLE_STORE_PORT,
    SINGLE_STORE_USER: process.env.SINGLE_STORE_USER,
    SINGLE_STORE_PASS: process.env.SINGLE_STORE_PASS,
    SINGLE_STORE_DB_NAME: process.env.SINGLE_STORE_DB_NAME,
    // AWS S3 Configuration
    AWS_USER_ACCESS_KEY_ID: process.env.AWS_USER_ACCESS_KEY_ID,
    AWS_USER_SECRET_ACCESS_KEY: process.env.AWS_USER_SECRET_ACCESS_KEY,
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
