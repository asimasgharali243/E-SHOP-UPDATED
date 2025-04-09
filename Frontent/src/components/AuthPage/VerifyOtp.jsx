import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { Link} from "react-router-dom";
import "./auth1.css";
import "../auth/Auth.css";

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
 /* const [loading, setLoading] = useState(false);
  const [isexpire, setIsExpire] = useState(false);
  const [otpTime, setOtpTime] = useState(null);*/
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [otp5, setOtp5] = useState("");
  const [otp6, setOtp6] = useState("");

  const otpArray = [setOtp1, setOtp2, setOtp3, setOtp4, setOtp5, setOtp6];
  
  useEffect(() => {
    if (ref1.current) {
      ref1.current.focus();
    }
    
  }, []);

  const inputChnage = (event, location) => {
    if (location < 5 && event.target.value) {
      inputRef[location + 1].current.focus();
    }
    otpArray[location](event.target.value);
  };

  const handleKeyDown = (event, location) => {
    if (event.key === "Backspace" && location > 0 && !event.target.value) {
      // Move to the previous input field if backspace is pressed
      inputRef[location - 1].current.focus();
    }
  };
  const truncateEmail = (email) => {
    const [name, domain] = email.split("@");
    const truncatedName = name.slice(0, 4); // Show only first 4 characters
    return `${truncatedName}...@${domain}`;
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const finalOtp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;

    
  };

  useEffect(() => {
    if (!email) {
      // Redirect to ForgetPassword if email is not available
      navigate("/forgetpassword");
    }
  }, [email, navigate]);

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light "
      style={{ height: "100vh", width: "100vw" }}
    >
      <Form onSubmit={handleSubmit} className="p-4 border rounded formcss  ">
        <h2 className="text-start mb-4">We are Send OTP To {truncateEmail(email)}</h2>

        <Row>
          <Col>
          <div className="auth_header">
            
            <p className="auth_heading">Verify your OTP</p>
            <p className="auth_title">
              Enter 6-digit OTP here we just sent at your email
            </p>
          </div>
          <div className="auth_item">
            <label>OTP *</label>
            <div className="otp_input_container">
              {inputRef.map((item, index) => {
                return (
                  <input
                    required
                    key={index}
                    onChange={(event) => inputChnage(event, index)}
                    ref={item}
                    onInput={(event) => {
                      if (event.target.value.length > 1) {
                        event.target.value = event.target.value.slice(0,1);
                      }
                    }}

                    onKeyDown={(event) => handleKeyDown(event, index)}
                    type="number"
                    className=""
                  />
                );
              })}
            </div>
          </div>
          
          <div className="mt-3">
            
          <Link>Resend</Link>  
            
          </div>
             <Button
                          variant="primary"
                          type="submit"
                          className="w-100 bg-black text-white mt-1"
                          
                        >
                          {/*loading ? "Signing up..." :*/ "Verify"}
                        </Button>
            
          
          
          <div>
          
          </div>
        </Col>  
        </Row>  
      </Form>
    </Container>
  );
};

export default VerifyOtp;


