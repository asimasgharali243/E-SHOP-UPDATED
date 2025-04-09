import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify'

import { RouterProvider } from 'react-router-dom';
import AppRouter from './AppRoutes';
import { store } from './redux/store';
import { Provider } from 'react-redux';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <ToastContainer/>
         <RouterProvider router={AppRouter} />
         
    </Provider>
  </StrictMode>
);