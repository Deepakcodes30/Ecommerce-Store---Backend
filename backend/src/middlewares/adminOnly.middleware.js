export const adminOnly = (req, res, next) => {
  if (!req.user) {
    throw new apiError(401, "Authentication required");
  }

  if (!req.user.isAdmin) {
    throw new apiError(403, "Admin access only");
  }

  next();
};
