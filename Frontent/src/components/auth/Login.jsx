import React, { useState, useCallback, useEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/api/authapi/authapi";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { FormGroup } from "../SubComponent/FormGroup";
import AuthValidationWorker from "../../utils/authValidation.js?worker";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, user } = useSelector((state) => state.authUser,shallowEqual);
console.log(user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [show, setShow] = useState(false);
  const workerRef = useRef(null);

  useEffect(() => {
  if (user) {
    navigate("/logout");
  }
  
}, [navigate,user]);


  useEffect(() => {
    workerRef.current = new AuthValidationWorker();

    workerRef.current.onmessage = (event) => {
      const errors = event.data;
      if (Object.keys(errors).length === 0) {
        dispatch(login({ email: formData.email, password: formData.password }));
        setFormData({ email: "", password: "" });
      } else {
        setFormErrors(errors);
      }
    };

    return () => {
      workerRef.current.terminate();
    };
  }, [dispatch, formData]);

  const handleChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prevErrors) => {
      const { [field]: _, ...rest } = prevErrors;
      return rest;
    });
  }, []);

  const showPassword = useCallback(() => {
    setShow((prev) => !prev);
  }, []);

  const handleForgotPassword = useCallback(
    (e) => {
      e.preventDefault();
      navigate("/forgetpassword");
    },
    [navigate]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const fieldsToValidate = ["email", "password"];
      workerRef.current.postMessage({ formData, fieldsToValidate });
    },
    [formData]
  );

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center authcontainer"
      style={{ height: "100vh", width: "100vw" }}
    >
      <Form onSubmit={handleSubmit} className="p-4 border formcss">
        <h2 className="text-center">Log In</h2>
        <Row>
          <Col>
            <FormGroup
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              formError={formErrors.email}
              icon="bi bi-envelope-at-fill"
              classFormGroup="mb-3"
              autoFocus
            />
            <FormGroup
              label="Password"
              id="password"
              type={show ? "text" : "password"}
              value={formData.password}
              onChange={handleChange("password")}
              formError={formErrors.password}
              icon={show ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}
              showPassword={showPassword}
              classFormGroup="mb-3"
            />
            <Link
              to=""
              className="d-block text-end mb-1"
              onClick={handleForgotPassword}
            >
              Forgot Password
            </Link>
            <Button
              variant=""
              type="submit"
              id="submit"
              className="w-100 bg-black text-white"
              disabled={( status === "loading") ? true : false}
            >
              {status === "loading" ? "Logging in..." : "Log In"}
            </Button>
            <div className="text-end mt-3">
              Dont have an account? <Link to="/signup">Sign Up</Link>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default Login;
