import { Order } from "../models";

export async function markPaid(id: string) {
  const o = await Order.findOne({ where: { stripeSessionId: id } });
  if (o && o.status !== "PAID") await o.update({ status: "PAID" });
}

export async function markCanceled(id: string) {
  const o = await Order.findOne({ where: { stripeSessionId: id } });
  if (o && o.status === "PENDING") await o.update({ status: "CANCELED" });
}
