import { Router } from "express";
import { createCheckout } from "../services/checkoutService";

const r = Router();

r.post("/", async (req, res) => {
  try {
    res.json(await createCheckout(req.body));
  } catch (e) {
    res
      .status(400)
      .json({ error: e instanceof Error ? e.message : "Checkout failed" });
  }
});
export default r;
