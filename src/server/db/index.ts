/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { drizzle } from "drizzle-orm/singlestore";
import { createPool, type Pool } from "mysql2/promise";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const conn =
  globalForDb.conn ??
  createPool({
    host: env.SINGLE_STORE_HOST,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    port: parseInt(env.SINGLE_STORE_PORT),
    user: env.SINGLE_STORE_USER,
    password: env.SINGLE_STORE_PASS,
    database: env.SINGLE_STORE_DB_NAME,
    ssl: {},
    maxIdle: 0,
  });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

conn.addListener("error", (err) => {
  console.error("Database connection error:", err);
});

export const db = drizzle(conn, { schema });
