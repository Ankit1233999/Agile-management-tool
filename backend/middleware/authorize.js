const authorizeOwner = (resourceField = "owner") => {
  return (req, res, next) => {
    const resource = req.resource;

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      });
    }

    const ownerId = resource[resourceField]?.toString();

    if (!ownerId || ownerId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource"
      });
    }

    next();
  };
};

export default authorizeOwner;