import App from "./App";
import { createBrowserRouter } from "react-router-dom";
import Contact from "./components/Contact";
import Home from "./components/Home";
import { CataLog } from "./components/CataLog";
import Error from "./components/Error";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgetPassword";
import VerifyOtp from "./components/auth/VerifyOtp";
import ResetPassword from "./components/auth/ResetPassword";
import TestingComponenet from "./components/TestingComponenet"; 
import Cart from "./components/Cart";
import Checkout from './pages/CheckOut';

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      {
        path: "contact",
        element: <Contact />,
      },
      { path: "CataLog/:id?", element: <CataLog /> },
      {
        path: "login",
        element: <Login />,
      },

      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "forgetpassword",
        element: <ForgotPassword />,
      },
      {
        path: "Verify/Otp",
        element: <VerifyOtp />,
      },
      {
        path: "reset/password",
        element: <ResetPassword />,
      },
      {
        path: "testing",
        element:<TestingComponenet/>,
      },
      {
        path: "/cart",
        element:<Cart/>,
      },
      {
        path:"/checkout",
        element:<Checkout/>,
      },
    ],
  },
]);

export default AppRouter;
