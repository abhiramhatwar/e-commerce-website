//Authorize admin users (Used after token is verified)
exports.verifyAdmin = (req, res, next) => {
  const { user } = req;
  if (!user || !user.isAdmin) return res.status(401).json({ error: "Unauthorized" });
  next();
};
