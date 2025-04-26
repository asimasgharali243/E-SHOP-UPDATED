import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer} from "react-toastify";
import { Spinner } from "react-bootstrap"; 
import { RouterProvider } from "react-router-dom";
import AppRouter from "./AppRoutes";
import { store } from "./redux/store";
import { Provider } from "react-redux";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spinner animation="border"
  
  style={{ width: '5rem', height: '5rem',color: 'var(--primary)' }} /></div>}>
        <RouterProvider router={AppRouter} />
      </Suspense>
    </Provider>
  </StrictMode>
);
