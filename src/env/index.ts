import { z } from "zod";

const envSchema = z
	.object({
		NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
		DISCORD_TOKEN: z.string(),
		DISCORD_APPLICATION_ID: z.string(),
		TURSO_AUTH_TOKEN: z.string(),
		TURSO_DATABASE_URL: z.string(),
		DISCORD_DEV_USER_ID: z.string().optional(),
		DISCORD_DEV_GUILD_ID: z.string().optional(),
	})
	.superRefine((input, ctx) => {
		if (input.NODE_ENV === "dev") {
			if (!input.DISCORD_DEV_GUILD_ID) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "DISCORD_DEV_GUILD_ID is required when NODE_ENV is 'dev'",
					path: ["DISCORD_DEV_GUILD_ID"],
				});
			}
			if (!input.DISCORD_DEV_USER_ID) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "DISCORD_DEV_USER_ID is required when NODE_ENV is 'dev'",
					path: ["DISCORD_DEV_USER_ID"],
				});
			}
		}
	});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error("invalid environment variables", _env.error.format());
	throw new Error("invalid environment variables");
}

export const env = _env.data;
