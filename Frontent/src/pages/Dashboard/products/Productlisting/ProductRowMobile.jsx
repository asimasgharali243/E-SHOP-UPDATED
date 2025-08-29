import React from "react";
import { Accordion, Dropdown, Form, Button } from "react-bootstrap";

const ProductRowMobile = ({
  product,
  eventKey,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const getStockBadgeClass = (stock) => {
    if (stock === 0) return "out-of-stock";
    if (stock < 10) return "low-stock";
    return "in-stock";
  };

  const getStockText = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 10) return `${stock} Low Stock`;
    return `${stock} In Stock`;
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      onDelete(product._id);
    }
  };

  return (
    <div className="d-flex align-items-center">
      <div className="flex-grow-1">
        <Accordion.Item eventKey={eventKey} className="product-accordion-item">
          <Accordion.Header>
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="d-flex align-items-center gap-3">
                <Form.Check
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => onSelect(product._id, e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
                <img
                  src={
                    product.featureImages?.[0]?.url ||
                    "/placeholder-product.jpg"
                  }
                  alt={product.name}
                  className="product-img"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
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
                <span className="detail-value">{product._id}</span>
              </div>
              {product.sku && (
                <div className="detail-row">
                  <span className="detail-label">SKU:</span>
                  <span className="detail-value">{product.sku}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{product.category}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Stock:</span>
                <span
                  className={`stock-badge ${getStockBadgeClass(product.stock)}`}
                >
                  {getStockText(product.stock)}
                </span>
              </div>
            </div>
            <div className="mt-3 d-flex justify-content-end">
              <Dropdown align="end">
                <Dropdown.Toggle
                  as={Button}
                  variant="outline-secondary"
                  size="sm"
                >
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    href={`/dashboard/products/details/${product._id}`}
                  >
                    Edit
                  </Dropdown.Item>

                  <Dropdown.Divider />
                  <Dropdown.Item className="text-danger" onClick={handleDelete}>
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </div>
    </div>
  );
};

export default ProductRowMobile;
