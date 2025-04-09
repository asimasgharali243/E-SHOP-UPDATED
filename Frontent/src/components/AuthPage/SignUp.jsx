import React, { useCallback, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { validateForm } from "./validateForm";
import { FormGroup } from "../SubComponent/FormGroup";
import apis from "../../utils/apis";
const SignUp_LogIn = ({ isLogin }) => {
  const [isLoginState, setIsLoginState] = useState(isLogin);
  const navigate = useNavigate();

  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Form Input Control
  const handleChange = (field) => (e) => {
    console.log(field);
    setFormData({ ...formData, [field]: e.target.value });
    delete formErrors[field];
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData, isLoginState);
  
    if (Object.keys(errors).length === 0) {
      if (isLoginState) {
        try {
          console.log(apis().loginUser);
          console.log(formData.password); // formData.lastName
          const response = await fetch(apis().loginUser,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email:formData.email,password:formData.password}),
          });
  
          if (!response.ok) {
            console.error('Error:', response.status, response.statusText);
          } else {
            const data = await response.json();
            console.log('Success:', data.email,data.password);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      } else 
      try {
        console.log(apis().signupUser);
        console.log(formData.password); // formData.lastName
        const response = await fetch(apis().registerUser,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({firstName:formData.firstName,lastName:formData.lastName,userName:formData.userName,email:formData.email,password:formData.password}),
        });

        if (!response.ok) {
          console.error('Error:', response.status, response.statusText);
        } else {
          const data = await response.json();
          console.log('Success:', formData.firstName,formData.lastName,formData.userName,data.email,data.password);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      setFormErrors(errors);
      console.log(formErrors);
    }
  };// SignUp or LogIn Switcher
  const handleNavigate = (newLoginState) => {
    navigate(newLoginState ? "/signup" : "/login");
  };

  const handleSwitch = useCallback(() => {
    setIsLoginState((prevState) =>!prevState);

    // Reset form fields
    setFormData({
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
    });
    setFormErrors({});
    handleNavigate(isLoginState);
  });

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center "
      style={{ height: "100vh", width: "100vw" }}
    >
      <form
        onSubmit={handleSubmit}
        className="row d-flex flex-column justify-content-center gap-3  border p-3  formcss"
      >
        <div className="col form-group mb-3 mt-3">
          <h2 className="text-center">
            {isLoginState ? "Login" : "Create Account"}
          </h2>
        </div>
        {/* Signup Fields */}
        {!isLoginState && (
          <>
            <div className="col  d-sm-flex d-sm-column  gap-4">
              <FormGroup
                label="First Name"
                id="firstName"
                type="text"
                placeholder="Enter First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange("firstName")}
                formError={formErrors.firstName}
                classForm="col"
                classLabel="form-label"
                classInput="form-control"
              />
              <FormGroup
                label="Last Name"
                id="lastName"
                type="text"
                placeholder=" Enter Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange("lastName")}
                formError={formErrors.lastName}
                classForm="col form-group"
                classLabel="form-label"
                classInput="form-control"
              />
            </div>
            <FormGroup
              label="Username"
              id="userName"
              type="text"
              placeholder="User Name"
              name="userName"
              value={formData.userName}
              onChange={handleChange("userName")}
              formError={formErrors.userName}
              classForm="col"
              classLabel="form-label"
              classInput="form-control"
            />
          </>
        )}

        <FormGroup
          label="Email"
          id="email"
          type="email" // Specify email type
          placeholder="example@gmail.com"
          name="email"
          value={formData.email}
          onChange={handleChange("email")}
          formError={formErrors.email}
          classForm="col"
          classLabel="form-label"
          classInput="form-control"
        />
        <FormGroup
          label="Password"
          id="password"
          type="password" // Specify password type
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange("password")}
          formError={formErrors.password}
          classForm="col"
          classLabel="form-label"
          classInput="form-control"
        />
        {isLoginState && (
          <div className="col d-flex justify-content-end">
            <Link to="/forgot-password" className="text-decoration-none mt-2">
              Forgot Password?
            </Link>
          </div>
        )}
        {/* Buttons */}
        <div className="col d-grid ">
          <button
            type="submit"
            className={`btn btn-primary 
             pt-3 pb-3  `}
          >
            {isLoginState ? "Log In" : "Sign Up"}
          </button>
        </div>
        <div className="col d-flex justify-content-end gap-2">
          {isLoginState ? (
            <p>Does not have a acount </p>
          ) : (
            <p>Does have a account </p>
          )}
          <Link onClick={handleSwitch}>
            {isLoginState ? "Sign Up" : "Log In"}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp_LogIn;
