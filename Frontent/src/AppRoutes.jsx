import { lazy } from "react";
import App from "./App";
import { createBrowserRouter } from "react-router-dom";
import WishListPage from "./pages/WishListPage";
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Home = lazy(() => import("./pages/Home"));
const CataLog = lazy(() => import("./pages/Catalog"));
const Error = lazy(() => import("./pages/ErrorPage"));
const Signup = lazy(() => import("./components/auth/Signup"));
const Login = lazy(() => import("./components/auth/Login"));
const ForgotPassword = lazy(() => import("./components/auth/ForgetPassword"));
const VerifyOtp = lazy(() => import("./components/auth/VerifyOtp"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));
const TestingComponenet = lazy(() => import("./components/TestingComponenet"));
const Cart = lazy(() => import("./components/Cart"));
const Checkout = lazy(() => import("./pages/CheckOut"));

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
        path: "/About",
        element: <About />,
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
        path: "/Wishlist",
        element:<WishListPage/>,
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
