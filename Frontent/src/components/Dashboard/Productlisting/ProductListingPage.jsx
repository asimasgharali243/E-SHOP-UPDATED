import React, { useState } from "react";
import { Container, Row, Col, Button, Breadcrumb } from "react-bootstrap";
import ProductTable from "./ProductTable";
import SearchBar from "./SearchBar";
import { mockProducts } from "./Data/mockData";
import "./Product.scss";

const ProductListPage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState(null);
  // Initially null, means no sorting is applied.

  const [sortDirection, setSortDirection] = useState("asc");

  //   This filter will return true for any product where: The name, or
  // The ID, or The SKU, or The category
  // contains the text typed into the search box (stored in searchTerm).
  // Only those matching products are included in filteredProducts,
  // and this filtered list can then be shown on the page.

  const filteredProducts = products.filter(
    (product) =>
      //   .includes() checks if the search term typed by the user exists anywhere inside
      //  the product’s name, ignoring case sensitivity.

      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // stock keeping unit
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = sortField
    ? [...filteredProducts].sort((a, b) => {
        // The spread operator makes a copy of filteredProducts array so the original isn't modified.
        if (a[sortField] < b[sortField])
          return sortDirection === "asc" ? -1 : 1;
        // a will come before b
        if (a[sortField] > b[sortField])
          return sortDirection === "asc" ? 1 : -1;
        // a will come after b
        return 0;
      })
    : filteredProducts;

  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  // slice doesn't modify original array and makes a copy of selected range of products
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  // math.ceil rounds up the decimals into whole number
  const totalPages = Math.ceil(sortedProducts.length / rowsPerPage);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item href="dashboard">Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item active>Products</Breadcrumb.Item>
          </Breadcrumb>
          <h2 className="mb-0">Products</h2>
        </Col>
        <Col xs="auto" className="d-flex align-items-center gap-2">
          <Button variant="light" className="fw-medium">
            Import
          </Button>
          <Button variant="warning" className="fw-medium">
            New product
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <SearchBar onSearch={handleSearch} />
        </Col>
      </Row>

      <ProductTable
        products={currentProducts}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalItems={sortedProducts.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Container>
  );
};

export default ProductListPage;
