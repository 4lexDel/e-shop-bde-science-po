module.exports = {
  up: async (q) =>
    q.bulkInsert(
      "products",
      [
        [
          "Midnight Streetwear",
          "midnight-streetwear",
          "Thème sombre streetwear avec lookbook et composants.",
          2900,
          "eur",
          "streetwear",
        ],
        [
          "Candy Club",
          "candy-club",
          "Thème coloré et pop pour collection lifestyle.",
          2400,
          "eur",
          "colorful",
        ],
        [
          "Atelier Minimal",
          "atelier-minimal",
          "Thème éditorial premium pour marque contemporaine.",
          3200,
          "eur",
          "minimal",
        ],
      ].map((x) => ({
        name: x[0],
        slug: x[1],
        description: x[2],
        priceCents: x[3],
        currency: x[4],
        theme: x[5],
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    ),
  down: async (q) => q.bulkDelete("products", {}),
};
