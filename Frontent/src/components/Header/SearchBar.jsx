import React,{useState} from "react";
import { Form, Button } from "react-bootstrap";
export default function SearchBar() {
  return (
    <Form className="">
      <Form.Control
        type="search"
        placeholder="Search for products..."
        className="me-2"
        aria-label="Search"
      />
      <Button className="Search-icon"
        aria-label="Search button"
      
      >
        <i className="bi bi-search"
        aria-label="Search icon"
        ></i>
      </Button>
    </Form>
  );
}
