import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Form,
  Modal,
} from "react-bootstrap";
import {
  Gear,
  Lock,
  Bell,
  CreditCard,
  Palette,
  Globe,
  Person,
} from "react-bootstrap-icons";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("account");
  const [showAddCard, setShowAddCard] = useState(false);

  const handleClose = () => setShowAddCard(false);
  const handleShow = () => setShowAddCard(true);

  return (
    <Container fluid className="py-4 bg-light">
      <Row>
        {/* Sidebar Menu */}
        <Col md={3} className="mb-3">
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-3">
                <Gear className="me-2" />
                Settings Menu
              </h5>
              <ListGroup variant="flush">
                <ListGroup.Item
                  action
                  active={activeSection === "account"}
                  onClick={() => setActiveSection("account")}
                >
                  <Person className="me-2" /> Account Info
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={activeSection === "security"}
                  onClick={() => setActiveSection("security")}
                >
                  <Lock className="me-2" /> Security
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={activeSection === "notifications"}
                  onClick={() => setActiveSection("notifications")}
                >
                  <Bell className="me-2" /> Notifications
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={activeSection === "payments"}
                  onClick={() => setActiveSection("payments")}
                >
                  <CreditCard className="me-2" /> Payment Methods
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Content */}
        <Col md={9}>
          {activeSection === "account" && (
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <h5 className="fw-bold mb-3">
                  <Person className="me-2" />
                  Account Information
                </h5>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" placeholder="John Doe" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="john@email.com" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" placeholder="+1234567890" />
                  </Form.Group>
                  <Button variant="primary">Save Changes</Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {activeSection === "security" && (
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <h5 className="fw-bold mb-3">
                  <Lock className="me-2" />
                  Security Settings
                </h5>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control type="password" placeholder="********" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="********" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="********" />
                  </Form.Group>
                  <Button variant="primary">Update Password</Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {activeSection === "notifications" && (
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <h5 className="fw-bold mb-3">
                  <Bell className="me-2" />
                  Notifications
                </h5>
                <Form.Check
                  type="switch"
                  id="emailNoti"
                  label="Email Notifications"
                  className="mb-2"
                />
              </Card.Body>
            </Card>
          )}

          {activeSection === "payments" && (
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <h5 className="fw-bold mb-3">
                  <CreditCard className="me-2" />
                  Payment Methods
                </h5>

                <Card className="p-3 mb-2 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>**** **** **** 1234 (Visa)</span>
                    <Button size="sm" variant="outline-danger">
                      Remove
                    </Button>
                  </div>
                </Card>

                <Button variant="primary" onClick={handleShow}>
                  <CreditCard className="me-2" /> Add New Card
                </Button>
              </Card.Body>
            </Card>
          )}

          {activeSection === "language" && (
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <h5 className="fw-bold mb-3">
                  <Globe className="me-2" />
                  Language
                </h5>
                <Form.Select>
                  <option>English</option>
                  <option>Urdu</option>
                  <option>Spanish</option>
                  <option>French</option>
                </Form.Select>
              </Card.Body>
            </Card>
          )}

          {activeSection === "appearance" && (
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <h5 className="fw-bold mb-3">
                  <Palette className="me-2" />
                  Appearance
                </h5>
                <Form.Check type="radio" name="theme" label="Light Mode" />
                <Form.Check type="radio" name="theme" label="Dark Mode" />
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Add Card Modal */}
      <Modal show={showAddCard} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <CreditCard className="me-2 text-primary" />
            Add New Card
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name on card" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control type="text" placeholder="MM/YY" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="***"
                    maxLength={4}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Billing Address</Form.Label>
              <Form.Control type="text" placeholder="Street, City, Country" />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Set as default payment method"
              className="mb-3"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Card
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Settings;
