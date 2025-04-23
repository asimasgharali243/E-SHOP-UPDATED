import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CheckoutPage = () => {
  const [coupon, setCoupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleOrder = () => {
    alert("Order placed successfully!");
  };

  return (
    <Container className="my-5 ">
      <Row className="gap-4">
        {/* Billing Details */}
        <Col md={7} className="border border-1 rounded bg-light p-4 ">
          <h3>Billing Details</h3>
          <Form>
            <Form.Group controlId="firstName" className="mb-3">
              <Form.Label>First Name*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your first name"
                required
              />
            </Form.Group>

            <Form.Group controlId="companyName" className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your company name" />
            </Form.Group>

            <Form.Group controlId="streetAddress" className="mb-3">
              <Form.Label>Street Address*</Form.Label>
              <Form.Control type="text" placeholder="123 Main St" required />
            </Form.Group>

            <Form.Group controlId="apartment" className="mb-3">
              <Form.Label>Apartment, floor, etc. (optional)</Form.Label>
              <Form.Control type="text" placeholder="Apt 4B" />
            </Form.Group>

            <Form.Group controlId="city" className="mb-3">
              <Form.Label>Town/City*</Form.Label>
              <Form.Control type="text" placeholder="Your city" required />
            </Form.Group>

            <Form.Group controlId="phone" className="mb-3">
              <Form.Label>Phone Number*</Form.Label>
              <Form.Control type="text" placeholder="123-456-7890" required />
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email Address*</Form.Label>
              <Form.Control
                type="email"
                placeholder="you@example.com"
                required
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Save this information for faster check-out next time"
              className="mb-3"
              defaultChecked
            />
          </Form>
        </Col>

        {/* Order Summary */}
        <Col md={4} className="border border-1 rounded bg-light p-4 ">
          <h3>Order Summary</h3>
          <div className="mb-4">
            <Row className="mb-2 align-items-center">
              <Col xs={2}>
                <img
                  className="img-fluid"
                  src="https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=200"
                  alt=""
                />
              </Col>
              <Col>LCD Monitor</Col>
              <Col className="text-end">$650</Col>
            </Row>

            <Row className="mb-2 align-items-center">
              <Col xs={2}>
                <img
                  className="img-fluid"
                  src="https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=200"
                  alt=""
                />
              </Col>
              <Col>HI Gamepad</Col>
              <Col className="text-end">$1100</Col>
            </Row>

            <hr />

            <Row>
              <Col>Subtotal:</Col>

              <Col className="text-end">$1750</Col>
            </Row>
            <hr />
            <Row>
              <Col>Shipping:</Col>
              <Col className="text-end">Free</Col>
            </Row>
            <hr />
            <Row className="fw-bold">
              <Col>Total:</Col>
              <Col className="text-end">$1750</Col>
            </Row>
          </div>

          <Form>
            <Form.Group className="mb-3">
              <Form.Check
                type="radio"
                label="Bank"
                name="paymentMethod"
                id="bank"
                value="bank"
                onChange={() => setPaymentMethod("bank")}
                checked={paymentMethod === "bank"}
              />
              <Form.Check
                type="radio"
                label="Cash on delivery"
                name="paymentMethod"
                id="cod"
                value="cod"
                onChange={() => setPaymentMethod("cod")}
                checked={paymentMethod === "cod"}
              />
            </Form.Group>

            <Button variant="danger" onClick={handleOrder}>
              Place Order
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
