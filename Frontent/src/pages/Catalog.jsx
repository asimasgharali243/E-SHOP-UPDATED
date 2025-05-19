import React, { useState } from 'react';
import { Container, Row, Col, Button, Offcanvas, Dropdown } from 'react-bootstrap';
import FilterSidebar from '../components/CataLogComponent/FilterSidebar';
import CustomContainer from '../components/SubComponent/CustomContainer';
import CustomGrid from '../components/CataLogComponent/CustomGrid';

const CatalogPage = () => {
       const [showFilter, setShowFilter] = useState(false);

const handleToggleFilter = () => setShowFilter(prev => !prev);
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
      badge: "New",
      description: "Description for Product 2",
    },
    {
      id: 10,
      image: "https://via.placeholder.com/200",
      name: "Product 10 asdsadsa sad sadadsadads dasds",
      price: 39.99,
      discount: 20,
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

  
  return (
    <CustomContainer className="">
     <div sm={12} className=" my-3"
     style={{padding:'0px 12px'}}
     ><h5 className=""
        style={{fontSize:`clamp(14px, 1.2vw,18px)`}}
        >{productData.length} Results for Search</h5></div>
      <div className='d-flex justify-content-between align-items-start'
      
      >
        
        {/* Sidebar */}
        <div  className="d-none d-lg-block  "
        style={{minWidth:'270px',maxWidth:'270px',padding:'0px 12px'}}
        >
          <FilterSidebar />
        </div>

        {/* Main Content */}
        <div className='w-100'
        style={{padding:'0px 12px'}}
        >
   <CustomGrid productData={productData} handleToggleFilter={handleToggleFilter}  />
        </div>
      </div>

      {/* Mobile Offcanvas Filter */}
      <Offcanvas show={showFilter} onHide={handleToggleFilter} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FilterSidebar />
        </Offcanvas.Body>
      </Offcanvas>
    </CustomContainer>
  );
};

export default CatalogPage;
