import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Nav,
  Form,
  Navbar,
  Button,
  Badge,
  Offcanvas,
} from "react-bootstrap";
import { Link,useNavigate, useLocation } from "react-router-dom";
import { toggleTheme } from "../../redux/features/theme-mode/ThemeSlice";
import CustomContainer from "../SubComponent/CustomContainer";
import DropdownMenu from "./DropdownMenu";
import "./Header1.scss";
import TopBar from "./TopBar";
import SearchBar from "./SearchBar";
import ToggleIcon from "../SubComponent/ToggleIcon";
import useIsmobile from "../CustomHook/useIsmobile";
export default function Header1() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleShow = () => setShowOffcanvas(true);
  const handleClose = () => setShowOffcanvas(false);
  const location = useLocation();
  const theme = useSelector((state) => state.theme.theme);
 const isMobile= useIsmobile();
const offcanvasRef = useRef(null);
const navigate = useNavigate();

// useEffect(() => {
//   if (offcanvasRef.current) {
//     if (isMobile) {
//       offcanvasRef.current?.setAttribute("data-bs-theme", theme);
//     } else {
//       offcanvasRef.current?.removeAttribute("data-bs-theme");
//     }
//   }
// }, [isMobile, theme]);


 
  const categories = [
    {
      name: "Women's Fashion",
      key: "women",
      subcategories: Array.from({ length: 30 }, (_, i) => ({
        name: `Women's Item ${i + 1}`,
        key: `women_item_${i + 1}`,
        image: `https://picsum.photos/seed/women${i + 1}/150/150`,
      })),
    },
    {
      name: "Women's Fashion1",
      key: "women1",
      subcategories: Array.from({ length: 30 }, (_, i) => ({
        name: `Women's Item ${i + 1}`,
        key: `women_item_${i + 1}`,
        image: `https://picsum.photos/seed/women${i + 1}/150/150`,
      })),
    },
    {
      name: "Men's Fashion",
      key: "men",
      subcategories: Array.from({ length: 30 }, (_, i) => ({
        name: `Men's Item ${i + 1}`,
        key: `men_item_${i + 1}`,
        image: `https://picsum.photos/seed/men${i + 1}/150/150`,
      })),
    },
    {
      name: "Electronics",
      key: "electronics",
      subcategories: Array.from({ length: 27 }, (_, i) => ({
        name: `Electronics Item ${i + 1}`,
        key: `electronics_item_${i + 1}`,
        image: `https://picsum.photos/seed/electronics${i + 1}/150/150`,
      })),
    },
  ];


  return (
    <>
      {/* top Bar */}
      <TopBar />

      {/* Logo search and icon header */}
      <Navbar expand="md" className="header" data-bs-theme={theme}>
        <CustomContainer className="header-container">
          <Row className="d-flex align-items-center justify-content-between   ">
            <Col
              className="logo-container"
              xs={{ span: 4, order: 1 }}
              sm={{ span: 4, order: 1 }}
              md={{ span: 2, order: 1 }}
            >
              <Navbar.Brand
                className="navbar-brand d-flex align-items-end gap-2"
                as={Link}
                to="/"
              >
                <img src="/Bag1.png" alt="logo" className="logo" />
                <span className="logo-text">E-SHOP</span>
              </Navbar.Brand>
            </Col>

            <Col
              className="SearchBar-container"
              xs={{ span: 12, order: 4 }}
              xm={{ span: 12, order: 4 }}
              md={{ span: 4, order: 2 }}
            >
              <SearchBar />
            </Col>
            <Col
              xs={{ span: 4, order: 2 }}
              sm={{ span: 4, order: 2 }}
              md={{ span: 5, order: 3 }}
            >
              <Nav className="d-flex align-items-center justify-content-evenly">
                <Nav.Link as={Link} to="/login" className="d-none d-md-flex">
                  <i className="bi bi-person"></i>{" "}
                  <span className="d-none d-lg-flex">Sign in</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/wishlist" className="d-none d-md-flex">
                  <span>
                    <i className="bi bi-heart"></i>
                    <Badge bg="secondary">0</Badge>
                  </span>{" "}
                  <span className="d-none d-lg-flex">Wishlist</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/Cart" className="">
                  <span>
                    <i className="bi bi-cart"></i>
                    <Badge bg="secondary">0</Badge>
                  </span>
                  <span className="d-none d-lg-flex">Cart</span>
                </Nav.Link>
              </Nav>
            </Col>
            <Col
              className="menu-toggle-btn d-flex d-md-none justify-content-end "
              xs={{ span: 3, order: 3 }}
              sm={{ span: 3, order: 3 }}
              md={{ span: 12, order: 4 }}
            >
              <ToggleIcon handleoffCanvass={handleShow } handleClose={handleClose} isOpen={showOffcanvas} />
            </Col>
          </Row>
        </CustomContainer>
      </Navbar>

      {/* menu  */}

      <Navbar expand="md" className={`header-menu ${!isMobile ?`bg-white h-0`:`h-50`}`}
        
      >
        <CustomContainer className=" menu-container">
          <Row className="">
            <Navbar.Offcanvas

   id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
              show={showOffcanvas}
              onHide={handleClose}
              placement="start"
              ref={offcanvasRef}
              data-bs-theme={theme}
              // className={isMobile ? `offcanvas-${theme}` : "bg-white"}
            >
              <Offcanvas.Header as={Row} closeButton>
                <Offcanvas.Title as={Col} id="offcanvasNavbarLabel">
                  <Navbar.Brand
                    className="navbar-brand d-flex align-items-start "
                    as={Link}
                    to="/"
                  >
                    <img src="/Bag.png" 
                    style={{width:"50px",height:"50px"}}
                    onError={(e) => {
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                    alt="logo" className="logo" />
                    <span className="logo-text ">E-SHOP</span>
                  </Navbar.Brand>
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="">
                <Nav className={``}>
                  <DropdownMenu 
                  navigate={navigate} 
                  categories={categories} 
                  theme={theme}
                  isMobile={isMobile}
                  setShowOffcanvas={setShowOffcanvas}
                  />
                  <Nav.Link
                    as={Link}
                    onClick={handleClose}
                    to="/"
                    className={` ${
                      location.pathname === "/" ? "active" : ""
                    }`}
                  >
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    onClick={handleClose}
                    to="/catalog"
                    className={` ${
                      location.pathname === "/catalog" ? "active" : ""
                    }`}
                  >
                    Catalog
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    onClick={handleClose}
                    to="/store"
                    className={` ${
                      location.pathname === "/store" ? "active" : ""
                    }`}
                  >
                    Store
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    onClick={handleClose}
                    to="/about"
                    className={` ${
                      location.pathname === "/about" ? "active" : ""
                    }`}
                  >
                    About
                  </Nav.Link>
 
                  <Nav.Link
                    as={Link}
                    onClick={handleClose}
                    to="/contact"
                    className={` ${
                      location.pathname === "/contact" ? "active" : ""
                    }`}
                  >
                    DashBoard
                  </Nav.Link>
                </Nav>

              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Row>
        </CustomContainer>
      </Navbar>
    </>
  );
}
