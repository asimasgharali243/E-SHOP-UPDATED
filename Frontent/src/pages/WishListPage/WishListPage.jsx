// src/pages/LikesPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toggleLocalLike } from "../../redux/features/products/LikeProduct";
import { syncLikesAPI } from "../../redux/api/productsApi/LikeProductApi";
import { useGetLikeProductQuery } from "../../redux/api/productsApi/ProductApi";
import ShowToast from "../../components/SubComponent/Showtoast";
import "./LikesPage.scss";
import ProductCard from "../../components/Card/ProductCard";
const LikesPage = () => {
  const dispatch = useDispatch();
  const { likedProducts = [], version = 0 } = useSelector(
    (state) => state.Likes || {}
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  // Fetch liked products from backend using RTK Query
  const {
    data: responseData = {},
    isFetching,
    error: fetchError,
    refetch,
  } = useGetLikeProductQuery(likedProducts, {
    skip: likedProducts.length === 0,
  });

  // Extract products from response data
  const filteredProducts = responseData.products || [];

  // Local loading effect for better UX
  useEffect(() => {
    const timer = setTimeout(() => setLocalLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Manual sync handler
  const handleManualSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      await dispatch(syncLikesAPI({ likedProducts, version })).unwrap();
      ShowToast("success", "Likes synced successfully", "top-right");
      refetch(); // Refetch after sync
    } catch (error) {
      ShowToast("error", "Failed to sync likes", "top-right");
    } finally {
      setIsSyncing(false);
    }
  }, [dispatch, likedProducts, version, refetch]);

  // Unlike a product locally
  const handleUnlike = useCallback(
    (productId, productName) => {
      dispatch(toggleLocalLike(productId));
      ShowToast("info", `Removed ${productName} from wishlist`, "top-right");
    },
    [dispatch]
  );

  const navigateToProduct = useCallback((productId) => {
    window.location.href = `/products/${productId}`;
  }, []);

  // Show loader if syncing/fetching/loading
  if (localLoading || isFetching) {
    return (
      <Container className="likes-page">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" role="status" />
          <p className="mt-3 text-muted">Loading your liked products...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="likes-page">
      <Row className="justify-content-center">
        <Col xl={10}>
          {/* Header */}
          <div className="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <div className="mb-3 mb-md-0">
              <h1 className="page-title">Your Wishlist</h1>
              <p className="page-subtitle text-muted">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} in your wishlist
                {version > 0 && (
                  <Badge bg="light" text="dark" className="ms-2">
                    v{version}
                  </Badge>
                )}
              </p>
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <Button
                variant="outline-secondary"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="sync-btn"
                size="sm"
              >
                {isSyncing ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <i className="bi bi-arrow-clockwise"></i>
                )}
              </Button>

              <Button
                variant="outline-primary"
                href="/products"
                className="browse-btn"
                size="sm"
              >
                <i className="bi bi-grid me-1"></i> Browse
              </Button>
            </div>
          </div>

          {/* Error */}
          {fetchError && (
            <Alert variant="warning" className="mb-4">
              <div className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div>
                  <strong>Sync Issue</strong>
                  <p className="mb-0 small">
                    {fetchError?.data?.message ||
                      "Failed to load liked products"}
                  </p>
                </div>
              </div>
            </Alert>
          )}

          {/* Empty state */}
          {filteredProducts.length === 0 ? (
            <div className="empty-state text-center py-5">
              <div className="empty-icon-wrapper">
                <i className="bi bi-heart empty-icon"></i>
              </div>
              <h3 className="mt-4">Your wishlist is empty</h3>
              <p className="text-muted mb-4">
                Save your favorite items here for easy access later
              </p>
              <Button
                variant="primary"
                href="/products"
                size="lg"
                className="px-4"
                style={{
                  backgroundColor: `var(--primary)`,
                  color: `var(--white)`,
                  border: `0.1px solid var(--primary)`,
                }}
              >
                <i className="bi bi-search me-2"></i>
                Discover Products
              </Button>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <Row className="d-flex justify-content-between justify-content-md-start  align-items-center align-content-center justify-items-between gap-3">
                {filteredProducts.map((product) => (
                  <Col key={product._id} xs={5} sm={4} lg={3} xl={2}>
                    <ProductCard
                      product={product}
                      handleUnlike={handleUnlike}
                      navigateToProduct={navigateToProduct}
                    />
                  </Col>
                ))}
              </Row>

              {/* Optional Sync Button */}
              {filteredProducts.length > 8 && (
                <div className="text-center mt-4">
                  <Button
                    variant="outline-secondary"
                    onClick={handleManualSync}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Sync Wishlist
                  </Button>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default LikesPage;
