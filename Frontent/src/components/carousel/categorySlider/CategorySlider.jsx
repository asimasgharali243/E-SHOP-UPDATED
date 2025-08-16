import React from "react";
import GeneralCustomCarousel from "../GeneralCustomCarousel";
import ProductCard from "../../Card/ProductCard";

export default function CategorySlider({ title }) {
  const productData = [
    {
      id: 1,
      image: "/assets/products_4_1.jpg",
      name: "product 1",
      price: 19.99,
      description: "Description for Product 1",
    },
    {
      id: 2,
      image: "/assets/products_1_1_1920x.jpg",
      name: "product 2",
      price: 29.99,
      description: "Description for Product 2",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/200",
      name: "Product 3",
      price: 39.99,
      description: "Description for Product 3",
    },
    {
      id: 4,
      image: "/assets/products_4_1.jpg",
      name: "product 1",
      price: 19.99,
      description: "Description for Product 1",
    },
    {
      id: 5,
      image: "/assets/products_1_1_1920x.jpg",
      name: "product 2",
      price: 29.99,
      description: "Description for Product 2",
    },
    {
      id: 6,
      image: "https://via.placeholder.com/200",
      name: "Product 3",
      price: 39.99,
      description: "Description for Product 3",
    },
    {
      id: 1,
      image: "/assets/products_4_1.jpg",
      name: "product 1",
      price: 19.99,
      description: "Description for Product 1",
    },
    {
      id: 2,
      image: "/assets/products_1_1_1920x.jpg",
      name: "product 2",
      price: 29.99,
      description: "Description for Product 2",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/200",
      name: "Product 3",
      price: 39.99,
      description: "Description for Product 3",
    },
    {
      id: 4,
      image: "/assets/products_4_1.jpg",
      name: "product 1",
      price: 19.99,
      description: "Description for Product 1",
    },
    {
      id: 5,
      image: "/assets/products_1_1_1920x.jpg",
      name: "product 2",
      price: 29.99,
      description: "Description for Product 2",
    },
    {
      id: 6,
      image: "https://via.placeholder.com/200",
      name: "Product 3",
      price: 39.99,
      description: "Description for Product 3",
    },

    // ...more products
  ];

  return (
    <>
      <div className="d-flex align-items-center justify-content-start mb-4 position-relative mt-3 ">
        <h2
          style={{
            fontSize: `clamp(20px, 3vw, 30px)`,
            fontWeight: 600,
            color: `var(--text)`,
          }}
          className="mb-0"
        >
          {title}
        </h2>
        <div
          className="d-none d-md-flex align-items-center justify-content-center gap-2 cursor-pointer me-5 position-absolute  "
          style={{ right: "15%", top: "50%", transform: "translateY(-50%)" }}
        >
          <i
            className="bi bi-arrow-left  border fs-4 rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "50px", height: "50px" }}
          ></i>
          <i
            className="bi bi-arrow-right  border fs-4 rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "50px", height: "50px" }}
          ></i>
        </div>
      </div>
      <GeneralCustomCarousel>
        {productData.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </GeneralCustomCarousel>
    </>
  );
}
