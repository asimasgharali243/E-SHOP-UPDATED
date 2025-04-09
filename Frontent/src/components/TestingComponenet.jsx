// import React, { useState } from "react";
// import { Carousel, Container, Row, Col } from "react-bootstrap";

// const items = [
//   { id: 1, img: "/assets/products_4_1.jpg", label: "Slide 1" },
//   { id: 2, img: "/assets/products_4_1.jpg", label: "Slide 2" },
//   { id: 3, img: "/assets/products_4_1.jpg", label: "Slide 3" },
//   { id: 4, img: "/assets/products_4_1.jpg", label: "Slide 4" },
//   { id: 5, img: "/assets/products_4_1.jpg", label: "Slide 5" },
//   { id: 6, img: "/assets/products_4_1.jpg", label: "Slide 6" },
//   { id: 7, img: "/assets/products_4_1.jpg", label: "Slide 7" },
//   { id: 8, img: "/assets/products_4_1.jpg", label: "Slide 8" },
// ];

// export default function MultiSlideCarousel() {
//   const slidesPerView = 3; // Number of slides visible at a time
//   const [index, setIndex] = useState(0);

//   const handlePrev = () => {
//     setIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
//   };

//   const handleNext = () => {
//     setIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
//   };

//   return (
//     <Container fluid className="mt-3 position-relative">
//       <Carousel indicators={false} controls={false} interval={null} slide={true}>
//         <Carousel.Item>
//           <Row className="justify-content-center">
//             {items.slice(index, index + slidesPerView).map((item) => (
//               <Col key={item.id} md={4} className="text-center">
//                 <img src={item.img} className="d-block w-100 rounded" alt={item.label} />
//                 <h5 className="mt-2">{item.label}</h5>
//               </Col>
//             ))}
//           </Row>
//         </Carousel.Item>
//       </Carousel>

//       {/* Custom Navigation Controls */}
//       <button className="carousel-control-prev" type="button" onClick={handlePrev}>
//         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//       </button>
//       <button className="carousel-control-next" type="button" onClick={handleNext}>
//         <span className="carousel-control-next-icon" aria-hidden="true"></span>
//       </button>
//     </Container>
//   );
// }

// import React from "react";
// import { Container, Row, Col, Card } from "react-bootstrap";
// import CustomCarousel2 from "./carousel/customCarousel2";

// const items = [
//   { id: 1, img: "/assets/products_4_1.jpg", label: "Product 1" },
//   { id: 2, img: "/assets/products_4_1.jpg", label: "Product 2" },
//   { id: 3, img: "/assets/products_4_1.jpg", label: "Product 3" },
//   { id: 4, img: "/assets/products_4_1.jpg", label: "Product 4" },
//   { id: 5, img: "/assets/products_4_1.jpg", label: "Product 5" },
//   { id: 6, img: "/assets/products_4_1.jpg", label: "Product 6" },
//   { id: 7, img: "/assets/products_4_1.jpg", label: "Product 7" },
//   { id: 8, img: "/assets/products_4_1.jpg", label: "Product 8" },
// ];

// const MultiSlideCarousel = () => {
//   return (
//     <Container className="mt-4">
//       <h2 className="text-center mb-3">Featured Products</h2>
//       <CustomCarousel2 xs={1} sm={2} md={3} lg={4} xl={4} xxl={5} numberOfRows={1}>
//         {items.map((item) => (
//           <Col key={item.id} className="d-flex justify-content-center">
//             <Card className="text-center shadow-sm" style={{ width: "100%" }}>
//               <Card.Img variant="top" src={item.img} alt={item.label} />
//               <Card.Body>
//                 <Card.Title>{item.label}</Card.Title>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </CustomCarousel2>
//     </Container>
//   );
// };

// export default MultiSlideCarousel;



// import React, { useState, useEffect } from "react";
// import { Container } from "react-bootstrap";
// import "./TestingComponent.scss";

// const items = [
//   { id: 1, img: "/assets/products_4_1.jpg", label: "Slide 1" },
//   { id: 2, img: "/assets/products_4_1.jpg", label: "Slide 2" },
//   { id: 3, img: "/assets/products_4_1.jpg", label: "Slide 3" },
//   { id: 4, img: "/assets/products_4_1.jpg", label: "Slide 4" },
//   { id: 5, img: "/assets/products_4_1.jpg", label: "Slide 5" },
//   { id: 6, img: "/assets/products_4_1.jpg", label: "Slide 6" },
//   { id: 7, img: "/assets/products_4_1.jpg", label: "Slide 7" },
//   { id: 1, img: "/assets/products_4_1.jpg", label: "Slide 1" },
//   { id: 2, img: "/assets/products_4_1.jpg", label: "Slide 2" },
//   { id: 3, img: "/assets/products_4_1.jpg", label: "Slide 3" },
//   { id: 4, img: "/assets/products_4_1.jpg", label: "Slide 4" },
//   { id: 5, img: "/assets/products_4_1.jpg", label: "Slide 5" },
//   { id: 6, img: "/assets/products_4_1.jpg", label: "Slide 6" },
//   { id: 7, img: "/assets/products_4_1.jpg", label: "Slide 7" },

// ];

// export default function MultiSlideCarousel() {
//   const [index, setIndex] = useState(0);
//   const [slidesPerView, setSlidesPerView] = useState(4); // Default

//   // Adjust slidesPerView based on screen width
//   useEffect(() => {
//     const updateSlidesPerView = () => {
//       const width = window.innerWidth;
//       if (width >= 1200) setSlidesPerView(6);
//       else if (width >= 992) setSlidesPerView(5);
//       else if (width >= 768) setSlidesPerView(3);
//       else setSlidesPerView(2);
//     };
//     updateSlidesPerView();
//     window.addEventListener("resize", updateSlidesPerView);
//     return () => window.removeEventListener("resize", updateSlidesPerView);
//   }, []);

//   const handlePrev = () => {
//     setIndex((prevIndex) => (prevIndex === 0 ? items.length - slidesPerView : prevIndex - 1));
//   };

//   const handleNext = () => {
//     setIndex((prevIndex) => (prevIndex >= items.length - slidesPerView ? 0 : prevIndex + 1));
//   };

//   return (
//     <Container fluid className="mt-3 position-relative">
//       <div className="slider-wrapper">
//         <div className="slider" style={{ transform: `translateX(-${index * (100 / slidesPerView)}%)` }}>
//           {items.map((item) => (
//             <div key={item.id} className="slide">
//               <img src={item.img} alt={item.label} />
//               <h3>{item.label}</h3>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Custom Navigation Controls */}
//       <button className="carousel-control-prev" onClick={handlePrev}>
//         &#10094;
//       </button>
//       <button className="carousel-control-next" onClick={handleNext}>
//         &#10095;
//       </button>
//     </Container>
//   );
// }


export const example = () => {
  const items = [
    { id: 1, img: "https://via.placeholder.com/150", label: "Item 1" },
    { id: 2, img: "https://via.placeholder.com/150", label: "Item 2" },
    { id: 3, img: "https://via.placeholder.com/150", label: "Item 3" },
    { id: 4, img: "https://via.placeholder.com/150", label: "Item 4" },
    { id: 5, img: "https://via.placeholder.com/150", label: "Item 5" },
    { id: 6, img: "https://via.placeholder.com/150", label: "Item 6" },
    { id: 7, img: "https://via.placeholder.com/150", label: "Item 7" },
    { id: 8, img: "https://via.placeholder.com/150", label: "Item 8" },
  ];

  return (
    <CustomGridCarousel lg={4} md={3} sm={2} xs={1} numberOfRows={1}>
      {items.map((item) => (
        <Col key={item.id}>
          <div className="card text-center">
            <img src={item.img} alt={item.label} className="img-fluid" />
            <h5 className="mt-2">{item.label}</h5>
          </div>
        </Col>
      ))}
    </CustomGridCarousel>
  );
};








import React, { useState, useEffect, forwardRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import "./TestingComponent.scss";

const CustomGridCarousel = forwardRef(
  (
    {
      indicators = false,
      controls = false,
      preIcon = "❮",
      nextIcon = "❯",
      xs = 1,
      sm = 2,
      md = 3,
      lg = 4,
      xl = 5,
      xxl = 6,
      children,
    },
    ref
  ) => {
    const breakpoints = { xs, sm, md, lg, xl, xxl };
    const [slidesPerView, setSlidesPerView] = useState(xs);
    const [index, setIndex] = useState(0);

    // Responsive slidesPerView update
    useEffect(() => {
      const updateSlidesPerView = () => {
        const width = window.innerWidth;
        if (width >= 1400) setSlidesPerView(breakpoints.xxl);
        else if (width >= 1200) setSlidesPerView(breakpoints.xl);
        else if (width >= 992) setSlidesPerView(breakpoints.lg);
        else if (width >= 768) setSlidesPerView(breakpoints.md);
        else if (width >= 576) setSlidesPerView(breakpoints.sm);
        else setSlidesPerView(breakpoints.xs);
      };
      updateSlidesPerView();
      window.addEventListener("resize", updateSlidesPerView);
      return () => window.removeEventListener("resize", updateSlidesPerView);
    }, [breakpoints]);

    // Ensure only valid child elements (Col) are used
    const validChildren = React.Children.toArray(children).filter(
      (node) => React.isValidElement(node) && node.type === Col
    );

    // Adjust total slides count dynamically
    const totalSlides = validChildren.length;
    const maxIndex = totalSlides - slidesPerView;

    const handlePrev = () => {
      setIndex((prevIndex) => (prevIndex === 0 ? maxIndex : prevIndex - 1));
    };

    const handleNext = () => {
      setIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
    };

    return (
      <Container fluid className="mt-3 position-relative carousel-container" ref={ref}>
        {indicators && (
          <div className="carousel-indicators">
            {Array.from({ length: Math.ceil(totalSlides / slidesPerView) }).map((_, idx) => (
              <button key={idx} className={idx === index ? "active" : ""} onClick={() => setIndex(idx)}></button>
            ))}
          </div>
        )}

        <div className="slider-wrapper">
          <Row className="slider" style={{ transform: `translateX(-${index * (100 / slidesPerView)}%)` }}>
            {validChildren.map((child, i) => (
              <Col key={i} xs={12 / slidesPerView} className="slide">
                {child}
              </Col>
            ))}
          </Row>
        </div>

        {/* Custom Navigation Controls */}
        {controls && (
          <>
            <button className="carousel-control-prev" onClick={handlePrev}>
              {preIcon}
            </button>
            <button className="carousel-control-next" onClick={handleNext}>
              {nextIcon}
            </button>
          </>
        )}
      </Container>
    );
  }
);

CustomGridCarousel.propTypes = {
  indicators: PropTypes.bool,
  controls: PropTypes.bool,
  preIcon: PropTypes.node,
  nextIcon: PropTypes.node,
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xl: PropTypes.number,
  xxl: PropTypes.number,
  children: PropTypes.node,
};

export default CustomGridCarousel;



