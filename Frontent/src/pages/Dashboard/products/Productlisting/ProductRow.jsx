import React from "react";
import { Form, Dropdown } from "react-bootstrap";

const ProductRow = ({ product, isSelected, onSelect, onDelete }) => {
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
    <tr>
      <td>
        <Form.Check
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(product._id, e.target.checked)}
        />
      </td>
      <td>
        <div className="d-flex align-items-center gap-3">
          <img
            src={product.featureImages?.[0]?.url || "/placeholder-product.jpg"}
            alt={product.name}
            className="product-img"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
          <div>
            <div className="product-name">{product.name}</div>
            <div className="product-id">
              ID: {product._id} {product.sku && `| SKU: ${product.sku}`}
            </div>
          </div>
        </div>
      </td>
      <td>{product.category}</td>
      <td>
        <span className={`stock-badge ${getStockBadgeClass(product.stock)}`}>
          {getStockText(product.stock)}
        </span>
      </td>
      <td>${product.price.toFixed(2)}</td>
      <td>
        <Dropdown align="end">
          <Dropdown.Toggle
            as="button"
            className="action-btn btn btn-link p-0 border-0"
          >
            <i className="bi bi-three-dots-vertical"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href={`/dashboard/products/details/${product._id}`}>
              Edit
            </Dropdown.Item>

            <Dropdown.Divider />
            <Dropdown.Item className="text-danger" onClick={handleDelete}>
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
};

export default ProductRow;
