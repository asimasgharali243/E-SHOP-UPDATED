// import React, { useRef } from "react";
// import { Col, Row } from "react-bootstrap";
// import Card from "../../Card/Card";
// import CustomCarousel from "../CustomCarousel";

// export default function CardItemSlide({ title,initialItemsPerSlide,children}) {
//   const control = useRef(null);
//   const offerdate=null;
// console.log(children)
//   const productData = [
//     { id: 1, image: "/assets/products_1_1_1920x.jpg", name: "Product 1", price: 19.99, description: "Description for Product 1" },
//     { id: 2, image: "/assets/products_1_1_1920x.jpg", name: "Product 2", price: 29.99, description: "Description for Product 2" },
//     { id: 3, image: "https://via.placeholder.com/200", name: "Product 3", price: 39.99, description: "Description for Product 3" },
//     { id: 4, image: "/assets/products_1_1_1920x.jpg", name: "Product 4", price: 19.99, description: "Description for Product 4" },
//     { id: 5, image: "https://via.placeholder.com/200", name: "Product 5", price: 49.99, description: "Description for Product 5" },
//     { id: 6, image: "https://via.placeholder.com/200", name: "Product 6", price: 59.99, description: "Description for Product 6" },
//     { id: 7, image: "https://via.placeholder.com/200", name: "Product 7", price: 69.99, description: "Description for Product 7" },
//     { id: 8, image: "/assets/products_1_1_1920x.jpg", name: "Product 1", price: 19.99, description: "Description for Product 1" },
//     { id: 9, image: "/assets/products_1_1_1920x.jpg", name: "Product 2", price: 29.99, description: "Description for Product 2" },
//     { id: 10, image: "https://via.placeholder.com/200", name: "Product 3 asdsadsa sad sadadsadads dasds", price: 39.99, description: "Description for Product 3" },
//     { id: 11, image: "/assets/products_1_1_1920x.jpg", name: "Product 4", price: 19.99, description: "Description for Product 4" },
//     { id: 12, image: "https://via.placeholder.com/200", name: "Product 5 fgffhgfhfghfgh  hggjhgh hjgjhg hhjgh", price: 49.99, description: "Description for Product 5" },
//     { id: 13, image: "https://via.placeholder.com/200", name: "Product 6", price: 59.99, description: "Description for Product 6" },
//     { id: 14, image: "https://via.placeholder.com/200", name: "Product 6", price: 59.99, description: "Description for Product 6" },
    
//   ];

//   return (
//     <div className="card-item-slide ">
//       <Row className="title-container mt-3">
//         <Col className="title">
//           <h2>{title}</h2>
//         </Col>
//         {offerdate && <Col  className="offerTime">
//           <p><span>DAYS</span><span>00</span></p><p><span>HOURS</span><span>00</span></p> <p><span>MIN</span><span>00</span></p> <p><span>SEC</span><span>00</span></p> 
//         </Col>}
//         <Col  className=" control d-none d-md-flex ">
//           <i className="bi bi-arrow-left" onClick={() => control.current?.prev()}></i>
//           <i className="bi bi-arrow-right" onClick={() => control.current?.next()}></i>
//         </Col>
// <hr/>
//       </Row>

//       <Row className="item-carousel-container">
//         <Col xs={12}>
//         <CustomCarousel ref={control} indicators={false} controls={false} initialItemsPerSlide={initialItemsPerSlide} slide={false} interval={null}>
//       {children}

         
//           </CustomCarousel>
//         </Col>
//       </Row>

//     </div>
//   );
// }
import React, { useRef } from "react";
import { Col, Row } from "react-bootstrap";
import CustomCarousel from "../CustomCarousel";

export default function CardItemSlide({
  title,
  initialItemsPerSlide = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 },
  numberOfRows,
  children,
}) {
  const control = useRef(null);
  const offerdate = null;

  // Convert children into an array to properly handle mapping
  const itemsArray = React.Children.toArray(children);

  return (
    <div className="card-item-slide">
      <Row className="title-container mt-3">
        <Col className="title">
          <h2>{title}</h2>
        </Col>
        {offerdate && (
          <Col className="offerTime">
            <p><span>DAYS</span><span>00</span></p>
            <p><span>HOURS</span><span>00</span></p>
            <p><span>MIN</span><span>00</span></p>
            <p><span>SEC</span><span>00</span></p>
          </Col>
        )}
        <Col className="control d-none d-md-flex">
          <i className="bi bi-arrow-left" onClick={() => control.current?.prev()}></i>
          <i className="bi bi-arrow-right" onClick={() => control.current?.next()}></i>
        </Col>
        <hr />
      </Row>

      <Row className="item-carousel-container">
        <Col xs={12}>
          <CustomCarousel
            ref={control}
            indicators={false}
            controls={false} // Disable default controls since we have custom controls
            fade={false}
            slide={true}
            interval={null}
            xs={initialItemsPerSlide.xs}
            sm={initialItemsPerSlide.sm}
            md={initialItemsPerSlide.md}
            lg={initialItemsPerSlide.lg}
            xl={initialItemsPerSlide.xl}
            xxl={initialItemsPerSlide.xxl}
            numberOfRows={numberOfRows}
          >
            {itemsArray.length > 0 ? (
              itemsArray.map((child, index) => (
                <Col key={index} className="px-0">
                  {child}
                </Col>
              ))
            ) : (
              <p>No items available</p>
            )}
          </CustomCarousel>
        </Col>
      </Row>
    </div>
  );
}