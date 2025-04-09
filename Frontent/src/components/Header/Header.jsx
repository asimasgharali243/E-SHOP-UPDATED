import { Row, Col, Container, Nav, Navbar, Form, Button, Badge, Offcanvas } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/features/theme-mode/ThemeSlice';
import DropdownMenu from './DropdownMenu';

function OffcanvasExample() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleShow = () => setShowOffcanvas(true);
  const handleClose = () => setShowOffcanvas(false);
  const CurrentLocation=useLocation() 
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const dark_mode = useSelector((state) => state.theme.dark_mode);

  useEffect(() => {
    document.body.className = theme; // Apply the theme class to the body
  }, [theme, dark_mode]);

  return (
    <>
      <div className="lg-py-2">
        <Container className=" justify-content-between align-items-center">
          <Row className='align-items-center m-0'>
          <Col className='d-none d-md-flex'> <span >Need help? Call us: (+98) 0234 456 789</span></Col>
          <Nav as={Col} className="d-flex align-items-center">
            <Nav.Link as={Link} to="#store" className="px-2 d-none d-md-flex">Our store</Nav.Link>
            <Nav.Link as={Link} to="#track" className="px-2">Track your order</Nav.Link>
          </Nav>
          <Form as={Col} className='checkDarkMode'>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Dark mode"
              checked={dark_mode}
              onChange={() => dispatch(toggleTheme())}
             
             
            />
          </Form>
          </Row>
        </Container>
      </div>

      <Navbar expand="md" className="header" data-bs-theme={theme}>
        <Container >
          <Row className="m-0 HeaderRow1 w-100 align-items-center justify-content-between">
            <Col 
            
            md={{span:2,order:1}}
            xs={{span:2,order:1}}
            className="logo ">
              <Navbar.Brand as={Link} to="/">E-SHOP</Navbar.Brand>
            </Col>

            <Col 
            
            md={{span:5,order:2}}
            xs={{span:12,order:4}}
            className="search">
              <Form className="p-0">
                <Form.Control type="search" placeholder="Search for products..." className="me-2" aria-label="Search" />
                <Button ><i className="bi bi-search"></i></Button>
              </Form>
            </Col>

                 <Nav as={Col}
              md={{span:4,order:3}}
              xs={{span:4,order:2}}
              className="d-flex justify-content-center justify-content-md-around  align-items-center"
              >
                <Nav.Link as={Link} to="/login" className="px-2 d-none d-md-flex ">
                <i className="bi bi-person"></i> <span className="d-none d-lg-flex">Sign in</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/wishlist" className="px-2 d-none d-md-flex">
                <span><i className="bi bi-heart"></i><Badge bg="secondary">0</Badge></span>  <span className="d-none d-lg-flex">Wishlist</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/cart" className="px-0 px-md-2">
                <span><i className="bi bi-cart"></i><Badge bg="secondary">0</Badge></span><span className="d-none d-lg-flex">Cart</span>
                </Nav.Link>
              </Nav>
    

            <Col 
            
            md={{span:1,order:4, offset:1}}
            xs={{span:1,order:3, offset:0}}
            className="d-flex justify-content-end">
              <Navbar.Toggle onClick={handleShow} className="d-md-none" aria-controls="offcanvasNavbar" />
            </Col>
          </Row>
        </Container>
      </Navbar>

      <Navbar expand="md" className="header-menu bg-white m-0 p-0 ">
        <Container className=' '>
          <Row className="m-0 HeaderRow2 w-100 align-items-center justify-content-between">
            <Navbar.Offcanvas
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
              className='px-0'
              show={showOffcanvas}
              onHide={handleClose}
              placement="start"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="offcanvasNavbarLabel">E-Shop</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="px-0">
                  <DropdownMenu />
                  <Nav.Link as={Link} onClick={handleClose} to="/"         className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} >Home</Nav.Link>
                  <Nav.Link as={Link} onClick={handleClose} to="/catalog"  className={`nav-link ${location.pathname === '/catalog' ? 'active' : ''}`} >Catalog</Nav.Link>
                  <Nav.Link as={Link} onClick={handleClose} to="/about"    className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} >About</Nav.Link>
                  <Nav.Link as={Link} onClick={handleClose} to="/contact"  className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} >Contact</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Row>
        </Container>
      </Navbar>
    </>
  );
}

export default OffcanvasExample;
