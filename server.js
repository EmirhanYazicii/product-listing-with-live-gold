const express = require("express");
const fs = require("fs").promises;
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
require("dotenv").config();

const API_KEY = process.env.GOLD_API_KEY;
const GOLD_API_URL = "https://www.goldapi.io/api/XAU/USD";

// Gram altın fiyatı
async function getGoldPrice() {
  try {
    const res = await axios.get(GOLD_API_URL, {
      headers: {
        "x-access-token": API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
    const d = res.data;
    const ouncePrice = d.price || d.ask || d.open || d.last;
    if (!ouncePrice) throw new Error("GoldAPI ounce price not found");
    const gramsPerOunce = 31.1034768;
    return ouncePrice / gramsPerOunce;
  } catch (err) {
    console.error("getGoldPrice error:", err.message);
    return 65; // fallback
  }
}

// /products endpoint
app.get("/products", async (req, res) => {
  try {
    const raw = await fs.readFile("products.json", "utf8");
    const products = JSON.parse(raw);

    const goldPrice = await getGoldPrice();
    let productsWithPrice = products.map((product) => {
      const pop = Number(product.popularityScore) || 0;
      const weight = Number(product.weight) || 0;
      const popularity = Math.round(pop * 5);
      const price = Number(((pop + 1) * weight * goldPrice).toFixed(2));
      return { ...product, price, popularity };
    });

    // Query filtreleri
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;
    const popularityFilter = req.query.popularity
      ? Number(req.query.popularity)
      : null;

    if (minPrice !== null)
      productsWithPrice = productsWithPrice.filter((p) => p.price >= minPrice);
    if (maxPrice !== null)
      productsWithPrice = productsWithPrice.filter((p) => p.price <= maxPrice);
    if (popularityFilter !== null)
      productsWithPrice = productsWithPrice.filter(
        (p) => p.popularity === popularityFilter
      );

    res.json(productsWithPrice);
  } catch (err) {
    console.error("Error in /products:", err.message);
    res.status(500).json({ error: "Ürünler alınamadı" });
  }
});

// Frontend serve
const buildPath = path.join(__dirname, "frontend", "build");
app.use(express.static(buildPath));

// Render uyumlu fallback route
app.get("*", function (req, res) {
  res.sendFile(path.join(buildPath, "index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// Port
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server çalışıyor: http://localhost:${port}`)
);
