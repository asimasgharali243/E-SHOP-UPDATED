import React, { useState } from "react";
import { Card } from "react-bootstrap";
import "./ProductCard.scss";
import { useDispatch, useSelector } from "react-redux";
import { toggleLocalLike } from "../../redux/features/products/LikeProduct";
import { addToCart } from "../../redux/features/Cart/CartAction";
import { useNavigate } from "react-router-dom";
import ProductModel from "./ProductModel";

const ProductCard = ({ product }) => {
  const {
    _id,
    name,
    price,
    discount,
    ratings,
    numOfReviews,
    shortDescription,
    featureImages,
  } = product;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quickViewed, setQuickViewed] = useState(false);

  // Get liked products from Redux store with proper fallback
  const { likedProducts = [] } = useSelector((state) => state.Likes || {});
  const liked = likedProducts.includes(_id);
  const inCart = useSelector((state) =>
    state.cart.items.some((item) => item._id === _id)
  );
  const image = featureImages?.[0]?.thumbnailUrl || "/placeholder.jpg";
  const badgeContent = discount ? `${discount}% OFF` : null;

  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`bi bi-star${i + 1 <= ratings ? "-fill" : ""}`}
        style={{
          cursor: "pointer",
          color: i + 1 <= ratings ? "#ffc107" : "#ccc",
        }}
      />
    ));
  };

  // 🔹 Event delegation
  const handleContainerClick = (e) => {
    const action = e.target.closest("[data-action]")?.dataset.action;

    if (action) {
      e.stopPropagation();

      switch (action) {
        case "quick-view":
          setQuickViewed((prev) => !prev);
          break;
        case "like":
          // Dispatch to Redux only - no local state needed
          if (_id) dispatch(toggleLocalLike(_id));
          break;
        case "add-to-cart":
          dispatch(addToCart(product, 1));
          break;
        default:
          break;
      }
      return;
    }
    navigate(`/product/${_id}`);
  };

  return (
    <article
      className="product-card shadow-sm"
      aria-label={`Product: ${name}`}
      onClick={handleContainerClick}
      style={{ backgroundColor: "var(--white)" }}
    >
      <div className="position-relative overflow-hidden">
        <Card.Img
          variant="top"
          src={image}
          onError={(e) => {
            e.target.src = "/placeholder.jpg";
            e.target.onerror = null;
          }}
          alt={`Image of ${name}`}
          loading="lazy"
          className="product-image"
        />

        {badgeContent && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-2">
            {badgeContent}
          </span>
        )}

        {/* 🔹 Delegated buttons */}
        <div className="action-icons-container">
          <button
            type="button"
            className={`btn btn-light btn-sm action-btn ${
              quickViewed ? "quick-viewed" : ""
            }`}
            data-action="quick-view"
            aria-label="Quick view"
          >
            <i className={`bi bi-eye${quickViewed ? "-fill" : ""}`}></i>
          </button>

          <button
            type="button"
            className={`btn btn-light btn-sm action-btn ${
              liked ? "liked" : ""
            }`}
            data-action="like"
            aria-label={liked ? "Unlike product" : "Like product"}
          >
            <i className={`bi bi-heart${liked ? "-fill" : ""}`}></i>
          </button>

          <button
            type="button"
            className={`btn btn-light btn-sm action-btn ${
              inCart ? "in-cart" : ""
            }`}
            data-action="add-to-cart"
            aria-label="Add to cart"
          >
            <i className={`bi bi-cart-plus${inCart ? "-fill" : ""}`}></i>
          </button>
        </div>
      </div>

      <Card.Body className="px-2 py-2">
        <div
          className="card-description-wrapper"
          style={{ fontSize: "clamp(12px, 1.2vw, 14px)" }}
        >
          {shortDescription ? (
            <p className="short-description mb-1">{shortDescription}</p>
          ) : (
            <p className="name-description mb-1">
              {name}
              {featureImages?.[0]?.description && (
                <span className="details-description">
                  {featureImages[0].description}
                </span>
              )}
            </p>
          )}
        </div>

        <p className="fw-bold text-success mb-1">${price}</p>

        <div className="star-rating d-flex align-items-center gap-2">
          {renderStars()} <small>({numOfReviews})</small>
        </div>
      </Card.Body>

      {quickViewed && (
        <ProductModel
          show={quickViewed}
          handleClose={() => setQuickViewed(false)}
          product={product}
        />
      )}
    </article>
  );
};

export default ProductCard;
