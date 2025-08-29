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

const Orders = () => {
  // Sample orders
  const [orders, setOrders] = useState([
    {
      id: 1,
      date: "2025-08-10",
      total: 150,
      status: "Shipped",
      tracking: "TRK123456",
      shippingAddress: "123 Main St, City A",
      items: ["iPhone 13", "AirPods Pro"],
    },
    {
      id: 2,
      date: "2025-08-15",
      total: 300,
      status: "Processing",
      tracking: "TRK654321",
      shippingAddress: "456 Park Ave, City B",
      items: ["Samsung Galaxy S21"],
    },
    {
      id: 3,
      date: "2025-08-20",
      total: 75,
      status: "Delivered",
      tracking: "TRK987654",
      shippingAddress: "789 Market St, City C",
      items: ["Wireless Mouse", "Keyboard"],
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  // Filter + search
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(search) &&
      (filterStatus ? order.status === filterStatus : true)
  );

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Open modal for editing
  const handleShowModal = (order) => {
    setSelectedOrder({ ...order }); // clone to avoid direct mutation
    setShowModal(true);
  };

  // Handle changes inside modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save changes
  const handleSave = () => {
    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrder.id ? selectedOrder : o))
    );
    setShowModal(false);
  };

  return (
    <Container fluid className="p-3">
      <h2 className="mb-4">Orders</h2>

      {/* Search & Filter */}
      <Row className="mb-3">
        <Col md={6} className="mb-2">
          <InputGroup>
            <Form.Control
              placeholder="Search by Order ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Filter by Status</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Accordion for mobile */}
      <Accordion className="d-md-none">
        {currentOrders.map((order) => (
          <Accordion.Item key={order.id} eventKey={order.id.toString()}>
            <Accordion.Header>
              Order #{order.id} - {order.date}
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <strong>Total:</strong> ${order.total}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge
                  bg={
                    order.status === "Delivered"
                      ? "success"
                      : order.status === "Shipped"
                      ? "info"
                      : "warning"
                  }
                >
                  {order.status}
                </Badge>
              </p>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => handleShowModal(order)}
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
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Tracking</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.date}</td>
                  <td>${order.total}</td>
                  <td>
                    <Badge
                      bg={
                        order.status === "Delivered"
                          ? "success"
                          : order.status === "Shipped"
                          ? "info"
                          : "warning"
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td>{order.tracking}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => handleShowModal(order)}
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

      {/* Editable Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Order #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={selectedOrder.date}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Total</Form.Label>
                    <Form.Control
                      type="number"
                      name="total"
                      value={selectedOrder.total}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={selectedOrder.status}
                      onChange={handleChange}
                    >
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tracking Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="tracking"
                      value={selectedOrder.tracking}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Shipping Address</Form.Label>
                <Form.Control
                  type="text"
                  name="shippingAddress"
                  value={selectedOrder.shippingAddress}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Items</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="items"
                  value={selectedOrder.items.join(", ")}
                  onChange={(e) =>
                    setSelectedOrder((prev) => ({
                      ...prev,
                      items: e.target.value.split(",").map((i) => i.trim()),
                    }))
                  }
                />
              </Form.Group>
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

export default Orders;
