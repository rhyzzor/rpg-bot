import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
	DISCORD_TOKEN: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error("invalid environment variables", _env.error.format());
	throw new Error("invalid environment variables");
}

export const env = _env.data;
