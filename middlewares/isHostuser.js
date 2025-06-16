const isRoleHost = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user || user.role.toLowerCase() !== "host") {
      return res
        .status(403)
        .json({
          message:
            "Access denied. Only Hosts are allowed to perform this action.",
        });
    }

    next();
  } catch (error) {
    console.error("Error in isRoleHost middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = isRoleHost;
