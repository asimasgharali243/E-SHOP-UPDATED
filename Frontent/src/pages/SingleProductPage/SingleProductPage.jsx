import React, { useCallback, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  Col,
  Row,
  Spinner,
  Image,
  Button,
  Alert,
  Badge,
  Tabs,
  Tab,
} from "react-bootstrap";
import Rating from "react-rating";
import ProductSlider from "../../components/carousel/CarditemSlider/CardItemSlider";
import CustomContainer from "../../components/SubComponent/CustomContainer";
import { useGetSingleProductQuery } from "../../redux/api/productsApi/ProductApi";
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";
import NegotiationChat from "./NegotiationChatBoard";
import { addToCart } from "../../redux/features/Cart/CartAction";
import { toggleLocalLike } from "../../redux/features/products/LikeProduct";

import "./SingleProduct.scss";

export default function SingleProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchProduct,
  } = useGetSingleProductQuery(id);
  const product = data?.product || {};
  const similarProducts = data?.relatedProducts || [];
  // Local state
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [displayedSrc, setDisplayedSrc] = React.useState("");
  const [overlaySrc, setOverlaySrc] = React.useState(null);
  const [overlayVisible, setOverlayVisible] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState("");
  const [selectedSize, setSelectedSize] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState("description");

  // Prevent crash when colors/sizes missing
  const validColors = product?.colors?.filter((c) => c?.trim() !== "") || [];
  const validSizes = product?.sizes?.filter((s) => s?.trim() !== "") || [];

  // Price calculation
  const discountedPrice = useMemo(() => {
    if (!product) return 0;
    return product.price * (1 - (product.discount || 0) / 100);
  }, [product]);

  // Image logic
  const currentImage = useMemo(() => {
    if (!product?.featureImages?.length) return "";
    return product.featureImages[currentIndex]?.url || "";
  }, [product, currentIndex]);

  const showImage = useCallback(
    (img) => {
      if (!img || img === displayedSrc) return;
      const pre = new window.Image();
      pre.src = img;
      const showOverlay = () => {
        setOverlaySrc(img);
        requestAnimationFrame(() => setOverlayVisible(true));
      };
      if (pre.complete) {
        showOverlay();
      } else {
        pre.onload = showOverlay;
        pre.onerror = () => {
          setDisplayedSrc(img);
          setOverlaySrc(null);
          setOverlayVisible(false);
        };
      }
    },
    [displayedSrc]
  );

  const handleThumbnailClick = useCallback(
    (img, index) => {
      setCurrentIndex(index);
      showImage(img);
    },
    [showImage]
  );

  const handleOverlayTransitionEnd = useCallback(() => {
    if (!overlayVisible || !overlaySrc) return;
    setDisplayedSrc(overlaySrc);
    setOverlaySrc(null);
    setOverlayVisible(false);
  }, [overlayVisible, overlaySrc]);

  const handleNext = useCallback(() => {
    if (!product?.featureImages) return;
    const nextIndex = (currentIndex + 1) % product.featureImages.length;
    setCurrentIndex(nextIndex);
    showImage(product.featureImages[nextIndex]?.url);
  }, [product?.featureImages, currentIndex, showImage]);

  const handlePrev = useCallback(() => {
    if (!product?.featureImages) return;
    const prevIndex =
      (currentIndex - 1 + product.featureImages.length) %
      product.featureImages.length;
    setCurrentIndex(prevIndex);
    showImage(product.featureImages[prevIndex]?.url);
  }, [product?.featureImages, currentIndex, showImage]);

  useEffect(() => {
    if (product?.featureImages?.length && !displayedSrc) {
      setDisplayedSrc(product.featureImages[0]?.url);
    }
  }, [product?.featureImages, displayedSrc]);

  const handleQuantityChange = (newQuantity) => {
    const clampedQuantity = Math.max(
      1,
      Math.min(product?.stock || 1, newQuantity)
    );
    setQuantity(clampedQuantity);
  };

  // Redux selectors
  const likedProducts = useSelector(
    (state) => state.likes?.products || [],
    shallowEqual
  );
  const cartItems = useSelector(
    (state) => state.cart?.items || [],
    shallowEqual
  );
  const userId = useSelector((state) => state.authUser?.user?.userId || null);
  console.log("likedProducts:", userId);
  const liked = likedProducts.includes(product._id);
  const inCart = cartItems.some((item) => item._id === product._id);

  // Loading/Error states
  if (isLoading) {
    return (
      <CustomContainer
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </CustomContainer>
    );
  }

  if (isError) {
    return (
      <CustomContainer>
        <Alert variant="danger">
          {error?.data?.message || "Failed to fetch product"}
        </Alert>
      </CustomContainer>
    );
  }

  if (!product) {
    return (
      <CustomContainer>
        <Alert variant="warning">Product not found</Alert>
      </CustomContainer>
    );
  }

  return (
    <CustomContainer className="product-page py-3">
      <Row className="g-2">
        {/* Product Images */}
        <Col
          lg={8}
          md={7}
          sm={12}
          className="product-photo-container d-flex flex-column flex-lg-row gap-2 justify-content-center"
          style={{ maxHeight: "500px" }}
        >
          {/* Main Image Column */}
          <Col
            lg={{ span: 9, order: 2 }}
            md={{ span: 12, order: 1 }}
            className="main-image-column bg-white p-1 shadow-sm rounded "
          >
            <div className="main-image-wrapper">
              <button className="nav-btn prev-btn" onClick={handlePrev}>
                <i className="bi bi-chevron-left"></i>
              </button>

              <img
                src={displayedSrc}
                alt="Main product"
                className="main-image main-image--base"
                loading="eager"
                decoding="async"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />

              {overlaySrc && (
                <img
                  src={overlaySrc}
                  alt="Main product (switching)"
                  className={`main-image main-image--overlay ${
                    overlayVisible ? "is-visible" : ""
                  }`}
                  onTransitionEnd={handleOverlayTransitionEnd}
                  loading="eager"
                  decoding="async"
                />
              )}

              <button className="nav-btn next-btn" onClick={handleNext}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </Col>

          {/* Thumbnails Column */}
          <Col
            lg={{ span: 2, order: 1 }}
            md={{ span: 12, order: 2 }}
            className="thumbnails-column"
          >
            <div className="thumbnails-scroll">
              {product?.featureImages?.map((img, index) => (
                <div
                  key={`thumbnail-${index}`}
                  className={`thumbnail-item bg-white shadow-sm ${
                    currentIndex === index ? "active" : ""
                  }`}
                  onClick={() => handleThumbnailClick(img.url, index)}
                  role="button"
                  aria-label={`Select image ${index + 1}`}
                >
                  <Image
                    src={img.url}
                    className="w-100 h-100 object-fit-fill"
                    loading="lazy"
                    alt={`Thumbnail ${index + 1}`}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                </div>
              ))}
            </div>
          </Col>
        </Col>

        {/* Product Details */}
        <Col lg={4} md={5} sm={12} className="product-details p-3 p-md-0">
          <h1 className="product-title mb-2">{product.name}</h1>

          <div className="d-flex align-items-center mb-2">
            <Rating
              initialRating={product.ratings || 0}
              readonly
              emptySymbol={
                <i
                  className="bi bi-star text-warning"
                  style={{ fontSize: "clamp(1rem, 2vw + 0.5rem, 1.2rem)" }}
                />
              }
              fullSymbol={
                <i
                  className="bi bi-star-fill text-warning"
                  style={{ fontSize: "clamp(1rem, 2vw + 0.5rem, 1.2rem)" }}
                />
              }
              fractions={2}
              className="me-2"
            />
            <span className="text-muted small">
              {(product.ratings || 0)?.toFixed(1)} ({product.numOfReviews || 0}{" "}
              reviews)
            </span>
          </div>

          <div className="price-section mb-3">
            <span className="product-price text-danger fs-2 fw-bold">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-muted text-decoration-line-through ms-2">
                  ${product.price.toFixed(2)}
                </span>
                <Badge bg="danger" className="ms-2">
                  {product.discount}% OFF
                </Badge>
              </>
            )}
          </div>

          <div className="availability mb-3">
            {product.stock > 0 ? (
              <span className="text-success">
                <i className="bi bi-check-circle-fill me-1"></i>In Stock (
                {product.stock} available)
              </span>
            ) : (
              <span className="text-danger">
                <i className="bi bi-x-circle-fill me-1"></i>Out of Stock
              </span>
            )}
          </div>

          <p className="description text-muted mb-3">
            {product.shortDescription}
          </p>
          <hr />

          {/* Colors */}
          {validColors?.length > 0 && (
            <div className="color-selection mb-4">
              <h6 className="mb-2">
                Color:{" "}
                <span className="fw-normal">{selectedColor || "Select"}</span>
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-option ${
                      selectedColor === color ? "active" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {validSizes?.length > 0 && (
            <div className="size-selection mb-4">
              <h6 className="mb-2">
                Size:{" "}
                <span className="fw-normal">{selectedSize || "Select"}</span>
              </h6>
              <div className="size-options d-flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`btn btn-outline-dark ${
                      selectedSize === size ? "active" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="quantity-selector mb-4">
            <h6 className="mb-2">Quantity</h6>
            <div className="d-flex align-items-center">
              <Button
                variant="outline-secondary"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                className="form-control text-center mx-2"
                style={{ width: "60px" }}
              />
              <Button
                variant="outline-secondary"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                +
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="action-buttons d-grid gap-2">
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-success"
                size="lg"
                className="w-100 py-3 compare-btn"
                onClick={() =>
                  navigate(`/compare?query=${encodeURIComponent(product.name)}`)
                }
              >
                <i className="bi bi-search"></i> Compare Prices
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="h-100 add-to-cart-btn"
                onClick={() => dispatch(addToCart(product, quantity))}
              >
                <i className={`bi bi-cart${inCart ? "-fill" : ""}`}></i>
                <i className="bi bi-cart-fill fill-layer"></i>
              </Button>
              <Button
                variant="outline-primary"
                className="h-100 p-2 like-btn"
                aria-label={liked ? "Unlike product" : "Like product"}
                onClick={() => dispatch(toggleLocalLike(product._id))}
              >
                <i className={`bi bi-heart${liked ? "-fill" : ""}`}></i>
                <i className="bi bi-heart-fill fill-layer"></i>
              </Button>
            </div>
            <Button
              variant="outline-primary"
              size="lg"
              className="py-3 buy-now-btn"
              disabled={product.stock <= 0}
            >
              Buy Now
            </Button>
          </div>
        </Col>
      </Row>

      {/* Tabs */}
      <Row className="mb-5">
        <Col>
          <Tabs
            activeKey={activeTab}
            onSelect={setActiveTab}
            id="product-tabs"
            className="mb-4 custom-tabs mt-2 mt-md-5"
            justify
          >
            <Tab
              eventKey="description"
              title={
                <div className="d-flex align-items-center">
                  <i className="bi bi-file-text me-2 d-none d-md-inline"></i>
                  Details
                </div>
              }
            >
              <div className="p-3">
                <h4 className="mb-3">Product Details</h4>
                <p>
                  {product.detailsDescription ||
                    "No detailed description available."}
                </p>
              </div>
            </Tab>

            <Tab
              eventKey="reviews"
              title={
                <div className="d-flex align-items-center">
                  <i className="bi bi-star-fill me-2 d-none d-md-inline"></i>
                  Reviews
                </div>
              }
            >
              <div className="p-3">
                <div className="mb-3">
                  <ReviewForm
                    productId={product._id}
                    refetchProduct={refetchProduct}
                  />
                </div>
                <ReviewsList reviews={product.reviews || []} />
              </div>
            </Tab>

            {product.negotiationEnabled && (
              <Tab
                eventKey="negotiation"
                title={
                  <div className="d-flex align-items-center">
                    <i className="bi bi-chat-left-text me-2 d-none d-md-inline"></i>
                    Negotiation
                  </div>
                }
              >
                <Row className="mt-4">
                  <Col>
                    <NegotiationChat product={product} userId={userId} />
                  </Col>
                </Row>
              </Tab>
            )}
          </Tabs>
        </Col>
      </Row>
      <Row
        className=""
        style={{ justifyContent: "center", marginTop: "150px" }}
      >
        <Col>
          <ProductSlider
            title={"Similar Products"}
            products={similarProducts}
            autoplay={true}
          />
        </Col>
      </Row>
    </CustomContainer>
  );
}
