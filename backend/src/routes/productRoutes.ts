import { Router } from "express";
import { Product } from "../models";

const r = Router();

r.get("/", async (_req, res) =>
  res.json(
    await Product.findAll({
      where: { active: true },
      order: [["createdAt", "DESC"]],
    }),
  ),
);

export default r;
