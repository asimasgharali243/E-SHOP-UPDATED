import React, { useState } from "react";
import {
  ChevronDown,
  Calendar,
  Box,
  CurrencyDollar,
  Person,
  Envelope,
  GeoAlt,
} from "react-bootstrap-icons";

const OrderCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Accordion Header */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">
                {order.orderNumber}
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {new Date(order.orderDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CurrencyDollar className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-900">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500">
                {order.customer.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 border-t border-gray-100">
          {/* Customer Details */}
          <div className="mb-6 mt-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Person className="w-4 h-4" />
              Customer Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Person className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900">
                  {order.customer.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Envelope className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900">{order.customer.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <GeoAlt className="w-3 h-3 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-gray-600">Address:</span>
                  <div className="text-gray-900 ml-2">
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Box className="w-4 h-4" />
              Order Items
            </h4>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900">
                    ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-gray-900">
                  ${order.shipping.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="text-gray-900">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-semibold text-gray-900">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Actions */}
          <div className="flex flex-col gap-2">
            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              View Full Details
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm">
                Update Status
              </button>
              <button className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm">
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
