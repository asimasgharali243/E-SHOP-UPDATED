import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header1";
import "../src/Styles/sass/App.css";
import CustomContainer from "./components/SubComponent/CustomContainer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-bootstrap";
import '/src/Styles/fonts.css';
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import Footer from "./components/footer/Footer";
function App() {
  const location = useLocation();

  // Define the paths where you don't want to show the header
  const hideHeaderPaths = [
    "/logout",
    "/logout/",
    "/login",
    "/login/",
    "/signup",
    "/SignUp/",
    "/signup/",
    "/forgetpassword/",
    "/forgetpassword",
    "/verify/otp",
    "/verify/otp/",
    "/reset/password/",
    "/reset/password",
  ];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Outlet />
      {/* <Outlet />
      {!shouldHideHeader && <Footer />} */}
    </>
  );
}

export default App;
