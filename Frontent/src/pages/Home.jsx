import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRef } from "react";
import { Container, Nav, Navbar, Row, Col } from "react-bootstrap";
import Card from "../components/Card/Card";
import CustomCarousel from "../components/carousel/CustomCarousel";
import CustomCarousel2 from "../components/carousel/customCarousel2";
import CardItemSlide from "../components/carousel/CardItemSlide/CardItemSlide";
import HeaderSlide from "../components/carousel/HeaderSlide/HeaderSlide";
import CategorySlider from "../components/carousel/categorySlider/CategorySlider";

export default function Home() {
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
      image: "/assets/products_15_1_1920x.jpg",
      name: "product 4",
      price: 19.99,
      description: "Description for Product 4",
    },
    {
      id: 5,
      image: "https://via.placeholder.com/200",
      name: "Product 5",
      price: 49.99,
      description: "Description for Product 5",
    },
    {
      id: 6,
      image: "https://via.placeholder.com/200",
      name: "Product 6",
      price: 59.99,
      description: "Description for Product 6",
    },
    {
      id: 7,
      image: "https://via.placeholder.com/200",
      name: "Product 7",
      price: 69.99,
      description: "Description for Product 7",
    },
    {
      id: 8,
      image: "/assets/products_4_1.jpg",
      name: "Product 8",
      price: 19.99,
      description: "Description for Product 1",
    },
    {
      id: 9,
      image: "/assets/products_1_1_1920x.jpg",
      name: "Product 9",
      price: 29.99,
      description: "Description for Product 2",
    },
    {
      id: 10,
      image: "https://via.placeholder.com/200",
      name: "Product 10 asdsadsa sad sadadsadads dasds",
      price: 39.99,
      description: "Description for Product 3",
    },
    {
      id: 11,
      image: "/assets/products_1_1_1920x.jpg",
      name: "Product 11",
      price: 19.99,
      description: "Description for Product 4",
    },
    {
      id: 12,
      image: "https://via.placeholder.com/200",
      name: "Product 12 fgffhgfhfghfgh  hggjhgh hjgjhg hhjgh",
      price: 49.99,
      description: "Description for Product 5",
    },
    {
      id: 13,
      image: "https://via.placeholder.com/200",
      name: "Product 13",
      price: 59.99,
      description: "Description for Product 6",
    },
    {
      id: 14,
      image: "https://via.placeholder.com/200",
      name: "Product 14",
      price: 59.99,
      description: "Description for Product 6",
    },
  ];

  const categories = [
    { name: "Dresses", icon: "bi bi-person-lines-fill" },
    { name: "Handbags", icon: "bi bi-bag-fill" },
    { name: "Jewelry", icon: "bi bi-gem" },
    { name: "Shoes", icon: "bi bi-handbag-fill" },
    { name: "Watches", icon: "bi bi-watch" },
    { name: "T-Shirts", icon: "bi bi-shirt" },
    { name: "Jeans", icon: "bi bi-archive-fill" },
    { name: "Formal Wear", icon: "bi bi-person-standing" },
    { name: "Shoes", icon: "bi bi-handbag-fill" },
    { name: "Watches", icon: "bi bi-watch" },
    { name: "Smartphones", icon: "bi bi-phone" },
    { name: "Laptops", icon: "bi bi-laptop" },
    { name: "Cameras", icon: "bi bi-camera" },
    { name: "Headphones", icon: "bi bi-headphones" },
    { name: "Gaming Consoles", icon: "bi bi-controller" },
    { name: "Furniture", icon: "bi bi-house-fill" },
    { name: "Home Decor", icon: "bi bi-brush-fill" },
    { name: "Lighting", icon: "bi bi-lightbulb-fill" },
    { name: "Kitchenware", icon: "bi bi-cup-straw" },
    { name: "Bedding", icon: "bi bi-cloud-sun" },
    { name: "Toys", icon: "bi bi-balloon-fill" },
    { name: "Baby Clothes", icon: "bi bi-person-bounding-box" },
    { name: "Strollers", icon: "bi bi-cart-fill" },
    { name: "Educational Toys", icon: "bi bi-lightbulb" },
    { name: "Diapers", icon: "bi bi-box2-fill" },
    { name: "Makeup", icon: "bi bi-brush" },
    { name: "Skincare", icon: "bi bi-droplet-fill" },
    { name: "Haircare", icon: "bi bi-scissors" },
    { name: "Perfumes", icon: "bi bi-droplet-half" },
    { name: "Wellness", icon: "bi bi-heart-pulse" },
  ];
  const control = useRef(null);

  return (
    <Container style={{ overflow: "hidden" }}>
      {/* Header Slide */}
      {<HeaderSlide />}
      {/* <Row className="text-center  bg-white">
          <Col as={Row} md={3} sm={6} className="mb-3 mb-md-0 justify-content-center align-items-center">
            <Col sm={2}><i className="bi bi-rocket-takeoff fs-1 d-flex justify-content-end mb-2"></i></Col>
            <Col sm={6}><h6 className="mt-2 justify-content-start">Free Shipping</h6>
            <p className="text-muted small">Free Shipping On All Orders</p>
            </Col>
          </Col>
          <Col md={3} sm={6} className="mb-3 mb-md-0">
            <i className="bi bi-arrow-repeat fs-2 mb-2"></i>
            <h6 className="mt-2">Money Guarantee</h6>
            <p className="text-muted small">30 Day Money Back Guarantee</p>
          </Col>
          <Col md={3} sm={6} className="mb-3 mb-md-0">
            <i className="bi bi-people fs-2 mb-2"></i>
            <h6 className="mt-2">Online Support 24/7</h6>
            <p className="text-muted small">Technical Support 24/7</p>
          </Col>
          <Col md={3} sm={6}>
            <i className="bi bi-receipt fs-2 mb-2"></i>
            <h6 className="mt-2">Member Discount</h6>
            <p className="text-muted small">Up to 40% Discount All Products</p>
          </Col>
        </Row> */}
 <Row className=" text-center align-items-center bg-white mb-5" style={{color: "black"}}>
        <Col md={3} sm={6} xs={12} className="mb-3 p-4 mb-md-0">
          <div className="d-flex align-items-center justify-content-center">
            <i className="bi bi-rocket-takeoff fs-1 me-3"></i>
            <div className="text-start">
              <h6 className="mb-1">Free Shipping</h6>
              <p className="text-muted small mb-0">Free Shipping On All Orders</p>
            </div>
          </div>
        </Col>

        <Col md={3} sm={6} xs={12} className="mb-3 mb-md-0">
          <div className="d-flex align-items-center justify-content-center">
            <i className="bi bi-arrow-repeat fs-1 me-3"></i>
            <div className="text-start">
              <h6 className="mb-1">Money Guarantee</h6>
              <p className="text-muted small mb-0">30 Day Money Back Guarantee</p>
            </div>
          </div>
        </Col>

        <Col md={3} sm={6} xs={12} className="mb-3 mb-md-0">
          <div className="d-flex align-items-center justify-content-center">
            <i className="bi bi-people fs-1 me-3"></i>
            <div className="text-start">
              <h6 className="mb-1">Online Support 24/8</h6>
              <p className="text-muted small mb-0">Technical Support 24/8</p>
            </div>
          </div>
        </Col>

        <Col md={3} sm={6} xs={12}>
          <div className="d-flex align-items-center justify-content-center">
            <i className="bi bi-receipt fs-1 me-3"></i>
            <div className="text-start">
              <h6 className="mb-1">Member Discount</h6>
              <p className="text-muted small mb-0">Up to 60% Discount All Products</p>
            </div>
          </div>
        </Col>
      </Row>


      {/* Browse by Category */}
      <CardItemSlide
        title={"Browse by Category"}
        initialItemsPerSlide={{ xs: 3, sm: 5, md: 6, lg: 7, xl: 8, xxl: 10 }}
      >
        {categories.map((category, index) => (
          <Col key={index} className="categories-container">
            <i className={`${category.icon} category-icon`}></i>
            <p className="category-name">{category.name}</p>
          </Col>
        ))}
      </CardItemSlide>

      {/* Flash Sale */}
      <CardItemSlide
        title={"Flash Sale"}
        initialItemsPerSlide={{ xs: 2, sm: 3, md: 4, lg: 4, xl: 6, xxl: 6 }}
      >
        {productData.map((product) => (
          <Col key={product.id}>
            <Card
              image={product.image}
              name={product.name}
              price={product.price}
              description={product.description}
            />
          </Col>
        ))}
      </CardItemSlide>

      {/* Best Selling Products */}
      <CardItemSlide
        title={"Best Selling Products"}
        initialItemsPerSlide={{ xs: 2, sm: 3, md: 6, lg: 6, xl: 6, xxl: 6 }}
        
      >
        {productData.map((product) => (
          <Col key={product.id}>
            <Card
              image={product.image}
              name={product.name}
              price={product.price}
              description={product.description}
            />
          </Col>
        ))}
      </CardItemSlide>

      {/* New Arrivals */}

      
      <CustomCarousel2 />
    </Container>
  );
}

// import { Link } from "react-router-dom"
// import Contact from "./Contact"
// import { useRef } from "react"
// import {Container,Nav,Navbar,Row,Col } from "react-bootstrap"
// import Card from "./Card/Card";
// import CustomCarousel from "./carousel/CustomCarousel"

// import CardItemSlide from "./carousel/CardItemSlide/CardItemSlide"
// import HeaderSlide from "./carousel/HeaderSlide/HeaderSlide"
// import CategorySlider from "./carousel/categorySlider/CategorySlider"
// export default function Home() {

//       const productData = [
//             { id: 1, image: "/assets/products_4_1.jpg", name: "samsung Galaxy Pro", price: 19.99, description: "Description for Product 1" },
//             { id: 2, image: "/assets/products_1_1_1920x.jpg", name: "I Phone 13", price: 29.99, description: "Description for Product 2" },
//             { id: 3, image: "https://via.placeholder.com/200", name: "Product 3", price: 39.99, description: "Description for Product 3" },
//             { id: 4, image: "/assets/products_15_1_1920x.jpg", name: "SamSung Laptop", price: 19.99, description: "Description for Product 4" },
//             { id: 5, image: "https://via.placeholder.com/200", name: "Product 5", price: 49.99, description: "Description for Product 5" },
//             { id: 6, image: "https://via.placeholder.com/200", name: "Product 6", price: 59.99, description: "Description for Product 6" },
//             { id: 7, image: "https://via.placeholder.com/200", name: "Product 7", price: 69.99, description: "Description for Product 7" },
//             { id: 8, image: "/assets/products_4_1.jpg", name: "Product 1", price: 19.99, description: "Description for Product 1" },
//             { id: 9, image: "/assets/products_1_1_1920x.jpg", name: "Product 2", price: 29.99, description: "Description for Product 2" },
//             { id: 10, image: "https://via.placeholder.com/200", name: "Product 3 asdsadsa sad sadadsadads dasds", price: 39.99, description: "Description for Product 3" },
//             { id: 11, image: "/assets/products_1_1_1920x.jpg", name: "Product 4", price: 19.99, description: "Description for Product 4" },
//             { id: 12, image: "https://via.placeholder.com/200", name: "Product 5 fgffhgfhfghfgh  hggjhgh hjgjhg hhjgh", price: 49.99, description: "Description for Product 5" },
//             { id: 13, image: "https://via.placeholder.com/200", name: "Product 6", price: 59.99, description: "Description for Product 6" },
//             { id: 14, image: "https://via.placeholder.com/200", name: "Product 6", price: 59.99, description: "Description for Product 6" },

//           ];
//           const categories = [
//             { name: "Dresses", icon: "bi bi-person-lines-fill" },
//             { name: "Handbags", icon: "bi bi-bag-fill" },
//             { name: "Jewelry", icon: "bi bi-gem" },
//             { name: "Shoes", icon: "bi bi-handbag-fill" },
//             { name: "Watches", icon: "bi bi-watch" },

//             { name: "T-Shirts", icon: "bi bi-shirt" },
//             { name: "Jeans", icon: "bi bi-archive-fill" },
//             { name: "Formal Wear", icon: "bi bi-person-standing" },
//             { name: "Shoes", icon: "bi bi-handbag-fill" },
//             { name: "Watches", icon: "bi bi-watch" },

//             { name: "Smartphones", icon: "bi bi-phone" },
//             { name: "Laptops", icon: "bi bi-laptop" },
//             { name: "Cameras", icon: "bi bi-camera" },
//             { name: "Headphones", icon: "bi bi-headphones" },
//             { name: "Gaming Consoles", icon: "bi bi-controller" },

//             { name: "Furniture", icon: "bi bi-house-fill" },
//             { name: "Home Decor", icon: "bi bi-brush-fill" },
//             { name: "Lighting", icon: "bi bi-lightbulb-fill" },
//             { name: "Kitchenware", icon: "bi bi-cup-straw" },
//             { name: "Bedding", icon: "bi bi-cloud-sun" },

//             { name: "Toys", icon: "bi bi-balloon-fill" },
//             { name: "Baby Clothes", icon: "bi bi-person-bounding-box" },
//             { name: "Strollers", icon: "bi bi-cart-fill" },
//             { name: "Educational Toys", icon: "bi bi-lightbulb" },
//             { name: "Diapers", icon: "bi bi-box2-fill" },

//             { name: "Makeup", icon: "bi bi-brush" },
//             { name: "Skincare", icon: "bi bi-droplet-fill" },
//             { name: "Haircare", icon: "bi bi-scissors" },
//             { name: "Perfumes", icon: "bi bi-droplet-half" },
//             { name: "Wellness", icon: "bi bi-heart-pulse" },

//           ];

//       const control= useRef(null);
//       return(

//       <Container   style={{overflow:"hidden"}}>
//             <HeaderSlide/>

// <CardItemSlide title={"Browse by Category"} initialItemsPerSlide={{ xs: 3, sm: 5, md: 6, lg: 7, xl: 8, xxl: 10 }}>
// <>
// {categories.map((category) => (
//           <Col className="categories-container" >
//           <i className={`${category.icon} category-icon ` }></i>
//           <p className="category-name">{category.name}</p>

//           </Col >
//         ))}</>
// </CardItemSlide>

// <CardItemSlide title={"Flash Sale"} initialItemsPerSlide={{ xs: 2, sm: 3, md: 4, lg: 4, xl: 6, xxl: 6 }}>
// <Col>
// {productData.map((product) => (
//           <Card
//             key={product.id}
//             image={product.image}
//             name={product.name}
//             price={product.price}
//             description={product.description}
//           />

//         ))

//         }</Col>
// </CardItemSlide>

// <CardItemSlide title={"Best Selling Products"} initialItemsPerSlide={{ xs: 6, sm: 6, md: 8, lg: 7, xl: 7, xxl: 7 }}>
// <Col>
// {productData.map((product) => (
//           <Card
//             key={product.id}
//             image={product.image}
//             name={product.name}
//             price={product.price}
//             description={product.description}
//           />
//         ))}</Col>
// </CardItemSlide>

//       </Container> )
// }
