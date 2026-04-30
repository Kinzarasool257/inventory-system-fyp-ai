// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const JWT_SECRET = process.env.JWT_SECRET;

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   if (!authHeader) return res.status(403).json({ message: 'No token provided' });

//   const token = authHeader.split(' ')[1];
//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(403).json({ message: 'Invalid token' });
//     req.user = decoded;
//     next();
//   });
// };

// const authorizeRoles = (...roles) => (req, res, next) => {
//   if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Access denied' });
//   next();
// };

// module.exports = { verifyToken, authorizeRoles };



const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// =========================
// ✅ VERIFY TOKEN
// =========================
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'Token missing' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      req.user = decoded; // { userId, email, role }
      next();
    });

  } catch (error) {
    return res.status(500).json({ message: 'Auth error', error });
  }
};

// =========================
// ✅ AUTHORIZE ROLES (WITH ADMIN BYPASS)
// =========================
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(403).json({ message: 'Role not found' });
      }

      // 👑 ADMIN HAS FULL ACCESS
      if (userRole === 'admin') {
        return next();
      }

      // ❌ CHECK OTHER ROLES
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();

    } catch (error) {
      return res.status(500).json({ message: 'Authorization error', error });
    }
  };
};

module.exports = { verifyToken, authorizeRoles };