// server.js
const express = require("express");
const fs = require("fs").promises;
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

require("dotenv").config();
// Gold API bilgileri
const API_KEY = process.env.GOLD_API_KEY;
const GOLD_API_URL = "https://www.goldapi.io/api/XAU/USD";

// Gram altın fiyatını döndür
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
    let ouncePrice = d.price || d.ask || d.open || d.last;

    if (!ouncePrice) throw new Error("GoldAPI ounce price not found");

    const gramsPerOunce = 31.1034768;
    const gramPrice = ouncePrice / gramsPerOunce;

    console.log(
      `GoldAPI: ${ouncePrice} USD/oz -> ${gramPrice.toFixed(2)} USD/g`
    );
    return gramPrice;
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

      // Popülerliği 5 üzerinden tam sayıya çevir
      const popularity = Math.round(pop * 5);

      // Fiyatı hesapla
      const priceRaw = (pop + 1) * weight * goldPrice;
      const price = Number(priceRaw.toFixed(2));

      return { ...product, price, popularity };
    });

    // Query parametreleri
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;
    const popularityFilter = req.query.popularity
      ? Number(req.query.popularity)
      : null;

    if (minPrice !== null && !isNaN(minPrice)) {
      productsWithPrice = productsWithPrice.filter((p) => p.price >= minPrice);
    }

    if (maxPrice !== null && !isNaN(maxPrice)) {
      productsWithPrice = productsWithPrice.filter((p) => p.price <= maxPrice);
    }

    if (popularityFilter !== null && !isNaN(popularityFilter)) {
      productsWithPrice = productsWithPrice.filter(
        (p) => p.popularity === popularityFilter
      );
    }

    res.json(productsWithPrice);
  } catch (err) {
    console.error("Error in /products:", err.message);
    res.status(500).json({ error: "Ürünler alınamadı" });
  }
});

app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
