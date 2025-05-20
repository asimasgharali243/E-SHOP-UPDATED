import { useState } from "react";
import { Nav, Accordion, Button, Offcanvas, Navbar } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "./dashboard.scss";
function Sidebar({ role = "admin" }) {
  const [show, setShow] = useState(false);
  const [openProduct, setOpenProduct] = useState(true);
  const [openElectronics, setOpenElectronics] = useState(true);
  const location = useLocation();

  const navItem = (href, icon, label, depth = 0) => (
    <Nav.Link
      href={href}
      active={location.pathname === href}
      className={`d-flex align-items-center ps-${
        depth * 3 + 3
      } py-2 sidebar-item`}
    >
      <i className={`bi ${icon} me-2`}></i>
      {label}
    </Nav.Link>
  );

  const SubLink = ({ href, label, depth = 1 }) => (
    <div className={`ps-${depth * 3 + 3} py-1`}>
      <a
        href={href}
        className="text-dark text-decoration-none d-block sidebar-sublink"
      >
        {label}
      </a>
    </div>
  );

  const SidebarContent = () => (
    <>
      <Navbar.Brand className="mb-4 fw-bold text-center">
        <i className="bi bi-shop me-2"></i>E-SHOP
      </Navbar.Brand>

      {navItem("/dashboard", "bi-house", "Dashboard")}

      {navItem("/users", "bi-people", "Users")}

      {/* Products Section */}
      <div className="sidebar-section">
        <div
          onClick={() => setOpenProduct(!openProduct)}
          className="d-flex align-items-center ps-3 py-2 sidebar-item cursor-pointer"
        >
          <i className="bi bi-box-seam me-2"></i> Products
          <i
            className={`bi ms-auto ${
              openProduct ? "bi-chevron-up" : "bi-chevron-down"
            }`}
          ></i>
        </div>

        {openProduct && (
          <>
            <div
              onClick={() => setOpenElectronics(!openElectronics)}
              className="ps-5 py-2 d-flex align-items-center sidebar-sublink cursor-pointer"
            >
              Electronics
              <i
                className={`bi ms-auto ${
                  openElectronics ? "bi-chevron-up" : "bi-chevron-down"
                }`}
              ></i>
            </div>
            {openElectronics && (
              <>
                <SubLink href="/products/phones" label="Phones" depth={2} />
                <SubLink href="/products/laptops" label="Laptops" depth={2} />
                <SubLink
                  href="/products/accessories"
                  label="Accessories"
                  depth={2}
                />
              </>
            )}

            <SubLink href="/products/clothing" label="Clothing" />
            <SubLink href="/products/home-living" label="Home & Living" />
          </>
        )}
      </div>

      {navItem("/orders", "bi-file-earmark-text", "Orders")}
      {navItem("/analytics", "bi-bar-chart", "Analytics")}
      {navItem("/settings", "bi-gear", "Settings")}
    </>
  );

  return (
    <>
      {/* Toggle on small screens */}
      <div className="d-md-none p-2 bg-white border-bottom">
        <Button variant="outline-primary" onClick={() => setShow(true)}>
          <i className="bi bi-list"></i> Menu
        </Button>
      </div>

      {/* Sidebar on large screens */}
      <div
        className="d-none d-md-block sidebar bg-white border-end"
        style={{
          width: "300px",
          minHeight: "100vh",
          position: "fixed",
          padding: "20px",
        }}
      >
        {SidebarContent()}
      </div>

      {/* Offcanvas for small devices */}
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        responsive="md"
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <i className="bi bi-shop me-2"></i>E-SHOP
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">{SidebarContent()}</Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar;
