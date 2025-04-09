import React, { useCallback, useEffect, useRef } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { VerifyOtpApi } from "../../redux/api/authapi/VerifyOtp";
import { forgetPassword } from "../../redux/api/authapi/ForgetPassword";
import { useCountdownTimer } from "../../utils/CountDownTimer";
import {
  OtpSendState,
  resetTime,
} from "../../redux/features/auth/ForgetPasswordSlice";



const VerifyOtp = () => {
  const location = useLocation();
  const email = location.state?.email || ""; // Retrieve email from state
  const navigate = useNavigate();
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);

  const inputRef = [ref1, ref2, ref3, ref4, ref5, ref6];
  const otpArray = useRef(["", "", "", "", "", ""]).current;
  const dispatch = useDispatch();
  const { loading, isverify } = useSelector((state) => state.VerifyOtp);
  const { isOtpSend, loading: resendOtploading } = useSelector(
    (state) => state.ForgetPassword
  );
  const countdown = useCountdownTimer(); // Get the countdown timer

  useEffect(() => {
    if (ref1.current) {
      ref1.current.focus();
    }
  }, [email, navigate]);

  useEffect(() => {
    if (isOtpSend) {
      dispatch(OtpSendState(false));
    }
  }, [isOtpSend]);

  useEffect(() => {
    if (!email) {
      navigate("/forgetpassword");
    }
  }, [email]);

  const handleChange = (event, index) => {
    otpArray[index] = event.target.value;
    if (event.target.value && index < inputRef.length - 1) {
      inputRef[index + 1].current.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && index > 0 && !otpArray[index]) {
      inputRef[index - 1].current.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const finalOtp = otpArray.join("");
    console.log("OTP Submitted:", finalOtp, email);
    console.log(finalOtp.length);
    dispatch(VerifyOtpApi({ email: email, otp: finalOtp }));
  };

  useEffect(() => {
    if (isverify) {
      navigate("/reset/password", {
        state: { email: email, isverify: isverify },
      });
    }
  }, [isverify]);

  const truncateEmail = (email) => {
    const [name, domain] = email.split("@");
    return `${name.slice(0, 4)}...@${domain}`;
  };

  const resendOtp = useCallback(
    (e) => {
      e.preventDefault();
      if (countdown === 0 && !resendOtploading) {
        console.log("Resending OTP to:", email);
        dispatch(resetTime()); // Reset timer to 0
        dispatch(forgetPassword({ email })); // Trigger OTP resend API call
      }
    },
    [dispatch, countdown, email, resendOtploading]
  );

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light authcontainer"
      style={{ height: "100vh", width: "100vw" }}
    >
      <Form  onSubmit={handleSubmit} className="p-4  border rounded formcss">
        <Row>
          
          <Col >
            <h3 className="text-start mb-4">
              We sent OTP to {truncateEmail(email)}
            </h3>
            <label>OTP *</label>
          </Col>
        </Row>

        <Row   className="">
          <Col className="otp_input_container ">
            {inputRef.map((ref, index) => (
              <Form.Control
                key={index}
                ref={ref}
                type="number"
                maxLength="1"
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                required
              />
            ))}
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              
              type="submit"
              className="w-100 bg-black text-white mt-3"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-start align-items-center mt-3">
            <Button
              
              onClick={resendOtp}
              className={`${countdown && "text-black"} `}
              disabled={resendOtploading || countdown} // Disable when countdown is > 0
            >
              {countdown ? `Wait to resend Otp` : "Resend OTP"}
            </Button>

            {
              <span className="text-primary fw-bold">
                {countdown ? `${countdown}` : ""}
              </span>
            }
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default VerifyOtp;
