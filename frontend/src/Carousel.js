import { useRef } from "react";
import "./Carousel.css";

function Carousel({ children }) {
  const carouselRef = useRef(null);
  let startX = 0;
  let scrollLeft = 0;

  const scrollCarousel = (direction) => {
    const width = carouselRef.current.clientWidth;
    const scrollAmount = width / 4 + 20; // 4 ürün + gap
    carouselRef.current.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

  // Swipe başlat
  const handleTouchStart = (e) => {
    startX = e.touches[0].pageX;
    scrollLeft = carouselRef.current.scrollLeft;
  };

  // Swipe hareket
  const handleTouchMove = (e) => {
    if (!startX) return;
    const x = e.touches[0].pageX;
    const walk = startX - x;
    carouselRef.current.scrollLeft = scrollLeft + walk;
  };

  // Mouse drag (desktop swipe için)
  const handleMouseDown = (e) => {
    carouselRef.current.isDown = true;
    startX = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft = carouselRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!carouselRef.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = x - startX;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    carouselRef.current.isDown = false;
  };

  return (
    <div className="carousel-container">
      <div
        className="carousel-wrapper"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {children}
      </div>

      <button className="nav-button left" onClick={() => scrollCarousel(-1)}>
        ‹
      </button>
      <button className="nav-button right" onClick={() => scrollCarousel(1)}>
        ›
      </button>
    </div>
  );
}

export default Carousel;
