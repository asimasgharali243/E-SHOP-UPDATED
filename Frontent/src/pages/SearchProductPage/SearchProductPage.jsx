import React from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Spinner, Alert, Container } from "react-bootstrap";
import CustomContainer from "../../components/SubComponent/CustomContainer";
import { useSearchProductsQuery } from "../../redux/api/productsApi/ProductApi";
import ProductCard from "../../components/Card/ProductCard";
import "./SearchProduct.scss"; // We'll create this CSS file

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery();
  const searchQuery = query.get("query") || "";

  // API call with RTK Query
  const {
    data: searchResponse,
    isLoading,
    isError,
  } = useSearchProductsQuery({ keyword: searchQuery }, { skip: !searchQuery });

  const products = searchResponse?.products || [];

  return (
    <CustomContainer className="search-page-container">
      {/* Header Section */}
      <Row className="my-4">
        <Col>
          <div className="search-header text-center text-md-start">
            <h2 className="fw-bold mb-2">
              {searchQuery ? (
                <>
                  Search results for:{" "}
                  <span className="text-primary">"{searchQuery}"</span>
                </>
              ) : (
                "Product Search"
              )}
            </h2>
            {products.length > 0 && (
              <p className="text-muted mb-0">
                Found {products.length} product
                {products.length !== 1 ? "s" : ""}
              </p>
            )}
            <hr className="mt-3" />
          </div>
        </Col>
      </Row>

      {/* Loading State */}
      {isLoading && (
        <Row className="my-5">
          <Col className="text-center">
            <Spinner
              animation="border"
              variant="primary"
              style={{ width: "3rem", height: "3rem" }}
            />
            <p className="mt-3 text-muted">Searching products...</p>
          </Col>
        </Row>
      )}

      {/* Error State */}
      {isError && (
        <Row className="my-5">
          <Col>
            <Alert
              variant="danger"
              className="text-center mx-auto"
              style={{ maxWidth: "500px" }}
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Something went wrong. Please try again.
            </Alert>
          </Col>
        </Row>
      )}

      {/* No Results State */}
      {!isLoading && !isError && products.length === 0 && searchQuery && (
        <Row className="my-5">
          <Col className="text-center">
            <div className="no-results">
              <i className="bi bi-search display-1 text-muted mb-3"></i>
              <h4 className="text-muted">No products found</h4>
              <p className="text-muted">
                No results found for "<strong>{searchQuery}</strong>"
              </p>
              <p className="text-muted small">
                Try different keywords or browse our categories
              </p>
            </div>
          </Col>
        </Row>
      )}

      {/* Empty Search State */}
      {!isLoading && !isError && products.length === 0 && !searchQuery && (
        <Row className="my-5">
          <Col className="text-center">
            <div className="empty-search">
              <i className="bi bi-search display-1 text-muted mb-3"></i>
              <h4 className="text-muted">Search Products</h4>
              <p className="text-muted">
                Use the search bar to find products in our store
              </p>
            </div>
          </Col>
        </Row>
      )}

      {/* Results Grid - Perfect Horizontal Alignment */}
      {!isLoading && !isError && products.length > 0 && (
        <Container fluid className="px-0">
          <Row className="products-grid g-3 g-md-4 justify-content-center justify-content-md-start">
            {products.map((product) => (
              <Col
                key={product._id}
                xs={6} // 2 columns on mobile
                sm={6} // 2 columns on small screens
                md={4} // 3 columns on medium screens
                lg={3} // 4 columns on large screens
                xl={2} // 5 columns on extra large screens
                xxl={2} // 5 columns on extra extra large screens
                className="product-col d-flex"
              >
                <ProductCard product={product} className="h-100 w-100" />
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {/* Load More Button (optional) */}
      {products.length > 0 && products.length % 20 === 0 && (
        <Row className="my-4">
          <Col className="text-center">
            <button className="btn btn-outline-primary btn-lg">
              Load More Products
            </button>
          </Col>
        </Row>
      )}
    </CustomContainer>
  );
}
