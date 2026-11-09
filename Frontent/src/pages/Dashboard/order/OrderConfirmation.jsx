// OrderConfirmation.js
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="py-5 bg-light d-flex align-items-center justify-content-center min-vh-100"
    >
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg text-center p-4">
            <i className="bi bi-check-circle-fill text-success mb-3" style={{ fontSize: 60 }} aria-hidden="true" />
            <h3 className="fw-bold mb-2">Order Confirmed!</h3>
            <p className="text-muted mb-4">
              Thank you for your purchase. Your order has been successfully
              placed and is now being processed.
            </p>

            <div className="d-grid gap-2">
              <Button variant="primary" onClick={() => navigate("/orders")}>
                View My Orders
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate("/")}>
                Continue Shopping
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderConfirmation;
