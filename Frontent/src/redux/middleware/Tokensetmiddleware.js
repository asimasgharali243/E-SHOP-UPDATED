// Middleware to handle tokens exclusively through headers:
// 1. Capture tokens from response headers and store in localStorage
// 2. Automatically add tokens from localStorage to request headers

const tokenMiddleware = store => next => action => {
  // Handle RESPONSES: Capture tokens from response headers
  if (action.type?.endsWith('/fulfilled') && action.meta?.response) {
    const response = action.meta.response;
    
    // Extract tokens from headers only (not from payload)
    const authHeader = response.headers.get('authorization');
    const refreshHeader = response.headers.get('x-refresh-token');
    
    // Extract access token from Authorization header
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.substring(7);
      localStorage.setItem('accessToken', accessToken);
      console.log('🔑 Access token stored from header');
      
      // Update Redux state
      store.dispatch({
        type: 'auth/tokensUpdated',
        payload: { accessToken }
      });
    }

    // Extract refresh token from custom header
    if (refreshHeader) {
      localStorage.setItem('refreshToken', refreshHeader);
      console.log('🔄 Refresh token stored from header');
      
      // Update Redux state
      store.dispatch({
        type: 'auth/tokensUpdated',
        payload: { refreshToken: refreshHeader }
      });
    }

    // Extract user info from headers if available
    const userIdHeader = response.headers.get('x-user-id');
    const userNameHeader = response.headers.get('x-user-name');
    
    if (userIdHeader) {
      localStorage.setItem('userId', userIdHeader);
      console.log('👤 User ID stored from header');
    }
    
    if (userNameHeader) {
      localStorage.setItem('userName', userNameHeader);
      console.log('👤 User name stored from header');
    }
  }

  // Handle logout actions to clear storage
  if (action.type === 'auth/logout' || action.type?.includes('logout/fulfilled')) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    console.log('🗑️ Tokens cleared from localStorage on logout');
  }

  return next(action);
};

export default tokenMiddleware;