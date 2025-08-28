import React, { useState, useEffect } from "react";
import { Button, Offcanvas, Pagination } from "react-bootstrap";
import FilterSidebar from "../../components/CataLogComponent/FilterSidebar";
import CustomContainer from "../../components/SubComponent/CustomContainer";
import CustomGrid from "../../components/CataLogComponent/CustomGrid";
import {
  useSearchProductsQuery,
  useGetFilterOptionsQuery,
} from "../../redux/api/productsApi/ProductApi";
import { toast } from "react-toastify";

const CatalogPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: productData,
    isLoading,
    isFetching,
    error,
  } = useSearchProductsQuery({
    ...filters,
    sort: sortOption,
    page: currentPage,
  });

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

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOption]);

  const handleToggleFilter = () => setShowFilter((prev) => !prev);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    // Hide the offcanvas on mobile after applying filters
    setShowFilter(false);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Pagination functions
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    if (!productData?.pagination) return null;

    const { totalPages, currentPage } = productData.pagination;
    const items = [];

    // Always show first page
    items.push(
      <Pagination.Item
        key={1}
        active={1 === currentPage}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );

    // Add ellipsis if needed
    if (currentPage > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis-start" />);
    }

    // Add current page and surrounding pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis-end" />);
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <Pagination.Item
          key={totalPages}
          active={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
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

          {/* Pagination */}
          {productData?.pagination && productData.pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                {renderPaginationItems()}
                <Pagination.Next
                  disabled={currentPage === productData.pagination.totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </Pagination>
            </div>
          )}
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
