// import React from "react";
// import { Carousel, Container, Row, Col } from "react-bootstrap"; // Bootstrap components
// import HeaderSlideItem from "./HeaderSlideItem";
// import CustomCarousel from "../CustomCarousel";
// const HeaderSlide = () => {
//   const headerItems = [
//     {
//       src: "/assets/banner_2_1.webp",
//       alt: "Image 1",
//       CaptionTitle: "Exclusive Deals on Electronics",
//       CaptionText: "Discover the latest gadgets at unbeatable prices!",
//       style: {},
//     },
//     {
//       src: "/assets/products_1_1_1920x.jpg",
//       alt: "Image 2",
//       CaptionTitle: "Stylish Furniture Collection",
//       CaptionText: "Upgrade your home with our elegant furniture designs.",
//       style: {},
//     },
//     {
//       src: "/assets/products_4_1.jpg",
//       alt: "Image 3",
//       CaptionTitle:
//         "Trending Fashion fdsfdsfd dfsdfdf dfsdfdsf sadasdsad sdfassadas dfsdfdsfds ",
//       CaptionText:
//         "Stay ahead of the curve with our latest fashion trends.fdgdgdfgfgdgdfgdgfgfgdgfdgdfgdgdfgfdgfdgfdgfgfdgfdg",
//       style: {},
//     },
//     {
//       src: "/assets/products_15_1_1920x.jpg",
//       alt: "Image 4",
//       CaptionTitle: "Flash Sale – 60% OFF on Laptops!",
//       CaptionText: "Powerful processors, stunning displays,and ultra-fast speed – all at an unbeatable 60% discount! Limited stock – grab yours now!",
//       style: {},
//     },
//     {
//       src: "https://picsum.photos/1920/1080",
//       alt: "Image 4",
//       CaptionTitle: "Kitchen Essentials",
//       CaptionText: "Find everything you need to create culinary masterpieces.",
//       style: {},
//     },
//   ];

//   return (
//     <Container className="header-slider-container mt-0 mt-md-3 ">
//       <Row className="justify-content-between">
//         <Col className="carousel-container px-0 " sm={12} md={12} lg={9}>
//           <CustomCarousel
//             indicators={true}
//             initialItemsPerSlide={1}
//             Interval={null}
//           >
//             <>
//               {headerItems.map((item, index) => (
//                 <HeaderSlideItem
//                   key={index}
//                   src={item.src}
//                   alt={item.alt}
//                   CaptionTitle={item.CaptionTitle}
//                   CaptionText={item.CaptionText}
//                   style={item.style}
//                 />
//               ))}
//             </>
//           </CustomCarousel>
//         </Col>
//         <Col
//           sm={12}
//           md={6}
//           lg={3}
//           className=" header-sm-banner d-flex flex-row flex-lg-column justify-content-between"
//         >
//           <Col xs={6} md={6} lg={6} xl={6} xxl={6} className="sm-banner-item px-0">
//           <p>
//               Exclusive Deals on Electronics Exclusive Deals on Electronics
//               Exclusive Deals on Electronics
//             </p>
//             <img src="/assets/products_4_1.jpg" />
            
//           </Col>
//           <Col  xs={6} md={6} lg={6} xl={6} xxl={6} className="sm-banner-item px-0">
//           <p>Exclusive Deals</p>
//             <img src="/assets/banner_2_1.webp" />
            
//           </Col>
//         </Col>
         
        
//       </Row>
      
//     </Container>
//   );
// };

// export default HeaderSlide;

import React from "react";
import { Container, Row, Col } from "react-bootstrap"; // Bootstrap components
import HeaderSlideItem from "./HeaderSlideItem";
import CustomCarousel from "../CustomCarousel";

const HeaderSlide = () => {
  const headerItems = [
    {
      src: "/assets/banner_2_1.webp",
      alt: "Image 1",
      CaptionTitle: "Exclusive Deals on Electronics",
      CaptionText: "Discover the latest gadgets at unbeatable prices!",
    },
    {
      src: "/assets/products_1_1_1920x.jpg",
      alt: "Image 2",
      CaptionTitle: "Stylish Furniture Collection",
      CaptionText: "Upgrade your home with our elegant furniture designs.",
    },
    {
      src: "/assets/products_4_1.jpg",
      alt: "Image 3",
      CaptionTitle:
        "Trending Fashion Trends",
      CaptionText:
        "Stay ahead of the curve with our latest fashion trends.",
    },
    {
      src: "/assets/products_15_1_1920x.jpg",
      alt: "Image 4",
      CaptionTitle: "Flash Sale – 60% OFF on Laptops!",
      CaptionText: "Powerful processors, stunning displays, and ultra-fast speed – all at an unbeatable 60% discount! Limited stock – grab yours now!",
    },
    {
      src: "https://picsum.photos/1920/1080",
      alt: "Image 5",
      CaptionTitle: "Kitchen Essentials",
      CaptionText: "Find everything you need to create culinary masterpieces.",
    },
  ];

  return (
    <Container className="header-slider-container mt-0 mt-md-4">
      <Row className="justify-content-between">
        <Col className="carousel-container px-0" sm={12} md={12} lg={9}>
          <CustomCarousel indicators={true} interval={null} xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
            {headerItems.map((item, index) => (
              <Col key={index} className="px-0">
                <HeaderSlideItem
                  src={item.src}
                  alt={item.alt}
                  CaptionTitle={item.CaptionTitle}
                  CaptionText={item.CaptionText}
                />
              </Col>
            ))}
          </CustomCarousel>
        </Col>
        <Col
          sm={12}
          md={6}
          lg={3}
          className="header-sm-banner d-flex flex-row flex-lg-column justify-content-between"
        >
          <Col xs={6} md={6} lg={6} xl={6} xxl={6} className="sm-banner-item px-0">
            <p>Exclusive Deals on Electronics</p>
            <img src="/assets/products_4_1.jpg" alt="Electronics Banner" />
          </Col>
          <Col xs={6} md={6} lg={6} xl={6} xxl={6} className="sm-banner-item px-0">
            <p>Exclusive Deals</p>
            <img src="/assets/banner_2_1.webp" alt="Deals Banner" />
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

export default HeaderSlide;
