import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer mt-5">
      <Container fluid className="footer-top py-5 px-4 px-md-5">
        <Row className="gy-4">
          {/* Brand Info */}
          <Col xs={12} md={4} lg={3}>
            <h4 className="footer-logo">E-Shop</h4>
            <p>
              Your one-stop shop for all your needs. We deliver products at your
              doorstep with trusted service.
            </p>
            <div className="social-icons">
              <a href="#">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={6} md={4} lg={2}>
            <h5>Quick Links</h5>
            <ul>
              <li>
                <a href="home">Shop</a>
              </li>
              <li>
                <a href="#">Categories</a>
              </li>
              <li>
                <a href="#">Deals</a>
              </li>
              <li>
                <a href="#">New Arrivals</a>
              </li>
              <li>
                <a href="#">Best Sellers</a>
              </li>
            </ul>
          </Col>

          {/* Customer Service */}
          <Col xs={6} md={4} lg={2}>
            <h5>Customer Service</h5>
            <ul>
              <li>
                <a href="help">Help Center</a>
              </li>
              <li>
                <a href="return-policy">Returns</a>
              </li>
              <li>
                <a href="shipping-policy">Shipping</a>
              </li>
              <li>
                <a href="privacy-policy">Privacy Policy</a>
              </li>
              <li>
                <a href="terms-and-conditions">Terms & Conditions</a>
              </li>
            </ul>
          </Col>

          {/* Newsletter */}
          <Col xs={12} md={8} lg={5}>
            <h5>Subscribe to Newsletter</h5>
            <p>Get updates about our latest offers & products.</p>
            <Form className="newsletter-form d-flex">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                className="me-2"
              />
              <Button type="submit" variant="primary">
                Subscribe
              </Button>
            </Form>
            <div className="payment-icons mt-3 d-flex gap-3 fs-4">
              <i className="bi bi-credit-card"></i>
              <i className="bi bi-paypal"></i>
              <i className="bi bi-wallet2"></i>
              <i className="bi bi-cart"></i>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Bottom Footer */}
      <div className="footer-bottom text-center py-3">
        <p className="mb-0">
          © {new Date().getFullYear()} E-Shop. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
