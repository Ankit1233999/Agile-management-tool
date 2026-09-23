export const protectedTest = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "You have access to a protected route",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
};