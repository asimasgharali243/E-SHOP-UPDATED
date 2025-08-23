const apis = () => {
  const local = "http://localhost:5000"; // Backend base URL

  const list = {
    baseUrl: `${local}/api`, // Prefix all routes with /api

    // ---------- Auth ----------
    registerUser: `/auth/user/signup`,
    loginUser: `/auth/user/login`,
    logoutUser: `/auth/user/logout`,
    forgetPassword: `/auth/user/forgetpassword`,
    otpVerify: `/auth/user/otp/verify`,
    resetPassword: `/auth/user/resetpassword`,

    // ---------- Products ----------
    getAllProducts: `/products`,
    getSingleProduct: (productId) => `/products/${productId}`,
    createProduct: `/products`,
    updateProduct: (productId) => `/products/${productId}`,
    deleteProduct: (productId) => `/products/${productId}`,
    getSignature: (count) => `/products/get/signature?count=${count}`,
    addReview: (productId) => `/products/${productId}/reviews`,
    rollbackProduct: `/products/rollback`,

    // ---------- Negotiation ----------
    negotiateStart: `/negotiation/start`,
    negotiateMessage: (negotiationId) => `/negotiation/${negotiationId}/message`,
    negotiateToggleAI: (negotiationId) => `/negotiation/${negotiationId}/toggle-ai`,
    negotiateStatus: (negotiationId) => `/negotiation/${negotiationId}/status`,
    getNegotiationsByProduct: (productId) => `/negotiation/product/${productId}`,
  };

  return list;
};

export default apis;
