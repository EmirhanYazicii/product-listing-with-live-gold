function ColorOptions({ imagesArray, selectedImage, onColorChange }) {
  const colors = ["#E6CA97", "#E1A4A9", "#D9D9D9"];

  return (
    <div className="color-options">
      {imagesArray.map((img, idx) => (
        <div
          key={idx}
          className={`color-wrapper ${selectedImage === img ? "selected" : ""}`}
        >
          <button
            onClick={() => onColorChange(idx)}
            style={{ backgroundColor: colors[idx] || "#fff" }}
            className="color-button"
          />
        </div>
      ))}
    </div>
  );
}

export default ColorOptions;
