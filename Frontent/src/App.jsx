import { useLocation, Outlet } from "react-router-dom";
import Header from "./components/Header/Header1";
import Footer from "./components/footer/Footer";
import "../src/Styles/sass/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import '/src/Styles/fonts.css';

function AppLayout() {
  const location = useLocation();

  const hideHeaderPaths = [
    "/login", "/signup", "/logout", "/forgetpassword",
    "/verify/otp", "/reset/password"
  ];

  // Check if path is in the hide list OR starts with '/dashboard'
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname) || location.pathname.startsWith("/dashboard");
  const shouldHideFooter = shouldHideHeader; // Same logic for footer

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Outlet />
      {!shouldHideFooter && <Footer />}
    </>
  );
}

export default AppLayout;
