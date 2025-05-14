const apis = () => {
  const local = "http://localhost:5000/";

  const list = {
    baseUrl:`${local}`,
    registerUser: `${local}user/signup`,
    loginUser: `${local}user/login`,
    logoutUser: `${local}user/logout`,
    forgetPassword: `${local}user/forgetpassword`,
    otpVerify: `${local}user/otp/verify`,
    resetPassword: `${local}user/resetpassword`,
    getAllProduct:`products`,
    getSingleProduct:`products`,
    createProduct:`products/create`,
    updateProduct: `products`,
    deleteProduct: `products`,
    getAllOrders: `${local}orders`,
    getAllUsers: `${local}users`,
    getSingleUser: `${local}users`,
  };

  return list;
};

export default apis;
