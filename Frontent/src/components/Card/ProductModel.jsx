import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Modal, Row, Col, Image, Button, Badge } from "react-bootstrap";
import Rating from "react-rating";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { addToCart } from "../../redux/features/Cart/CartAction";
import { toggleLocalLike } from "../../redux/features/products/LikeProduct";

import "./ProductModel.scss";

const ProductModel = ({ show, onClose, product }) => {
  const dispatch = useDispatch();

  // Local state for image gallery
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedSrc, setDisplayedSrc] = useState("");

  useEffect(() => {
    if (product?.featureImages?.length) {
      setDisplayedSrc(product.featureImages[0]?.url);
    }
  }, [product]);

  const discountedPrice = useMemo(() => {
    if (!product) return 0;
    return product.price * (1 - (product.discount || 0) / 100);
  }, [product]);

  // Redux selectors
  const likedProducts = useSelector(
    (state) => state.likes?.products || [],
    shallowEqual
  );
  const cartItems = useSelector(
    (state) => state.cart?.items || [],
    shallowEqual
  );

  const liked = likedProducts.includes(product?._id);
  const inCart = cartItems.some((item) => item._id === product?._id);

  // States for selections
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity) => {
    const clampedQuantity = Math.max(
      1,
      Math.min(product?.stock || 1, newQuantity)
    );
    setQuantity(clampedQuantity);
  };

  if (!product) return null;

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="xl"
      backdrop="static" // Prevent close on backdrop click
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-3">
          {/* Images */}
          <Col md={6} className="d-flex flex-column align-items-center">
            <div className="main-image-wrapper position-relative">
              <img
                src={displayedSrc}
                alt={product.name}
                className="img-fluid rounded shadow-sm"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            </div>
            <div className="d-flex gap-2 mt-2 flex-wrap justify-content-center">
              {product?.featureImages?.map((img, index) => (
                <Image
                  key={index}
                  src={img.url}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail rounded border ${
                    index === currentIndex ? "border-primary" : ""
                  }`}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setDisplayedSrc(img.url);
                    setCurrentIndex(index);
                  }}
                />
              ))}
            </div>
          </Col>

          {/* Details */}
          <Col md={6}>
            <div className="mb-2">
              <Rating
                initialRating={product.ratings || 0}
                readonly
                emptySymbol={<i className="bi bi-star text-warning"></i>}
                fullSymbol={<i className="bi bi-star-fill text-warning"></i>}
              />
              <span className="text-muted small ms-2">
                ({product.numOfReviews || 0} reviews)
              </span>
            </div>

            <div className="price-section mb-3">
              <span className="fs-3 fw-bold text-danger">
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

            <div className="mb-2">
              {product.stock > 0 ? (
                <span className="text-success">
                  <i className="bi bi-check-circle-fill me-1"></i>In Stock (
                  {product.stock})
                </span>
              ) : (
                <span className="text-danger">
                  <i className="bi bi-x-circle-fill me-1"></i>Out of Stock
                </span>
              )}
            </div>

            <p className="text-muted">{product.shortDescription}</p>
            <hr />

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-3">
                <h6>Color: {selectedColor || "Select"}</h6>
                <div className="d-flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`color-option ${
                        selectedColor === color ? "active" : ""
                      }`}
                      style={{
                        backgroundColor: color,
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        border: "1px solid #ccc",
                      }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-3">
                <h6>Size: {selectedSize || "Select"}</h6>
                <div className="d-flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "dark" : "outline-dark"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-3">
              <h6>Quantity</h6>
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
                  value={quantity}
                  min={1}
                  max={product.stock}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 1)
                  }
                  className="form-control text-center mx-2"
                  style={{ width: "60px", borderRadius: "5px" }}
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
            <div className="d-flex gap-2">
              <Button
                variant="secondary"
                className="add-to-cart-btn-model d-flex align-items-center justify-content-center"
                onClick={() => dispatch(addToCart(product, quantity))}
              >
                <i className={` bi bi-cart${inCart ? "-fill" : ""}`}></i> Add to
                Cart
              </Button>
              <Button
                variant="outline-primary"
                className="like-button-model d-flex align-items-center justify-content-center"
                // style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                onClick={() => dispatch(toggleLocalLike(product._id))}
              >
                <i className={`bi bi-heart${liked ? "-fill" : ""}`}></i>
              </Button>
              <Button
                variant="success"
                style={{
                  color: "white",
                  backgroundColor: `var(--primary)`,
                  borderColor: `var(--primary)`,
                  borderRadius: "3px",
                }}
              >
                Buy Now
              </Button>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModel;
