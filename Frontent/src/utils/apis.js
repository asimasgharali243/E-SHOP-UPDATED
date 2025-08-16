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
    updateProduct: `products/update`,
    deleteProduct: `products/delete`,
    getAllOrders: `${local}orders`,
    getAllUsers: `${local}users`,
    getSingleUser: `${local}users`,
    getSignature: `${local}get-signature`,
    RemoveBackground: `${local}remove-background`,
    RollbackProductDetails: `${local}products/roll/back`,
  };

  return list;
};

export default apis;
