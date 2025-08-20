import React, { useCallback, useMemo } from "react";
import CustomContainer from "../../components/SubComponent/CustomContainer";
import { useParams } from "react-router-dom";
import { useGetSingleProductQuery } from "../../redux/api/productsApi/ProductApi";
import ReviewForm from "./ReviewForm";
import NegotiationChat from "./NegotiationChatBoard";
import ReviewsList from "./ReviewsList";
import {
  Col,
  Row,
  Spinner,
  Image,
  Button,
  Alert,
  Badge,
  Tabs,
  Form,
  Tab,
  InputGroup,
} from "react-bootstrap";
import Rating from "react-rating";
import "./SingleProduct.scss";
import { useSelector } from "react-redux";
import { useId } from "react";

export default function SingleProductPage() {
  const { id } = useParams();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchProduct,
  } = useGetSingleProductQuery(id);
  const product = data?.product;
  const userId = useSelector((state) => state.authUser.user);
  console.log(userId);
  // State management
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [displayedSrc, setDisplayedSrc] = React.useState("");
  const [overlaySrc, setOverlaySrc] = React.useState(null);
  const [overlayVisible, setOverlayVisible] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState("");
  const [selectedSize, setSelectedSize] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState("description");
  const [message, setMessage] = React.useState("");
  const [chatMessages, setChatMessages] = React.useState([]);
  const [showReviewModal, setShowReviewModal] = React.useState(false);

  // Memoized calculations
  const discountedPrice = useMemo(() => {
    if (!product) return 0;
    return product.price * (1 - (product.discount || 0) / 100);
  }, [product]);

  const currentImage = useMemo(() => {
    if (!product?.featureImages?.length) return "";
    return product.featureImages[currentIndex]?.url || "";
  }, [product, currentIndex]);

  // Image handling functions
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

  // Initialize displayed image
  React.useEffect(() => {
    if (product?.featureImages?.length && !displayedSrc) {
      setDisplayedSrc(product.featureImages[0]?.url);
    }
  }, [product?.featureImages, displayedSrc]);

  const handleQuantityChange = useCallback(
    (newQuantity) => {
      setQuantity(Math.max(1, Math.min(product?.stock || 1, newQuantity)));
    },
    [product?.stock]
  );

  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: "buyer",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setMessage("");

    setTimeout(() => {
      const reply = {
        id: chatMessages.length + 2,
        sender: "seller",
        text: `I can do $${(product.price * 0.9).toFixed(
          2
        )}. That's my best offer.`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, reply]);
    }, 1000);
  }, [message, chatMessages.length, product?.price]);

  // Initialize chat if negotiation is enabled
  React.useEffect(() => {
    if (product?.negotiationEnabled) {
      setChatMessages([
        {
          id: 1,
          sender: "seller",
          text: "Hello! Welcome to price negotiation. What's your offer?",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  }, [product?.negotiationEnabled]);

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
        {/* Product Images Section */}
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
                  />
                </div>
              ))}
            </div>
          </Col>
        </Col>

        {/* Product Details Section */}
        <Col lg={4} md={5} sm={12} className="product-details p-3 p-md-0">
          <div className="position-relative">
            <h1 className="product-title mb-2">{product.name}</h1>
          </div>

          <div className="d-flex align-items-center mb-2 ">
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
              {product.ratings?.toFixed(1) || "N/A"} (
              {product.numOfReviews || 0} reviews)
            </span>
          </div>

          <div className="price-section mb-3">
            <span className="product-price text-danger fs-2  fw-bold">
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
                <i className="bi bi-check-circle-fill me-1"></i>
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-danger">
                <i className="bi bi-x-circle-fill me-1"></i>
                Out of Stock
              </span>
            )}
          </div>

          <p className="description text-muted mb-3">
            {product.shortDescription}
          </p>
          <hr />

          {/* Color and Size Selection */}
          {product.colors?.length > 0 && (
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
                    style={{ backgroundColor: `${color}` }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
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

          <div className="quantity-selector mb-4">
            <h6 className="mb-2">Quantity</h6>
            <div className="d-flex align-items-center">
              <Button
                variant="outline-secondary"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
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
                aria-label="Product quantity"
              />
              <Button
                variant="outline-secondary"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
              >
                +
              </Button>
            </div>
          </div>

          <div className="action-buttons d-grid gap-2">
            <div className="d-flex align-items-center gap-2">
              {/* Add to Cart Button */}
              <Button
                variant="secondary"
                size="lg"
                className="w-100 add-to-cart-btn"
              >
                Add to Cart
              </Button>

              {/* Like Icon */}
              <Button
                variant="outline-primary"
                className="p-2 d-flex align-items-center justify-content-center like-btn"
                aria-label="Like product"
              >
                <i class="bi bi-heart"></i>
                <i class="bi bi-heart-fill fill-layer"></i>
              </Button>
            </div>

            {/* Buy Now */}
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

      {/* Product Tabs Section */}
      <Row className="mb-5">
        <Col>
          <Tabs
            activeKey={activeTab}
            onSelect={setActiveTab}
            id="product-tabs"
            className="mb-4 custom-tabs mt-2 mt-md-5"
            justify
          >
            {/* Details Tab */}
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

            {/* Reviews Tab */}
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="mb-1">Customer Reviews</h4>
                    <div className="d-flex align-items-center mb-1">
                      <Rating
                        initialRating={product.ratings || 0}
                        readonly
                        emptySymbol={
                          <i className="bi bi-star text-warning"></i>
                        }
                        fullSymbol={
                          <i className="bi bi-star-fill text-warning"></i>
                        }
                        fractions={2}
                      />
                      <span className="ms-2">
                        {product.ratings?.toFixed(1) || "0"} out of 5
                      </span>
                    </div>
                    <p className="text-muted small mb-0">
                      Based on {product.numOfReviews || 0} reviews
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <ReviewForm
                    productId={product._id}
                    refetchProduct={refetchProduct}
                  />
                </div>

                <div>
                  <ReviewsList reviews={product.reviews} />
                </div>
              </div>
            </Tab>

            {/* Negotiation Tab */}
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
    </CustomContainer>
  );
}
