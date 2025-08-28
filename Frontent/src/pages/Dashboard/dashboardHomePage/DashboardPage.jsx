import React from "react";

import { Container, Row, Col, Card } from "react-bootstrap";
import "./dashboard.scss";

const DashboardPage = () => {
  return (
    <Container fluid className="dashboard-container p-3">
      <Row className="mb-4">
        <Col>
          <h1 className="dashboard-title text-center text-md-start">
            Dashboard Overview
          </h1>
        </Col>
      </Row>

      <Row className="stats-cards">
        {[
          {
            icon: <i className="bi bi-people fs-3"></i>,
            title: "Total Users",
            value: "1,234",
            trend: "+12% from last month",
            trendClass: "positive",
            className: "users",
          },
          {
            icon: <i className="bi bi-bag fs-3"></i>,
            title: "Total Orders",
            value: "856",
            trend: "+23% from last month",
            trendClass: "positive",
            className: "orders",
          },
          {
            icon: <i className="bi bi-currency-dollar fs-3"></i>,
            title: "Revenue",
            value: "$45,678",
            trend: "+18% from last month",
            trendClass: "positive",
            className: "revenue",
          },
          {
            icon: <i className="bi bi-graph-up fs-3"></i>,
            title: "Growth",
            value: "+28%",
            trend: "+5% from last month",
            trendClass: "positive",
            className: "growth",
          },
        ].map((stat, index) => (
          <Col key={index} xs={12} sm={6} lg={3} className="mb-4">
            <Card className="stat-card h-100">
              <Card.Body>
                <div className={`stat-icon ${stat.className}`}>{stat.icon}</div>
                <h3>{stat.title}</h3>
                <h2>{stat.value}</h2>
                <p className={`trend ${stat.trendClass}`}>{stat.trend}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        {/* Recent Orders */}
        <Col xs={12} lg={8} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Recent Orders</Card.Title>
              <div className="table-responsive">
                <table className="table">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: "#12345",
                        customer: "John Doe",
                        product: "iPhone 13",
                        amount: "$999",
                        status: "Completed",
                        badge: "success",
                      },
                      {
                        id: "#12346",
                        customer: "Jane Smith",
                        product: "MacBook Pro",
                        amount: "$1999",
                        status: "Pending",
                        badge: "warning",
                      },
                      {
                        id: "#12347",
                        customer: "Bob Johnson",
                        product: "AirPods Pro",
                        amount: "$249",
                        status: "Processing",
                        badge: "info",
                      },
                    ].map((order, index) => (
                      <tr key={index}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.product}</td>
                        <td>{order.amount}</td>
                        <td>
                          <span className={`badge bg-${order.badge}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Top Products */}
        <Col xs={12} lg={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Top Products</Card.Title>
              <div className="product-list">
                {[
                  { name: "iPhone 13", sales: 234, percent: 85 },
                  { name: "MacBook Pro", sales: 186, percent: 70 },
                  { name: "AirPods Pro", sales: 142, percent: 55 },
                ].map((product, index) => (
                  <div className="product-item mb-3" key={index}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <h5 className="mb-0">{product.name}</h5>
                        <small className="text-muted">
                          {product.sales} sales
                        </small>
                      </div>
                      <span>{product.percent}%</span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${product.percent}%` }}
                        aria-valuenow={product.percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
