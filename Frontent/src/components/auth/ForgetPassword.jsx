import React, { useEffect, useState,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { FormGroup } from "../SubComponent/FormGroup";
import { validateForm } from "../../utils/authValidation";

import { useDispatch, useSelector } from "react-redux";
import { forgetPassword } from "../../redux/api/authapi/ForgetPassword";
import { OtpSendState } from "../../redux/features/auth/ForgetPasswordSlice";

const ForgetPassword = () => {
  const [formData, setFormData] = useState({ email: "" });
  const dispatch = useDispatch();
  const { isOtpSend, loading, error } = useSelector((state) => state.ForgetPassword);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setFormData({ [field]: e.target.value });
    if (formErrors) setFormErrors({});
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const fieldToValidate = ["email"];
    const errors = validateForm(formData, fieldToValidate);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      dispatch(forgetPassword({ email: formData.email }));
    }
  }, [dispatch, formData]);

  useEffect(() => {
    if (isOtpSend) {

      navigate("/verify/otp", { state: { email: formData.email } });
    }
  },[isOtpSend]);

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center  authcontainer"
      style={{ height: "100vh", width: "100vw" }}
    >
      <Form onSubmit={handleSubmit} className="p-4 border rounded formcss">
        <h3 className="mb-3">We Will Sending OTP to Your Email</h3>
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
