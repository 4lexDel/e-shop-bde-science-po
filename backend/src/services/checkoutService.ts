import Stripe from "stripe";
import { config } from "../config";
import { Order, OrderItem, Product } from "../models";
import { sequelize } from "../db";

const stripe = new Stripe(config.stripeSecretKey);

type Input = {
  firstName: string;
  lastName: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  country: string;
  items: { productId: string; quantity: number }[];
};

export async function createCheckout(input: Input) {
  if (!input.items?.length) throw new Error("Cart is empty");

  const products = await Product.findAll({
    where: { id: input.items.map((x) => x.productId), active: true },
  });

  if (products.length !== input.items.length)
    throw new Error("Invalid product selection");

  const q = new Map(
    input.items.map((x) => [
      x.productId,
      Math.max(1, Math.min(20, Math.floor(x.quantity))),
    ]),
  );
  const totalCents = products.reduce(
    (s, p) => s + p.priceCents * (q.get(p.id) || 0),
    0,
  );

  const t = await sequelize.transaction();

  try {
    const order = await Order.create(
      {
        ...input,
        customerFirstName: input.firstName,
        customerLastName: input.lastName,
        customerEmail: input.email,
        addressLine2: input.addressLine2 || null,
        country: input.country.toUpperCase(),
        totalCents,
        status: "PENDING",
      },
      { transaction: t },
    );

    await OrderItem.bulkCreate(
      products.map((p) => ({
        orderId: order.id,
        productId: p.id,
        name: p.name,
        unitPriceCents: p.priceCents,
        quantity: q.get(p.id)!,
      })),
      { transaction: t },
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: input.email,
      line_items: products.map((p) => ({
        price_data: {
          currency: p.currency,
          product_data: { name: p.name, description: p.description },
          unit_amount: p.priceCents,
        },
        quantity: q.get(p.id),
      })),
      metadata: { orderId: order.id },
      success_url: `${config.frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.frontendUrl}/checkout?canceled=1`,
    });

    await order.update({ stripeSessionId: session.id }, { transaction: t });
    await t.commit();

    return { url: session.url };
  } catch (e) {
    await t.rollback();
    throw e;
  }
}
