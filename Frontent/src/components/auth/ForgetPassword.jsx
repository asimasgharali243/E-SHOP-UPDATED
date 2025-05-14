import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { FormGroup } from "../SubComponent/FormGroup";
import AuthValidationWorker from "../../utils/authValidation.js?worker";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { forgetPassword } from "../../redux/api/authapi/ForgetPassword";

const ForgetPassword = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { timer, loading } = useSelector(
    (state) => state.ForgetPassword,
    shallowEqual
  );
  

  const emailRef = useRef(""); // store latest email for navigation

  // Navigate to OTP verification when timer is set
  useEffect(() => {
    const expiryTime = new Date(timer).getTime();
    console.log("Expiry Time:", expiryTime);
    if (expiryTime > Date.now() && emailRef.current) {
      console.log(emailRef.current);
      navigate("/verify/otp", { state: { email: emailRef.current } });
    }
  }, [timer, navigate]);
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const worker = new AuthValidationWorker();

      worker.postMessage({
        formData,
        fieldsToValidate: ["email"],
      });

      worker.onmessage = (event) => {
        const errors = event.data;
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
          emailRef.current = formData.email;
          dispatch(forgetPassword({ email: formData.email }));
          navigate("/verify/otp", { state: { email: emailRef.current } });
        }

        worker.terminate();
      };

      worker.onerror = (error) => {
        console.error("Worker validation error:", error);
        worker.terminate();
      };
    },
    [dispatch, formData]
  );

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center authcontainer"
      style={{ height: "100vh", width: "100vw" }}
    >
      <Form
        onSubmit={handleSubmit}
        className="p-4 border rounded formcss shadow bg-white"
      >
        <h4 className="pb-3">We Will Send an OTP to Your Email</h4>
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
            <Button
              variant="primary"
              type="submit"
              className="w-100 bg-black text-white"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default ForgetPassword;
