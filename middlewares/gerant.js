export const gerant = (req, res, next) => {
  if (req.user.role === "gerant") return next();
  return res.status(403).json({ message: "Accès réservé aux gerant" });
};
