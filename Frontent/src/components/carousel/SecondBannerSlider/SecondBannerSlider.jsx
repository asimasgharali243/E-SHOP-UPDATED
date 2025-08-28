import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./SecondBannerSlider.scss";

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const timeoutRef = useRef(null);
  const totalSlides = 3; // Fixed number of slides

  const bannerItems = [
    {
      id: 1,
      image: "/assets/banner_2_1.webp",
      title: "Summer Collection 2024",
      subtitle: "Discover the latest trends in fashion",
      description: "Get up to 50% off on selected items",
      buttonText: "Shop Now",
      buttonVariant: "primary",
      textPosition: "start",
    },
    {
      id: 2,
      image: "/assets/products_15_1_1920x.jpg",
      title: "Electronics Sale",
      subtitle: "Cutting-edge technology at amazing prices",
      description: "Limited time offer on gadgets and devices",
      buttonText: "Explore Deals",
      buttonVariant: "warning",
      textPosition: "center",
    },
    {
      id: 3,
      image: "/assets/products_4_1.jpg",
      title: "Home Essentials",
      subtitle: "Transform your living space",
      description: "Free shipping on orders over $100",
      buttonText: "Discover More",
      buttonVariant: "success",
      textPosition: "end",
    },
  ];

  // Preload images and track loading state
  useEffect(() => {
    const loadImages = () => {
      const newImagesLoaded = {};
      const promises = bannerItems.map((item) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = item.image;
          img.onload = () => {
            newImagesLoaded[item.id] = true;
            resolve();
          };
          img.onerror = () => {
            newImagesLoaded[item.id] = false;
            resolve();
          };
        });
      });

      Promise.all(promises).then(() => {
        setImagesLoaded(newImagesLoaded);
      });
    };

    loadImages();
  }, [bannerItems]);

  // Auto slide functionality with reset
  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 5000);
    };

    resetTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <Container fluid className="banner-slider-container p-0">
      <div className="banner-slider-wrapper">
        <div className="banner-slides">
          {bannerItems.map((banner, index) => (
            <div
              key={banner.id}
              className={`banner-slide ${
                index === currentSlide ? "active" : ""
              } ${imagesLoaded[banner.id] ? "image-loaded" : "image-loading"}`}
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <Container>
                <Row className="h-100 align-items-center">
                  <Col xs={12} className="banner-content">
                    <div className={`banner-text text-${banner.textPosition}`}>
                      <h1 className="banner-title">{banner.title}</h1>
                      <h3 className="banner-subtitle">{banner.subtitle}</h3>
                      <p className="banner-description">{banner.description}</p>
                      <Button
                        variant={banner.buttonVariant}
                        size="lg"
                        className="banner-btn"
                      >
                        {banner.buttonText}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          ))}
        </div>

        <button className="slider-arrow slider-arrow-prev" onClick={prevSlide}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <button className="slider-arrow slider-arrow-next" onClick={nextSlide}>
          <i className="bi bi-chevron-right"></i>
        </button>

        <div className="slider-dots">
          {bannerItems.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="slider-progress">
          <div
            className="progress-bar"
            style={{
              width: `${((currentSlide + 1) / totalSlides) * 100}%`,
              animationPlayState: "running",
            }}
          ></div>
        </div>
      </div>
    </Container>
  );
};

export default BannerSlider;
