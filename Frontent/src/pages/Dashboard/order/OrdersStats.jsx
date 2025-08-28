import React from "react";
import { ArrowUp, Box, Clock, CheckCircle } from "react-bootstrap-icons";

const OrdersStats = ({ orders }) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: ArrowUp,
      color: "text-green-600",
      bg: "bg-green-50",
      change: "+12.5%",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: Box,
      color: "text-blue-600",
      bg: "bg-blue-50",
      change: "+8.2%",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      change: "+3.1%",
    },
    {
      title: "Delivered Orders",
      value: deliveredOrders.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      change: "+15.3%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
              <p className="text-sm text-green-600 font-medium mt-1">
                {stat.change} from last month
              </p>
            </div>
            <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersStats;
