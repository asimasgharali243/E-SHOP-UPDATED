// import React, { useMemo, forwardRef } from 'react';
// import Carousel from 'react-multi-carousel';
// import './GeneralCustomCarousel.scss';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './GeneralCustomCarousel.scss';
import { useMemo } from 'react';

export default function GeneralCustomCarousel() {

 const responsive = useMemo(() => ({
    xxl: {
      breakpoint: { max: 3000, min: 1400 },
      items:  5,
      slidesToSlide:1,
    },
    xl: {
      breakpoint: { max: 1399.98, min: 1200 },
      items:   4,
      slidesToSlide:1,
    },
    lg: {
      breakpoint: { max: 1199.98, min: 992 },
      items: 3,
      slidesToSlide:1,
    },
    md: {
      breakpoint: { max: 991.98, min: 768 },
      items:  2,
      slidesToSlide:1,
    },
    sm: {
      breakpoint: { max: 767.98, min: 576 },
      items: 1,
      slidesToSlide:1,
    },
    xs: {
      breakpoint: { max: 575.98, min: 0 },
      items:  1,
      slidesToSlide:1,
    }
  }), []);
    
    return (
    
    <Carousel  responsive={responsive}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div><div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div><div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </Carousel>
  )
}




































































// const CustomCarousel = forwardRef(({
//   items,
//   slidesToSlide = 1,
//   itemsPerView = { xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 },
//   showDots = false,
//   autoPlay = false,
//   autoPlaySpeed = 3000,
//   infinite = false,
//   keyBoardControl = true,
//   arrows = false,
//   renderButtonGroupOutside = false,
//   removeArrowOnDeviceType = ['tablet', 'mobile'],
//   swipeable = true,
//   draggable = true,
//   lazyLoad = true,
//   transitionDuration = 500,
//   customTransition = "all 0.5s ease",
//   dotListClass = "custom-dot-list-style",
//   containerClass = "carousel-container",
//   itemClass = "carousel-item",
//   ariaLabel = "Image carousel",
// }, ref) => {

//   const responsive = useMemo(() => ({
//     xxl: {
//       breakpoint: { max: 3000, min: 1400 },
//       items: itemsPerView.xxl || 5,
//       slidesToSlide,
//     },
//     xl: {
//       breakpoint: { max: 1399.98, min: 1200 },
//       items: itemsPerView.xl || 4,
//       slidesToSlide,
//     },
//     lg: {
//       breakpoint: { max: 1199.98, min: 992 },
//       items: itemsPerView.lg || 3,
//       slidesToSlide,
//     },
//     md: {
//       breakpoint: { max: 991.98, min: 768 },
//       items: itemsPerView.md || 2,
//       slidesToSlide,
//     },
//     sm: {
//       breakpoint: { max: 767.98, min: 576 },
//       items: itemsPerView.sm || 1,
//       slidesToSlide,
//     },
//     xs: {
//       breakpoint: { max: 575.98, min: 0 },
//       items: itemsPerView.xs || 1,
//       slidesToSlide,
//     }
//   }), [itemsPerView, slidesToSlide]);

//   return (
//     <section aria-label={ariaLabel}>
//       <Carousel
//         ref={ref}
//         responsive={responsive}
//         showDots={showDots}
//         ssr
//         infinite={infinite}
//         keyBoardControl={keyBoardControl}
//         arrows={arrows}
//         swipeable={swipeable}
//         draggable={draggable}
//         autoPlay={autoPlay}
//         autoPlaySpeed={autoPlaySpeed}
//         lazyLoad={lazyLoad}
//         transitionDuration={transitionDuration}
//         customTransition={customTransition}
//         containerClass={containerClass}
//         dotListClass={dotListClass}
//         itemClass={itemClass}
//         renderButtonGroupOutside={renderButtonGroupOutside}
//         removeArrowOnDeviceType={removeArrowOnDeviceType}
//         focusOnSelect={false}
//         rtl={false}
//       >
//         {items.map((item, index) => (
//           <div key={index} className={itemClass}>{item}</div>
//         ))}
//       </Carousel>
//     </section>
//   );
// });

// export default React.memo(CustomCarousel);
