import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 4242),
  databaseUrl: process.env.DATABASE_URL!,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
};

if (!config.databaseUrl || !config.stripeSecretKey)
  throw new Error("DATABASE_URL and STRIPE_SECRET_KEY are required");
