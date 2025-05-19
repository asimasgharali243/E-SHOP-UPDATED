import React from "react";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./ProductCard.scss";

const ProductCard = React.memo(({ product }) => {
  const { id, image, name, price, discount, badge, rating, liked } = product;

  // Prepare badge text
  const badgeContent = discount ? `${discount}% OFF` : badge;

  // Render stars for rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi bi-star${i <= rating ? "-fill" : ""}`}
          data-action="rate"
          data-value={i}
          data-product-id={id}
          role="button"
          tabIndex={0}
          aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
          style={{ cursor: "pointer", color: i <= rating ? "#ffc107" : "#ccc" }}
        />
      );
    }
    return stars;
  };

  return (
    <article
      className="product-card shadow-sm"
      data-product-id={id}
      aria-label={`Product: ${name}`}
    style={{backgroundColor:`var(--white)`}}
    >
      <div className="position-relative overflow-hidden">
        <Card.Img
          variant="top"
          src={image}
          onError={(e) => {e.target.src = "/placeholder.jpg"
e.target.onerror=null;            
          }}
          alt={`Image of ${name}`}
          loading="lazy"
          className="product-image"
          decoding="async"
          fetchpriority="low"
        />

        {(discount || badge) && (
          <span
            className="badge bg-danger position-absolute top-0 start-0 m-2"
            aria-label={badgeContent}
          >
            {badgeContent}
          </span>
        )}

        <div className="action-icons position-absolute top-0 end-0 d-flex flex-column m-2 gap-2">
          <button
            type="button"
            className="btn btn-light btn-sm"
            data-action="quick-view"
            aria-label={`Quick view of ${name}`}
            data-product-id={id}
          >
            <i className="bi bi-eye" aria-hidden="true"></i>
          </button>

          
          <button
            type="button"
            className={`btn btn-light btn-sm ${liked ? "liked" : ""}`}
            data-action="toggle-like"
            aria-label={
              liked ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`
            }
            data-product-id={id}
          >
            <i
              className={`bi bi-heart${liked ? "-fill" : ""}`}
              aria-hidden="true"
            ></i>
          </button>
        </div>
        <div className=" position-absolute bottom-0  d-flex flex-column m-2 gap-2"
        style={{right:'0'}}
        >
          <button
            type="button"
            className="btn btn-light btn-sm"
            data-action="add-to-cart"
            aria-label={`Add ${name} to cart`}
            data-product-id={id}
            aria-role="add to card button "
          >
            <i className="bi bi-cart-plus" aria-hidden="true"></i>
          </button>

        </div>
      </div>

      <Card.Body
        className="px-2 py-2"
        aria-label={`Product name: ${name}, Price: $${price}, Rating: ${rating} out of 5 stars`}
        style={{ fontSize: `clamp(12px, 1.2vw, 14px)` }}
      >
        <div className="body-desc"
        aria-label="Product description"
        >
        <h3
          style={{ fontSize: `clamp(12px, 1.2vw, 14px)` }}
          className="card-description mb-1"
          tabIndex="0"
        >
          {name}
        </h3>
        <p
          className="fw-bold text-success mb-2"
          aria-label={`Price: $${price}`}
          style={{fontSize:`clamp(12px, 1.2vw, 14px)`}}
        >
          ${price}
        </p>
        <div
          className="star-rating d-flex gap-2"
          aria-label={`Rating: ${rating} out of 5 stars`}
        >
          {renderStars()}
        </div>
        </div>


      </Card.Body>
    </article>
  );
});

export default ProductCard;
