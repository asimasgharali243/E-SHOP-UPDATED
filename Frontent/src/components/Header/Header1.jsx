import {
  Navbar,
  Nav,
  Form,
  Button,
  Container,
  Col,
  Row,
  Offcanvas,
  Dropdown,
  InputGroup,
  NavDropdown,
  NavbarText,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Header.css";

export default function Header() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Categories");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimers = {}; 
  
  const dropdownMenuLG = [
    { name: "Women's Fashion", key: "women" },
    { name: "Men's Fashion", key: "men" },
    { name: "Electronics", key: "electronics" },
    { name: "Home & LifeStyle", key: "home" },
    { name: "Baby's & Toy", key: "baby" },
    { name: "Health & Beauty", key: "beauty" },
  ];
  

  const [isOverlayActive, setOverlayActive] = useState(false);


  const handleFocus = () => {
    setOverlayActive(true); // Show overlay when input is focused
  };

  const handleBlur = () => {
    setOverlayActive(false); // Hide overlay when input loses focus
  };
  const handleShow = () => setShowOffcanvas(true);
  const handleClose = () => setShowOffcanvas(false);

  const handleSelect = (category) => {
    console.log("Selected Categorfy:", category);
    setSelectedCategory(category); // Update the selected category
    setActiveDropdown(null)
  };

  const handleMouseEnter = async (dropdownName) => {
    clearAllDropdownTimers(); // Clear any active timers for all dropdowns
    setActiveDropdown(dropdownName); // Set the active dropdown
  };

  const handleMouseLeave = (dropdownName) => {
    if (dropdownTimers[dropdownName]) clearTimeout(dropdownTimers[dropdownName]);

    dropdownTimers[dropdownName] = setTimeout(() => {
      if (activeDropdown === dropdownName) {
        setActiveDropdown(null); // Close the dropdown if it's still active
      }
    }, 1000); // Adjust timing here as needed
  };
  const handleClick=(category)=>{


  }

  const clearAllDropdownTimers = () => {
    Object.keys(dropdownTimers).forEach((dropdown) => {
      if (dropdownTimers[dropdown]) clearTimeout(dropdownTimers[dropdown]);
    });
  };
  return (
    <>
        <Container className=" d-none d-md-flex justify-content-between align-items-center  ">
          <span>Need help? Call us:(+98) 0234 456 789</span>

          <Nav className="d-flex align-items-center ">
            <Nav.Link href="#store" className="px-2">
              Our store
            </Nav.Link>
            <Nav.Link href="#track" className="px-2">
              Track your order
            </Nav.Link>
          </Nav>
        </Container>
      

      {/* Navbar with flexbox and order property */}
      <Navbar expand="md" className=" " style={{ background:"#074ab6" }}>
        <Container
          fluid="md"
          className=" p-3 p-md-0"
        >
          <Row className="w-100  align-items-center justify-content-between pt-sm-2 pt-xs-2 pt-md-0 m-0 ">
            {/* Brand Logo */}
            <Col
              xs={{ span: 4, order: 1, offset: 0 }}
              sm={{ span: 4, order: 1, offset: 0 }}
              md={{ span: 2, order: 1, offset: 0 }}
              className="d-flex align-items-center "
            >
              <Navbar.Brand href="#" className="text-white ">
                <strong>E-SHOP</strong>
              </Navbar.Brand>
            </Col>

            {/* Search Bar */}
            <Col
              xs={{ span: 12, order: 4, offset: 0 }}
              sm={{ span: 12, order: 4, offset: 0 }}
              md={{ span: 5, order: 2, offset: 1 }}
              className="rounded-pill align-items-center mt-sm-2 mt-xs-2 mt-md-0"
            >
              <InputGroup className="d-flex position-relative justify-content-between text-black bg-white rounded-pill align-items-center px-2 mb-3 mt-3">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="text-black bg-white border-0 outline-0 flex-grow-1 flex-shrink-1 rounded-pill px-2"
                  // This ensures the input takes up full width of its parent.
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <InputGroup.Text
                  id="bg-white border-0"
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    padding: "0.5rem",
                  }}
                >
                  <i
                    className="bi bi-search text-black bg-white border-0 outline-0 p-0 rounded-pill"
                    style={{
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      background: "warning",
                      border: "none",
                      outline: "none",
                      padding: "0.5rem",
                    }}
                  ></i>
                </InputGroup.Text>
              </InputGroup>
            </Col>

            {/* User Links (Sign In, Cart, etc.) */}
            <Col
              className=""
              xs={{ span: 6, order: 2, offset: 0 }}
              sm={{ span: 6, order: 2, offset: 0 }}
              md={{ span: 3, order: 3, offset: 1 }}
            >
              <Nav className="d-flex flex-row justify-content-around align-items-center">
                <Nav.Link
                  href="#signin"
                  className="text-white px-3 d-flex gap-2 justify-content-center align-items-center"
                >
                  Sign 
                </Nav.Link>
                <Nav.Link
                  href="#wishlist"
                  className="text-white px-3 d-flex gap-2 justify-content-center align-items-center"
                >
                  <i className="bi bi-heart"></i>
                  <span className="d-none d-lg-block">Wishlist</span>
                </Nav.Link>
                <Nav.Link
                  href="#cart"
                  className="text-white px-3 d-flex gap-2 justify-content-center align-items-center"
                >
                  <i className="bi bi-cart"></i>
                  <span className="d-none d-lg-block">Cart</span>
                </Nav.Link>
              </Nav>
            </Col>
            <Col
              className="d-flex  align-items-center justify-content-center d-md-none p-0"
              xs={{ span: 2, order: 3, offset: 0 }}
              sm={{ span: 2, order: 3, offset: 0 }}
              md={{ span: 4, order: 4, offset: 0 }}
            >
              <Navbar.Toggle
                className="navbar-toggler border-0  text-white  d-flex align-items-center justify-content-center   "
                style={{ width: "2rem", height: "2rem" }}
                aria-controls="offcanvasNavbar"
                onClick={handleShow}
              >
                <i className="bi bi-list" style={{ fontSize: "2rem" }}></i>
              </Navbar.Toggle>
            </Col>
          </Row>
        </Container>
      </Navbar>

      {/* Offcanvas Menu*/}
      <Navbar.Offcanvas
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
        show={showOffcanvas}
        onHide={handleClose}
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title id="offcanvasNavbarLabel">Electon</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <NavDropdown title="Browse categories" id="categories-dropdown">
              <NavDropdown.Item href="#electronics">
                Electronics
              </NavDropdown.Item>
              <NavDropdown.Item href="#fashion">Fashion</NavDropdown.Item>
              <NavDropdown.Item href="#home">Home</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#catalog">Catalog</Nav.Link>
            <Nav.Link href="#blog">Blog</Nav.Link>
            <Nav.Link href="#pages">Pages</Nav.Link>
            <Nav.Link href="#about">About us</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>

{/*<div className={`overlay ${isOverlayActive ? 'active' : ''}`}></div>*/}

      {/* Secondary Navbar for Desktop */}
      <Navbar bg="light" expand="md" className="d-none d-md-flex position-sticky top-0  "  style={{zIndex:"9"}}>
        <Container
          fluid="md"
          className="d-flex justify-content-start   align-items-center "
        >
          <Row>
            <Nav
              justify
              variant=""
              className="d-flex    flex-wrape w-100  h-15 mx-2"
            >
              <Col
                className="d-flex d-lg-none     h-15"
                xs={{ span: "auto", order: 1, offset: 0 }}
                sm={{ span: "auto", order: 1, offset: 0 }}
                md={{ span: "auto", order: 1, offset: 0 }}
                lg={{ span: "auto", order: 2, offset: 0 }}
              >
                <Dropdown
                  className="h-100   "
                  onSelect={handleSelect}
                  onMouseEnter={ () =>handleMouseEnter('showMdDropdown')} // Open on hover
                  onMouseLeave={()=>handleMouseLeave('showMdDropdown')} // Close on mouse leave
                  onClick={()=>handleClick('showMdDropdown')}                        
                  show={activeDropdown === 'showMdDropdown'}
                >
               <Dropdown.Toggle
    id="dropdown-category-selector"
    variant=""
    className=""
    style={{
      height: "h-100 m-0 pt-0 pb-0",
      background: "#ff7e00",
      color: "white",
      fontSize: "0.8rem",
      borderRadius: "0",
    }}
  ><span className="me-1 "style={{ fontSize: "1rem" }}>Shop By Categories</span>
    {/* Show only list icon */}
    <i className="bi bi-list "style={{ fontSize: "1.2rem" }}></i>
  </Dropdown.Toggle>

                  <Dropdown.Menu>
    {dropdownMenuLG.map((item) => (
      <Dropdown.Item
        key={item.key}
        eventKey={item.name}
    
        className={`${selectedCategory === item.key ? "selected-category" : ""}`}
        onClick={() => handleSelect(item.key)}
      >
        {item.name}
      </Dropdown.Item>
    ))}
    NavDropdown
    <Dropdown.Item
      eventKey={"more"}
      className={`${selectedCategory === "more" ? "selected-category" : ""}`}
      onClick={() => handleSelect("more")}
    >
      More Categories
    </Dropdown.Item>
  </Dropdown.Menu>
                </Dropdown>
              </Col>

              <Col
                className="d-flex justify-content-start align-item-center w-auto w-lg-100 gap-3 ms-4 ms-lg-0 gap-lg-5   h-15 "
                xs={{ span: "auto", order: 2, offset: 0 }}
                sm={{ span: "auto ", order: 2, offset: 0 }}
                md={{ span: "auto", order: 2, offset: 0 }}
                lg={{ span: 12, order: 1, offset: 0 }}
                style={{gap:"4.5rem"}}
              >
                <Nav.Link className="desktop" href="#home">
                  Home
                </Nav.Link>
                <Nav.Link className="desktop" href="#catalog">
                  Catalog
                </Nav.Link>
                <Nav.Link className="desktop" href="#pages">
                  Pages
                </Nav.Link>
                <Nav.Link className="desktop" href="#about">
                  About us
                </Nav.Link>
                <Nav.Link className="desktop" href="#contact">
                  Contact
                </Nav.Link>
              </Col>
            </Nav>
          </Row>
        </Container>
      </Navbar>
      
    </>
  );
}
