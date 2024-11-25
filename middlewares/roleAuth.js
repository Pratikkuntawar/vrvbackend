// const roleAuth = (roles) => {
//     return (req, res, next) => {
//       if (!roles.includes(req.user.role)) {
//         return res.status(403).json({ message: 'Access Forbidden: Insufficient Permissions!' });
//       }
//       next();
//     };
//   };
  
//   module.exports = roleAuth;

const roleAuth = (roles) => {
  return (req, res, next) => {
    console.log('Required Roles:', roles); // Debugging
    console.log('User Role:', req.user?.role); // Debugging

    // Allow Admin to access all routes
    if (req.user.role === 'Admin') {
      return next();
    }

    // Check if the user role matches the required roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access Forbidden: Insufficient Permissions!' });
    }

    next();
  };
};

module.exports = roleAuth;

  