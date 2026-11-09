import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Nav,
  Navbar,
  Badge,
  Offcanvas,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CustomContainer from "../SubComponent/CustomContainer";
import DropdownMenu from "./DropdownMenu";
import "./Header1.scss";
import "./ProfessionalHeader.scss";
import TopBar from "./TopBar";
import SearchBar from "./SearchBar";
import ToggleIcon from "../SubComponent/ToggleIcon";
import useIsmobile from "../CustomHook/useIsmobile";
import { useGetCategoriesQuery } from "../../redux/api/productsApi/ProductApi";

export default function Header1() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleShow = () => setShowOffcanvas(true);
  const handleClose = () => setShowOffcanvas(false);
  const location = useLocation();
  const theme = useSelector((state) => state.theme.theme);
  const isMobile = useIsmobile();
  const offcanvasRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux states
  const likes = useSelector((state) => state.Likes);

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.authUser.user);

  // Corrected profile image handling
  const profileImgSrc =
    user?.profileImage || user?.image || "/assets/default-avatar.png";

  // Categories API
  const { data: categoriesData, isLoading, isError } = useGetCategoriesQuery();

  // Local search state
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (searchQuery) {
      navigate(`/search?query=${searchQuery}`);
    }
  }, [searchQuery, navigate]);

  // Fallback categories in case API fails
  const fallbackCategories = [
    {
      name: "Women's Fashion",
      key: "women",
      subcategories: Array.from({ length: 10 }, (_, i) => ({
        name: `Women's Item ${i + 1}`,
        key: `women_item_${i + 1}`,
        image: `https://picsum.photos/seed/women${i + 1}/150/150`,
      })),
    },
    {
      name: "Men's Fashion",
      key: "men",
      subcategories: Array.from({ length: 10 }, (_, i) => ({
        name: `Men's Item ${i + 1}`,
        key: `men_item_${i + 1}`,
        image: `https://picsum.photos/seed/men${i + 1}/150/150`,
      })),
    },
    {
      name: "Electronics",
      key: "electronics",
      subcategories: Array.from({ length: 10 }, (_, i) => ({
        name: `Electronics Item ${i + 1}`,
        key: `electronics_item_${i + 1}`,
        image: `https://picsum.photos/seed/electronics${i + 1}/150/150`,
      })),
    },
  ];

  // Categories for dropdown
  const categories = isLoading
    ? [] // Show nothing while loading
    : isError
    ? fallbackCategories // Fallback if API error
    : categoriesData || []; // API data if available

  return (
    <>
      {/* Top Bar */}
      <TopBar />

      {/* Logo search and icon header */}
      <Navbar expand="md" className="header" data-bs-theme={theme}>
        <CustomContainer className="header-container">
          <Row className="d-flex align-items-center justify-content-between">
            {/* Logo */}
            <Col
              xs={{ span: 4, order: 1 }}
              sm={{ span: 4, order: 1 }}
              md={{ span: 2, order: 1 }}
              className="logo-container"
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

            {/* Search */}
            <Col
              xs={{ span: 12, order: 4 }}
              xm={{ span: 12, order: 4 }}
              md={{ span: 4, order: 2 }}
              className="SearchBar-container"
            >
              <SearchBar />
            </Col>

            {/* Right nav */}
            <Col
              xs={{ span: 4, order: 2 }}
              sm={{ span: 4, order: 2 }}
              md={{ span: 5, order: 3 }}
            >
              <Nav className="d-flex align-items-center justify-content-evenly">
                {/* If user logged in → show profile image, else Sign in */}
                {user && user ? (
                  <Nav.Link
                    as={Link}
                    to="/profile"
                    className="d-flex align-items-center"
                  >
                    <img
                      src={profileImgSrc}
                      alt={user?.userName?.slice(0, 1) || "User"}
                      className="rounded-circle"
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/assets/default-avatar.png"; // ✅ correct fallback
                      }}
                    />
                    <span className="d-none d-lg-flex ms-2">
                      {user.userName && user.userName.slice(0, 5)}
                    </span>
                  </Nav.Link>
                ) : (
                  <Nav.Link as={Link} to="/login" className="d-none d-md-flex">
                    <i className="bi bi-person"></i>{" "}
                    <span className="d-none d-lg-flex">Sign in</span>
                  </Nav.Link>
                )}

                {/* Wishlist */}
                {/* Wishlist */}
                <Nav.Link as={Link} to="/wishlist" className="d-none d-md-flex">
                  <span>
                    <i className="bi bi-heart"></i>
                    <Badge bg="secondary">
                      {likes?.likedProducts?.length || 0}
                    </Badge>
                  </span>{" "}
                  <span className="d-none d-lg-flex">Wishlist</span>
                </Nav.Link>

                {/* Cart */}
                <Nav.Link as={Link} to="/Cart">
                  <span>
                    <i className="bi bi-cart"></i>
                    <Badge bg="secondary">{cart?.items?.length || 0}</Badge>
                  </span>
                  <span className="d-none d-lg-flex">Cart</span>
                </Nav.Link>
              </Nav>
            </Col>

            {/* Mobile Toggle */}
            <Col
              xs={{ span: 3, order: 3 }}
              sm={{ span: 3, order: 3 }}
              md={{ span: 12, order: 4 }}
              className="menu-toggle-btn d-flex d-md-none justify-content-end"
            >
              <ToggleIcon
                style={{ backgroundColor: `var(--white)` }}
                handleoffCanvass={handleShow}
                handleClose={handleClose}
                isOpen={showOffcanvas}
              />
            </Col>
          </Row>
        </CustomContainer>
      </Navbar>

      {/* Menu */}
      <Navbar
        expand="md"
        className={`header-menu ${!isMobile ? `bg-white h-0` : `h-50`}`}
      >
        <CustomContainer className="menu-container">
          <Row>
            <Navbar.Offcanvas
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
              show={showOffcanvas}
              onHide={handleClose}
              placement="start"
              ref={offcanvasRef}
              data-bs-theme={theme}
            >
              <Offcanvas.Header as={Row} closeButton>
                <Offcanvas.Title as={Col} id="offcanvasNavbarLabel">
                  <Navbar.Brand
                    className="navbar-brand d-flex align-items-start"
                    as={Link}
                    to="/"
                  >
                    <img
                      src="/Bag.png"
                      style={{ width: "50px", height: "50px" }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.jpg";
                      }}
                      alt="logo"
                      className="logo"
                    />
                    <span className="logo-text ">E-SHOP</span>
                  </Navbar.Brand>
                </Offcanvas.Title>
              </Offcanvas.Header>

              <Offcanvas.Body>
                <Nav>
                  {isLoading ? (
                    <div className="d-flex justify-content-center my-2">
                      <Spinner animation="border" size="sm" />
                    </div>
                  ) : (
                    <DropdownMenu
                      navigate={navigate}
                      categories={categories}
                      theme={theme}
                      isMobile={isMobile}
                      setShowOffcanvas={setShowOffcanvas}
                    />
                  )}

                  {/* Links */}
                  <Nav.Link
                    as={Link}
                    onClick={handleClose}
                    to="/"
                    className={`${location.pathname === "/" ? "active" : ""}`}
                  >
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    onClick={handleClose}
                    to="/catalog"
                    className={`${
                      location.pathname === "/catalog" ? "active" : ""
                    }`}
                  >
                    Catalog
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    onClick={handleClose}
                    to="/about"
                    className={`${
                      location.pathname === "/about" ? "active" : ""
                    }`}
                  >
                    About
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    onClick={handleClose}
                    to="/dashboard"
                    className={`${
                      location.pathname === "/dashboard" ? "active" : ""
                    }`}
                  >
                    Dashboard
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
