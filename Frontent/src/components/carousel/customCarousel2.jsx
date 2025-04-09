import React, { useState, useEffect, forwardRef } from "react";
import { Carousel, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

const CustomCarousel2 = forwardRef(
  (
    {
      indicators = false,
      controls = true,
      preIcon,
      nextIcon,
      xs = 1,
      sm = 2,
      md = 3,
      lg = 4,
      xl = 5,
      xxl = 6,
      fade = false,
      slide = true,
      interval,
      className = "",
      children,
    },
    ref
  ) => {
    const breakpoints = { xs, sm, md, lg, xl, xxl };
    const [itemsPerSlide, setItemsPerSlide] = useState(xs);
    const [index, setIndex] = useState(0);

    useEffect(() => {
      const updateItemsPerSlide = () => {
        const width = window.innerWidth;
        if (width >= 1400) setItemsPerSlide(breakpoints.xxl);
        else if (width >= 1200) setItemsPerSlide(breakpoints.xl);
        else if (width >= 992) setItemsPerSlide(breakpoints.lg);
        else if (width >= 768) setItemsPerSlide(breakpoints.md);
        else if (width >= 576) setItemsPerSlide(breakpoints.sm);
        else setItemsPerSlide(breakpoints.xs);
      };
      updateItemsPerSlide();
      window.addEventListener("resize", updateItemsPerSlide);
      return () => window.removeEventListener("resize", updateItemsPerSlide);
    }, [breakpoints]);

    const validChildren = React.Children.toArray(children).filter(
      (node) => React.isValidElement(node) && node.type === Col
    );

    const chunkItems = (items, size) => {
      const chunks = [];
      for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size));
      }
      return chunks;
    };

    const chunkedItems = chunkItems(validChildren, itemsPerSlide);
    const totalSlides = chunkedItems.length;

    const handlePrev = () => {
      setIndex((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
    };

    const handleNext = () => {
      setIndex((prevIndex) => (prevIndex === totalSlides - 1 ? 0 : prevIndex + 1));
    };

    return (
      <div className={`position-relative ${className}`} ref={ref}>
        <Carousel
          indicators={indicators}
          controls={true}
          fade={fade}
          slide={slide}
          interval={interval}
          activeIndex={index}
          onSelect={setIndex}
        >
          <Carousel.Item>
            <Row className="align-items-stretch">
              {chunkedItems.slice(index, index + itemsPerSlide).map((slideItems, slideIndex) => (
                <Col key={slideIndex} className="px-1">
                  <Row>{slideItems}</Row>
                </Col>
              ))}
            </Row>
          </Carousel.Item>
        </Carousel>

        {controls && (
          <>
            <button className="carousel-control-prev" type="button" onClick={handlePrev}>
              {preIcon || <span className="carousel-control-prev-icon" aria-hidden="true"></span>}
            </button>
            <button className="carousel-control-next" type="button" onClick={handleNext}>
              {nextIcon || <span className="carousel-control-next-icon" aria-hidden="true"></span>}
            </button>
          </>
        )}
      </div>
    );
  }
);

CustomCarousel2.propTypes = {
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
  fade: PropTypes.bool,
  slide: PropTypes.bool,
  interval: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default CustomCarousel2;
