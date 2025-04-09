import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/api/authapi/authapi";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { validateForm } from "../../utils/authValidation";
import { FormGroup } from "../SubComponent/FormGroup";
import { Link } from "react-router-dom";

const SignUp = () => {
  
  const dispatch = useDispatch();
  
  const { loading, error, islogin } = useSelector((state) => state.authUser);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });

    // Remove the error for this field
    setFormErrors((prevErrors) => {
      const { [field]: _, ...rest } = prevErrors;
      return rest;
    });
  };
  const showPassword = useCallback(
    (e) => {
      setShow(!show);
    },
    [show]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const fieldTovalidate = [
        "firstName",
        "lastName",
        "userName",
        "email",
        "password",
      ];
      
      const errors = validateForm(formData, fieldTovalidate);
      setFormErrors(errors);
      if (Object.keys(errors).length === 0) {
        
        dispatch(
          register({
            firstName: formData.firstName,
            lastName: formData.lastName,
            userName: formData.userName,
            email: formData.email,
            password: formData.password,
          })
        );
        setFormData({
          firstName: "",
          lastName: "",
          userName: "",
          email: "",
          password: "",
        });
        
        console.log(loading, error, islogin);
      }
    },
    [formErrors]
  );

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light authcontainer "
      style={{ height: "100vh", width: "100vw" }}
    >
      <Form onSubmit={handleSubmit} className="p-4 border rounded formcss">
        <h2 className="text-center pb-3">Sign Up</h2>
      
        <Row>
          <Col className="d-flex flex-row gap-3 ">
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
              autoFocus={true}
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
              ame="userName"
              value={formData.userName}
              onChange={handleChange("userName")}
              formError={formErrors.userName}
              classFormGroup="mb-3"
              icon="bi bi-person-fill"
            />

            <FormGroup
              label="Email"
              id="email"
              type="email"
              ame="email"
              value={formData.email}
              onChange={handleChange("email")}
              formError={formErrors.email}
              icon="bi bi-envelope-at-fill"
              classFormGroup="mb-3"
            />

            <FormGroup
              label="password"
              id="password"
              type={show ? "text" : "password"}
              ame="password"
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
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
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
