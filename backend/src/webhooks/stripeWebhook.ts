import { Request, Response } from "express";
import Stripe from "stripe";
import { config } from "../config";
import { markPaid, markCanceled } from "../services/orderService";

const stripe = new Stripe(config.stripeSecretKey);

export async function stripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig || !config.stripeWebhookSecret)
    return res.status(400).send("Webhook not configured");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripeWebhookSecret,
    );
  } catch {
    return res.status(400).send("Invalid signature");
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;

    if (s.payment_status === "paid") await markPaid(s.id);
  }

  if (event.type === "checkout.session.expired")
    await markCanceled((event.data.object as Stripe.Checkout.Session).id);

  res.json({ received: true });
}
