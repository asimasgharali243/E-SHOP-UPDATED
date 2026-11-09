import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const PrivacyPolicy = () => {
  return (
    <div>
      <div className="bg-dark text-white text-center py-5 mb-4 mt-4">
        <h1>Privacy Policy</h1>
        <p className="lead">
          Your privacy matters. Here’s how we protect your data.
        </p>
      </div>

      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <i className="bi bi-person fs-2 mb-3 text-primary" aria-hidden="true" />
                <Card.Title>Information We Collect</Card.Title>
                <Card.Text>
                  We may collect your name, email, phone number, and browsing
                  activity to improve services.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <i className="bi bi-lock fs-2 mb-3 text-danger" aria-hidden="true" />
                <Card.Title>Data Security</Card.Title>
                <Card.Text>
                  We use advanced security measures to keep your personal data
                  safe and secure.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <i className="bi bi-shield fs-2 mb-3 text-success" aria-hidden="true" />
                <Card.Title>Your Rights</Card.Title>
                <Card.Text>
                  You can request access, update, or deletion of your personal
                  data anytime.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
