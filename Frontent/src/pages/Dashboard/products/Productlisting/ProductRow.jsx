import React from "react";
import { Form, Dropdown } from "react-bootstrap";

const ProductRow = ({ product }) => {
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
    <tr>
      <td>
        <Form.Check type="checkbox" id={`product-${product.id}`} />
      </td>
      <td>
        <div className="d-flex align-items-center gap-3">
          <img src={product.image} alt={product.name} className="product-img" />
          <div>
            <div className="product-name">{product.name}</div>
            <div className="product-id">
              ID: {product.id} | SKU: {product.sku}
            </div>
          </div>
        </div>
      </td>
      <td>{product.category}</td>
      <td>
        <span
          className={`stock-badge ${getStockBadgeClass(product.stockStatus)}`}
        >
          {product.stockCount > 0
            ? `${product.stockCount} In Stock`
            : product.stockStatus}
        </span>
      </td>
      <td>${product.price.toFixed(2)}</td>
      <td>
        <Dropdown align="end">
          <Dropdown.Toggle
            as="button"
            className="action-btn btn btn-link p-0 border-0"
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
      </td>
    </tr>
  );
};

export default ProductRow;
