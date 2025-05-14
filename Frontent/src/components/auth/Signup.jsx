import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { register } from "../../redux/api/authapi/authapi";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { FormGroup } from "../SubComponent/FormGroup";
import { Link, useNavigate } from "react-router-dom";
import AuthValidationWorker from "../../utils/authValidation.js?worker";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, user } = useSelector((state) => state.authUser, shallowEqual);
console.log(user);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
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
},[navigate,user]);
  useEffect(() => {
    workerRef.current = new AuthValidationWorker();

    // Setup message handler
    workerRef.current.onmessage = (event) => {
      const errors = event.data;
      if (Object.keys(errors).length === 0) {
        dispatch(register(formData));
        setFormData({
          firstName: "",
          lastName: "",
          userName: "",
          email: "",
          password: "",
        });
      } else {
        setFormErrors(errors);
      }
    };

    // Clean up on unmount
    return () => {
      workerRef.current.terminate();
    };
  }, [dispatch, formData]);

  const handleChange = useCallback((field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setFormErrors((prevErrors) => {
      const { [field]: _, ...rest } = prevErrors;
      return rest;
    });
  }, []);

  const showPassword = useCallback(() => setShow((prev) => !prev), []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const fieldsToValidate = [
        "firstName",
        "lastName",
        "userName",
        "email",
        "password",
      ];

      workerRef.current?.postMessage({ formData, fieldsToValidate });
    },
    [formData]
  );

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light authcontainer"
      style={{ height: "100vh", width: "100vw" }}
    >
      <Form onSubmit={handleSubmit} className="p-4 border rounded formcss">
        <h2 className="text-center pb-3">Sign Up</h2>
        <Row>
          <Col className="d-flex flex-row gap-3">
            <FormGroup
              label="FirstName"
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange("firstName")}
              formError={formErrors.firstName}
              icon="bi bi-person"
              classFormGroup="mb-3"
              autoFocus
            />
            <FormGroup
              label="LastName"
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange("lastName")}
              formError={formErrors.lastName}
              icon="bi bi-person"
              classFormGroup="mb-3"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup
              label="UserName"
              id="userName"
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange("userName")}
              formError={formErrors.userName}
              icon="bi bi-person-fill"
              classFormGroup="mb-3"
            />
            <FormGroup
              label="Email"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange("email")}
              formError={formErrors.email}
              icon="bi bi-envelope-at-fill"
              classFormGroup="mb-3"
            />
            <FormGroup
              label="Password"
              id="password"
              type={show ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange("password")}
              formError={formErrors.password}
              icon={show ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}
              showPassword={showPassword}
              classFormGroup="mb-3"
            />
            <Button
              variant=""
              type="submit"
              id="submit"
              className="w-100 bg-black text-white"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Signing up..." : "Sign Up"}
            </Button>
            <div className="text-end mt-3">
              Already have an account? <Link to="/login">Log In</Link>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default SignUp;
