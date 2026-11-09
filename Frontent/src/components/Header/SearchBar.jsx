import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <Form className="d-flex eshop-search" role="search" onSubmit={handleSearch}>
      <Form.Control
        type="search"
        placeholder="Search products, categories, and more"
        className="eshop-search__input"
        aria-label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button
        type="submit"
        className="Search-icon eshop-search__button"
        aria-label="Search products"
        variant="outline-secondary"
      >
        <i className="bi bi-search" aria-label="Search icon"></i>
      </Button>
    </Form>
  );
}
