import React from "react";
import GeneralCarousel from "../GeneralCustomCarousel";
import CategoryCard from "../../Card/Categories";
import "./Categories.scss"; // Import the specific SCSS file

const CategorySlider = ({ title, categories, showControls = true }) => {
  return (
    <div className="category-slider-component">
      {" "}
      {/* Added wrapper with specific class */}
      <GeneralCarousel
        title={title}
        autoPlay={true}
        showControls={showControls}
        responsive={{
          superLargeDesktop: {
            breakpoint: { max: 4000, min: 1400 },
            items: 8,
            slidesToSlide: 4,
            partialVisibilityGutter: 10,
          },
          desktop: {
            breakpoint: { max: 1400, min: 992 },
            items: 7,
            slidesToSlide: 4,
            partialVisibilityGutter: 10,
          },
          tablet: {
            breakpoint: { max: 992, min: 768 },
            items: 5,
            slidesToSlide: 4,
            partialVisibilityGutter: 10,
          },
          mobile: {
            breakpoint: { max: 768, min: 576 },
            items: 4,
            slidesToSlide: 4,
            partialVisibilityGutter: 10,
          },
          smallMobile: {
            breakpoint: { max: 576, min: 0 },
            items: 3,
            slidesToSlide: 3,
            partialVisibilityGutter: 10,
          },
        }}
        className="category-slider"
        containerClass="category-slider-container"
        itemClass="category-slider-item"
      >
        {categories.map((category, index) => (
          <div key={index} className="category-item-wrapper">
            <CategoryCard category={category} />
          </div>
        ))}
      </GeneralCarousel>
    </div>
  );
};

export default CategorySlider;
