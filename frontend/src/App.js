import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Carousel from "./Carousel";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/products");
        const data = await res.json();
        const updatedData = data.map((p) => ({
          ...p,
          imagesArray: p.images ? Object.values(p.images) : [],
        }));
        setProducts(updatedData);
        setSelectedImages(
          Object.fromEntries(
            updatedData.map((p, i) => [i, p.imagesArray[0] || ""])
          )
        );
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    fetchProducts();
  }, []);

  const handleColorChange = (productIndex, colorIndex) => {
    setSelectedImages((prev) => ({
      ...prev,
      [productIndex]: products[productIndex].imagesArray[colorIndex] || "",
    }));
  };

  return (
    <div className="app-container">
      <h1>Ürünler</h1>

      <Carousel>
        {products.map((product, index) => (
          <ProductCard
            key={index}
            product={product}
            selectedImage={selectedImages[index]}
            onColorChange={(colorIndex) => handleColorChange(index, colorIndex)}
          />
        ))}
      </Carousel>
    </div>
  );
}

export default App;
