import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Footer.scss";

const groups = [
  {
    title: "Explore",
    links: [
      ["Shop all", "/home"],
      ["Browse catalog", "/catalog"],
      ["Your wishlist", "/wishlist"],
      ["Your cart", "/cart"],
    ],
  },
  {
    title: "Customer care",
    links: [
      ["Help center", "/help"],
      ["Contact us", "/contact"],
      ["Shipping policy", "/shipping-policy"],
      ["Returns & refunds", "/return-policy"],
    ],
  },
  {
    title: "About E-Shop",
    links: [
      ["Our story", "/about"],
      ["Privacy policy", "/privacy-policy"],
      ["Terms & conditions", "/terms-and-conditions"],
    ],
  },
];

const Footer = () => (
  <footer className="eshop-footer mt-5" aria-label="Site footer">
    <div className="eshop-footer__accent" aria-hidden="true" />
    <Container className="eshop-footer__inner">
      <div className="eshop-footer__intro">
        <div>
          <span className="eshop-footer__eyebrow">DISCOVER MORE</span>
          <h2>Find your next favorite.</h2>
          <p>Explore the catalog, save products you love, and shop at your own pace.</p>
        </div>
        <Link className="eshop-footer__cta" to="/catalog">
          Explore products <i className="bi bi-arrow-up-right" aria-hidden="true" />
        </Link>
      </div>
      <Row className="eshop-footer__main gy-5">
        <Col xs={12} lg={4}>
          <Link to="/" className="eshop-footer__brand" aria-label="E-Shop home">
            <span className="eshop-footer__brand-icon"><i className="bi bi-bag-heart" aria-hidden="true" /></span>
            E<span>Shop</span><span className="eshop-footer__brand-dot">.</span>
          </Link>
          <p className="eshop-footer__description">
            A modern shopping experience built around discovery, convenience and thoughtful design.
          </p>
          <div className="eshop-footer__note">
            <i className="bi bi-shield-check" aria-hidden="true" />
            <span>Questions about an order? Our help and policy pages are here for you.</span>
          </div>
        </Col>
        {groups.map((group) => (
          <Col xs={6} sm={4} lg key={group.title}>
            <h3 className="eshop-footer__heading">{group.title}</h3>
            <ul className="eshop-footer__links">
              {group.links.map(([label, url]) => (
                <li key={url}><Link to={url}>{label}</Link></li>
              ))}
            </ul>
          </Col>
        ))}
      </Row>
      <div className="eshop-footer__bottom">
        <p>© {new Date().getFullYear()} E-Shop. Crafted for better everyday shopping.</p>
        <div className="eshop-footer__legal">
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/terms-and-conditions">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </Container>
  </footer>
);

export default Footer;
