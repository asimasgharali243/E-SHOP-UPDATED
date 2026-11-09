import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const ShippingPolicy = () => {
  return (
    <div>
      <div className="bg-dark text-white text-center py-5 mb-4 mt-4">
        <h1>Shipping Policy</h1>
        <p className="lead">
          Fast, reliable, and safe delivery to your doorstep.
        </p>
      </div>

      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <i className="bi bi-truck fs-2 mb-3 text-success" aria-hidden="true" />
                <Card.Title>Delivery Methods</Card.Title>
                <Card.Text>
                  We provide standard and express delivery across multiple
                  regions with trusted couriers.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <i className="bi bi-clock-history fs-2 mb-3 text-primary" aria-hidden="true" />
                <Card.Title>Delivery Time</Card.Title>
                <Card.Text>
                  Standard shipping takes 3-5 business days, while express
                  shipping is delivered within 1-2 days.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <i className="bi bi-geo-alt fs-2 mb-3 text-danger" aria-hidden="true" />
                <Card.Title>Tracking</Card.Title>
                <Card.Text>
                  Track your orders in real-time with our tracking system and
                  updates via SMS/email.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ShippingPolicy;
