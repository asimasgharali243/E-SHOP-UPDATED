import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Truck, ClockHistory, GeoAlt } from "react-bootstrap-icons";

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
                <Truck size={32} className="mb-3 text-success" />
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
                <ClockHistory size={32} className="mb-3 text-primary" />
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
                <GeoAlt size={32} className="mb-3 text-danger" />
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
