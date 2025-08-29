import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { ShieldLock, FileText, CartCheck } from "react-bootstrap-icons";

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
                <ShieldLock size={32} className="mb-3 text-primary" />
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
                <CartCheck size={32} className="mb-3 text-success" />
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
                <FileText size={32} className="mb-3 text-danger" />
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
