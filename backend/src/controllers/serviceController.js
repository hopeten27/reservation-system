// Service controller stubs

export const getServices = async (req, res, next) => {
  res.status(501).json({
    success: false,
    error: { message: 'Get services endpoint not implemented yet' }
  });
};

export const getService = async (req, res, next) => {
  res.status(501).json({
    success: false,
    error: { message: 'Get service endpoint not implemented yet' }
  });
};

export const createService = async (req, res, next) => {
  res.status(501).json({
    success: false,
    error: { message: 'Create service endpoint not implemented yet' }
  });
};

export const updateService = async (req, res, next) => {
  res.status(501).json({
    success: false,
    error: { message: 'Update service endpoint not implemented yet' }
  });
};

export const deleteService = async (req, res, next) => {
  res.status(501).json({
    success: false,
    error: { message: 'Delete service endpoint not implemented yet' }
  });
};