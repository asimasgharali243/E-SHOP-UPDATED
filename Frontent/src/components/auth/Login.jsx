import React, { useState, useCallback, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/api/authapi/authapi";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { FormGroup } from "../SubComponent/FormGroup";
import { validateForm } from "../../utils/authValidation";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.authUser);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldTovalidate = ["email", "password"];
    const errors = validateForm(formData, fieldTovalidate);
    console.log(errors);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      dispatch( login({email:formData.email,password:formData.password}));
      setFormData({ email: "", password: "" });
    }
  
  console.log(loading, error);
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center  authcontainer "
      style={{ height: "100vh", width: "100vw" }}
    >
      
        
          <Form
            onSubmit={handleSubmit}
            className="p-4 border  formcss  "
          >
            
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
              autoFocus={true}
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
            <Link to={""} className="d-block text-end mb-1" onClick={(e) => {e.preventDefault();navigate("/forgetpassword") }} >Forgot Password</Link>

            <Button
              variant="primary"
              type="submit"
              id="submit"
              className="w-100 bg-black text-white"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>

            <div className="text-end   mt-3">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
            </Col>
            </Row>
          
          </Form>
    </Container>
        
            
  );
};

export default Login;
