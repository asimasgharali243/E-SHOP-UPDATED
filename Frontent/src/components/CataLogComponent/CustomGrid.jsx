import { Row, Button, Dropdown, ButtonGroup, Spinner } from "react-bootstrap";
import { useState, useMemo, useCallback } from "react";
import ProductCard from "../Card/ProductCard";
import "./Grid.scss";

export default function CustomGrid({
  productData,
  handleToggleFilter,
  isLoading,
  onSortChange,
  currentSort,
}) {
  const [gridMode, setGridMode] = useState("wide"); // 'wide' or 'compact'
  console.log(productData);
  const toggleGridMode = useCallback(() => {
    setGridMode((prev) => (prev === "wide" ? "compact" : "wide"));
  }, []);

  const sortOptions = useMemo(
    () => [
      "newest",
      "price-low",
      "price-high",
      "rating",
      "discount",
      "name-asc",
      "popular",
    ],
    []
  );

  const getSortLabel = useCallback((option) => {
    switch (option) {
      case "price-low":
        return "Price: Low to High";
      case "price-high":
        return "Price: High to Low";
      case "name-asc":
        return "Name (A-Z)";
      case "newest":
        return "Newest";
      case "popular":
        return "Popular";
      case "rating":
        return "Rating";
      case "discount":
        return "Discount";
      default:
        return option;
    }
  }, []);

  return (
    <>
      {/* Control Bar */}
      <Row className="justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2 w-100 justify-content-between">
          {/* Mobile Filter */}
          <Button
            variant="outline-primary"
            size="sm"
            className="d-lg-none"
            onClick={handleToggleFilter}
            aria-label="Toggle Filter"
          >
            <i className="bi bi-funnel-fill"></i>
          </Button>

          {/* Grid Switcher (Only Two Buttons) */}
          <ButtonGroup>
            <Button
              variant={gridMode === "wide" ? "primary" : "light"}
              size="sm"
              onClick={() => setGridMode("wide")}
              title="More items per row"
              aria-label="Wide View"
            >
              <i className="bi bi-grid-3x3-gap-fill" />
            </Button>
            <Button
              variant={gridMode === "compact" ? "primary" : "light"}
              size="sm"
              onClick={() => setGridMode("compact")}
              title="Fewer items per row"
              aria-label="Compact View"
            >
              <i className="bi bi-grid" />
            </Button>
          </ButtonGroup>

          {/* Sort Dropdown */}
          <Dropdown className="ms-auto">
            <Dropdown.Toggle
              as={Button}
              variant="light"
              size="sm"
              id="sort-dropdown"
              aria-label="Sort Products"
            >
              <i className="bi bi-filter" style={{ fontSize: "22px" }}></i>
              <span className="ms-2">
                {currentSort ? `Sort by: ${getSortLabel(currentSort)}` : "Sort"}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {sortOptions.map((option) => (
                <Dropdown.Item
                  key={option}
                  onClick={() => onSortChange(option)}
                  active={currentSort === option}
                >
                  {getSortLabel(option)}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Row>

      {/* Product Grid */}
      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <section
          className={`catalog-grid catalog-grid--${gridMode} `}
          aria-label="Product List"
        >
          {productData && productData.length > 0 ? (
            productData.map((product) => (
              <div key={product._id} className="item">
                <ProductCard product={product} layoutType={gridMode} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center my-5">
              <h4>No products found.</h4>
            </div>
          )}
        </section>
      )}
    </>
  );
}
