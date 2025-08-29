import React from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Dropdown,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Sidebar.scss";
const DashboardHeader = ({ toggleSidebar, isMobile }) => {
  return (
    <Navbar
      bg="light"
      expand="md"
      className="dashboard-header px-3 shadow-sm sticky-top justify-content-between"
    >
      <div
        className="toggle-button"
        onClick={toggleSidebar}
        style={{ cursor: "pointer" }}
      >
        <i className="bi bi-list fs-4"></i>
        <span className="d-block d-md-none">E-SHOP</span>
      </div>

      <Navbar.Brand className="brand-title fw-bold d-flex align-items-center d-md-none justify-self-start "></Navbar.Brand>

      <Nav className="nav-area align-items-center flex-row gap-4">
        <Dropdown align="end" className="notification-dropdown">
          <Dropdown.Toggle
            as="div"
            className="position-relative cursor-pointer bell-toggle"
          >
            <i className="bi bi-bell bell-icon"></i>
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle bell-badge"></span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>🔔 New order received</Dropdown.Item>
            <Dropdown.Item>📦 Product stock low</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>View all notifications</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown align="end" className="user-dropdown">
          <Dropdown.Toggle
            as="div"
            className="d-flex align-items-center cursor-pointer user-toggle"
          >
            <Image
              src="https://via.placeholder.com/40"
              roundedCircle
              height="32"
              width="32"
              onError={(e) => {
                e.target.src = "/placeholder.jpg";
                e.target.onerror = null;
              }}
              className="user-avatar me-2"
              alt="User Avatar"
            />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/dashboard/profile">
              <i className="bi bi-person me-2"></i> Profile
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/dashboard/settings">
              <i className="bi bi-gear me-2"></i> Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item as={Link} to="/logout">
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <div className="user-info d-none d-md-flex flex-column">
          <span className="user-name">Asim Ali</span>
          <span className="user-email">hashimali786@gmail.com</span>
        </div>
      </Nav>
    </Navbar>
  );
};

export default DashboardHeader;
