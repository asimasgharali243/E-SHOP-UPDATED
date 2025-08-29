import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Accordion,
  Table,
  Badge,
  Modal,
  Button,
  Form,
  InputGroup,
  Pagination,
} from "react-bootstrap";

const Customers = () => {
  // Sample customers data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      joinDate: "2025-08-10",
      orders: 15,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 987-6543",
      joinDate: "2025-07-22",
      orders: 8,
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.j@example.com",
      phone: "+1 (555) 456-7890",
      joinDate: "2025-08-05",
      orders: 23,
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      phone: "+1 (555) 234-5678",
      joinDate: "2025-07-15",
      orders: 12,
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael.b@example.com",
      phone: "+1 (555) 876-5432",
      joinDate: "2025-06-30",
      orders: 5,
    },
  ]);

  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 3;

  // Filter + search
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.id.toString().includes(search) ||
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  // Open modal for editing
  const handleShowModal = (customer) => {
    setSelectedCustomer({ ...customer }); // clone to avoid direct mutation
    setShowModal(true);
  };

  // Handle changes inside modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save changes
  const handleSave = () => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === selectedCustomer.id ? selectedCustomer : c))
    );
    setShowModal(false);
  };

  return (
    <Container fluid className="p-3">
      <h2 className="mb-4">Customer Management</h2>

      {/* Search */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by Customer ID, Name, or Email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Accordion for mobile */}
      <Accordion className="d-md-none">
        {currentCustomers.map((customer) => (
          <Accordion.Item key={customer.id} eventKey={customer.id.toString()}>
            <Accordion.Header>
              {customer.name} - #{customer.id}
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <strong>Email:</strong> {customer.email}
              </p>
              <p>
                <strong>Phone:</strong> {customer.phone}
              </p>
              <p>
                <strong>Join Date:</strong> {customer.joinDate}
              </p>
              <p>
                <strong>Orders:</strong> {customer.orders}
              </p>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => handleShowModal(customer)}
              >
                View / Edit
              </Button>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Table for desktop */}
      <Card className="d-none d-md-block">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => handleShowModal(customer)}
                    >
                      View / Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Pagination */}
      {filteredCustomers.length > 0 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages).keys()].map((n) => (
              <Pagination.Item
                key={n + 1}
                active={n + 1 === currentPage}
                onClick={() => setCurrentPage(n + 1)}
              >
                {n + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      {/* No results message */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted">
            No customers found matching your criteria.
          </p>
        </div>
      )}

      {/* Editable Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer #{selectedCustomer?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Customer ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedCustomer.id}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Join Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="joinDate"
                      value={selectedCustomer.joinDate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={selectedCustomer.name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Total Orders</Form.Label>
                    <Form.Control
                      type="number"
                      name="orders"
                      value={selectedCustomer.orders}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={selectedCustomer.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={selectedCustomer.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Customers;
