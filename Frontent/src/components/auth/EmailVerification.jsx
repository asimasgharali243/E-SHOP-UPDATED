import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmailPage = () => {
  const [status, setStatus] = useState("Verifying your email...");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      // Extract the 'token' query parameter from the URL
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");

      // Handle the case where the token is missing from the URL
      if (!token) {
        setStatus("Error: No verification token found.");
        return;
      }

      try {
        // Send a GET request to your backend's verification endpoint
        // It's a good practice to use your full backend URL for clarity
        const response = await fetch(
          `http://localhost:5000/api/auth/user/verify-email?token=${token}`,
          {
            method: "POST",
          }
        );

        const data = await response.json();
        console.log("Response from backend:", data);
        if (response.ok) {
          setStatus(`Success: ${data.message}`);
          // Optional: Redirect the user to a success page or the dashboard after a short delay
          setTimeout(() => {
            navigate("/");
          }, 3000); // 3-second delay
        } else {
          // Display the error message from the backend
          setStatus(`Error: ${data.message || "Verification failed."}`);
        }
      } catch (error) {
        console.error("API Error:", error);
        setStatus("An error occurred. Please try again.");
      }
    };

    verifyUser();
  }, [location, navigate]); // Dependencies for the useEffect hook

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Email Verification Status</h2>
      <p>{status}</p>
      <div style={{ marginTop: "20px" }}>
        {status.includes("Success") && <p>You will be redirected shortly.</p>}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
