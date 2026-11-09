import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Nav, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { toggleTheme } from "../../redux/features/theme-mode/ThemeSlice";
import CustomContainer from "../SubComponent/CustomContainer";

export default function TopBar() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const dark_mode = useSelector((state) => state.theme.dark_mode);

  // Apply the theme class to the body once when theme or dark_mode changes
  useEffect(() => {
    document.body.className = theme;
  }, [theme, dark_mode]);

  return (
    <header className="topbar-container" role="banner">
      <CustomContainer>
        <Row className="align-items-center justify-content-between">
          {/* Help Text (hidden on small devices) */}
          <Col className="d-none d-md-flex align-items-center">
            <span className="topbar-text" aria-label="Customer help line">
              Need assistance? Explore our help center
            </span>
          </Col>

          {/* Navigation Links */}
          <Nav as={Col} className="d-flex align-items-center  justify-content-between">
            <Nav.Item>
              <Nav.Link as={Link} to="/about" className="topbar-text" aria-label="Visit our store">
                About E-Shop
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/help" className="topbar-text" aria-label="Track your order">
                Help center
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Dark Mode Switch */}
          <Form
            as={Col}
            className="d-flex align-items-center justify-content-end "
            role="group"
            aria-label="Dark mode toggle"
          >
            <Form.Check
              type="switch"
              id="dark-mode-switch"
              label="Dark mode"
              checked={dark_mode}
              onChange={() => dispatch(toggleTheme())}
              aria-checked={dark_mode}
              className="topbar-text"
            />
          </Form>
        </Row>
      </CustomContainer>
    </header>
  );
}
