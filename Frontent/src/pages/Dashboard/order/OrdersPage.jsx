import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  Box,
  Calendar,
  CurrencyDollar,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";
import OrderCard from "./OrderCard";
import OrdersStats from "./OrdersStats";
import mockOrders from "../order/mockdata/MockOrders";
const OrdersPage = () => {
  const [orders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const ordersPerPage = 10;

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
          break;
        case "total":
          comparison = a.total - b.total;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedOrders.length / ordersPerPage);
  const paginatedOrders = filteredAndSortedOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Stats */}
      <OrdersStats orders={orders} />

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders, customers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Export Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Sort Options - Desktop */}
        <div className="hidden lg:flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <button
            onClick={() => handleSort("date")}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm transition-colors ${
              sortBy === "date"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Calendar className="w-3 h-3" />
            Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("total")}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm transition-colors ${
              sortBy === "total"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <CurrencyDollar className="w-3 h-3" />
            Total {sortBy === "total" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("status")}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm transition-colors ${
              sortBy === "status"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Box className="w-3 h-3" />
            Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {paginatedOrders.length} of {filteredAndSortedOrders.length}{" "}
        orders
        {searchTerm && ` matching "${searchTerm}"`}
        {statusFilter !== "all" && ` with status "${statusFilter}"`}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Order
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Customer
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Date
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Items
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Total
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">#{order.id}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">
                        {order.customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                          ? "bg-purple-100 text-purple-800"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-900">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-900">
                      ${order.total.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Accordion */}
      <div className="lg:hidden space-y-4">
        {paginatedOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Results Info */}
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * ordersPerPage + 1} to{" "}
              {Math.min(
                currentPage * ordersPerPage,
                filteredAndSortedOrders.length
              )}{" "}
              of {filteredAndSortedOrders.length} results
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNum, index) => (
                  <React.Fragment key={index}>
                    {pageNum === "..." ? (
                      <span className="px-3 py-2 text-sm text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Page Info */}
          <div className="sm:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredAndSortedOrders.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Box className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "No orders have been placed yet"}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
