import React, { useCallback, useEffect, useRef, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { VerifyOtpApi } from "../../redux/api/authapi/VerifyOtp";
import { forgetPassword } from "../../redux/api/authapi/ForgetPassword";
import { useWorkerCountdown } from "../CustomHook/useWorkerCountdown";
import { resetTime } from "../../redux/features/auth/ForgetPasswordSlice";
import OtpValidatorWorker from "../../utils/otpValidator.js?worker";

const VerifyOtp = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { status } = useSelector((state) => state.VerifyOtp);
  const reduxTimer = useSelector((state) => state.ForgetPassword.timer);
console.log(status);
  const [otpError, setOtpError] = useState("");
  const otpArray = useRef(["", "", "", "", "", ""]).current;
  const inputRefs = useRef([]);
  const otpValidatorWorker = useRef(null);

  const initialTargetTime =
    typeof reduxTimer === "string"
      ? new Date(reduxTimer).getTime()
      : reduxTimer;

  const { minutes, seconds, expired } = useWorkerCountdown(initialTargetTime);

  useEffect(() => {
    if (!email) navigate("/forgetpassword");
    else inputRefs.current[0]?.focus();
  }, [email, navigate]);

  useEffect(() => {
    if (status === "succeeded") {
      navigate("/reset/password", { state: { email,status } });
    }
  }, [status, email, navigate]);

  useEffect(() => {
    otpValidatorWorker.current = new OtpValidatorWorker();
    otpValidatorWorker.current.onmessage = ({ data }) => {
      const { isValid } = data;
      if (isValid) {
        dispatch(VerifyOtpApi({ email, otp: otpArray.join("") }));
      } else {
        setOtpError("Invalid OTP format. Please enter 6 digits.");
      }
    };
    return () => otpValidatorWorker.current?.terminate();
  }, [dispatch, email]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    otpArray[index] = value;
    setOtpError("");
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otpArray.join("");
    otpValidatorWorker.current?.postMessage({ otp: finalOtp });
  };
  

  const resendOtp = useCallback(
    (e) => {
      e.preventDefault();
      if (expired) {
        dispatch(resetTime());
        dispatch(forgetPassword({ email }));
      }
    },
    [dispatch, expired, email]
  );

  const truncateEmail = (email) => {
    const [name, domain] = email.split("@");
    return `${name.slice(0, 4)}...@${domain}`;
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light authcontainer"
      style={{ height: "100vh", width: "100vw" }}
    >
      <Form onSubmit={handleSubmit} className="p-4 border rounded formcss">
        <Row>
          <Col>
            <h3 className="text-start mb-4">We sent OTP to {truncateEmail(email)}</h3>
            <label>OTP *</label>
          </Col>
        </Row>

        <Row>
          <Col className="otp_input_container d-flex gap-2">
            {[...Array(6)].map((_, index) => (
              <Form.Control
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                required
                style={{ width: "3rem", textAlign: "center" }}
              />
            ))}
          </Col>
        </Row>

        {otpError && (
          <Row className="mt-2">
            <Col>
              <span className="text-danger">{otpError}</span>
            </Col>
          </Row>
        )}

        <Row className="mt-3">
          <Col>
            <Button
              type="submit"
              className="w-100 bg-black text-white"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Verifying..." : "Verify OTP"}
            </Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col className="d-flex align-items-center gap-3">
            <Button
              onClick={resendOtp}
              variant="link"
              disabled={!expired}
              className="p-0"
            >
              {expired ? "Resend OTP" : "Wait to resend"}
            </Button>
            {!expired && (
              <span className="text-primary fw-bold">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
            )}
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default VerifyOtp;
