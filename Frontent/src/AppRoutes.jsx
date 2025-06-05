import { lazy } from "react";
import App from "./App";
import { createBrowserRouter } from "react-router-dom";
import WishListPage from "./pages/WishListPage";

// Lazy-loaded components
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Home = lazy(() => import("./pages/Home"));
const Catalog = lazy(() => import("./pages/Catalog")); 
const Error = lazy(() => import("./pages/ErrorPage"));
const Signup = lazy(() => import("./components/auth/Signup"));
const Login = lazy(() => import("./components/auth/Login"));
const ForgotPassword = lazy(() => import("./components/auth/ForgetPassword"));
const VerifyOtp = lazy(() => import("./components/auth/VerifyOtp"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));
const TestingComponent = lazy(() => import("./components/TestingComponenet")); 
const Cart = lazy(() => import("./components/Cart"));
const Checkout = lazy(() => import("./pages/CheckOut"));
const Logout = lazy(() => import("./components/auth/Logout"));
{/* dashboard routes**/ }
const DashboardLayout = lazy(() => import("./components/Dashboard/DashboardLayout"));
const DashboardPage = lazy(() => import("./pages/Dashboard/dashboardHomePage/DashboardPage"));
const ProductLists = lazy(() => import("./pages/Dashboard/products/ProductLists"));
const ProductCreate = lazy(() => import("./pages/Dashboard/products/ProductCreate"));
const ProductDetails = lazy(() => import("./pages/Dashboard/products/ProductDetails"));
const OrderLists = lazy(() => import("./pages/Dashboard/order/OrderLists"));
const Orderdetails = lazy(() => import("./pages/Dashboard/order/Orderdetails"));
const CustomerLists = lazy(() => import("./pages/Dashboard/customer/CustomerLists"));
const CustomerDetails = lazy(() => import("./pages/Dashboard/customer/CustomerDetails"));
const Analytics = lazy(() => import("./pages/Dashboard/analytics/Analytics"));
const Setting = lazy(() => import("./pages/Dashboard/setting/Setting"));
const Help = lazy(() => import("./pages/Dashboard/help/Help"));
const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [

      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "contact", element: <Contact /> },
      { path: "catalog/:id?", element: <Catalog /> }, 
      { path: "login", element: <Login /> },
      { path: "about", element: <About /> }, 
      { path: "signup", element: <Signup /> },
      { path: "forgetpassword", element: <ForgotPassword /> },
      { path: "verify/otp", element: <VerifyOtp /> },
      { path: "reset/password", element: <ResetPassword /> },
      { path: "logout", element: <Logout /> },
      { path: "wishlist", element: <WishListPage /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },

      // Dashboard Routes
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "products/list", element: <ProductLists /> },
          { path: "products/add", element: <ProductCreate /> },
          { path: "products/details", element: <ProductDetails /> },
          { path: "customers/list", element: <CustomerLists /> },
          { path: "customers/details", element: <CustomerDetails /> },
          
          { path: "orders/list", element: <OrderLists /> },
          { path: "orders/details", element: <Orderdetails /> },
          
          { path: "analytics", element: <Analytics /> },
          { path: "settings", element: <Setting /> },
          { path: "help", element: <Help /> },
          
        ],
      },
    ],
  },
]);

export default AppRouter;
