import React, { useMemo } from "react";
import MultiCarousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Col, Row, Button, Container } from "react-bootstrap";
import "./HeaderSlider.scss";

const HeaderSlider = () => {
  const headerItems = useMemo(
    () => [
      {
        src: "/assets/banner_2_1.webp",
        alt: "Exclusive Deals on Electronics",
        captionTitle: "Exclusive Deals on Electronics",
        captionText: "Discover the latest gadgets at unbeatable prices!",
      },
      {
        src: "/assets/products_1_1_1920x.jpg",
        alt: "Stylish Furniture Collection",
        captionTitle: "Stylish Furniture Collection",
        captionText: "Upgrade your home with our elegant furniture designs.",
      },
      {
        src: "/assets/products_4_1.jpg",
        alt: "Trending Fashion",
        captionTitle: "Trending Fashion",
        captionText: "Stay ahead of the curve with our latest fashion trends.",
      },
      {
        src: "/assets/products_15_1_1920x.jpg",
        alt: "Flash Sale – 60% OFF on Laptops!",
        captionTitle: "Flash Sale – 60% OFF on Laptops!",
        captionText:
          "Powerful processors, stunning displays, and ultra-fast speed – all at an unbeatable discount!",
      },
      {
        src: "https://picsum.photos/1920/1080",
        alt: "Kitchen Essentials",
        captionTitle: "Kitchen Essentials",
        captionText:
          "Find everything you need to create culinary masterpieces.",
      },
    ],
    []
  );

  const sideBanners = useMemo(
    () => [
      {
        src: "/assets/products_4_1.jpg",
        title: "Exclusive Electronics Deals",
        alt: "electronics banner",
      },
      {
        src: "/assets/banner_2_1.webp",
        title: "Special Offers",
        alt: "deals banner",
      },
    ],
    []
  );

  const responsive = useMemo(
    () => ({
      superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 1,
        partialVisibilityGutter: 0,
      },
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
        partialVisibilityGutter: 0,
      },
      tablet: {
        breakpoint: { max: 1024, min: 768 },
        items: 1,
        partialVisibilityGutter: 0,
      },
      mobile: {
        breakpoint: { max: 768, min: 0 },
        items: 1,
        partialVisibilityGutter: 0,
      },
    }),
    []
  );

  const CustomRightArrow = React.memo(({ onClick }) => (
    <button
      className="custom-arrow right-arrow"
      onClick={onClick}
      aria-label="Next slide"
    >
      <i className="bi bi-arrow-right"></i>
    </button>
  ));

  const CustomLeftArrow = React.memo(({ onClick }) => (
    <button
      className="custom-arrow left-arrow"
      onClick={onClick}
      aria-label="Previous slide"
    >
      <i className="bi bi-arrow-left"></i>
    </button>
  ));

  return (
    <div className="header-slider-component">
      <Container fluid className="header-slider-wrapper">
        <Row className="align-items-stretch  g-md-4 g-lg-0">
          {/* Main Carousel - lg-9 md-12 xs-12 */}
          <Col xs={12} md={12} lg={9} className="carousel-col mb-3 mb-lg-0  ">
            <MultiCarousel
              responsive={responsive}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={5000}
              arrows={true}
              showDots={true}
              customRightArrow={<CustomRightArrow />}
              customLeftArrow={<CustomLeftArrow />}
              containerClass="main-carousel-container"
              itemClass="carousel-item-wrapper"
              removeArrowOnDeviceType={["tablet", "mobile"]}
              partialVisible={false}
              centerMode={false}
              swipeable={true}
              draggable={true}
              keyBoardControl={true}
              partialVisibilityGutter={0}
            >
              {headerItems.map((item, index) => (
                <div
                  key={index}
                  className="header-slide-item"
                  style={{
                    backgroundImage: `url(${item.src})`,
                  }}
                  role="img"
                  aria-label={item.alt}
                >
                  <div className="carousel-caption">
                    <h1>{item.captionTitle}</h1>
                    <p>{item.captionText}</p>
                    <Button variant="warning" className="shop-now-btn">
                      Shop Now
                    </Button>
                  </div>
                </div>
              ))}
            </MultiCarousel>
          </Col>

          {/* Side Banners - lg-3, md-12 (2 x md-6), xs-12 (2 x xs-6) */}
          <Col
            xs={12}
            md={12}
            lg={3}
            className="side-banners-col mb-3 mb-lg-0 "
          >
            <Row className="h-100 g-3">
              {sideBanners.map((banner, index) => (
                <Col
                  xs={6}
                  md={6}
                  lg={12}
                  key={index}
                  className="d-flex align-items-center justify-content-center py-0"
                >
                  <div
                    className="sm-banner-item mb-0 w-100 px-0 py-0"
                    style={{
                      backgroundImage: `url(${banner.src})`,
                    }}
                    role="img"
                    aria-label={banner.alt}
                  >
                    <p className="banner-title">{banner.title}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default React.memo(HeaderSlider);
