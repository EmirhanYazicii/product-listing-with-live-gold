function Stars({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <p className="product-rating">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < fullStars) {
          return (
            <span key={i} className="star filled">
              ★
            </span>
          );
        } else if (i === fullStars && hasHalfStar) {
          return (
            <span key={i} className="star half">
              ★
            </span>
          );
        } else {
          return (
            <span key={i} className="star empty">
              ☆
            </span>
          );
        }
      })}
      <span className="rating-text">{rating} / 5</span>
    </p>
  );
}

export default Stars;
