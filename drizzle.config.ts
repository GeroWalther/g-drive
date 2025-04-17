import { type Config } from "drizzle-kit";
import { readFileSync } from "fs";
import { resolve } from "path";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
  tablesFilter: ["G_DRIVE_DB_9f5bc*"],
  out: "./drizzle",
  dbCredentials: {
    host: process.env.SINGLE_STORE_HOST ?? "",
    port: parseInt(process.env.SINGLE_STORE_PORT ?? "3333"),
    user: process.env.SINGLE_STORE_USER ?? "",
    password: process.env.SINGLE_STORE_PASS ?? "",
    database: process.env.SINGLE_STORE_DB_NAME ?? "",
    ssl: {
      rejectUnauthorized: true,
      ca: readFileSync(
        resolve(process.cwd(), "singlestore_bundle.pem"),
      ).toString(),
    },
  },
} satisfies Config;
