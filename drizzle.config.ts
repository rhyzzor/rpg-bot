require("dotenv").config({ path: ".env.local" });
import type { Config } from "drizzle-kit";

export default {
	schema: "./src/lib/database/schema.ts",
	out: "./src/lib/database/migrations",
	dialect: "turso",
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN,
	},
} satisfies Config;
