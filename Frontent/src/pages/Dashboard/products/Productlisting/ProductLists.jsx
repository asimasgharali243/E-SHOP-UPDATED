import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Breadcrumb,
  Spinner,
  Alert,
} from "react-bootstrap";
import ProductTable from "./ProductTable";
import SearchBar from "./SearchBar";
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
} from "../../../../redux/api/productsApi/ProductApi";
import "./Product.scss";

const ProductLists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedProducts, setSelectedProducts] = useState(new Set());

  // Fetch products from backend
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useGetAllProductsQuery();

  const [deleteProduct] = useDeleteProductMutation();

  const products = productsData?.products || [];

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku &&
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products
  const sortedProducts = sortField
    ? [...filteredProducts].sort((a, b) => {
        const aValue = a[sortField] || "";
        const bValue = b[sortField] || "";

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : filteredProducts;

  // Pagination
  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(sortedProducts.length / rowsPerPage);

  // Handlers
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

  const handleSelectProduct = (productId, isSelected) => {
    setSelectedProducts((prev) => {
      const newSelection = new Set(prev);
      if (isSelected) {
        newSelection.add(productId);
      } else {
        newSelection.delete(productId);
      }
      return newSelection;
    });
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const allIds = currentProducts.map((product) => product._id);
      setSelectedProducts(new Set(allIds));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedProducts.size === 0) return;

    try {
      const deletePromises = Array.from(selectedProducts).map((id) =>
        deleteProduct(id).unwrap()
      );

      await Promise.all(deletePromises);
      setSelectedProducts(new Set());
      refetch();
    } catch (error) {
      console.error("Failed to delete products:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  if (isLoading) {
    return (
      <Container fluid className="py-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">
          Failed to load products: {error?.data?.message || error.message}
          <Button variant="outline-danger" className="ms-3" onClick={refetch}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item active>Products</Breadcrumb.Item>
          </Breadcrumb>
          <h2 className="mb-0">Products</h2>
        </Col>
        <Col xs="auto" className="d-flex align-items-center gap-2">
          {selectedProducts.size > 0 && (
            <Button
              variant="danger"
              className="fw-medium"
              onClick={handleDeleteSelected}
            >
              Delete Selected ({selectedProducts.size})
            </Button>
          )}

          <Button
            variant="primary"
            className="fw-medium px-4"
            href="/dashboard/products/add"
          >
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
        selectedProducts={selectedProducts}
        onSelectProduct={handleSelectProduct}
        onSelectAll={handleSelectAll}
        onDeleteProduct={handleDeleteProduct}
      />
    </Container>
  );
};

export default ProductLists;
