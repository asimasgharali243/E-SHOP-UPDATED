import React, { useState } from "react";
import { InputGroup, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="position-relative">
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <i className="bi bi-search fs-5"></i>
        </InputGroup.Text>
        <Form.Control
          placeholder="Start typing to search for products"
          aria-label="Search products"
          className="form-control-search"
          value={searchTerm}
          onChange={handleChange}
        />
      </InputGroup>
    </div>
  );
};

export default SearchBar;
