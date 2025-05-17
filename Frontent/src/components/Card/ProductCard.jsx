// ProductCard.js
import React from 'react';
import { Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './ProductCard.scss';

const ProductCard = ({ product }) => {
  return (
    <Card className="product-card shadow-sm" data-product-id={product.id}>
      <div className="position-relative overflow-hidden">
        <Card.Img
          variant="top"
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="product-image"
        />
        {(product.discount || product.badge) && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-2">
            {`${product.discount ? `${product.discount}% OFF` : `${product.badge}`}`}
          </span>
        )}

        <div className="action-icons position-absolute top-0 end-0 d-flex flex-column m-2 gap-2">
          <OverlayTrigger placement="left" overlay={<Tooltip>Quick View</Tooltip>}>
            <Button variant="light" size="sm" data-role="quick-view" aria-label="Quick View">
              <i className="bi bi-eye"></i>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="left" overlay={<Tooltip>Add to Cart</Tooltip>}>
            <Button variant="light" size="sm" data-role="add-to-cart" aria-label="Add to Cart">
              <i className="bi bi-cart-plus"></i>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="left" overlay={<Tooltip>Wishlist</Tooltip>}>
            <Button variant="light" size="sm" data-role="add-to-wishlist" aria-label="Add to Wishlist">
              <i className="bi bi-heart"></i>
            </Button>
          </OverlayTrigger>
        </div>
      </div>
      <Card.Body className="text-center">
        <Card.Title className="fs-6">{product.name}</Card.Title>
        <Card.Text className="fw-bold text-success">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
