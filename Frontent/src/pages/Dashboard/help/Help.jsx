import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Accordion,
  Button,
  Card,
} from "react-bootstrap";
import {
  Search,
  ChatDots,
  Telephone,
  Envelope,
  BoxSeam,
  Truck,
  ArrowRepeat,
  PersonCircle,
  CreditCard,
} from "react-bootstrap-icons";
import "./Help.scss";

const Help = () => {
  const [query, setQuery] = useState("");

  const faqs = [
    {
      question: "How can I track my order?",
      answer:
        "Go to 'My Orders' in your profile and click on the order to see live tracking updates.",
      category: "Orders",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept Credit/Debit cards, PayPal, Cash on Delivery, and Wallet payments.",
      category: "Payments",
    },
    {
      question: "How do I return a product?",
      answer:
        "Go to 'My Orders', select the product and click 'Return'. Follow the steps provided.",
      category: "Returns",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard delivery takes 3–7 business days. Express shipping options are available.",
      category: "Shipping",
    },
    {
      question: "How can I reset my password?",
      answer: "Go to 'Profile > Account Settings' and click 'Change Password'.",
      category: "Account",
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Container fluid className="help-center py-5 px-3 px-md-5">
      <h2 className="mb-4 text-center">Help Center</h2>
      <p className="text-center mb-5">
        Find answers to common questions or contact our support team.
      </p>

      {/* Search */}
      <Row className="justify-content-center mb-5">
        <Col xs={12} md={8} lg={6}>
          <div className="search-bar d-flex">
            <Form.Control
              type="text"
              placeholder="Search your query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="primary" className="ms-2">
              <Search />
            </Button>
          </div>
        </Col>
      </Row>
      {/* Contact Support */}
      <Row className="contact-support text-center gy-4 mb-5">
        <Col xs={12}>
          <h4>Need More Help?</h4>
          <p>Our support team is here for you 24/7.</p>
        </Col>
        <Col xs={12} md={4}>
          <Card className="support-card p-4">
            <ChatDots size={30} />
            <h6 className="mt-2">Live Chat</h6>
            <Button variant="outline-primary" className="mt-2">
              Start Chat
            </Button>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="support-card p-4">
            <Telephone size={30} />
            <h6 className="mt-2">Call Us</h6>
            <p className="small">+1 800 123 456</p>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="support-card p-4">
            <Envelope size={30} />
            <h6 className="mt-2">Email</h6>
            <p className="small">support@eshop.com</p>
          </Card>
        </Col>
      </Row>

      {/* FAQ Accordion */}
      <Row className="mb-5">
        <Col xs={12} md={10} lg={8} className="mx-auto">
          <h4 className="mb-4">Frequently Asked Questions</h4>
          <Accordion defaultActiveKey="0">
            {filteredFaqs.map((faq, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>{faq.question}</Accordion.Header>
                <Accordion.Body>{faq.answer}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default Help;
