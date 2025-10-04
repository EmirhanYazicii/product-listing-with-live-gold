import ColorOptions from "./ColorOptions";
import Stars from "./Stars";

function ProductCard({ product, selectedImage, onColorChange }) {
  const colorNames = ["Yellow Gold", "Rose Gold", "White Gold"];

  return (
    <div className="product-card">
      {selectedImage ? (
        <img src={selectedImage} alt={product.name} className="product-image" />
      ) : (
        <div className="product-placeholder" />
      )}

      <h2 className="product-name">{product.name}</h2>
      <p className="product-price">${product.price} USD</p>

      <div className="product-details">
        <ColorOptions
          imagesArray={product.imagesArray}
          selectedImage={selectedImage}
          onColorChange={onColorChange}
        />
        <div className="color-name">
          {colorNames[
            product.imagesArray.findIndex((img) => img === selectedImage)
          ] || ""}
        </div>
        <Stars rating={(product.popularityScore * 5).toFixed(1)} />
      </div>
    </div>
  );
}

export default ProductCard;
