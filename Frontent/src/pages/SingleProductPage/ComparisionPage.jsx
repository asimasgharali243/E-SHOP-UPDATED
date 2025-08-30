import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Table,
  Badge,
  Modal,
} from "react-bootstrap";
import { useGetProductComparisonQuery } from "../../redux/api/productsApi/ProductApi";
import CustomContainer from "../../components/SubComponent/CustomContainer";
import "./ComparisonPage.scss";

const ComparisonPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const productName = queryParams.get("query");

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("price");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const {
    data: comparisonData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductComparisonQuery(productName, { skip: !productName });

  useEffect(() => {
    if (productName) {
      refetch();
    }
  }, [productName, refetch]);

  const handleRetry = () => refetch();

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const filteredProducts =
    comparisonData?.products
      ?.filter(
        (product) =>
          filterBy === "all" ||
          product?.source?.toLowerCase().includes(filterBy)
      )
      ?.sort((a, b) => {
        if (sortBy === "price") {
          const priceA = parseFloat(a?.price?.replace(/[^\d.]/g, "") || 0);
          const priceB = parseFloat(b?.price?.replace(/[^\d.]/g, "") || 0);
          return priceA - priceB;
        }
        if (sortBy === "rating") {
          return (b?.rating || 0) - (a?.rating || 0);
        }
        return 0;
      }) || [];

  if (isLoading) {
    return (
      <CustomContainer className="py-5">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">
            Searching for the best prices across retailers...
          </p>
        </div>
      </CustomContainer>
    );
  }

  if (isError) {
    return (
      <CustomContainer className="py-5">
        <Alert variant="danger" className="text-center">
          <h4>Failed to load comparison data</h4>
          <p>{error?.data?.message || "Please try again later"}</p>
          <Button variant="primary" onClick={handleRetry} className="mt-2">
            Try Again
          </Button>
        </Alert>
      </CustomContainer>
    );
  }

  if (!productName) {
    return (
      <CustomContainer className="py-5">
        <Alert variant="warning" className="text-center">
          <h4>No product specified</h4>
          <p>Please search for a product to compare prices</p>
          <Button
            variant="primary"
            onClick={() => navigate("/")}
            className="mt-2"
          >
            Go to Home
          </Button>
        </Alert>
      </CustomContainer>
    );
  }

  return (
    <CustomContainer className="py-4">
      <div className="d-flex align-items-center mb-4">
        <Button
          variant="outline-secondary"
          onClick={() => navigate(-1)}
          className="me-3"
        >
          <i className="bi bi-arrow-left"></i> Back
        </Button>
        <h2 className="mb-0">Compare Prices: {productName}</h2>
      </div>

      {/* Results Count */}
      <div className="mb-3">
        <p className="text-muted">
          Found {filteredProducts?.length || 0} results across retailers
        </p>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <Row className="g-4">
          {filteredProducts?.map((product, index) => (
            <Col key={index} md={6} lg={4} xl={3}>
              <Card className="h-100 shadow-sm compare-card">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={product?.image || "/placeholder.png"}
                    style={{
                      height: "200px",
                      objectFit: "contain",
                      padding: "15px",
                    }}
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  <Badge
                    bg="primary"
                    className="position-absolute top-0 end-0 m-2"
                  >
                    {product?.source || "Unknown"}
                  </Badge>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="h6" title={product?.name || "N/A"}>
                    {product?.name
                      ? product.name.length > 60
                        ? `${product.name.substring(0, 60)}...`
                        : product.name
                      : "No Name"}
                  </Card.Title>

                  <div className="mb-2">
                    {product?.rating && (
                      <div className="d-flex align-items-center">
                        <span className="text-warning me-1">
                          <i className="bi bi-star-fill"></i>
                        </span>
                        <small>{product.rating}</small>
                      </div>
                    )}
                    {product?.reviews && (
                      <small className="text-muted">
                        {product.reviews} reviews
                      </small>
                    )}
                  </div>

                  <div className="mt-auto">
                    <div className="d-flex align-items-center mb-2">
                      <span className="h5 text-success mb-0">
                        {product?.price || "Price not available"}
                      </span>
                    </div>

                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        onClick={() =>
                          product?.link && window.open(product.link, "_blank")
                        }
                        disabled={!product?.link}
                      >
                        <i className="bi bi-cart me-1"></i> Visit Store
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleViewProduct(product)}
                      >
                        <i className="bi bi-eye me-1"></i> Details
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card className="shadow-sm">
          <Card.Body className="p-0">
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Store</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={product?.image || "/placeholder.png"}
                          alt={product?.name || "N/A"}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "contain",
                            marginRight: "15px",
                          }}
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />
                        <div>
                          <div className="fw-bold">
                            {product?.name || "Unnamed"}
                          </div>
                          <small className="text-muted">
                            {product?.description
                              ? product.description.substring(0, 80)
                              : "No description"}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="primary">{product?.source || "N/A"}</Badge>
                    </td>
                    <td className="fw-bold text-success">
                      {product?.price || "N/A"}
                    </td>
                    <td>
                      {product?.rating ? (
                        <div className="d-flex align-items-center">
                          <span className="text-warning me-1">
                            <i className="bi bi-star-fill"></i>
                          </span>
                          {product.rating}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            product?.link && window.open(product.link, "_blank")
                          }
                          disabled={!product?.link}
                        >
                          <i className="bi bi-cart"></i>
                        </Button>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleViewProduct(product)}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* No Results */}
      {filteredProducts?.length === 0 && !isLoading && (
        <Alert variant="info" className="text-center">
          <i className="bi bi-search display-4 d-block mb-3"></i>
          <h4>No products found</h4>
          <p>Try adjusting your search terms or filters</p>
        </Alert>
      )}

      {/* Product Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Row>
              <Col md={6}>
                <img
                  src={selectedProduct?.image || "/placeholder.png"}
                  alt={selectedProduct?.name || "N/A"}
                  className="img-fluid rounded"
                  style={{ maxHeight: "300px", objectFit: "contain" }}
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
              </Col>
              <Col md={6}>
                <h4>{selectedProduct?.name || "Unnamed Product"}</h4>
                <Badge bg="primary" className="mb-2">
                  {selectedProduct?.source || "N/A"}
                </Badge>

                <div className="mb-3">
                  <h3 className="text-success">
                    {selectedProduct?.price || "Price not available"}
                  </h3>
                </div>

                {selectedProduct?.rating && (
                  <div className="d-flex align-items-center mb-2">
                    <span className="text-warning me-1">
                      <i className="bi bi-star-fill"></i>
                    </span>
                    <span className="me-2">{selectedProduct.rating}</span>
                    {selectedProduct?.reviews && (
                      <small className="text-muted">
                        ({selectedProduct.reviews} reviews)
                      </small>
                    )}
                  </div>
                )}

                {selectedProduct?.description && (
                  <div className="mb-3">
                    <h6>Description:</h6>
                    <p className="text-muted">{selectedProduct.description}</p>
                  </div>
                )}

                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() =>
                    selectedProduct?.link &&
                    window.open(selectedProduct.link, "_blank")
                  }
                  disabled={!selectedProduct?.link}
                >
                  <i className="bi bi-cart me-1"></i> Visit Store
                </Button>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </CustomContainer>
  );
};

export default ComparisonPage;
