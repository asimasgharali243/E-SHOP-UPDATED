import React, { useCallback, useEffect, useRef, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FormGroup } from "../SubComponent/FormGroup";
import { resetPasswordApi } from "../../redux/api/authapi/resetPasswordApi";
import { clearResetState } from "../../redux/features/auth/ResetPasswordSlice";
import AuthValidationWorker from "../../utils/authValidation.js?worker";

const ResetPassword = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const isverify = location.state?.status || "";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    password: "",
    conformPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [Pshow, setShow] = useState(false);
  const [PConformShow, setConformShow] = useState(false);
  const workerRef = useRef(null);

  const { status } = useSelector((state) => state.resetPassword);

  useEffect(() => {
    if (!email || !isverify) {
      navigate("/verify/otp");
    }
  }, [email, isverify, navigate]);

  useEffect(() => {
    workerRef.current = new AuthValidationWorker();
    
    return () => {
      workerRef.current?.terminate();
    };
  }, [dispatch, email, formData]);

  useEffect(() => {
    if (status === "succeeded") {
      dispatch(clearResetState());
      navigate("/login");
    }
  }, [status, dispatch, navigate]);

  const handleChange = useCallback(
    (field) => (e) => {
      setFormData({ ...formData, [field]: e.target.value });
      setFormErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    },
    [formData]
  );

  const showPassword = useCallback(() => setShow((prev) => !prev), []);
  const showConformPassword = useCallback(() => setConformShow((prev) => !prev), []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const fieldsToValidate = ["password", "conformPassword", "comparePassword"];
      workerRef.current.postMessage({ formData, fieldsToValidate });
      workerRef.current.onmessage = (event) => {
        const errors = event.data;
        if (Object.keys(errors).length === 0) {
          dispatch(resetPasswordApi({ email, password: formData.password }));
        } else {
          setFormErrors(errors);
        }
      };
      
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
        <Row>
          <Col>
            <FormGroup
              label="Password"
              id="password"
              type={Pshow ? "text" : "password"}
              value={formData.password}
              onChange={handleChange("password")}
              formError={formErrors.password}
              icon={Pshow ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}
              showPassword={showPassword}
              classFormGroup="mb-3"
              autoFocus
            />

            <FormGroup
              label="Confirm Password"
              id="conformPassword"
              type={PConformShow ? "text" : "password"}
              value={formData.conformPassword}
              onChange={handleChange("conformPassword")}
              formError={formErrors.conformPassword}
              icon={PConformShow ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}
              showPassword={showConformPassword}
              classFormGroup="mb-3"
            />

            <Button
              variant="primary"
              type="submit"
              className="w-100 bg-black text-white mt-3"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Please wait..." : "Reset Password"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default ResetPassword;
