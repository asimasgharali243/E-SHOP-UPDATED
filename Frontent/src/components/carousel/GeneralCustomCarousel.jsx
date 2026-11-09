import React from "react";
import MultiCarousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./GeneralCustomCarousel.scss";

const GeneralCarousel = ({
  children,
  title,
  showControls = true,
  showTimer = false,
  responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1400 }, items: 6 },
    desktop: { breakpoint: { max: 1400, min: 992 }, items: 5 },
    tablet: { breakpoint: { max: 992, min: 768 }, items: 4 },
    mobile: { breakpoint: { max: 768, min: 576 }, items: 3 },
    smallMobile: { breakpoint: { max: 576, min: 0 }, items: 2 },
  },
  additionalTransform = 0,
  arrows = true,
  autoPlay = false,
  autoPlaySpeed = 3000,
  centerMode = false,
  className = "",
  containerClass = "carousel-container",
  dotListClass = "",
  draggable = true,
  focusOnSelect = false,
  infinite = true,
  itemClass = "",
  keyBoardControl = true,
  minimumTouchDrag = 80,
  renderButtonGroupOutside = true,
  renderDotsOutside = false,
  showDots = false,
  sliderClass = "",
  swipeable = true,
  customControlComponent,
  numberOfRows = 1,
}) => {
  const carouselRef = React.useRef();

  const next = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const previous = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
    }
  };

  const CustomRightArrow = ({ onClick, ...rest }) => {
    return (
      <i
        className="bi bi-arrow-right custom-arrow right-arrow"
        onClick={() => onClick()}
      />
    );
  };

  const CustomLeftArrow = ({ onClick, ...rest }) => {
    return (
      <i
        className="bi bi-arrow-left custom-arrow left-arrow"
        onClick={() => onClick()}
      />
    );
  };

  return (
    <div className="general-carousel-container p-3">
      {(title || showControls) && (
        <>
          <div className="title-container mt-3">
            <div className="title">
              <h2>{title}</h2>
            </div>

            <div className="header-controls">
              {showTimer && (
                <div className="offerTime">
                  <p>
                    <span>DAYS</span>
                    <span>00</span>
                  </p>
                  <p>
                    <span>HOURS</span>
                    <span>00</span>
                  </p>
                  <p>
                    <span>MIN</span>
                    <span>00</span>
                  </p>
                  <p>
                    <span>SEC</span>
                    <span>00</span>
                  </p>
                </div>
              )}

              {showControls && (
                <div className="control d-none d-md-flex">
                  <i className="bi bi-arrow-left" onClick={previous}></i>
                  <i className="bi bi-arrow-right" onClick={next}></i>
                </div>
              )}
            </div>
          </div>
          <hr />
        </>
      )}

      <div className="item-carousel-container">
        <MultiCarousel
          ref={carouselRef}
          responsive={responsive}
          additionalTransfrom={additionalTransform}
          arrows={false}
          autoPlay={autoPlay}
          autoPlaySpeed={autoPlaySpeed}
          centerMode={centerMode}
          className={className}
          containerClass={containerClass}
          dotListClass={dotListClass}
          draggable={draggable}
          focusOnSelect={focusOnSelect}
          infinite={infinite}
          itemClass={itemClass}
          keyBoardControl={keyBoardControl}
          minimumTouchDrag={minimumTouchDrag}
          renderButtonGroupOutside={renderButtonGroupOutside}
          renderDotsOutside={renderDotsOutside}
          showDots={showDots}
          sliderClass={sliderClass}
          swipeable={swipeable}
          customRightArrow={<CustomRightArrow />}
          customLeftArrow={<CustomLeftArrow />}
          customControl={customControlComponent}
        >
          {React.Children.map(children, (child, index) => (
            <div key={index} className="carousel-item-wrapper">
              {child}
            </div>
          ))}
        </MultiCarousel>
      </div>
    </div>
  );
};

export default GeneralCarousel;
