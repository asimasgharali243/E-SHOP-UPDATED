const apis = () => {
  const local = "http://localhost:5000"; // No trailing slash here, it's a base URL

  const list = {
    baseUrl: `${local}/api`, // Set a consistent base URL for all API calls
    registerUser: `/auth/user/signup`,
    loginUser: `/auth/user/login`,
    logoutUser: `/auth/user/logout`,
    forgetPassword: `/auth/user/forgetpassword`,
    otpVerify: `/auth/user/otp/verify`,
    resetPassword: `/auth/user/resetpassword`,

    getAllProduct: `/products`,
    getSingleProduct: (productId) => `/products/${productId}`,
    createProduct: `/products/create/product`,
    updateProduct: (productId) => `/products/${productId}`,
    deleteProduct: (productId) => `/products/${productId}`,
    getSignature: (count) => `/products/get-signature/product?count=${count}`,
    AddReview: (productid) => `/products/${productid}/reviews`,

    getAllOrders: `/orders`,
    getAllUsers: `/users`,
    getSingleUser: `/users`,
    RollbackProductDetails: `/products/roll/back`,

    negotiateStart: `/negotiation/start`,
    negotiateMessage: (negotiationId) =>
      `/negotiation/${negotiationId}/message`,
    negotiateToggleAI: (negotiationId) =>
      `/negotiation/${negotiationId}/toggle-ai`,
    negotiateStatus: (negotiationId) => `/negotiation/${negotiationId}/status`,
    getNegotiationsByProduct: (productId) =>
      `/negotiation/product/${productId}`,
  };

  return list;
};

export default apis;
