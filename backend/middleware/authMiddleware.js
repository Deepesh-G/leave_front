const jwt = require("jsonwebtoken");

/* ============================================================
   AUTH — PROTECT ROUTES
============================================================ */
exports.protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "No token, authorization denied" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user payload to req
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* ============================================================
   ROLE CHECKER
============================================================ */
exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    if (req.user.role !== role)
      return res.status(403).json({ message: "Access denied" });

    next();
  };
};
