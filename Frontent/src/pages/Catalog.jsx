import React, { useState } from 'react';
import { Container, Row, Col, Button, Offcanvas, Dropdown } from 'react-bootstrap';
import FilterSidebar from '../components/FilterComponent/FilterSidebar';
import ProductCard from '../components/Card/ProductCard';

const CatalogPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [sortOption, setSortOption] = useState('Popular');
  const [gridType, setGridType] = useState('grid3'); // grid2, grid3, list

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleShowFilter = () => setShowFilter(true);
  const handleCloseFilter = () => setShowFilter(false);

  const handleGridChange = (type) => {
    setGridType(type);
  };

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

  const getGridCols = () => {
    switch (gridType) {
      case 'grid2':
        return { xs: 2, md: 4, lg: 4 };
      case 'grid3':
        return { xs: 2, md: 6, lg: 6 };
      case 'list':
        return { xs: 1, md: 1, lg: 1 };
      default:
        return { xs: 2, md: 3, lg: 3 };
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col sm={12} className="mx-5 my-3"><h5 className="">{productData.length} Results for Search</h5></Col>
        {/* Sidebar */}
        <Col lg={3} className="d-none d-lg-block">
          <FilterSidebar />
        </Col>

        {/* Main Content */}
        <Col xs={12} lg={9}>
          <Row className="justify-content-between align-items-center mb-3 flex-wrap gap-2 mb-5">
            

            <Col className="d-flex align-items-center gap-2">
              {/* Filter Button (Mobile) */}
              <Button
                variant="outline-primary"
                size="sm"
                className="d-lg-none"
                onClick={handleShowFilter}
              >
                Filter
              </Button>

              {/* Grid Layout Switcher */}
              <Col className="d-flex align-items-center gap-2">
                <Button
                  variant={gridType === 'grid2' ? 'primary' : 'light'}
                  size="sm"
                  onClick={() => handleGridChange('grid2')}
                >
                  <i className="bi bi-grid" style={{ fontSize: '18px' }}></i>
                </Button>

                <Button
                  variant={gridType === 'grid3' ? 'primary' : 'light'}
                  size="sm"
                  onClick={() => handleGridChange('grid3')}
                >
                  <i className="bi bi-grid-3x3-gap" style={{ fontSize: '18px' }}></i>
                </Button>

                <Button
                  variant={gridType === 'list' ? 'primary' : 'light'}
                  size="sm"
                  onClick={() => handleGridChange('list')}
                >
                  <i className="bi bi-list" style={{ fontSize: '18px' }}></i>
                </Button>
              </Col>

              {/* Sort Dropdown */}
              <Col className='d-flex justify-content-end me-5'>
              <Dropdown>
                <Dropdown.Toggle as={Button} variant="light" size="sm" id="sort-dropdown" className='d-flex justify-content-center align-items-center'>
                  <i className='bi bi-filter' style={{ fontSize: '24px' }}></i><span className="ms-2 text-center">Sort by: {sortOption}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleSortChange('Popular')}>Popular</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChange('Newest')}>Newest</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChange('Price: Low to High')}>Price: Low to High</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChange('Price: High to Low')}>Price: High to Low</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              </Col>
            </Col>
          </Row>

          {/* Product Grid */}
          <Row {...getGridCols()} className="g-3">
            {productData.map((product) => (
              <Col key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Mobile Offcanvas Filter */}
      <Offcanvas show={showFilter} onHide={handleCloseFilter} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FilterSidebar />
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default CatalogPage;
