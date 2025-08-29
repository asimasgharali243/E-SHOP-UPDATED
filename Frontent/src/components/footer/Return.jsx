import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { ArrowRepeat, Cash, BoxArrowInLeft } from "react-bootstrap-icons";

const Returns = () => {
  return (
    <div>
      <div className="bg-dark text-white text-center py-5 mb-4 mt-4">
        <h1>Returns & Refunds</h1>
        <p className="lead">We make returns simple and refunds quick.</p>
      </div>

      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <ArrowRepeat size={32} className="mb-3 text-danger" />
                <Card.Title>Return Policy</Card.Title>
                <Card.Text>
                  Products can be returned within 7 days of delivery if unused,
                  in original packaging, and with invoice.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Cash size={32} className="mb-3 text-success" />
                <Card.Title>Refund Process</Card.Title>
                <Card.Text>
                  Refunds will be processed to your original payment method
                  within 5-7 working days after inspection.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <BoxArrowInLeft size={32} className="mb-3 text-primary" />
                <Card.Title>Exchange Option</Card.Title>
                <Card.Text>
                  Exchanges are available for defective or wrong items,
                  depending on stock availability.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Returns;
