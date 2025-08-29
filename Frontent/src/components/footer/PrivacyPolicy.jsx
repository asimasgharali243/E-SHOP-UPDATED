import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Lock, Person, Shield } from "react-bootstrap-icons";

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
                <Person size={32} className="mb-3 text-primary" />
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
                <Lock size={32} className="mb-3 text-danger" />
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
                <Shield size={32} className="mb-3 text-success" />
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
