export const isAdminOrSuperAdmin = (req, res, next) => {
  if (req.user?.role === "admin" || req.user?.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ message: "Accès réservé à l'administration" });
};
