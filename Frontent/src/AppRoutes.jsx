import { lazy } from "react";
import App from "./App";
import { createBrowserRouter } from "react-router-dom";
import WishListPage from "./pages/WishListPage/WishListPage";

// Lazy-loaded components
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Home = lazy(() => import("./pages/Home"));
const Catalog = lazy(() => import("./pages/Catalog/Catalog"));

const Error = lazy(() => import("./pages/ErrorPage"));
const Signup = lazy(() => import("./components/auth/Signup"));
const Login = lazy(() => import("./components/auth/Login"));
const ForgotPassword = lazy(() => import("./components/auth/ForgetPassword"));
const VerifyOtp = lazy(() => import("./components/auth/VerifyOtp"));
const EmailVerification = lazy(() =>
  import("./components/auth/EmailVerification")
);
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));
const SingleProductPage = lazy(() =>
  import("./pages/SingleProductPage/SingleProductPage")
);
const Checkout = lazy(() => import("./pages/CheckOut"));
const Logout = lazy(() => import("./components/auth/Logout"));
// Footer component
const PrivacyPolicy = lazy(() => import("./components/footer/PrivacyPolicy"));
const Return = lazy(() => import("./components/footer/Return"));
const ShippingPolicy = lazy(() => import("./components/footer/ShippingPolicy"));
const TermsAndConditions = lazy(() =>
  import("./components/footer/TermsAndConditions")
);
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
{
  /* dashboard routes**/
}
const Cart = lazy(() => import("./pages/Cart/Cart"));
const DashboardLayout = lazy(() =>
  import("./components/Dashboard/DashboardLayout")
);
const DashboardPage = lazy(() =>
  import("./pages/Dashboard/dashboardHomePage/DashboardPage")
);
const ProductLists = lazy(() =>
  import("./pages/Dashboard/products/Productlisting/ProductLists")
);
const ProductCreate = lazy(() =>
  import("./pages/Dashboard/products/ProductCreate")
);
const ProductDetails = lazy(() =>
  import("./pages/Dashboard/products/ProductDetails")
);
const CompareProduct = lazy(() =>
  import("./pages/SingleProductPage/ComparisionPage")
);
const OrderLists = lazy(() => import("./pages/Dashboard/order/OrderLists"));
const Orderdetails = lazy(() => import("./pages/Dashboard/order/Orderdetails"));
const CustomerLists = lazy(() =>
  import("./pages/Dashboard/customer/CustomerLists")
);
const SearchProsuctPage = lazy(() =>
  import("./pages/SearchProductPage/SearchProductPage")
);
const CustomerDetails = lazy(() =>
  import("./pages/Dashboard/customer/CustomerDetails")
);
const OrderConfirmation = lazy(() =>
  import("./pages/Dashboard/order/OrderConfirmation")
);
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
      { path: "catalog/:id?", element: <Catalog /> },
      { path: "login", element: <Login /> },
      { path: "about", element: <About /> },
      { path: "about", element: <About /> },
      { path: "signup", element: <Signup /> },
      { path: "forgetpassword", element: <ForgotPassword /> },
      { path: "verify/otp", element: <VerifyOtp /> },
      { path: "api/user/verify-email", element: <EmailVerification /> },
      { path: "reset/password", element: <ResetPassword /> },
      { path: "logout", element: <Logout /> },
      { path: "product/:id", element: <SingleProductPage /> },
      { path: "search", element: <SearchProsuctPage /> },
      { path: "wishlist", element: <WishListPage /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "return-policy", element: <Return /> },
      { path: "shipping-policy", element: <ShippingPolicy /> },
      { path: "terms-and-conditions", element: <TermsAndConditions /> },
      { path: "help", element: <Help /> },
      { path: "profile", element: <ProfilePage /> },
      {
        path: "compare",
        element: <CompareProduct />,
      },
      // Dashboard Routes
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "products/list", element: <ProductLists /> },
          { path: "products/add", element: <ProductCreate /> },
          { path: "products/details/:id", element: <ProductDetails /> },
          ,
          { path: "customers/list", element: <CustomerLists /> },
          { path: "customers/details", element: <CustomerDetails /> },

          { path: "orders/list", element: <OrderLists /> },
          { path: "orders/details", element: <Orderdetails /> },

          { path: "analytics", element: <Analytics /> },
          { path: "settings", element: <Setting /> },
          { path: "help", element: <Help /> },
          { path: "order/confirmation", element: <OrderConfirmation /> },
        ],
      },
    ],
  },
]);

export default AppRouter;
