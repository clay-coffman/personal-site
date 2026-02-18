import { z } from "zod";

const envSchema = z.object({
  SECRET_KEY: z.string().min(1),
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  DATABASE_PATH: z.string().default("./data/database.db"),
  CALIBRE_LIBRARY: z.string().default("/calibre"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

export function getEnv(): Env {
  if (env) return env;
  env = envSchema.parse(process.env);
  return env;
}
