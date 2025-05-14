// import React from 'react';
import GeneralCustomCarousel from './GeneralCustomCarousel';
import React from 'react'

export default function HeaderCarousel() {
  return (
    <GeneralCustomCarousel/>


    
  )
}





























// const headerItems = [
//   {
//     src: '/assets/banner_2_1.webp',
//     alt: 'Exclusive Deals on Electronics',
//     title: 'Exclusive Deals on Electronics',
//     description: 'Discover the latest gadgets at unbeatable prices!',
//   },
//   {
//     src: '/assets/products_1_1_1920x.jpg',
//     alt: 'Top Tech Savings',
//     title: 'Top Tech Savings',
//     description: 'Grab discounts on your favorite devices!',
//   },
//   {
//     src: '/assets/products_1_1_1920x.jpg',
//     alt: 'Gadget Clearance Sale',
//     title: 'Gadget Clearance Sale',
//     description: 'Limited stock at clearance prices!',
//   },
//   {
//     src: '/assets/products_1_1_1920x.jpg',
//     alt: 'Best Electronics Offers',
//     title: 'Best Electronics Offers',
//     description: 'Shop now and save big on top brands!',
//   }
// ];

// const headerSlides = headerItems.map((item, index) => (
//   <article key={index} className="header-carousel-item header-slide">
//     <div className="image-wrapper">
//       <img
//         src={item.src}
//         alt={item.alt}
//         loading="lazy"
//         className="w-100 h-auto"
//       />
//     </div>
//     <div className="slider-caption">
//       <h1>{item.title}</h1>
//       <p>{item.description}</p>
//       <a href="/shop" className="btn btn-warning text-white mt-2">
//         Shop Now
//       </a>
//     </div>
//   </article>
// ));

// const HeaderSlider = () => {
//   return (
//     <GeneralCustomCarousel
//       itemsPerView={{ xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
//       showDots={true}
//       items={headerSlides}
//       autoPlay={true}
//       autoPlaySpeed={4000}
//       infinite={true}
//       transitionDuration={600}
//       customTransition="transform 0.6s ease-in-out"
//       containerClass="header-carousel"
//       itemClass="header-carousel-item"
//       ariaLabel="Main promotional banners"
//     />
//   );
// };

// export default React.memo(HeaderSlider);
