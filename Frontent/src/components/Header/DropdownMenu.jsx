import React, { useState, useEffect, useRef, useCallback } from "react";
import { Dropdown, Modal, Row, Col, Accordion } from "react-bootstrap";
import "./CustomDropdownMenu.scss";

const CustomDropdownMenu = ({
  categories,
  theme = "light",
  navigate,
  isMobile,
  setShowOffcanvas,
}) => {
  const [showMain, setShowMain] = useState(false);
  const [openSubIndex, setOpenSubIndex] = useState(null);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const closeTimeout = useRef(null);

  useEffect(() => {
    return () => {
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
      }
    };
  }, []);

  const handleClick = useCallback(
    (e) => {
      const role = e.target.closest("[data-role]")?.dataset?.role;
      const index = e.target.closest("[data-index]")?.dataset?.index;
      const subKey = e.target.closest("[data-subkey]")?.dataset?.subkey;
      const subName = e.target.closest("[data-subname]")?.dataset?.subname;

      if (!role) return;

      if (role === "toggle-main") {
        if (isMobile) {
          setShowMobileModal(true);
        } else {
          setShowMain((prev) => !prev);
          setOpenSubIndex(null);
        }
      }

      if (role === "toggle-sub") {
        setOpenSubIndex((prev) => (prev === index ? null : index));
      }

      if (role === "subcategory" && subKey && subName) {
        // ✅ unified navigation using BOTH key + name
        navigate(
          `/search?query=${encodeURIComponent(
            subName
          )}&key=${encodeURIComponent(subKey)}`
        );
        setShowMain(false);
        setOpenSubIndex(null);
        setShowMobileModal(false);
        setShowOffcanvas(false);
      }
    },
    [isMobile, navigate, setShowOffcanvas]
  );

  const handleMouseEnter = (index) => {
    if (!isMobile) {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
      setShowMain(true);
      setOpenSubIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
      closeTimeout.current = setTimeout(() => {
        setShowMain(false);
        setOpenSubIndex(null);
      }, 100);
    }
  };

  return (
    <>
      <nav
        className="custom-dropdown"
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
        aria-label="Main Product Categories"
      >
        <Dropdown className="custom-dropdown" show={showMain}>
          <Dropdown.Toggle
            data-role="toggle-main"
            variant="primary"
            className="custom-dropdown-toggle d-flex align-items-center justify-content-center gap-3"
            aria-haspopup="true"
            aria-expanded={showMain}
            aria-controls="main-menu"
            onMouseEnter={() => handleMouseEnter(null)}
          >
            <span>Shop By Categories</span>
            <i className="bi bi-list d-none d-md-flex align-items-center justify-content-center"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu
            id="main-menu"
            className={`main-menu ${showMain ? "show" : ""}`}
            role="menu"
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => {
              if (closeTimeout.current) clearTimeout(closeTimeout.current);
            }}
          >
            {categories.map((category, index) => (
              <div
                key={category.key}
                className={`dropdown-item ${
                  category.subcategories?.length ? "has-submenu" : ""
                }`}
                data-role={
                  category.subcategories?.length ? "toggle-sub" : undefined
                }
                data-index={index}
                aria-haspopup={
                  category.subcategories?.length ? "true" : undefined
                }
                aria-expanded={openSubIndex === index}
                onMouseEnter={() => handleMouseEnter(index)}
              >
                {category.subcategories?.length ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{category.name}</span>
                      <i
                        className={`bi bi-caret-${
                          openSubIndex === index ? "right" : "down"
                        }-fill`}
                      ></i>
                    </div>
                    <div
                      className={`submenu ${
                        openSubIndex === index ? "show" : ""
                      }`}
                      role="menu"
                    >
                      {category.subcategories.map((sub) => (
                        <div
                          key={sub.key}
                          data-role="subcategory"
                          data-subkey={sub.key}
                          data-subname={sub.name}
                          role="button"
                          className="sub-menu-item"
                          style={{
                            width: "100px",
                            textAlign: "center",
                          }}
                        >
                          <img
                            src={sub.image}
                            alt={sub.name}
                            width="64"
                            height="64"
                            className="rounded-circle"
                            onError={(e) => {
                              e.target.src = "/placeholder.jpg";
                              e.target.onerror = null;
                            }}
                            loading="lazy"
                            style={{ objectFit: "cover", marginBottom: "12px" }}
                          />
                          <p
                            className="m-0 fw-semibold"
                            style={{ fontSize: "clamp(12px, 1.2vw, 13px)" }}
                          >
                            {sub.name}
                          </p>
                          <p
                            className="m-0 text-muted"
                            style={{ fontSize: "11px" }}
                          >
                            {sub.key}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <a
                    href={`/category/${category.key}`}
                    className="dropdown-link"
                  >
                    {category.name}
                  </a>
                )}
              </div>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        {isMobile && (
          <Modal
            data-bs-theme={theme}
            show={showMobileModal}
            onHide={() => setShowMobileModal(false)}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Select Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Accordion alwaysOpen>
                {categories.map((category, idx) => (
                  <Accordion.Item eventKey={String(idx)} key={category.key}>
                    <Accordion.Header>{category.name}</Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        {category.subcategories?.slice(0, 20).map((sub) => (
                          <Col
                            key={sub.key}
                            xs={4}
                            className="text-center mb-3"
                            style={{
                              color: `${
                                theme === "light"
                                  ? `var(--text1)`
                                  : `var(--white)`
                              }`,
                            }}
                          >
                            <div
                              data-role="subcategory"
                              data-subkey={sub.key}
                              data-subname={sub.name}
                              role="button"
                              className="mobile-submenu-item"
                              onClick={() => {
                                navigate(
                                  `/search?query=${encodeURIComponent(
                                    sub.name
                                  )}&key=${encodeURIComponent(sub.key)}`
                                );
                                setShowMobileModal(false);
                                setShowOffcanvas(false);
                              }}
                            >
                              <img
                                src={sub.image}
                                alt={sub.name}
                                width="64"
                                height="64"
                                className="rounded-circle"
                                onError={(e) => {
                                  e.target.src = "/placeholder.jpg";
                                  e.target.onerror = null;
                                }}
                                style={{
                                  objectFit: "cover",
                                  marginBottom: "8px",
                                }}
                                loading="lazy"
                              />
                              <p
                                className="m-0 fw-semibold"
                                style={{ fontSize: "12px" }}
                              >
                                {sub.name}
                              </p>
                              <p
                                className="m-0 text-muted"
                                style={{ fontSize: "11px" }}
                              >
                                {sub.key}
                              </p>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Modal.Body>
          </Modal>
        )}
      </nav>
    </>
  );
};

export default React.memo(CustomDropdownMenu);
