// import React from "react";
// import { Col, Container, Row } from "react-bootstrap";

// export default function Cart() {
//   return (
//     <Container>
//       <Row  >
//         <Col xl={9} as={Row} className="border my-5 justify-content-center align-items-center">
//         <Col><h6>Product</h6></Col>
//         <Col><h6>Price</h6></Col>
//         <Col><h6>Quantity</h6></Col>
//         <Col><h6>Subtotal</h6></Col>
//         </Col>
//         <Col xl={3} className="border my-5 justify-content-center align-items-center">
//         <h3>cart total</h3>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

import React, { useState } from "react";
// import DeleteIcon from "@mui/icons-material/Delete";
// import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "LCD Monitor ",
      price: 650,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 2,
      name: "H1 Gamepad",
      price: 550,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=200",
    },
  ]);

  const handleQuantityChange = (id, newQty) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: parseInt(newQty) } : item
    );
    setCartItems(updated);
  };
  // delete button
  const handleDelete = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Container style={{ marginTop: "30px" }}>
      <h2 className="mb-4">Shopping Cart</h2>
      <Row className="justify-content-between  text-black">
        <Col xl={8} className="bg-white p-4 rounded-2 mb-5">
          <Row className="fw-bold border p-2 ">
            <Col md={4}>Product</Col>
            <Col md={2} className="text-center">
              Price
            </Col>
            <Col md={2} className="text-center">
              Quantity
            </Col>
            <Col md={3} className="text-center">
              Subtotal
            </Col>
          </Row>

          {cartItems.map((item) => (
            <Row key={item.id} className="align-items-center p-3 border mt-4">
              <Col md={4} className="d-flex align-items-center gap-3">
                <img
                  className="img-fluid"
                  src={item.image}
                  alt={item.name}
                  width="50"
                />
                <span>{item.name}</span>
              </Col>
              <Col md={2} className="text-center">
                ${item.price}
              </Col>
              <Col md={2} className="text-center">
                <Form.Select
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, e.target.value)
                  }
                  style={{ width: "80px", margin: "auto" }}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={3} className="text-center">
                ${item.price * item.quantity}
              </Col>
              <Col md={1} className="text-center">
                {/* <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(item.id)}
                >
                  <DeleteIcon />
                </IconButton> */}
                <i
                  className="bi bi-trash"
                  aria-label="delete"
                  onClick={() => handleDelete(item.id)}
                ></i>
              </Col>
            </Row>
          ))}

          {/* Action Buttons */}
          <Row className="mt-4">
            <Col className="">
              <Button style={{ backgroundColor: `var(--primary)` } } className="p-2 rounded-1 float-start w-25">
                Return To Shop
              </Button>
              <Button style={{ backgroundColor: `var(--primary)` }}  className="p-2 rounded-1 float-end w-25">
                Update Cart  
              </Button>
            </Col>
          </Row>
        </Col>

        {/*  Total Section */}
        <Col md={3} xl={3} className="">
          <div className="border p-4 bg-white rounded-2">
            <h5 className="fw-bold">Cart Total</h5>
            <div className="d-flex justify-content-between my-2">
              <span>Subtotal:</span>
              <span>${subtotal}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between my-2">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between my-2 fw-bold">
              <span>Total:</span>
              <span>${subtotal}</span>
            </div>
            <div className="d-flex justify-content-center">
            <Button
            as={Link}
              to="/checkout"
              style={{ backgroundColor: `var(--secondary)`}}
              className="w-100 mt-3 border-0 p-2 rounded-1"
            >
              Process to checkout
            </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
