import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShowToast = (type, message, POSITION) => {
  
  switch (type) {
    case 'success' :
      toast.success(message, { position: POSITION, autoClose: 10000 });
      break;
    case 'error' :
      toast.error(message, { position: POSITION, autoClose: 10000 });
      break;
    default:
      toast(message, { position: POSITION, autoClose: 10000 });
      
  }
};
export default ShowToast; 