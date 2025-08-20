// Auth controller stubs

export const register = async (req, res, next) => {
  res.status(501).json({
    success: false,
    error: { message: 'Register endpoint not implemented yet' }
  });
};

export const login = async (req, res, next) => {
  res.status(501).json({
    success: false,
    error: { message: 'Login endpoint not implemented yet' }
  });
};

export const logout = async (req, res, next) => {
  res.status(501).json({
    success: false,
    error: { message: 'Logout endpoint not implemented yet' }
  });
};

export const getMe = async (req, res, next) => {
  res.status(501).json({
    success: false,
    error: { message: 'Get profile endpoint not implemented yet' }
  });
};