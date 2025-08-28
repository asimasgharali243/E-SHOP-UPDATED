import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Form, Accordion, Button, Col } from "react-bootstrap";
import "./grid.scss";

const FilterSidebar = React.memo(
  ({ filterOptions, onApplyFilters, currentFilters }) => {
    const [activeKeys, setActiveKeys] = useState(new Set());
    const [localFilters, setLocalFilters] = useState(currentFilters);

    // Sync internal state with external props
    useEffect(() => {
      setLocalFilters(currentFilters);
    }, [currentFilters]);

    const handleToggle = useCallback((key) => {
      setActiveKeys((prev) => {
        const newSet = new Set(prev);
        newSet.has(key) ? newSet.delete(key) : newSet.add(key);
        return newSet;
      });
    }, []);

    const handleCheckboxChange = useCallback((e) => {
      const { name, value, checked } = e.target;
      setLocalFilters((prev) => {
        let newValues = prev[name]
          ? Array.isArray(prev[name])
            ? [...prev[name]]
            : [prev[name]]
          : [];
        if (checked) {
          newValues.push(value);
        } else {
          newValues = newValues.filter((v) => v !== value);
        }
        return { ...prev, [name]: newValues };
      });
    }, []);

    const handlePriceChange = useCallback((e) => {
      const { name, value } = e.target;
      setLocalFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }, []);

    const handleTextSearchChange = useCallback((e) => {
      const { name, value } = e.target;
      setLocalFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }, []);

    const handleSizeClick = useCallback((e) => {
      const size = e.target.innerText;
      setLocalFilters((prev) => {
        let sizes = prev.sizes || [];
        if (!Array.isArray(sizes)) sizes = [sizes];
        const newSizes = sizes.includes(size)
          ? sizes.filter((s) => s !== size)
          : [...sizes, size];
        return { ...prev, sizes: newSizes };
      });
    }, []);

    const handleColorClick = useCallback((e) => {
      const color = e.target.dataset.color;
      setLocalFilters((prev) => {
        let colors = prev.colors || [];
        if (!Array.isArray(colors)) colors = [colors];
        const newColors = colors.includes(color)
          ? colors.filter((c) => c !== color)
          : [...colors, color];
        return { ...prev, colors: newColors };
      });
    }, []);

    const handleClearFilters = useCallback(() => {
      setLocalFilters({});
      onApplyFilters({});
    }, [onApplyFilters]);

    const handleApplyClick = useCallback(() => {
      onApplyFilters(localFilters);
    }, [onApplyFilters, localFilters]);

    const priceRange = useMemo(
      () => filterOptions?.priceRange || { minPrice: 0, maxPrice: 1000 },
      [filterOptions]
    );

    // ✅ Brand filter with live search + highlight
    const renderBrands = useMemo(() => {
      if (!filterOptions?.brands) return null;

      const keyword = localFilters.brandSearch?.toLowerCase() || "";
      const filteredBrands = filterOptions.brands.filter((brand) =>
        brand.toLowerCase().includes(keyword)
      );

      if (filteredBrands.length === 0) {
        return <div className="text-muted small">No brands found</div>;
      }

      return filteredBrands.map((brand) => {
        // Highlight match in label
        const startIndex = brand.toLowerCase().indexOf(keyword);
        let label = brand;
        if (keyword && startIndex !== -1) {
          const before = brand.slice(0, startIndex);
          const match = brand.slice(startIndex, startIndex + keyword.length);
          const after = brand.slice(startIndex + keyword.length);
          label = (
            <>
              {before}
              <span style={{ fontWeight: "600", color: "var(--primary)" }}>
                {match}
              </span>
              {after}
            </>
          );
        }

        return (
          <Form.Check
            key={brand}
            type="checkbox"
            label={label}
            name="brand"
            value={brand}
            checked={localFilters.brand?.includes(brand) || false}
            onChange={handleCheckboxChange}
            aria-label={`${brand} brand filter`}
          />
        );
      });
    }, [
      filterOptions,
      localFilters.brand,
      localFilters.brandSearch,
      handleCheckboxChange,
    ]);

    const renderSizes = useMemo(() => {
      if (!filterOptions?.sizes) return null;
      return filterOptions.sizes.map((size) => (
        <Button
          key={size}
          size="sm"
          variant={
            localFilters.sizes?.includes(size) ? "primary" : "outline-secondary"
          }
          onClick={handleSizeClick}
          aria-label={`Filter by size ${size}`}
        >
          {size}
        </Button>
      ));
    }, [filterOptions, localFilters.sizes, handleSizeClick]);

    const renderColors = useMemo(() => {
      if (!filterOptions?.colors) return null;
      return filterOptions.colors.map((color) => (
        <div
          key={color}
          data-color={color}
          onClick={handleColorClick}
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: color,
            borderRadius: "50%",
            border: `2px solid ${
              localFilters.colors?.includes(color)
                ? "var(--primary-color)"
                : "#ddd"
            }`,
            cursor: "pointer",
          }}
          title={`Filter by ${color}`}
          aria-label={`${color} color filter`}
        ></div>
      ));
    }, [filterOptions, localFilters.colors, handleColorClick]);

    return (
      <aside className="filter-sidebar bg-white" aria-label="Sidebar Filters">
        <div
          className="d-flex justify-content-between align-items-center px-3 py-3"
          style={{
            fontSize: `clamp(14px, 1.2vw, 18px)`,
            fontWeight: 600,
            color: `var(--text1)`,
          }}
        >
          <span className="">Filters</span>
          <Button
            variant="link"
            size="sm"
            onClick={handleClearFilters}
            className="p-0"
          >
            Clear All
          </Button>
        </div>
        <Accordion as={Col} activeKey={[...activeKeys]} flush alwaysOpen>
          {/* Keyword Search */}
          <Accordion.Item eventKey="search">
            <Accordion.Header onClick={() => handleToggle("search")}>
              Search
            </Accordion.Header>
            <Accordion.Body>
              <Form.Control
                type="text"
                name="keyword"
                placeholder="Search products..."
                value={localFilters.keyword || ""}
                onChange={handleTextSearchChange}
                className="mb-2"
              />
            </Accordion.Body>
          </Accordion.Item>

          {/* ✅ Brand Filter */}
          <Accordion.Item eventKey="brand">
            <Accordion.Header onClick={() => handleToggle("brand")}>
              Brand
            </Accordion.Header>
            <Accordion.Body style={{ maxHeight: "250px", overflowY: "auto" }}>
              <Form.Control
                type="text"
                placeholder="Search brand..."
                className="mb-2"
                name="brandSearch"
                value={localFilters.brandSearch || ""}
                onChange={handleTextSearchChange}
              />
              {renderBrands}
            </Accordion.Body>
          </Accordion.Item>

          {/* Price Filter */}
          <Accordion.Item eventKey="price">
            <Accordion.Header onClick={() => handleToggle("price")}>
              Price
            </Accordion.Header>
            <Accordion.Body>
              <Form.Range
                min={priceRange.minPrice}
                max={priceRange.maxPrice}
                value={localFilters.maxPrice || priceRange.maxPrice}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    maxPrice: e.target.value,
                  }))
                }
                aria-label="Price range slider"
              />
              <div className="d-flex gap-2 mt-2">
                <Form.Control
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={localFilters.minPrice || ""}
                  onChange={handlePriceChange}
                  aria-label="Min price"
                />
                <Form.Control
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={localFilters.maxPrice || ""}
                  onChange={handlePriceChange}
                  aria-label="Max price"
                />
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {/* Size Filter */}
          <Accordion.Item eventKey="size">
            <Accordion.Header onClick={() => handleToggle("size")}>
              Size
            </Accordion.Header>
            <Accordion.Body
              className="d-flex flex-wrap gap-2"
              style={{ maxHeight: "250px", overflowY: "auto" }}
            >
              {renderSizes}
            </Accordion.Body>
          </Accordion.Item>

          {/* Color Filter */}
          <Accordion.Item eventKey="color">
            <Accordion.Header onClick={() => handleToggle("color")}>
              Color
            </Accordion.Header>
            <Accordion.Body className="d-flex flex-wrap gap-2">
              {renderColors}
            </Accordion.Body>
          </Accordion.Item>

          <div className="p-3">
            <Button
              variant="primary"
              className="w-100 filter-button"
              onClick={handleApplyClick}
            >
              Apply Filters
            </Button>
          </div>
        </Accordion>
      </aside>
    );
  }
);

export default FilterSidebar;
