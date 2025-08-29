import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const About = () => {
  return (
    <Container fluid className="py-5 bg-light">
      {/* Header Section */}
      <Container className="text-center mb-5">
        <h1 className="fw-bold">About Us</h1>
        <p className="text-muted">
          Learn more about our journey, our mission, and what drives us to serve
          you better every day.
        </p>
      </Container>

      {/* Mission & Vision */}
      <Container className="mb-5">
        <Row className="g-4">
          <Col md={6}>
            <Card className="h-100 shadow-sm p-4">
              <Card.Body>
                <h3 className="fw-bold">
                  <i className="bi bi-cart-check me-2 text-primary"></i>
                  Our Mission
                </h3>
                <p>
                  To provide high-quality products at affordable prices with
                  seamless shopping experiences. We aim to bring convenience and
                  trust to every customer's doorstep.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 shadow-sm p-4">
              <Card.Body>
                <h3 className="fw-bold">
                  <i className="bi bi-globe me-2 text-success"></i>
                  Our Vision
                </h3>
                <p>
                  To become a globally recognized eCommerce platform that
                  connects buyers and sellers from all walks of life while
                  maintaining transparency and sustainability.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Why Choose Us */}
      <Container className="text-center mb-5">
        <h2 className="fw-bold mb-4">Why Choose Us?</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 shadow-sm p-4 text-center">
              <i
                className="bi bi-award text-warning mb-3"
                style={{ fontSize: "40px" }}
              ></i>
              <h5>Trusted Quality</h5>
              <p className="text-muted">
                We ensure top-quality products with verified sellers and strict
                quality checks.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm p-4 text-center">
              <i
                className="bi bi-people text-primary mb-3"
                style={{ fontSize: "40px" }}
              ></i>
              <h5>Customer First</h5>
              <p className="text-muted">
                We prioritize your satisfaction with secure payments and
                hassle-free returns.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm p-4 text-center">
              <i
                className="bi bi-globe text-success mb-3"
                style={{ fontSize: "40px" }}
              ></i>
              <h5>Global Reach</h5>
              <p className="text-muted">
                With fast delivery options, we connect millions of customers
                with trusted products worldwide.
              </p>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Closing Section */}
      <Container className="text-center">
        <h2 className="fw-bold">Join Our Journey</h2>
        <p className="text-muted mb-4">
          We are more than just a shopping platform – we are a community built
          on trust, innovation, and customer care. Thank you for choosing us!
        </p>
      </Container>
    </Container>
  );
};

export default About;
