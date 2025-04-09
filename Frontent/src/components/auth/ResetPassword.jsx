import React, { useCallback, useEffect, useState} from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FormGroup } from "../SubComponent/FormGroup";
import { resetPasswordApi } from "../../redux/api/authapi/resetPasswordApi";
import { validateForm } from "../../utils/authValidation";
import {clearResetState} from "../../redux/features/auth/ResetPasswordSlice"

const ResetPassword = () => {
  const location = useLocation();
  const email = location.state?.email || ""; // Retrieve email from state
  const isverify = location.state?.isverify || "";
  const navigate = useNavigate();
  const dispatch = useDispatch();
   const [formErrors, setFormErrors] = useState({});
    const [Pshow, setShow] = useState(false);
    const [PConformShow, setConformShow] = useState(false);
   const [formData, setFormData] = useState({
       password: "",
       conformPassword: "",
     });

    const {loading ,success, error } = useSelector((state) => state.resetPassword);
  useEffect(() => {
    if (!email && !isverify) {
      navigate("/verify/otp");
    }
  }, [email, isverify, navigate]);

  const handleChange = (field) => (e) => {
      setFormData({ ...formData, [field]: e.target.value });
      setFormErrors((prevErrors) => {
        const { [field]: _, ...rest } = prevErrors;
        return rest;
      });
    };
    const showPassword = useCallback(
      (e) => {
        setShow(!Pshow);
      },
      [Pshow]
    );
    const showConformPassword = useCallback(
        (e) => {
            setConformShow(!PConformShow);
        },
        [PConformShow]
      );
    

  const handleSubmit = (event) => {
    event.preventDefault();
    const fieldsToValidate=["password","conformPassword","comparePassword"];
    const errors=validateForm(formData,fieldsToValidate);
    setFormErrors(errors);
    if(Object.keys(errors).length===0){
      dispatch(resetPasswordApi({email:email,password:formData.password}));
      console.log("reset password:");
    }
  };

  useEffect(() => {
    if (success) {
        dispatch(clearResetState());
      navigate("/login");
    }
  }, [success, navigate]);
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
              autoFocus={true}
            />

            <FormGroup
              label="conform Password"
              id="conformpassword"
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
              disabled={loading}
            >
              {loading ? "Please wait..." : "Reset Password"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default ResetPassword;
