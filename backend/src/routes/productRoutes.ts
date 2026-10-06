import { Router } from "express";
import { Product } from "../models";
import { requireAdmin } from "../middleware/admin";
const router = Router();
router.get("/", async (_req, res) =>
  res.json(
    await Product.findAll({
      where: { active: true },
      order: [["createdAt", "DESC"]],
    }),
  ),
);
router.get("/admin", requireAdmin, async (_req, res) =>
  res.json(await Product.findAll({ order: [["createdAt", "DESC"]] })),
);
router.post("/admin", requireAdmin, async (req, res) => {
  try {
    const p = await Product.create({
      ...req.body,
      priceCents: Number(req.body.priceCents),
      stockQuantity: Number(req.body.stockQuantity),
      reservedQuantity: 0,
    });
    res.status(201).json(p);
  } catch (e) {
    res
      .status(400)
      .json({ error: e instanceof Error ? e.message : "Invalid product" });
  }
});
router.put("/admin/:id", requireAdmin, async (req, res) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: "Not found" });
    await p.update({
      ...req.body,
      priceCents:
        req.body.priceCents === undefined
          ? p.priceCents
          : Number(req.body.priceCents),
      stockQuantity:
        req.body.stockQuantity === undefined
          ? p.stockQuantity
          : Number(req.body.stockQuantity),
    });
    res.json(p);
  } catch (e) {
    res
      .status(400)
      .json({ error: e instanceof Error ? e.message : "Invalid product" });
  }
});
router.delete("/admin/:id", requireAdmin, async (req, res) => {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.sendStatus(404);
  await p.update({ active: false });
  res.sendStatus(204);
});
export default router;
