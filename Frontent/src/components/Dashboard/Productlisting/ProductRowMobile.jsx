import React from "react";
import { Accordion, Dropdown } from "react-bootstrap";

const ProductRowMobile = ({ product, eventKey }) => {
  const getStockBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "in stock":
        return "in-stock";
      case "out of stock":
        return "out-of-stock";
      case "on backorder":
        return "low-stock";
      case "preorder":
        return "preorder";
      default:
        return "in-stock";
    }
  };

  return (
    <div className="d-flex align-items-center">
      <div className="flex-grow-1">
        <Accordion.Item eventKey={eventKey} className="product-accordion-item">
          <Accordion.Header>
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-img"
                />
                <div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-price">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <div className="product-details">
              <div className="detail-row">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{product.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">SKU:</span>
                <span className="detail-value">{product.sku}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{product.category}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Stock:</span>
                <span
                  className={`stock-badge ${getStockBadgeClass(
                    product.stockStatus
                  )}`}
                >
                  {product.stockCount > 0
                    ? `${product.stockCount} In Stock`
                    : product.stockStatus}
                </span>
              </div>
            </div>
            <div className="mt-3 d-flex justify-content-end"></div>
          </Accordion.Body>
        </Accordion.Item>
      </div>
      <div style={{ maxWidth: "50px" }}>
        <Dropdown align="end">
          <Dropdown.Toggle
            as="button"
            className="action-btn btn btn-link p-0 border-0"
            style={{ maxWidth: "50px" }}
            id={`dropdown-${product.id}`}
          >
            <i className="bi bi-three-dots-vertical"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/edit">Edit</Dropdown.Item>
            <Dropdown.Item href="#/duplicate">Duplicate</Dropdown.Item>
            <Dropdown.Item href="#/archive">Archive</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#/delete" className="text-danger">
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default ProductRowMobile;
