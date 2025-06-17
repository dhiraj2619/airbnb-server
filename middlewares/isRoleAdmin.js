const isRoleAdmin = (req, res, next) => {
  try {

    const user = req.user;
    
    if (!user || user.role.toLowerCase() !== "admin") {
      return res.status(403).json({
        message:
          "Access denied. Only Admins are allowed to perform this action.",
      });
    }
    return next();
  } catch (error) {
    console.error("Error in isRoleAdmin middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  const user = req.user;
};

module.exports = isRoleAdmin;
