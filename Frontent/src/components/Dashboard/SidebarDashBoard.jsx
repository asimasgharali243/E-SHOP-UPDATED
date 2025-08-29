import React from "react";
import { Offcanvas, Nav, Accordion } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.scss";

const Sidebar = ({ isSidebarOpen, toggleSidebar, isMobile }) => {
  const { pathname } = useLocation();

  const navItems = [
    { path: "/dashboard/settings", label: "Settings", icon: "bi-gear" },
    { path: "/dashboard/help", label: "Help", icon: "bi-question-circle" },
    { path: "/logout", label: "Logout", icon: "bi-box-arrow-right" },
  ];

  const renderLink = (path, label, icon = null, subLink = false) => (
    <Link
      key={path}
      to={path}
      className={`sidebar-link${subLink ? " sub-link" : ""} ${
        pathname === path ? "active" : ""
      }`}
      onClick={isMobile ? toggleSidebar : undefined}
    >
      {icon && <i className={`bi ${icon} fs-5`}></i>}
      {isSidebarOpen && <span className="ms-2">{label}</span>}
      {!isSidebarOpen && !subLink && icon && (
        <span className="visually-hidden">{label}</span>
      )}
    </Link>
  );

  const renderAccordionItems = () => {
    if (!isSidebarOpen && !isMobile) {
      return (
        <>
          {renderLink("/dashboard/products/list", "Products", "bi-box-seam")}
          {renderLink("/dashboard/orders/list", "Orders", "bi-receipt")}
          {renderLink("/dashboard/customers/list", "Customers", "bi-people")}
        </>
      );
    }

    return (
      <Accordion defaultActiveKey="">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="d-flex align-items-center">
              <i className="bi bi-box-seam fs-5"></i>
              <span className="ms-2">Products</span>
            </div>
          </Accordion.Header>
          <Accordion.Body
            className="p-0"
            style={{ backgroundColor: `var(--background)` }}
          >
            {renderLink("/dashboard/products/list", "Product List", null, true)}
            {renderLink(
              "/dashboard/products/details/:id",
              "Product Details",
              null,
              true
            )}
            {renderLink("/dashboard/products/add", "Add Product", null, true)}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <div className="d-flex align-items-center">
              <i className="bi bi-receipt fs-5"></i>
              <span className="ms-2">Orders</span>
            </div>
          </Accordion.Header>
          <Accordion.Body
            className="p-0"
            style={{ backgroundColor: `var(--background)` }}
          >
            {renderLink("/dashboard/orders/list", "Order List", null, true)}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <div className="d-flex align-items-center">
              <i className="bi bi-people fs-5"></i>
              <span className="ms-2">Customers</span>
            </div>
          </Accordion.Header>
          <Accordion.Body
            className="p-0"
            style={{ backgroundColor: `var(--background)` }}
          >
            {renderLink(
              "/dashboard/customers/list",
              "Customer List",
              null,
              true
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const renderNavItems = () =>
    navItems.map(({ path, label, icon }) => renderLink(path, label, icon));

  if (isMobile) {
    return (
      <Offcanvas show={isSidebarOpen} onHide={toggleSidebar} placement="start">
        <Offcanvas.Header className="custom-sidebar-header" closeButton>
          <Offcanvas.Title>E-SHOP</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="custom-sidebar-body">
          <Nav className="flex-column">
            {renderAccordionItems()}
            {renderNavItems()}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    );
  }

  return (
    <div
      className={`custom-sidebar d-none d-md-block position-sticky ${
        isSidebarOpen ? "open" : "collapsed"
      }`}
    >
      <div className="sidebar-header">
        {isSidebarOpen ? (
          <h5 className="fw-bold">E-SHOP</h5>
        ) : (
          <i className="bi bi-shop fs-4"></i>
        )}
      </div>
      <Nav className="flex-column">
        {renderAccordionItems()}
        {renderNavItems()}
      </Nav>
    </div>
  );
};

export default Sidebar;
