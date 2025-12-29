import "server-only";

import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import relations from "./relations";

if (!process.env.DATABASE_URL) {
	throw new Error(`${__filename}: env var "DATABASE_URL" is not defined.`);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({
	client: pool,
	casing: "snake_case",
	relations,
});

export default db;
