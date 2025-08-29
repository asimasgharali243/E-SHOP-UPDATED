import React from "react";
import {
  Table,
  Form,
  Dropdown,
  Pagination,
  Row,
  Col,
  Accordion,
} from "react-bootstrap";
import ProductRow from "./ProductRow";
import ProductRowMobile from "./ProductRowMobile";

const ProductTable = ({
  products,
  onSort,
  sortField,
  sortDirection,
  currentPage,
  totalPages,
  rowsPerPage,
  totalItems,
  onPageChange,
  onRowsPerPageChange,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  onDeleteProduct,
}) => {
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  const renderPagination = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => onPageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      pages.push(
        <Pagination.Item
          key={1}
          active={1 === currentPage}
          onClick={() => onPageChange(1)}
        >
          1
        </Pagination.Item>
      );

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage > 3) {
        pages.push(<Pagination.Ellipsis key="ellipsis-start" />);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => onPageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(<Pagination.Ellipsis key="ellipsis-end" />);
      }

      pages.push(
        <Pagination.Item
          key={totalPages}
          active={totalPages === currentPage}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return (
      <Pagination>
        <Pagination.Prev
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
        {pages}
        <Pagination.Next
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  const allSelected =
    products.length > 0 &&
    products.every((product) => selectedProducts.has(product._id));

  return (
    <div className="bg-white rounded shadow-sm">
      {/* Desktop View */}
      <div className="d-none d-md-block">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead>
              <tr>
                <th width="40">
                  <Form.Check
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                  />
                </th>
                <th className="header-sort" onClick={() => onSort("name")}>
                  Product {renderSortIcon("name")}
                </th>
                <th className="header-sort" onClick={() => onSort("category")}>
                  Category {renderSortIcon("category")}
                </th>
                <th className="header-sort" onClick={() => onSort("stock")}>
                  Stock {renderSortIcon("stock")}
                </th>
                <th className="header-sort" onClick={() => onSort("price")}>
                  Price {renderSortIcon("price")}
                </th>
                <th width="40"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <ProductRow
                  key={product._id}
                  product={product}
                  isSelected={selectedProducts.has(product._id)}
                  onSelect={onSelectProduct}
                  onDelete={onDeleteProduct}
                />
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="d-md-none">
        <Accordion>
          {products.map((product, index) => (
            <ProductRowMobile
              key={product._id}
              product={product}
              eventKey={index.toString()}
              isSelected={selectedProducts.has(product._id)}
              onSelect={onSelectProduct}
              onDelete={onDeleteProduct}
            />
          ))}
        </Accordion>
      </div>

      <Row className="p-3 align-items-center">
        <Col xs={12} md="auto" className="mb-3 mb-md-0">
          {renderPagination()}
        </Col>
        <Col
          xs={12}
          md="auto"
          className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start"
        >
          <span>
            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems}
          </span>
          <span>|</span>
          <span className="d-flex align-items-center">
            Rows per page:
            <Form.Select
              size="sm"
              className="ms-2"
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              style={{ width: "70px" }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </Form.Select>
          </span>
        </Col>
      </Row>
    </div>
  );
};

export default ProductTable;
