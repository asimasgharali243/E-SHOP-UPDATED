import React, { useCallback, useEffect, useRef, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/api/authapi/authapi";
import { Link } from "react-router-dom";

const ResetPassword = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
const {user} = useSelector((state) => state.authUser);

useEffect(() => {
  if (!user) {
    navigate("/login");
  }
}, [dispatch,user,navigate]);

  
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      
      dispatch(logout());
    },
    [dispatch, navigate]
  );

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light authcontainer"
      style={{ height: "100vh", width: "100vw" }}
    >
      <Form onSubmit={handleSubmit} className="p-4 border rounded formcss w-25 h-50 d-flex flex-column justify-content-center align-items-center">
  <Row className="w-100">
    <Col className="d-flex justify-content-center">
      <Button
        type="submit"
        className=" fw-bold text-white p-3 w-75"
      >
        Logout
      </Button>
    </Col>
  </Row>
  <Link to="/home" ><p className="text-left text-primary pt-3 ">return to home</p></Link>  
</Form>

    </Container>
  );
};

export default ResetPassword;
