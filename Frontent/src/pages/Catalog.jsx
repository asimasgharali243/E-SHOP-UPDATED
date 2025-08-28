import React, { useState, useEffect } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import FilterSidebar from "../components/CataLogComponent/FilterSidebar";
import CustomContainer from "../components/SubComponent/CustomContainer";
import CustomGrid from "../components/CataLogComponent/CustomGrid";
import {
  useSearchProductsQuery,
  useGetFilterOptionsQuery,
} from "../redux/api/productsApi/ProductApi";
import { toast } from "react-toastify";

const CatalogPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState("newest");

  const {
    data: productData,
    isLoading,
    isFetching,
    error,
  } = useSearchProductsQuery({ ...filters, sort: sortOption });

  const {
    data: filterOptions,
    error: filterError,
    isLoading: filtersLoading,
  } = useGetFilterOptionsQuery();

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch products. Please try again.");
    }
  }, [error]);

  useEffect(() => {
    if (filterError) {
      toast.error("Failed to load filter options.");
    }
  }, [filterError]);

  const handleToggleFilter = () => setShowFilter((prev) => !prev);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    // Hide the offcanvas on mobile after applying filters
    setShowFilter(false);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  return (
    <CustomContainer>
      <div className="my-3" style={{ padding: "0px 12px" }}>
        <h5 className="" style={{ fontSize: `clamp(14px, 1.2vw,18px)` }}>
          {isLoading || isFetching
            ? "Loading..."
            : `${productData?.pagination?.totalCount || 0} Results for Search`}
        </h5>
      </div>
      <div className="d-flex justify-content-between align-items-start">
        {/* Sidebar */}
        <div
          className="d-none d-lg-block"
          style={{ minWidth: "270px", maxWidth: "270px", padding: "0px 12px" }}
        >
          {filtersLoading ? (
            <div>Loading filters...</div>
          ) : (
            <FilterSidebar
              filterOptions={filterOptions?.filters}
              onApplyFilters={handleApplyFilters}
              currentFilters={filters}
            />
          )}
        </div>

        {/* Main Content */}
        <div className="w-100" style={{ padding: "0px 12px" }}>
          <CustomGrid
            productData={productData?.products}
            handleToggleFilter={handleToggleFilter}
            isLoading={isLoading || isFetching}
            onSortChange={handleSortChange}
            currentSort={sortOption}
          />
        </div>
      </div>

      {/* Mobile Offcanvas Filter */}
      <Offcanvas
        show={showFilter}
        onHide={handleToggleFilter}
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {filtersLoading ? (
            <div>Loading filters...</div>
          ) : (
            <FilterSidebar
              filterOptions={filterOptions?.filters}
              onApplyFilters={handleApplyFilters}
              currentFilters={filters}
            />
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </CustomContainer>
  );
};

export default CatalogPage;
