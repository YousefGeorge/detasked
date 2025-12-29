import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
	throw new Error(`${__filename}: env var "DATABASE_URL" is not defined.`);
}

export default defineConfig({
	out: "./drizzle",
	schema: "./src/lib/db/schema",
	dialect: "postgresql",
	casing: "snake_case",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
	tablesFilter: ["detasked_*"],
});
