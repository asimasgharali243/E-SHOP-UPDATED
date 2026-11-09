import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TermsAndConditions = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-dark text-white text-center py-5 mb-4 mt-4">
        <h1>Terms & Conditions</h1>
        <p className="lead">
          Please read our terms carefully before using our services.
        </p>
      </div>

      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <i className="bi bi-shield-lock fs-2 mb-3 text-primary" aria-hidden="true" />
                <Card.Title>Use of Website</Card.Title>
                <Card.Text>
                  You agree to use our platform only for lawful purposes and not
                  to violate the rights of others.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <i className="bi bi-cart-check fs-2 mb-3 text-success" aria-hidden="true" />
                <Card.Title>Orders & Payments</Card.Title>
                <Card.Text>
                  All orders placed are subject to product availability and
                  payment confirmation.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <i className="bi bi-file-text fs-2 mb-3 text-danger" aria-hidden="true" />
                <Card.Title>Limitation of Liability</Card.Title>
                <Card.Text>
                  We are not liable for indirect damages arising from use of our
                  services.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TermsAndConditions;
